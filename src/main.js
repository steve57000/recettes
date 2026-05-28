const KEY = 'recettes-app-premium-v1';
const BACKUP_FILENAME = 'maison-saison-recettes.json';

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
  sessionUser: null,
  activeCategory: 'Tout voir',
  editingId: null,
};

const state = load();
let ingredientRows = [emptyIngredient()];

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const savedRecipes = Array.isArray(saved.recipes) && saved.recipes.length ? saved.recipes : [];
    const recipes = mergeRecipes(seedRecipes, savedRecipes);
    return { ...defaultState, ...saved, recipes, shopping: Array.isArray(saved.shopping) ? saved.shopping : [] };
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

function exportRecipes() {
  const payload = {
    exportedAt: new Date().toISOString(),
    recipes: state.recipes,
    shopping: state.shopping,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = BACKUP_FILENAME;
  link.click();
  URL.revokeObjectURL(url);
}

async function importRecipes(file) {
  if (!file) return;
  try {
    const content = await file.text();
    const payload = JSON.parse(content);
    const recipes = Array.isArray(payload) ? payload : payload.recipes;
    if (!Array.isArray(recipes)) throw new Error('Format invalide');
    state.recipes = mergeRecipes(state.recipes, recipes);
    if (Array.isArray(payload.shopping)) state.shopping = payload.shopping;
    state.activeCategory = 'Tout voir';
    state.editingId = null;
    save();
    render();
    alert('Recettes importées dans ce navigateur.');
  } catch {
    alert('Import impossible : choisissez un fichier JSON exporté depuis Maison Saison.');
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
    <header class="site-header">
      <a class="brand" href="#top"><span class="brand-mark">✦</span><span>Maison Saison <small>Premium</small></span></a>
      <nav class="top-menu" aria-label="Menu principal">
        <a href="#recettes">Menus</a>
        <a href="#ajouter">Ajouter / modifier</a>
        <a href="#courses">Courses</a>
      </nav>
      <button class="ghost" id="logout">Déconnexion</button>
    </header>

    <main id="top" class="page-shell">
      <section class="hero premium-glass">
        <div>
          <p class="eyebrow">Collection premium</p>
          <h1>Le livre de recettes complet, élégant et prêt à cuisiner.</h1>
          <p class="lead">Créez des fiches riches avec photos, vidéos et URLs, corrigez vos recettes, adaptez les portions et cochez uniquement les ingrédients à acheter.</p>
          <div class="hero-actions">
            <a class="button-link" href="#recettes">Explorer les menus</a>
            <a class="button-link secondary-link" href="#ajouter">Créer une recette</a>
          </div>
          <div class="storage-notice">
            <strong>☁️ Sauvegarde locale</strong>
            <span>Les recettes créées ici sont enregistrées dans ce navigateur. Pour les retrouver ailleurs, exportez le fichier JSON puis importez-le sur l’autre appareil.</span>
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

      <section class="workspace">
        <article id="ajouter" class="panel recipe-form-panel">
          ${renderFormHeader()}
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
          <div class="ingredient-actions"><button class="secondary" id="add-ing-bottom">+ Ajouter un ingrédient</button></div>
          <div class="row form-actions"><button class="secondary" id="reset-form">Réinitialiser</button><button id="save-recipe">${state.editingId ? 'Mettre à jour' : 'Enregistrer la recette'}</button></div>
        </article>

        <aside id="courses" class="panel sticky-panel">
          <p class="eyebrow">Organisation</p>
          <h2>Liste de courses</h2>
          <p class="small">Les ingrédients identiques sont regroupés lorsque l’unité est la même.</p>
          <div class="backup-actions">
            <button class="secondary" id="export-recipes">Exporter</button>
            <label class="button-link secondary-link import-label" for="import-recipes">Importer</label>
            <input class="visually-hidden" id="import-recipes" type="file" accept="application/json,.json" />
          </div>
          <p class="small">Important : une recette ajoutée n’est pas écrite automatiquement dans un fichier GitHub ; elle reste dans le stockage local du navigateur.</p>
          <div class="shopping-list">${renderShopping() || '<p class="small">Liste vide. Ouvrez une recette et cochez uniquement ce qu’il vous manque.</p>'}</div>
          <button id="clear-shopping">Vider la liste</button>
        </aside>
      </section>

      <section id="selected" class="selected-zone"></section>
    </main>`;

  bindEvents(root);
  hydrateForm();
  drawIngredientRows();
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
  return `<p class="eyebrow">${recipe ? 'Modification' : 'Création'}</p><h2>${recipe ? `Modifier : ${esc(recipe.name)}` : 'Ajouter une recette'}</h2>${recipe ? '<p class="small">Vous éditez une fiche existante. Enregistrez pour remplacer la version actuelle.</p>' : '<p class="small">Créez une fiche complète avec ingrédients, média, source et notes.</p>'}`;
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

  document.getElementById('add-ing').onclick = addIngredient;
  document.getElementById('add-ing-bottom').onclick = addIngredient;

  document.getElementById('reset-form').onclick = () => {
    state.editingId = null;
    ingredientRows = [emptyIngredient()];
    save();
    render();
    document.getElementById('ajouter').scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('save-recipe').onclick = saveRecipeFromForm;

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute('data-del');
      if (!confirm('Supprimer cette recette ?')) return;
      state.recipes = state.recipes.filter((r) => r.id !== id);
      state.shopping = state.shopping.filter((s) => s.recipeId !== id);
      if (state.editingId === id) state.editingId = null;
      save();
      render();
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
  };

  document.getElementById('export-recipes').onclick = exportRecipes;
  document.getElementById('import-recipes').onchange = (event) => importRecipes(event.target.files[0]);
}

function hydrateForm() {
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
  ingredientRows = [emptyIngredient()];
  save();
  render();
  openRecipe(recipe.id);
}

function editRecipe(recipeId) {
  state.editingId = recipeId;
  save();
  render();
  document.getElementById('ajouter').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      };
    });
  };

  document.getElementById('servings').oninput = redraw;
  redraw();
}

render();
