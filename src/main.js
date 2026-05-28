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

const seedRecipes = [
  {
    id: 'salade-nicoise-premium',
    name: 'Salade niçoise grand soleil',
    category: 'Salades',
    time: 25,
    difficulty: 'Facile',
    badge: 'Signature',
    baseServings: 4,
    image: 'linear-gradient(135deg, rgba(255, 209, 102, 0.92), rgba(246, 114, 128, 0.86)), url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dA0VGEbbw4g',
    sourceName: 'Inspiration méditerranéenne',
    sourceUrl: 'https://www.marmiton.org/recettes/recette_salade-nicoise_87933.aspx',
    description: 'Une salade complète, colorée et généreuse avec thon, œufs, légumes croquants et olives noires.',
    steps: 'Cuire les œufs 9 minutes puis les refroidir. Couper tomates, concombre, poivron et oignon. Disposer la salade, ajouter thon, olives et anchois. Assaisonner avec huile d’olive, vinaigre, sel et poivre. Servir très frais.',
    notes: 'Ajoutez les œufs au dernier moment pour une présentation impeccable.',
    ingredients: [
      { id: 'salade', name: 'Salade romaine', qty: 1, unit: 'pièce' },
      { id: 'tomates', name: 'Tomates', qty: 4, unit: 'pièces' },
      { id: 'thon', name: 'Thon', qty: 240, unit: 'g' },
      { id: 'oeufs', name: 'Œufs', qty: 4, unit: 'pièces' },
      { id: 'olives', name: 'Olives noires', qty: 80, unit: 'g' },
      { id: 'huile', name: 'Huile d’olive', qty: 3, unit: 'c. à soupe' },
    ],
  },
  {
    id: 'risotto-champignons',
    name: 'Risotto crémeux aux champignons',
    category: 'Plats',
    time: 40,
    difficulty: 'Moyen',
    badge: 'Comfort food',
    baseServings: 4,
    image: 'linear-gradient(135deg, rgba(91, 62, 43, 0.75), rgba(242, 177, 109, 0.74)), url(https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    sourceName: 'Technique maison',
    sourceUrl: '',
    description: 'Un plat principal onctueux, parfumé au parmesan, parfait pour un dîner premium sans complication.',
    steps: 'Faire revenir l’oignon dans l’huile. Ajouter le riz et le nacrer 2 minutes. Verser le vin blanc, puis incorporer le bouillon louche par louche. Poêler les champignons à part. Terminer avec parmesan, beurre, champignons et persil.',
    notes: 'Le secret : remuer souvent et garder le bouillon bien chaud.',
    ingredients: [
      { id: 'riz', name: 'Riz arborio', qty: 320, unit: 'g' },
      { id: 'champignons', name: 'Champignons', qty: 450, unit: 'g' },
      { id: 'bouillon', name: 'Bouillon de légumes', qty: 1.1, unit: 'L' },
      { id: 'parmesan', name: 'Parmesan', qty: 90, unit: 'g' },
      { id: 'vin', name: 'Vin blanc', qty: 12, unit: 'cl' },
      { id: 'oignon', name: 'Oignon', qty: 1, unit: 'pièce' },
    ],
  },
  {
    id: 'poulet-yassa',
    name: 'Poulet yassa citronné',
    category: 'Plats',
    time: 55,
    difficulty: 'Moyen',
    badge: 'Voyage',
    baseServings: 4,
    image: 'linear-gradient(135deg, rgba(255, 212, 59, 0.86), rgba(43, 138, 62, 0.8)), url(https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    sourceName: '',
    sourceUrl: '',
    description: 'Un grand plat familial avec oignons fondants, citron et moutarde, à servir avec du riz parfumé.',
    steps: 'Mariner le poulet avec citron, moutarde, ail, sel et poivre pendant 30 minutes. Faire dorer le poulet. Faire compoter les oignons, ajouter la marinade et un peu d’eau. Remettre le poulet et mijoter jusqu’à tendreté.',
    notes: 'Excellent réchauffé le lendemain.',
    ingredients: [
      { id: 'poulet', name: 'Cuisses de poulet', qty: 4, unit: 'pièces' },
      { id: 'oignons', name: 'Oignons', qty: 5, unit: 'pièces' },
      { id: 'citrons', name: 'Citrons', qty: 3, unit: 'pièces' },
      { id: 'moutarde', name: 'Moutarde', qty: 3, unit: 'c. à soupe' },
      { id: 'riz', name: 'Riz', qty: 300, unit: 'g' },
      { id: 'ail', name: 'Ail', qty: 2, unit: 'gousses' },
    ],
  },
  {
    id: 'tarte-fraises',
    name: 'Tarte aux fraises pâtissière',
    category: 'Desserts',
    time: 75,
    difficulty: 'Chef',
    badge: 'Pâtisserie',
    baseServings: 8,
    image: 'linear-gradient(135deg, rgba(255, 107, 107, 0.8), rgba(255, 236, 153, 0.76)), url(https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    sourceName: '',
    sourceUrl: '',
    description: 'Un dessert vitrine avec pâte croustillante, crème vanillée et fraises brillantes.',
    steps: 'Cuire la pâte à blanc. Préparer une crème pâtissière vanillée et la refroidir. Garnir le fond de tarte, disposer les fraises coupées et napper légèrement. Réserver au frais avant dégustation.',
    notes: 'Pour un rendu pro, alternez les pointes des fraises vers l’extérieur.',
    ingredients: [
      { id: 'pate', name: 'Pâte sablée', qty: 1, unit: 'pièce' },
      { id: 'fraises', name: 'Fraises', qty: 650, unit: 'g' },
      { id: 'lait', name: 'Lait', qty: 50, unit: 'cl' },
      { id: 'oeufs', name: 'Jaunes d’œufs', qty: 4, unit: 'pièces' },
      { id: 'sucre', name: 'Sucre', qty: 110, unit: 'g' },
      { id: 'vanille', name: 'Vanille', qty: 1, unit: 'gousse' },
    ],
  },
  {
    id: 'soupe-potimarron',
    name: 'Velouté potimarron & noisettes',
    category: 'Entrées',
    time: 35,
    difficulty: 'Facile',
    badge: 'Douceur',
    baseServings: 4,
    image: 'linear-gradient(135deg, rgba(240, 90, 55, 0.86), rgba(255, 190, 118, 0.76)), url(https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    sourceName: '',
    sourceUrl: '',
    description: 'Une entrée veloutée, rapide et élégante, avec une finition noisette qui change tout.',
    steps: 'Couper le potimarron et les carottes. Faire suer l’oignon, ajouter les légumes et couvrir de bouillon. Cuire 25 minutes puis mixer avec crème. Servir avec noisettes torréfiées.',
    notes: 'Inutile d’éplucher le potimarron si la peau est fine.',
    ingredients: [
      { id: 'potimarron', name: 'Potimarron', qty: 1, unit: 'pièce' },
      { id: 'carottes', name: 'Carottes', qty: 3, unit: 'pièces' },
      { id: 'bouillon', name: 'Bouillon de légumes', qty: 80, unit: 'cl' },
      { id: 'creme', name: 'Crème', qty: 15, unit: 'cl' },
      { id: 'noisettes', name: 'Noisettes', qty: 50, unit: 'g' },
      { id: 'oignon', name: 'Oignon', qty: 1, unit: 'pièce' },
    ],
  },
  {
    id: 'smoothie-mangue',
    name: 'Smoothie mangue passion',
    category: 'Boissons',
    time: 8,
    difficulty: 'Facile',
    badge: 'Vitaminé',
    baseServings: 2,
    image: 'linear-gradient(135deg, rgba(255, 193, 7, 0.85), rgba(255, 111, 97, 0.72)), url(https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=1200&q=80)',
    photoUrl: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    sourceName: '',
    sourceUrl: '',
    description: 'Une boisson minute, ultra fraîche, idéale pour brunchs et goûters.',
    steps: 'Mixer mangue, banane, jus d’orange, yaourt et pulpe de passion. Ajouter quelques glaçons et mixer à nouveau. Servir immédiatement.',
    notes: 'Remplacez le yaourt par du lait de coco pour une version vegan.',
    ingredients: [
      { id: 'mangue', name: 'Mangue', qty: 1, unit: 'pièce' },
      { id: 'banane', name: 'Banane', qty: 1, unit: 'pièce' },
      { id: 'orange', name: 'Jus d’orange', qty: 25, unit: 'cl' },
      { id: 'passion', name: 'Fruit de la passion', qty: 2, unit: 'pièces' },
      { id: 'yaourt', name: 'Yaourt grec', qty: 120, unit: 'g' },
    ],
  },
];

const defaultState = {
  users: [{ username: 'admin', password: 'admin123' }],
  recipes: seedRecipes,
  shopping: [],
  github: githubDefaults,
  sessionUser: null,
  activeCategory: 'Tout voir',
  editingId: null,
  formOpen: false,
  menuOpen: false,
};

const state = load();
let ingredientRows = [emptyIngredient()];

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const savedRecipes = Array.isArray(saved.recipes) && saved.recipes.length ? saved.recipes : [];
    const recipes = mergeRecipes(seedRecipes, savedRecipes);
    const github = { ...githubDefaults, ...(saved.github || {}) };
    githubStatus = github.lastSync ? `Dernière synchro GitHub : ${new Date(github.lastSync).toLocaleString('fr-FR')}` : 'GitHub prêt à configurer';
    return { ...defaultState, ...saved, github, recipes, shopping: Array.isArray(saved.shopping) ? saved.shopping : [] };
  } catch {
    return { ...defaultState };
  }
}

function mergeRecipes(seed, saved) {
  const map = new Map(seed.map((recipe) => [recipe.id, recipe]));
  saved.forEach((recipe) => map.set(recipe.id, normalizeRecipe(recipe)));
  return Array.from(map.values());
}

function normalizeRecipe(recipe) {
  return {
    badge: 'Maison',
    difficulty: 'Maison',
    baseServings: 2,
    time: 20,
    ingredients: [],
    ...recipe,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
  };
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

  const filteredRecipes = state.activeCategory === 'Tout voir' ? state.recipes : state.recipes.filter((r) => (r.category || 'Mes recettes') === state.activeCategory);
  const totalIngredients = state.recipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0);

  root.innerHTML = `
    <header class="site-header ${state.menuOpen ? 'is-menu-open' : ''}">
      <a class="brand" href="#top"><span class="brand-mark">✦</span><span>Maison Saison <small>Premium</small></span></a>
      <button class="menu-toggle ghost" id="menu-toggle" aria-expanded="${state.menuOpen ? 'true' : 'false'}" aria-controls="top-menu"><span>☰</span> Menu</button>
      <nav id="top-menu" class="top-menu" aria-label="Menu principal">
        <a href="#recettes">Recettes</a>
        <a href="#courses">Courses</a>
        <a href="#sauvegarde">Sauvegarde</a>
        <button class="nav-action" data-create>+ Recette</button>
      </nav>
      <button class="ghost logout-button" id="logout">Déconnexion</button>
    </header>

    <main id="top" class="page-shell">
      <section class="hero premium-glass">
        <div>
          <p class="eyebrow">Collection premium</p>
          <h1>Le livre de recettes complet, élégant et prêt à cuisiner.</h1>
          <p class="lead">Créez des fiches riches avec photos, vidéos et URLs, corrigez vos recettes, adaptez les portions et cochez uniquement les ingrédients à acheter.</p>
          <div class="hero-actions">
            <a class="button-link" href="#recettes">Explorer les menus</a>
            <button class="secondary-link" data-create>Créer une recette</button>
          </div>
          <div class="storage-notice">
            <strong>☁️ Sauvegarde locale</strong>
            <span>Les recettes sont gardées localement puis, si vous activez la synchronisation GitHub, automatiquement enregistrées dans le JSON de votre dépôt personnel.</span>
          </div>
        </div>
        <aside class="hero-card">
          <span>Tableau de bord</span>
          <strong>${state.recipes.length}</strong>
          <p>recettes · ${categories().length - 1} menus · ${totalIngredients} ingrédients</p>
        </aside>
      </section>

      <section class="premium-strip" aria-label="Fonctionnalités premium">
        <div><strong>📸 Médias</strong><span>photo, vidéo et source web</span></div>
        <div><strong>✍️ Édition</strong><span>modification complète des fiches</span></div>
        <div><strong>🛒 Courses</strong><span>sélection ingrédient par ingrédient</span></div>
        <div><strong>⚖️ Portions</strong><span>quantités recalculées automatiquement</span></div>
      </section>

      <section id="recettes" class="section-head">
        <div><p class="eyebrow">Menus</p><h2>Recettes disponibles</h2></div>
        <div class="category-menu">${categories().map((cat) => `<button class="nav-pill ${state.activeCategory === cat ? 'is-active' : ''}" data-cat="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>
      </section>

      <section class="recipe-grid">${filteredRecipes.map(recipeCard).join('') || '<p class="small">Aucune recette dans ce menu.</p>'}</section>

      <section id="selected" class="selected-zone"></section>

      <section id="courses" class="section-head">
        <div><p class="eyebrow">Courses</p><h2>Liste de courses</h2></div>
        <button class="secondary" id="clear-shopping">Vider la liste</button>
      </section>

      <section class="tool-grid">
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

        <article id="sauvegarde" class="panel backup-panel">
          <p class="eyebrow">Sauvegarde</p>
          <h2>Import, export & GitHub</h2>
          <p class="small">Les réglages de synchronisation et les sauvegardes manuelles sont séparés de la liste de courses pour garder chaque espace clair.</p>
          <div class="backup-layout">
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
        </article>
      </section>

      ${renderRecipeModal()}
    </main>`;

  bindEvents(root);
  hydrateForm();
  drawIngredientRows();
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
        </div>
        <label>Description<textarea id="r-description" placeholder="Courte description appétissante"></textarea></label>
        <label>Étapes<textarea id="r-steps" placeholder="Décrivez les étapes de préparation"></textarea></label>
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
      <p>${esc(r.description || 'Recette personnelle à adapter selon vos envies.')}</p>
      <div class="card-actions">
        <button data-open="${esc(r.id)}">Voir</button>
        <button class="secondary" data-edit="${esc(r.id)}">Modifier</button>
        <button class="icon-danger" title="Supprimer" data-del="${esc(r.id)}">×</button>
      </div>
      <div class="media-links">${r.videoUrl ? '<span>🎬 vidéo</span>' : ''}${r.sourceUrl ? `<a class="source" href="${esc(r.sourceUrl)}" target="_blank" rel="noreferrer">Source web</a>` : ''}</div>
    </div>
  </article>`;
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

  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    resetForm.onclick = () => {
      state.editingId = null;
      state.formOpen = true;
      ingredientRows = [emptyIngredient()];
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

  root.querySelectorAll('[data-del]').forEach((b) => {
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

  root.querySelectorAll('[data-edit]').forEach((b) => {
    b.onclick = () => editRecipe(b.getAttribute('data-edit'));
  });

  root.querySelectorAll('[data-open]').forEach((b) => {
    b.onclick = () => openRecipe(b.getAttribute('data-open'));
  });

  document.getElementById('clear-shopping').onclick = () => {
    state.shopping = [];
    save();
    updateShoppingPanel();
    scheduleGithubSync('Mise à jour de la liste de courses Maison Saison');
  };

  document.getElementById('save-github-settings').onclick = saveGithubSettings;
  document.getElementById('load-github').onclick = () => loadFromGitHub();
  document.getElementById('save-github-now').onclick = saveNowToGitHub;
  document.getElementById('export-recipes').onclick = exportRecipes;
  document.getElementById('copy-backup').onclick = copyBackup;
  document.getElementById('import-recipes').onchange = (event) => importRecipes(event.target.files[0]);
  document.getElementById('import-backup-text').onclick = importBackupText;
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
  document.getElementById('r-steps').value = recipe.steps || '';
  document.getElementById('r-notes').value = recipe.notes || '';
  document.getElementById('r-photo').value = recipe.photoUrl || '';
  document.getElementById('r-video').value = recipe.videoUrl || '';
  document.getElementById('r-source').value = recipe.sourceUrl || '';
  ingredientRows = recipe.ingredients.length ? recipe.ingredients.map((ing) => emptyIngredient(ing)) : [emptyIngredient()];
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
    description: document.getElementById('r-description').value.trim(),
    steps: document.getElementById('r-steps').value.trim(),
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
  save();
  render();
  openRecipe(recipe.id);
  scheduleGithubSync('Enregistrement de recette Maison Saison');
}

function openRecipeForm() {
  state.editingId = null;
  state.formOpen = true;
  state.menuOpen = false;
  ingredientRows = [emptyIngredient()];
  save();
  render();
}

function closeRecipeForm() {
  state.editingId = null;
  state.formOpen = false;
  ingredientRows = [emptyIngredient()];
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

function openRecipe(recipeId) {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) return;
  const selected = document.getElementById('selected');
  selected.innerHTML = `<article class="panel recipe-detail">
    <div class="detail-cover" style="background-image:${esc(asCssImage(recipe))}"></div>
    <div class="detail-main">
      <p class="eyebrow">Fiche recette</p>
      <h2>${esc(recipe.name)}</h2>
      <p class="lead">${esc(recipe.description || '')}</p>
      <div class="recipe-meta"><span>${esc(recipe.category || 'Mes recettes')}</span><span>${esc(recipe.time || 20)} min</span><span>${esc(recipe.difficulty || 'Facile')}</span></div>
      <div class="detail-actions"><button class="secondary" data-edit-detail="${esc(recipe.id)}">Modifier cette recette</button>${recipe.sourceUrl ? `<a class="button-link secondary-link" href="${esc(recipe.sourceUrl)}" target="_blank" rel="noreferrer">Ouvrir la source</a>` : ''}</div>
    </div>
    <div class="serving-box"><label for="servings">Personnes</label><input id="servings" type="number" min="1" value="${esc(recipe.baseServings)}" /></div>
    <div class="detail-section"><h3>Ingrédients à sélectionner</h3><p class="small">Cochez seulement ce que vous voulez ajouter à la liste de courses.</p><ul id="ing-list" class="ingredient-list"></ul></div>
    <div class="detail-section"><h3>Préparation</h3><p>${esc(recipe.steps || 'Aucune étape renseignée.')}</p>${recipe.notes ? `<div class="chef-note"><strong>Note du chef</strong><span>${esc(recipe.notes)}</span></div>` : ''}</div>
    ${recipe.videoUrl ? `<div class="detail-section media-player"><h3>Vidéo</h3>${videoEmbed(recipe.videoUrl)}</div>` : ''}
  </article>`;
  selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

render();
