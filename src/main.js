const KEY = 'recettes-app-premium-v1';
const BACKUP_FILENAME = 'maison-saison-recettes.json';

const githubDefaults = {
  enabled: false,
  owner: '',
  repo: '',
  branch: 'main',
  path: 'data/recipes.json',
  token: '',
  lastSync: '',
  lastSha: '',
};

let githubStatus = 'Non configuré';
let githubSyncTimer = null;
let githubSyncRunning = false;
let githubSyncQueued = false;
let githubAutoLoadStarted = false;

const INITIAL_RECIPES_URL = './data/recipes.json';

const defaultState = {
  users: [{ username: 'admin', password: 'admin123' }],
  recipes: [],
  shopping: [],
  github: githubDefaults,
  sessionUser: null,
  activeCategory: 'Tout voir',
  editingId: null,
  formOpen: false,
  menuOpen: false,
  filters: { name: '', ingredients: [], tags: [] },
};

const state = load();
let ingredientRows = [emptyIngredient()];
let stepRows = [emptyStep()];

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const recipes = Array.isArray(saved.recipes) ? saved.recipes.map(normalizeRecipe) : [];
    const github = { ...githubDefaults, ...(saved.github || {}) };
    githubStatus = github.lastSync ? `Dernière synchro GitHub : ${new Date(github.lastSync).toLocaleString('fr-FR')}` : 'GitHub prêt à configurer';
    return { ...defaultState, ...saved, github, recipes, shopping: Array.isArray(saved.shopping) ? saved.shopping : [] };
  } catch {
    return { ...defaultState };
  }
}

function mergeRecipes(existingRecipes, incomingRecipes) {
  const map = new Map(existingRecipes.map((recipe) => [recipe.id, normalizeRecipe(recipe)]));
  incomingRecipes.forEach((recipe) => map.set(recipe.id, normalizeRecipe(recipe)));
  return Array.from(map.values());
}

async function loadInitialRecipes() {
  try {
    const response = await fetch(INITIAL_RECIPES_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Chargement initial ${response.status}`);

    const payload = await response.json();
    const recipes = Array.isArray(payload) ? payload : payload.recipes;
    if (!Array.isArray(recipes)) throw new Error('Format initial invalide');

    state.recipes = mergeRecipes(state.recipes, recipes);
    if (!state.shopping.length && !Array.isArray(payload) && Array.isArray(payload.shopping)) state.shopping = payload.shopping;
    save();
    render();
  } catch (error) {
    console.error('Chargement des recettes initiales impossible', error);
  }
}

function normalizeRecipe(recipe) {
  return {
    badge: 'Maison',
    difficulty: 'Maison',
    baseServings: 2,
    time: 20,
    ingredients: [],
    steps: [],
    ...recipe,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    steps: normalizeSteps(recipe.steps),
    rating: clampRating(recipe.rating),
    tags: normalizeTags(recipe.tags || recipe.tag || recipe.badge || recipe.category),
  };
}

function clampRating(value) {
  const rating = Math.round(Number(value) || 0);
  return Math.min(5, Math.max(1, rating || 3));
}

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || '').split(/[,;#]/);
  return Array.from(new Set(raw.map((tag) => String(tag).trim()).filter(Boolean)));
}

function renderStars(value, label = 'Note de la recette') {
  const rating = clampRating(value);
  return `<span class="rating-stars" aria-label="${esc(label)} : ${rating}/5">${Array.from({ length: 5 }, (_, index) => `<span class="star ${index < rating ? 'is-full' : 'is-empty'}">★</span>`).join('')}</span>`;
}

function normalizeSteps(steps) {
  if (Array.isArray(steps)) {
    return steps
      .map((step) => (typeof step === 'string' ? { id: uid('step'), text: step } : { id: step.id || uid('step'), text: String(step.text || step.description || '') }))
      .map((step) => ({ ...step, text: step.text.trim() }))
      .filter((step) => step.text);
  }

  const lines = String(steps || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const parsed = [];
  let buffer = [];

  lines.forEach((line) => {
    const marker = line.match(/^(?:étape\s*\d+|\d+\s*[:.)-])\s*(.*)$/i);
    if (marker) {
      if (buffer.length) parsed.push(buffer.join(' ').trim());
      buffer = marker[1] ? [marker[1].trim()] : [];
      return;
    }
    buffer.push(line.replace(/^[-*•]\s*/, '').trim());
  });
  if (buffer.length) parsed.push(buffer.join(' ').trim());

  return parsed.filter(Boolean).map((text) => ({ id: uid('step'), text }));
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}


function githubConfig() {
  return { ...githubDefaults, ...(state.github || {}) };
}

function githubConfigured() {
  const config = githubConfig();
  return Boolean(config.owner && config.repo && config.branch && config.path && config.token);
}

function setGithubStatus(message, shouldRender = false) {
  githubStatus = message;
  if (!shouldRender) {
    const status = document.getElementById('github-status');
    if (status) status.textContent = githubStatus;
    return;
  }
  render();
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(text) {
  const binary = atob(text.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function githubApiUrl(config) {
  return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${config.path.split('/').map(encodeURIComponent).join('/')}`;
}

async function readGithubFile(config) {
  const response = await fetch(`${githubApiUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (response.status === 404) return { sha: null, payload: null };
  if (!response.ok) throw new Error(`GitHub lecture ${response.status}`);
  const file = await response.json();
  return { sha: file.sha, payload: JSON.parse(decodeBase64(file.content || '')) };
}

async function writeGithubFile(config, sha, message, content) {
  const response = await fetch(githubApiUrl(config), {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message,
      content: encodeBase64(content),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  const detail = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(detail.message || `GitHub écriture ${response.status}`);
    error.status = response.status;
    error.githubMessage = detail.message || '';
    throw error;
  }
  return detail;
}

function isGithubShaConflict(error) {
  return error?.status === 409 || /does not match|sha/i.test(error?.githubMessage || error?.message || '');
}

function friendlyGithubError(error) {
  if (isGithubShaConflict(error)) {
    return 'conflit de version du fichier GitHub. Réessayez dans quelques secondes.';
  }
  return error.message;
}

async function writeGithubFileWithRetry(config, message, content) {
  let remote = await readGithubFile(config);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await writeGithubFile(config, remote.sha, message, content);
      return result.content?.sha || remote.sha || '';
    } catch (error) {
      if (!isGithubShaConflict(error) || attempt === maxAttempts) throw error;
      setGithubStatus('Conflit GitHub détecté, nouvelle tentative…');
      remote = await readGithubFile(config);
    }
  }
  return remote.sha || '';
}

function mergeGithubPayload(payload) {
  if (!payload) return;
  const recipes = Array.isArray(payload) ? payload : payload.recipes;
  if (Array.isArray(recipes)) state.recipes = mergeRecipes(state.recipes, recipes);
  if (!Array.isArray(payload) && Array.isArray(payload.shopping)) state.shopping = payload.shopping;
}

async function syncToGitHub(reason = 'Synchronisation des recettes') {
  const config = githubConfig();
  if (!config.enabled || !githubConfigured()) return;
  if (githubSyncRunning) {
    githubSyncQueued = true;
    return;
  }
  githubSyncRunning = true;
  setGithubStatus('Synchronisation GitHub en cours…');
  try {
    const content = backupText();
    const latestSha = await writeGithubFileWithRetry(config, reason, content);
    state.github = { ...config, lastSync: new Date().toISOString(), lastSha: latestSha };
    save();
    setGithubStatus(`Dernière synchro GitHub : ${new Date(state.github.lastSync).toLocaleString('fr-FR')}`);
  } catch (error) {
    setGithubStatus(`Erreur GitHub : ${friendlyGithubError(error)}`);
  } finally {
    githubSyncRunning = false;
    if (githubSyncQueued) {
      githubSyncQueued = false;
      scheduleGithubSync(reason);
    }
  }
}

function scheduleGithubSync(reason) {
  const config = githubConfig();
  if (!config.enabled || !githubConfigured()) return;
  clearTimeout(githubSyncTimer);
  githubSyncTimer = setTimeout(() => syncToGitHub(reason), 900);
}

async function loadFromGitHub(silent = false) {
  const config = githubConfig();
  if (!githubConfigured()) {
    if (!silent) alert('Renseignez propriétaire, dépôt, branche, chemin JSON et token GitHub.');
    return;
  }
  setGithubStatus('Chargement depuis GitHub…');
  try {
    const remote = await readGithubFile(config);
    if (!remote.payload) {
      setGithubStatus('Le fichier JSON GitHub n’existe pas encore.');
      if (!silent) alert('Le fichier JSON GitHub n’existe pas encore. Cliquez sur Enregistrer maintenant pour le créer.');
      return;
    }
    mergeGithubPayload(remote.payload);
    state.activeCategory = 'Tout voir';
    state.github = { ...config, enabled: true, lastSync: new Date().toISOString(), lastSha: remote.sha || config.lastSha || '' };
    save();
    render();
    if (!silent) alert('Recettes chargées depuis GitHub.');
  } catch (error) {
    setGithubStatus(`Erreur GitHub : ${friendlyGithubError(error)}`);
    if (!silent) alert(`Chargement GitHub impossible : ${friendlyGithubError(error)}`);
  }
}

async function saveNowToGitHub() {
  const config = githubConfig();
  if (!githubConfigured()) return alert('Renseignez propriétaire, dépôt, branche, chemin JSON et token GitHub.');
  state.github = { ...config, enabled: true };
  save();
  await syncToGitHub('Mise à jour des recettes Maison Saison');
  alert(githubStatus.startsWith('Erreur') ? githubStatus : 'Recettes enregistrées sur GitHub.');
}

function saveGithubSettings() {
  state.github = {
    enabled: document.getElementById('github-enabled').checked,
    owner: document.getElementById('github-owner').value.trim(),
    repo: document.getElementById('github-repo').value.trim(),
    branch: document.getElementById('github-branch').value.trim() || 'main',
    path: document.getElementById('github-path').value.trim() || 'data/recipes.json',
    token: document.getElementById('github-token').value.trim(),
    lastSync: githubConfig().lastSync,
    lastSha: githubConfig().lastSha,
  };
  save();
  setGithubStatus(state.github.enabled ? 'Synchronisation GitHub activée.' : 'Synchronisation GitHub désactivée.', true);
  if (state.github.enabled) scheduleGithubSync('Activation de la synchronisation Maison Saison');
}

function buildBackupPayload() {
  return {
    exportedAt: new Date().toISOString(),
    recipes: state.recipes,
    shopping: state.shopping,
  };
}

function backupText() {
  return JSON.stringify(buildBackupPayload(), null, 2);
}

function exportRecipes() {
  const blob = new Blob([backupText()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = BACKUP_FILENAME;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyBackup() {
  const content = backupText();
  try {
    await navigator.clipboard.writeText(content);
    alert('Sauvegarde copiée. Envoyez ce texte à votre téléphone, puis collez-le dans Importer un texte de sauvegarde.');
  } catch {
    const textarea = document.getElementById('backup-text');
    if (textarea) {
      textarea.value = content;
      textarea.select();
    }
    alert('Copie automatique impossible : le texte de sauvegarde est affiché, copiez-le manuellement.');
  }
}

function importPayload(payload) {
  const recipes = Array.isArray(payload) ? payload : payload.recipes;
  if (!Array.isArray(recipes)) throw new Error('Format invalide');
  state.recipes = mergeRecipes(state.recipes, recipes);
  if (!Array.isArray(payload) && Array.isArray(payload.shopping)) state.shopping = payload.shopping;
  state.activeCategory = 'Tout voir';
  state.editingId = null;
  save();
  render();
}

async function importRecipes(file) {
  if (!file) return;
  try {
    importPayload(JSON.parse(await file.text()));
    alert('Recettes importées dans ce navigateur.');
  } catch {
    alert('Import impossible : choisissez un fichier JSON exporté depuis Maison Saison.');
  }
}

function importBackupText() {
  const textarea = document.getElementById('backup-text');
  const content = textarea?.value.trim();
  if (!content) return alert('Collez d’abord le texte de sauvegarde exporté depuis l’autre appareil.');
  try {
    importPayload(JSON.parse(content));
    alert('Recettes importées depuis le texte de sauvegarde.');
  } catch {
    alert('Import impossible : le texte collé ne correspond pas à une sauvegarde Maison Saison valide.');
  }
}

function updateShoppingPanel() {
  const shoppingList = document.querySelector('.shopping-list');
  if (!shoppingList) return;
  shoppingList.innerHTML = renderShopping() || '<p class="small">Liste vide. Ouvrez une recette et cochez uniquement ce qu’il vous manque.</p>';
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyIngredient(values = {}) {
  return { id: values.id || uid('ing'), name: values.name || '', qty: values.qty ?? 1, unit: values.unit || 'g' };
}

function emptyStep(values = {}) {
  return { id: values.id || uid('step'), text: values.text || values.description || '' };
}

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatQty(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/, '').replace(/0$/, '');
}

function asCssImage(recipe) {
  if (recipe.photoData || recipe.photoUrl) {
    return `linear-gradient(135deg, rgba(36, 20, 13, 0.06), rgba(36, 20, 13, 0.2)), url(${recipe.photoData || recipe.photoUrl})`;
  }
  return recipe.image || 'linear-gradient(135deg, #f08c00, #e8590c)';
}

function categories() {
  return ['Tout voir', ...Array.from(new Set(state.recipes.map((r) => r.category || 'Mes recettes')))];
}

function currentFilters() {
  const filters = { name: '', ingredients: [], tags: [], ...(state.filters || {}) };
  filters.ingredients = Array.isArray(filters.ingredients) ? filters.ingredients : [];
  filters.tags = Array.isArray(filters.tags) ? filters.tags : [];
  return filters;
}

function ingredientOptions() {
  return Array.from(new Set(state.recipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.name.trim()).filter(Boolean)))).sort((a, b) => a.localeCompare(b, 'fr'));
}

function tagOptions() {
  return Array.from(new Set(state.recipes.flatMap((recipe) => normalizeTags(recipe.tags || recipe.category || recipe.badge)))).sort((a, b) => a.localeCompare(b, 'fr'));
}

function recipeMatchesFilters(recipe) {
  const filters = currentFilters();
  const haystack = `${recipe.name || ''} ${recipe.description || ''}`.toLowerCase();
  const recipeIngredients = recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase());
  const recipeTags = normalizeTags(recipe.tags || recipe.category || recipe.badge).map((tag) => tag.toLowerCase());
  const categoryMatches = state.activeCategory === 'Tout voir' || (recipe.category || 'Mes recettes') === state.activeCategory;
  const nameMatches = !filters.name || haystack.includes(filters.name.toLowerCase());
  const ingredientsMatch = filters.ingredients.every((selected) => recipeIngredients.some((ingredient) => ingredient.includes(selected.toLowerCase())));
  const tagsMatch = filters.tags.every((selected) => recipeTags.includes(selected.toLowerCase()));
  return categoryMatches && nameMatches && ingredientsMatch && tagsMatch;
}

function shoppingSummary() {
  const map = new Map();
  state.shopping.forEach((item) => {
    const key = `${item.name.toLowerCase()}__${item.unit}`;
    const existing = map.get(key) || { ...item, qtyNumber: 0, recipes: new Set() };
    existing.qtyNumber += Number(item.qtyNumber) || 0;
    existing.recipes.add(item.recipeName);
    map.set(key, existing);
  });
  return Array.from(map.values()).map((item) => ({ ...item, recipes: Array.from(item.recipes) }));
}

function currentRoute() {
  const hash = decodeURIComponent(window.location.hash || '#top');
  if (hash.startsWith('#recette/')) return { page: 'recipe', id: hash.slice('#recette/'.length) };
  if (hash === '#sauvegarde') return { page: 'backup' };
  if (hash === '#courses') return { page: 'shopping' };
  return { page: 'home', anchor: hash };
}

function renderHeader() {
  return `<header class="site-header ${state.menuOpen ? 'is-menu-open' : ''}">
      <a class="brand" href="#top"><span class="brand-mark">✦</span><span>Maison Saison <small>Premium</small></span></a>
      <button class="menu-toggle ghost" id="menu-toggle" aria-expanded="${state.menuOpen ? 'true' : 'false'}" aria-controls="top-menu"><span>☰</span> Menu</button>
      <nav id="top-menu" class="top-menu" aria-label="Menu principal">
        <a href="#top">Recettes</a>
        <a href="#courses">Courses</a>
        <a href="#sauvegarde">Sauvegardes</a>
        <button class="nav-action" data-create>+ Recette</button>
      </nav>
      <button class="ghost logout-button" id="logout">Déconnexion</button>
    </header>`;
}

function renderBackupPanel() {
  return `<article id="sauvegarde" class="panel backup-panel page-panel">
          <p class="eyebrow">Centre de sauvegarde</p>
          <h2>Import, export & GitHub</h2>
          <p class="lead">Gérez vos sauvegardes dans un espace dédié : synchronisation GitHub, export JSON et import manuel depuis un autre appareil.</p>
          <div class="backup-layout backup-layout-wide">
            <section class="sync-box">
              <strong>Synchronisation GitHub automatique</strong>
              <p class="small">Enregistrez automatiquement les recettes dans un fichier JSON de votre dépôt GitHub personnel.</p>
              <div class="github-grid">
                <label>Propriétaire<input id="github-owner" placeholder="Ex : steve57000" value="${esc(githubConfig().owner)}" /></label>
                <label>Dépôt<input id="github-repo" placeholder="Ex : recettes" value="${esc(githubConfig().repo)}" /></label>
                <label>Branche<input id="github-branch" placeholder="main" value="${esc(githubConfig().branch)}" /></label>
                <label>Chemin JSON<input id="github-path" placeholder="data/recipes.json" value="${esc(githubConfig().path)}" /></label>
              </div>
              <label>Token GitHub<input id="github-token" type="password" placeholder="github_pat_..." value="${esc(githubConfig().token)}" autocomplete="off" /></label>
              <label class="check-row"><input id="github-enabled" type="checkbox" ${githubConfig().enabled ? 'checked' : ''} /> Activer l’enregistrement automatique sur GitHub</label>
              <p class="small github-status" id="github-status">${esc(githubStatus)}</p>
              <div class="backup-actions">
                <button class="secondary" id="save-github-settings">Enregistrer réglages</button>
                <button class="secondary" id="load-github">Charger depuis GitHub</button>
                <button class="secondary" id="save-github-now">Enregistrer maintenant</button>
              </div>
            </section>

            <section class="sync-box manual-sync-box">
              <strong>Export / import manuel</strong>
              <p class="small">Téléchargez un JSON ou collez une sauvegarde copiée depuis un autre appareil.</p>
              <div class="backup-actions">
                <button class="secondary" id="export-recipes">Exporter JSON</button>
                <button class="secondary" id="copy-backup">Copier sauvegarde</button>
                <label class="button-link secondary-link import-label" for="import-recipes">Importer fichier</label>
                <input class="visually-hidden" id="import-recipes" type="file" accept="application/json,.json" />
              </div>
              <label class="backup-text-label">Importer un texte de sauvegarde<textarea id="backup-text" placeholder="Collez ici la sauvegarde copiée depuis l’autre appareil"></textarea></label>
              <button class="secondary" id="import-backup-text">Importer le texte</button>
            </section>
          </div>
        </article>`;
}

function renderShoppingSection() {
  return `<section class="shopping-page-actions">
        <button class="secondary" id="clear-shopping">Vider la liste</button>
      </section>

      <section class="shopping-only-grid">
        <article class="panel shopping-panel">
          <div class="panel-intro">
            <span class="panel-icon">🛒</span>
            <div>
              <h3>À acheter</h3>
              <p class="small">Ouvrez une recette, ajustez les portions, puis cochez uniquement ce qu’il vous manque.</p>
            </div>
          </div>
          <div class="shopping-list">${renderShopping() || '<p class="small">Liste vide. Ouvrez une recette et cochez uniquement ce qu’il vous manque.</p>'}</div>
        </article>
      </section>`;
}

function renderDashboard(totalIngredients) {
  const shoppingItems = shoppingSummary().length;
  const avgRating = state.recipes.length ? (state.recipes.reduce((sum, recipe) => sum + clampRating(recipe.rating), 0) / state.recipes.length).toFixed(1) : '0';
  return `<aside class="hero-card dashboard-card">
          <div class="dashboard-top"><span>Tableau de bord</span><strong>${state.recipes.length}</strong></div>
          <div class="dashboard-grid">
            <span><b>${categories().length - 1}</b><small>menus</small></span>
            <span><b>${totalIngredients}</b><small>ingrédients</small></span>
            <span><b>${shoppingItems}</b><small>à acheter</small></span>
            <span><b>${avgRating}</b><small>note moy.</small></span>
          </div>
        </aside>`;
}

function renderFilterDropdown(type, title, options, selected) {
  return `<details class="filter-dropdown" data-filter-panel="${type}">
    <summary><span>${title}</span><strong>${selected.length || 'Tout'}</strong></summary>
    <div class="filter-menu">
      ${options.map((option) => `<label class="filter-option"><input type="checkbox" data-filter-${type}="${esc(option)}" ${selected.includes(option) ? 'checked' : ''}/><span>${esc(option)}</span></label>`).join('') || '<p class="small">Aucun choix disponible.</p>'}
    </div>
  </details>`;
}

function renderSearchFilters() {
  const filters = currentFilters();
  return `<section class="search-lab panel" aria-label="Filtres de recherche">
    <div class="search-title"><p class="eyebrow">Recherche gourmande</p><h2>Trouvez l’inspiration en quelques secondes</h2></div>
    <label class="name-filter"><span>Nom de la recette</span><input id="filter-name" placeholder="Ex : salade, tarte, poulet..." value="${esc(filters.name)}" /></label>
    <div class="smart-filters">
      ${renderFilterDropdown('ingredient', 'Ingrédients', ingredientOptions(), filters.ingredients)}
      ${renderFilterDropdown('tag', 'Tags', tagOptions(), filters.tags)}
    </div>
    <div class="selected-filters">
      ${filters.ingredients.map((item) => `<button class="filter-chip" data-remove-filter="ingredient" data-value="${esc(item)}">${esc(item)} ×</button>`).join('')}
      ${filters.tags.map((item) => `<button class="filter-chip tag-chip" data-remove-filter="tag" data-value="${esc(item)}">#${esc(item)} ×</button>`).join('')}
      ${(filters.name || filters.ingredients.length || filters.tags.length) ? '<button class="filter-reset secondary" id="clear-filters">Réinitialiser les filtres</button>' : '<span class="small">Ajoutez des ingrédients ou tags pour composer votre menu parfait.</span>'}
    </div>
  </section>`;
}

function renderHomePage(filteredRecipes, totalIngredients) {
  return `<section class="hero premium-glass">
        <div>
          <p class="eyebrow">Collection premium</p>
          <h1>Le livre de recettes complet, élégant et prêt à cuisiner.</h1>
          <p class="lead">Créez des fiches riches avec photos, vidéos et URLs, corrigez vos recettes, adaptez les portions et cochez uniquement les ingrédients à acheter.</p>
          <div class="hero-actions">
            <a class="button-link" href="#recettes">Explorer les menus</a>
            <button class="secondary-link" data-create>Créer une recette</button>
          </div>
        </div>
        ${renderDashboard(totalIngredients)}
      </section>

      ${renderSearchFilters()}

      <section id="recettes" class="section-head">
        <div><p class="eyebrow">Menus</p><h2>Recettes disponibles</h2></div>
        <div class="category-menu">${categories().map((cat) => `<button class="nav-pill ${state.activeCategory === cat ? 'is-active' : ''}" data-cat="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>
      </section>

      <section class="recipe-grid">${filteredRecipes.map(recipeCard).join('') || '<p class="small">Aucune recette dans ce menu.</p>'}</section>`;
}


function renderShoppingPage() {
  return `<section id="courses" class="page-hero premium-glass">
      <a class="secondary-link button-link" href="#top">← Retour aux recettes</a>
      <div><p class="eyebrow">Courses</p><h1>Votre liste de courses claire.</h1><p class="lead">Retrouvez uniquement les ingrédients cochés depuis les fiches recettes, prêts à être achetés.</p></div>
    </section>${renderShoppingSection()}`;
}

function renderBackupPage() {
  return `<section class="page-hero premium-glass">
      <a class="secondary-link button-link" href="#top">← Retour au carnet</a>
      <div><p class="eyebrow">Sauvegardes</p><h1>Un espace clair pour protéger votre carnet.</h1><p class="lead">Centralisez les exports, imports et la synchronisation GitHub sans encombrer la page d’accueil.</p></div>
    </section>${renderBackupPanel()}`;
}

function renderRecipePage(recipeId) {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) {
    return `<article class="panel page-panel"><p class="eyebrow">Recette introuvable</p><h2>Impossible d’ouvrir cette fiche</h2><p class="small">La recette a peut-être été supprimée.</p><a class="button-link" href="#recettes">Retour aux recettes</a></article>`;
  }
  return `<section class="page-hero recipe-page-hero premium-glass">
      <a class="secondary-link button-link" href="#recettes">← Retour aux recettes</a>
      <div><p class="eyebrow">Lecture recette</p><h1>${esc(recipe.name)}</h1><p class="lead">Une page dédiée pour cuisiner confortablement, avec les ingrédients, les portions et les étapes en pleine largeur.</p></div>
    </section>
    <section id="selected" class="selected-zone recipe-page-zone"></section>`;
}

function render() {
  const root = document.getElementById('root');
  if (!state.sessionUser) {
    root.innerHTML = `
      <main class="auth-shell">
        <section class="auth-card premium-glass">
          <p class="eyebrow">Livre de recettes privé</p>
          <h1>Maison Saison</h1>
          <p class="lead">Votre atelier culinaire premium : recettes enrichies, médias, modifications, portions intelligentes et liste de courses unifiée.</p>
          <div class="login-panel">
            <input id="login-user" placeholder="Utilisateur" autocomplete="username" />
            <input id="login-pass" type="password" placeholder="Mot de passe" autocomplete="current-password" />
            <button id="login-btn">Entrer dans le carnet</button>
          </div>
          <p class="small">Démo : admin / admin123</p>
        </section>
      </main>`;
    document.getElementById('login-btn').onclick = login;
    return;
  }

  const filteredRecipes = state.recipes.filter(recipeMatchesFilters);
  const totalIngredients = state.recipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0);
  const route = currentRoute();
  const content = route.page === 'backup' ? renderBackupPage() : route.page === 'shopping' ? renderShoppingPage() : route.page === 'recipe' ? renderRecipePage(route.id) : renderHomePage(filteredRecipes, totalIngredients);

  root.innerHTML = `${renderHeader()}<main id="top" class="page-shell">${content}${renderRecipeModal()}</main>`;

  bindEvents(root);
  hydrateForm();
  drawIngredientRows();
  drawStepRows();
  if (route.page === 'recipe') openRecipe(route.id, { scroll: false });
  if (!githubAutoLoadStarted && githubConfig().enabled && githubConfigured()) {
    githubAutoLoadStarted = true;
    setTimeout(() => loadFromGitHub(true), 0);
  }
}

function login() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const ok = state.users.find((x) => x.username === u && x.password === p);
  if (!ok) return alert('Identifiants invalides');
  state.sessionUser = u;
  save();
  render();
}

function renderFormHeader() {
  const recipe = state.recipes.find((r) => r.id === state.editingId);
  return `<p class="eyebrow">${recipe ? 'Modification' : 'Création'}</p><h2 id="recipe-modal-title">${recipe ? `Modifier : ${esc(recipe.name)}` : 'Ajouter une recette'}</h2>${recipe ? '<p class="small">Vous éditez une fiche existante. Enregistrez pour remplacer la version actuelle.</p>' : '<p class="small">Créez une fiche complète avec ingrédients, média, source et notes.</p>'}`;
}

function renderRecipeModal() {
  if (!state.formOpen && !state.editingId) return '';
  return `<section class="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title">
    <div class="modal-backdrop" data-close-form></div>
    <article id="ajouter" class="panel recipe-form-panel modal-panel">
      <div class="modal-toolbar">
        <div>${renderFormHeader()}</div>
        <button class="ghost modal-close" id="close-form" aria-label="Fermer le formulaire">×</button>
      </div>
      <div class="form-scroll">
        <div class="form-grid">
          <label>Nom<input id="r-name" placeholder="Ex : Lasagnes de famille" /></label>
          <label>Menu / catégorie<input id="r-category" placeholder="Salades, Plats, Desserts..." value="Mes recettes" /></label>
          <label>Personnes<input id="r-base" type="number" min="1" value="2" /></label>
          <label>Temps (min)<input id="r-time" type="number" min="1" value="20" /></label>
          <label>Difficulté<input id="r-difficulty" placeholder="Facile, Moyen, Chef..." value="Maison" /></label>
          <label>Badge<input id="r-badge" placeholder="Signature, Express..." value="Nouveau" /></label>
          <label>Tags<input id="r-tags" placeholder="rapide, été, végétarien..." /></label>
          <label>Note<input id="r-rating" type="hidden" value="3" /><span class="rating-picker" id="rating-picker" aria-label="Choisir une note">${[1, 2, 3, 4, 5].map((value) => `<button type="button" class="rating-button" data-rate="${value}">★</button>`).join('')}</span></label>
        </div>
        <label>Description<textarea id="r-description" placeholder="Courte description appétissante"></textarea></label>
        <div class="steps-head"><div><h3>Déroulé de la recette</h3><p class="small">Rédigez la préparation étape par étape pour obtenir une lecture élégante et guidée.</p></div><button class="secondary add-step-top" id="add-step">+ étape</button></div>
        <div id="steps" class="steps-editor"></div>
        <label>Notes du chef<textarea id="r-notes" placeholder="Astuce, conservation, dressage..."></textarea></label>
        <div class="form-grid media-grid">
          <label>URL photo<input id="r-photo" placeholder="https://...jpg" /></label>
          <label>Ajouter une photo locale<input id="r-file" type="file" accept="image/*" /></label>
          <label>URL vidéo<input id="r-video" placeholder="YouTube, Vimeo, MP4..." /></label>
          <label>URL source / site<input id="r-source" placeholder="https://site-de-recette.fr/..." /></label>
        </div>
        <div class="ingredients-head"><div><h3>Ingrédients</h3><p class="small">Ajoutez autant de lignes que nécessaire : les champs déjà saisis sont conservés.</p></div><button class="secondary add-ing-top" id="add-ing">+ ingrédient</button></div>
        <div id="ingredients" class="ingredients-editor"></div>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="add-ing-bottom">+ Ajouter un ingrédient</button>
        <button class="secondary" id="reset-form">Réinitialiser</button>
        <button id="save-recipe">${state.editingId ? 'Mettre à jour' : 'Enregistrer la recette'}</button>
      </div>
    </article>
  </section>`;
}

function recipeCard(r) {
  return `<article class="recipe-card">
    <div class="recipe-visual" style="background-image:${esc(asCssImage(r))}"><span>${esc(r.badge || 'Maison')}</span></div>
    <div class="recipe-body">
      <div class="recipe-meta"><span>${esc(r.category || 'Mes recettes')}</span><span>${esc(r.time || 20)} min</span><span>${esc(r.difficulty || 'Facile')}</span></div>
      <h3>${esc(r.name)}</h3>
      ${renderStars(r.rating, `Note ${r.name}`)}
      <p>${esc(r.description || 'Recette personnelle à adapter selon vos envies.')}</p>
      <div class="tag-row">${normalizeTags(r.tags || r.category || r.badge).slice(0, 4).map((tag) => `<span>#${esc(tag)}</span>`).join('')}</div>
      <div class="card-actions">
        <button data-open="${esc(r.id)}">Voir</button>
        <button class="secondary" data-edit="${esc(r.id)}">Modifier</button>
        <button class="icon-danger" title="Supprimer" data-del="${esc(r.id)}">×</button>
      </div>
      <div class="media-links">${r.videoUrl ? '<span>🎬 vidéo</span>' : ''}${r.sourceUrl ? `<a class="source" href="${esc(r.sourceUrl)}" target="_blank" rel="noreferrer">Source web</a>` : ''}</div>
    </div>
  </article>`;
}

function updateRecipeResults() {
  const grid = document.querySelector('.recipe-grid');
  if (!grid) return;
  const recipes = state.recipes.filter(recipeMatchesFilters);
  grid.innerHTML = recipes.map(recipeCard).join('') || '<p class="small">Aucune recette ne correspond à ces filtres.</p>';
  bindRecipeCardActions(grid);
}

function updateRatingPicker(value = 3) {
  const rating = clampRating(value);
  const input = document.getElementById('r-rating');
  if (input) input.value = rating;
  document.querySelectorAll('[data-rate]').forEach((button) => {
    const active = Number(button.getAttribute('data-rate')) <= rating;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function bindRecipeCardActions(scope = document) {
  scope.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute('data-del');
      if (!confirm('Supprimer cette recette ?')) return;
      state.recipes = state.recipes.filter((r) => r.id !== id);
      state.shopping = state.shopping.filter((s) => s.recipeId !== id);
      if (state.editingId === id) state.editingId = null;
      save();
      render();
      scheduleGithubSync('Suppression de recette Maison Saison');
    };
  });

  scope.querySelectorAll('[data-edit]').forEach((b) => {
    b.onclick = () => editRecipe(b.getAttribute('data-edit'));
  });

  scope.querySelectorAll('[data-open]').forEach((b) => {
    b.onclick = () => { window.location.hash = `recette/${b.getAttribute('data-open')}`; };
  });
}

function renderShopping() {
  return shoppingSummary()
    .map(
      (s) => `<div class="shopping-item"><span><strong>${esc(s.name)}</strong><small>${esc(s.recipes.join(', '))}</small></span><b>${formatQty(s.qtyNumber)} ${esc(s.unit)}</b></div>`,
    )
    .join('');
}

function bindEvents(root) {
  document.getElementById('logout').onclick = () => {
    state.sessionUser = null;
    save();
    render();
  };

  document.getElementById('menu-toggle').onclick = () => {
    state.menuOpen = !state.menuOpen;
    save();
    render();
  };

  root.querySelectorAll('.top-menu a').forEach((link) => {
    link.onclick = () => {
      state.menuOpen = false;
      save();
      document.querySelector('.site-header')?.classList.remove('is-menu-open');
      document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
    };
  });

  root.querySelectorAll('[data-create]').forEach((button) => {
    button.onclick = () => openRecipeForm();
  });

  root.querySelectorAll('[data-cat]').forEach((b) => {
    b.onclick = () => {
      state.activeCategory = b.getAttribute('data-cat');
      save();
      render();
    };
  });

  const addIngredient = () => {
    captureIngredientRows();
    const next = emptyIngredient();
    ingredientRows.push(next);
    drawIngredientRows(next.id);
  };

  const addTop = document.getElementById('add-ing');
  const addBottom = document.getElementById('add-ing-bottom');
  if (addTop) addTop.onclick = addIngredient;
  if (addBottom) addBottom.onclick = addIngredient;

  const addStep = () => {
    captureStepRows();
    const next = emptyStep();
    stepRows.push(next);
    drawStepRows(next.id);
  };
  const addStepTop = document.getElementById('add-step');
  if (addStepTop) addStepTop.onclick = addStep;

  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    resetForm.onclick = () => {
      state.editingId = null;
      state.formOpen = true;
      ingredientRows = [emptyIngredient()];
      stepRows = [emptyStep()];
      save();
      render();
    };
  }

  const saveRecipe = document.getElementById('save-recipe');
  if (saveRecipe) saveRecipe.onclick = saveRecipeFromForm;

  root.querySelectorAll('[data-close-form]').forEach((button) => {
    button.onclick = closeRecipeForm;
  });

  const closeForm = document.getElementById('close-form');
  if (closeForm) closeForm.onclick = closeRecipeForm;
  window.onkeydown = (event) => {
    if (event.key === 'Escape' && (state.formOpen || state.editingId)) closeRecipeForm();
  };

  bindRecipeCardActions(root);

  const filterName = document.getElementById('filter-name');
  if (filterName) filterName.oninput = () => {
    state.filters = { ...currentFilters(), name: filterName.value.trim() };
    save();
    updateRecipeResults();
  };

  root.querySelectorAll('[data-filter-ingredient]').forEach((input) => {
    input.onchange = () => {
      const value = input.getAttribute('data-filter-ingredient');
      const filters = currentFilters();
      const set = new Set(filters.ingredients);
      if (input.checked) set.add(value); else set.delete(value);
      state.filters = { ...filters, ingredients: Array.from(set) };
      save();
      render();
    };
  });

  root.querySelectorAll('[data-filter-tag]').forEach((input) => {
    input.onchange = () => {
      const value = input.getAttribute('data-filter-tag');
      const filters = currentFilters();
      const set = new Set(filters.tags);
      if (input.checked) set.add(value); else set.delete(value);
      state.filters = { ...filters, tags: Array.from(set) };
      save();
      render();
    };
  });

  root.querySelectorAll('[data-remove-filter]').forEach((button) => {
    button.onclick = () => {
      const filters = currentFilters();
      const kind = button.getAttribute('data-remove-filter');
      const value = button.getAttribute('data-value');
      if (kind === 'ingredient') filters.ingredients = filters.ingredients.filter((item) => item !== value);
      if (kind === 'tag') filters.tags = filters.tags.filter((item) => item !== value);
      state.filters = filters;
      save();
      render();
    };
  });

  const clearFilters = document.getElementById('clear-filters');
  if (clearFilters) clearFilters.onclick = () => {
    state.filters = { name: '', ingredients: [], tags: [] };
    save();
    render();
  };

  root.querySelectorAll('[data-rate]').forEach((button) => {
    button.onclick = () => updateRatingPicker(button.getAttribute('data-rate'));
  });
  updateRatingPicker(document.getElementById('r-rating')?.value || 3);

  const clearShopping = document.getElementById('clear-shopping');
  if (clearShopping) clearShopping.onclick = () => {
    state.shopping = [];
    save();
    updateShoppingPanel();
    scheduleGithubSync('Mise à jour de la liste de courses Maison Saison');
  };

  const saveGithub = document.getElementById('save-github-settings');
  if (saveGithub) saveGithub.onclick = saveGithubSettings;
  const loadGithub = document.getElementById('load-github');
  if (loadGithub) loadGithub.onclick = () => loadFromGitHub();
  const saveGithubNow = document.getElementById('save-github-now');
  if (saveGithubNow) saveGithubNow.onclick = saveNowToGitHub;
  const exportButton = document.getElementById('export-recipes');
  if (exportButton) exportButton.onclick = exportRecipes;
  const copyButton = document.getElementById('copy-backup');
  if (copyButton) copyButton.onclick = copyBackup;
  const importInput = document.getElementById('import-recipes');
  if (importInput) importInput.onchange = (event) => importRecipes(event.target.files[0]);
  const importText = document.getElementById('import-backup-text');
  if (importText) importText.onclick = importBackupText;
}

function hydrateForm() {
  if (!document.getElementById('r-name')) return;
  const recipe = state.recipes.find((r) => r.id === state.editingId);
  if (!recipe) return;
  document.getElementById('r-name').value = recipe.name || '';
  document.getElementById('r-category').value = recipe.category || 'Mes recettes';
  document.getElementById('r-base').value = recipe.baseServings || 2;
  document.getElementById('r-time').value = recipe.time || 20;
  document.getElementById('r-difficulty').value = recipe.difficulty || 'Maison';
  document.getElementById('r-badge').value = recipe.badge || 'Nouveau';
  document.getElementById('r-description').value = recipe.description || '';
  document.getElementById('r-tags').value = normalizeTags(recipe.tags || recipe.category || recipe.badge).join(', ');
  document.getElementById('r-rating').value = clampRating(recipe.rating);
  updateRatingPicker(clampRating(recipe.rating));
  stepRows = normalizeSteps(recipe.steps);
  if (!stepRows.length) stepRows = [emptyStep()];
  document.getElementById('r-notes').value = recipe.notes || '';
  document.getElementById('r-photo').value = recipe.photoUrl || '';
  document.getElementById('r-video').value = recipe.videoUrl || '';
  document.getElementById('r-source').value = recipe.sourceUrl || '';
  ingredientRows = recipe.ingredients.length ? recipe.ingredients.map((ing) => emptyIngredient(ing)) : [emptyIngredient()];
}

function captureStepRows() {
  const container = document.getElementById('steps');
  if (!container) return;
  stepRows = stepRows.map((row) => ({
    id: row.id,
    text: container.querySelector(`[data-step="text-${row.id}"]`)?.value.trim() || '',
  }));
}

function drawStepRows(focusId) {
  const container = document.getElementById('steps');
  if (!container) return;
  container.innerHTML = stepRows
    .map(
      (r, index) => `<div class="step-row" data-step-row-id="${esc(r.id)}">
        <div class="step-number">${index + 1}</div>
        <label><span>Étape ${index + 1}</span><textarea data-step="text-${r.id}" placeholder="Décrivez précisément cette étape de préparation">${esc(r.text)}</textarea></label>
        <button class="secondary tiny" data-remove-step="${esc(r.id)}" ${stepRows.length === 1 ? 'disabled' : ''}>Retirer</button>
      </div>`,
    )
    .join('');

  if (focusId) {
    const row = container.querySelector(`[data-step-row-id="${focusId}"]`);
    row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row?.querySelector('textarea')?.focus({ preventScroll: true });
  }

  container.querySelectorAll('[data-remove-step]').forEach((button) => {
    button.onclick = () => {
      captureStepRows();
      stepRows = stepRows.filter((row) => row.id !== button.getAttribute('data-remove-step'));
      if (!stepRows.length) stepRows = [emptyStep()];
      drawStepRows();
    };
  });
}

function captureIngredientRows() {
  const container = document.getElementById('ingredients');
  if (!container) return;
  ingredientRows = ingredientRows.map((row) => ({
    id: row.id,
    name: container.querySelector(`[data-in="name-${row.id}"]`)?.value.trim() || '',
    qty: Number(container.querySelector(`[data-in="qty-${row.id}"]`)?.value) || 0,
    unit: container.querySelector(`[data-in="unit-${row.id}"]`)?.value.trim() || 'u',
  }));
}

function drawIngredientRows(focusId) {
  const container = document.getElementById('ingredients');
  if (!container) return;
  container.innerHTML = ingredientRows
    .map(
      (r, index) => `<div class="ingredient-row" data-row-id="${esc(r.id)}">
        <label><span>Ingrédient</span><input data-in="name-${r.id}" placeholder="Ex : Tomates" value="${esc(r.name)}" /></label>
        <label><span>Quantité</span><input data-in="qty-${r.id}" type="number" min="0" step="0.1" value="${esc(r.qty)}" /></label>
        <label><span>Unité</span><input data-in="unit-${r.id}" placeholder="g, pièce..." value="${esc(r.unit)}" /></label>
        <button class="secondary tiny" data-remove-ing="${esc(r.id)}" ${ingredientRows.length === 1 ? 'disabled' : ''}>Retirer</button>
        <small>Ligne ${index + 1}</small>
      </div>`,
    )
    .join('');

  if (focusId) {
    const row = container.querySelector(`[data-row-id="${focusId}"]`);
    row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row?.querySelector('input')?.focus({ preventScroll: true });
  }

  container.querySelectorAll('[data-remove-ing]').forEach((button) => {
    button.onclick = () => {
      captureIngredientRows();
      ingredientRows = ingredientRows.filter((row) => row.id !== button.getAttribute('data-remove-ing'));
      if (!ingredientRows.length) ingredientRows = [emptyIngredient()];
      drawIngredientRows();
    };
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

async function saveRecipeFromForm() {
  captureIngredientRows();
  captureStepRows();
  const name = document.getElementById('r-name').value.trim();
  if (!name) return alert('Nom requis');
  const file = document.getElementById('r-file').files[0];
  const existing = state.recipes.find((r) => r.id === state.editingId) || {};
  const photoData = file ? await readFileAsDataUrl(file) : existing.photoData || '';
  const recipe = normalizeRecipe({
    ...existing,
    id: existing.id || uid('recipe'),
    name,
    category: document.getElementById('r-category').value.trim() || 'Mes recettes',
    baseServings: Number(document.getElementById('r-base').value) || 1,
    time: Number(document.getElementById('r-time').value) || 20,
    difficulty: document.getElementById('r-difficulty').value.trim() || 'Maison',
    badge: document.getElementById('r-badge').value.trim() || 'Nouveau',
    tags: normalizeTags(document.getElementById('r-tags').value),
    rating: clampRating(document.getElementById('r-rating').value),
    description: document.getElementById('r-description').value.trim(),
    steps: stepRows.filter((x) => x.text).map((x) => ({ ...x, id: x.id || uid('step') })),
    notes: document.getElementById('r-notes').value.trim(),
    photoUrl: document.getElementById('r-photo').value.trim(),
    photoData,
    videoUrl: document.getElementById('r-video').value.trim(),
    sourceUrl: document.getElementById('r-source').value.trim(),
    sourceName: document.getElementById('r-source').value.trim() ? 'Source web' : '',
    image: existing.image || 'linear-gradient(135deg, #74c0fc 0%, #69db7c 100%)',
    ingredients: ingredientRows.filter((x) => x.name).map((x) => ({ ...x, id: x.id || uid('ing'), qty: Number(x.qty) || 0 })),
  });

  if (!recipe.ingredients.length) return alert('Ajoutez au moins un ingrédient');
  const existingIndex = state.recipes.findIndex((r) => r.id === recipe.id);
  if (existingIndex >= 0) state.recipes[existingIndex] = recipe;
  else state.recipes.unshift(recipe);
  state.editingId = null;
  state.formOpen = false;
  ingredientRows = [emptyIngredient()];
  stepRows = [emptyStep()];
  save();
  window.location.hash = `recette/${recipe.id}`;
  render();
  scheduleGithubSync('Enregistrement de recette Maison Saison');
}

function openRecipeForm() {
  state.editingId = null;
  state.formOpen = true;
  state.menuOpen = false;
  ingredientRows = [emptyIngredient()];
  stepRows = [emptyStep()];
  save();
  render();
}

function closeRecipeForm() {
  state.editingId = null;
  state.formOpen = false;
  ingredientRows = [emptyIngredient()];
  stepRows = [emptyStep()];
  save();
  render();
}

function editRecipe(recipeId) {
  state.editingId = recipeId;
  state.formOpen = true;
  state.menuOpen = false;
  save();
  render();
}

function videoEmbed(url) {
  if (!url) return '';
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtube) return `<iframe title="Vidéo de la recette" src="https://www.youtube.com/embed/${esc(youtube[1])}" allowfullscreen></iframe>`;
  return `<video controls src="${esc(url)}"></video>`;
}

function renderPreparationSteps(recipe) {
  const steps = normalizeSteps(recipe.steps);
  if (!steps.length) return '<p class="small">Aucune étape renseignée.</p>';
  return `<ol class="preparation-steps">${steps.map((step, index) => `<li><span>${index + 1}</span><p>${esc(step.text)}</p></li>`).join('')}</ol>`;
}

function openRecipe(recipeId, options = {}) {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) return;
  const selected = document.getElementById('selected');
  if (!selected) {
    window.location.hash = `recette/${recipeId}`;
    return;
  }
  selected.innerHTML = `<article class="panel recipe-detail">
    <div class="detail-cover" style="background-image:${esc(asCssImage(recipe))}"></div>
    <div class="detail-main">
      <p class="eyebrow">Fiche recette</p>
      <h2>${esc(recipe.name)}</h2>
      ${renderStars(recipe.rating, `Note ${recipe.name}`)}
      <p class="lead">${esc(recipe.description || '')}</p>
      <div class="recipe-meta"><span>${esc(recipe.category || 'Mes recettes')}</span><span>${esc(recipe.time || 20)} min</span><span>${esc(recipe.difficulty || 'Facile')}</span></div>
      <div class="detail-actions"><button class="secondary" data-edit-detail="${esc(recipe.id)}">Modifier cette recette</button>${recipe.sourceUrl ? `<a class="button-link secondary-link" href="${esc(recipe.sourceUrl)}" target="_blank" rel="noreferrer">Ouvrir la source</a>` : ''}</div>
    </div>
    <div class="serving-box"><label for="servings">Personnes</label><input id="servings" type="number" min="1" value="${esc(recipe.baseServings)}" /></div>
    <div class="detail-section"><h3>Ingrédients à sélectionner</h3><p class="small">Cochez seulement ce que vous voulez ajouter à la liste de courses.</p><ul id="ing-list" class="ingredient-list"></ul></div>
    <div class="detail-section preparation-section"><h3>Préparation pas à pas</h3>${renderPreparationSteps(recipe)}${recipe.notes ? `<div class="chef-note"><strong>Note du chef</strong><span>${esc(recipe.notes)}</span></div>` : ''}</div>
    ${recipe.videoUrl ? `<div class="detail-section media-player"><h3>Vidéo</h3>${videoEmbed(recipe.videoUrl)}</div>` : ''}
  </article>`;
  if (options.scroll !== false) selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
  selected.querySelector('[data-edit-detail]').onclick = () => editRecipe(recipe.id);

  const redraw = () => {
    const servings = Number(document.getElementById('servings').value) || 1;
    document.getElementById('ing-list').innerHTML = recipe.ingredients
      .map((i) => {
        const qtyNumber = (Number(i.qty) * servings) / recipe.baseServings;
        const checked = state.shopping.some((s) => s.recipeId === recipe.id && s.ingredientId === i.id);
        return `<li><label><input type="checkbox" data-check="${esc(i.id)}" ${checked ? 'checked' : ''}/> <span>${esc(i.name)}</span><strong>${formatQty(qtyNumber)} ${esc(i.unit)}</strong></label></li>`;
      })
      .join('');

    document.querySelectorAll('[data-check]').forEach((c) => {
      c.onchange = () => {
        const ingredientId = c.getAttribute('data-check');
        const ingredient = recipe.ingredients.find((x) => x.id === ingredientId);
        const qtyNumber = (Number(ingredient.qty) * servings) / recipe.baseServings;
        const exists = state.shopping.find((s) => s.recipeId === recipe.id && s.ingredientId === ingredientId);
        if (exists) {
          state.shopping = state.shopping.filter((s) => !(s.recipeId === recipe.id && s.ingredientId === ingredientId));
        } else {
          state.shopping.push({ recipeId: recipe.id, ingredientId, recipeName: recipe.name, name: ingredient.name, qtyNumber, unit: ingredient.unit });
        }
        save();
        redraw();
        updateShoppingPanel();
        scheduleGithubSync('Mise à jour de la liste de courses Maison Saison');
      };
    });
  };

  document.getElementById('servings').oninput = redraw;
  redraw();
}

window.addEventListener('hashchange', render);
render();
loadInitialRecipes();
