const KEY = 'recettes-app-v3';

const summerRecipes = [
  {
    id: 'ete-pasteque-feta',
    name: 'Salade pastèque, feta & menthe',
    category: 'Salades fraîches',
    time: 15,
    difficulty: 'Facile',
    badge: 'Très frais',
    baseServings: 4,
    image: 'linear-gradient(135deg, #ff6f61 0%, #ff9f8c 45%, #2f9e44 100%)',
    description: 'Une assiette croquante et désaltérante, parfaite pour un déjeuner de canicule ou un buffet au jardin.',
    sourceName: 'Yuka',
    sourceUrl: 'https://yuka.io/recettes/salade-pasteque-tomate/',
    steps:
      'Couper la pastèque et les tomates en cubes. Émincer finement le concombre. Ajouter la feta émiettée, la menthe ciselée, un filet d’huile d’olive et le citron. Mélanger délicatement, poivrer et réserver 10 minutes au frais avant de servir.',
    ingredients: [
      { id: 'pastèque', name: 'Pastèque', qty: 700, unit: 'g' },
      { id: 'tomates', name: 'Tomates mûres', qty: 350, unit: 'g' },
      { id: 'concombre', name: 'Concombre', qty: 0.5, unit: 'pièce' },
      { id: 'feta', name: 'Feta', qty: 180, unit: 'g' },
      { id: 'menthe', name: 'Menthe fraîche', qty: 12, unit: 'feuilles' },
      { id: 'huile', name: 'Huile d’olive', qty: 2, unit: 'c. à soupe' },
      { id: 'citron', name: 'Citron vert', qty: 0.5, unit: 'pièce' },
    ],
  },
  {
    id: 'ete-gaspacho-tomate-basilic',
    name: 'Gaspacho tomate, concombre & basilic',
    category: 'Entrées glacées',
    time: 10,
    difficulty: 'Facile',
    badge: 'Sans cuisson',
    baseServings: 4,
    image: 'linear-gradient(135deg, #d9480f 0%, #ff922b 55%, #51cf66 100%)',
    description: 'Une soupe froide veloutée qui concentre tomates mûres, concombre, poivron et basilic.',
    sourceName: 'Croq’Kilos',
    sourceUrl: 'https://www.croq-kilos.com/actus/gaspacho-tomate-basilic',
    steps:
      'Laver et couper les légumes. Mixer tomates, concombre, poivron, oignon, ail, basilic, huile d’olive, vinaigre, sel et poivre. Ajouter un peu d’eau froide si besoin. Placer au frais au moins 30 minutes et servir avec basilic et dés de légumes.',
    ingredients: [
      { id: 'tomates', name: 'Tomates mûres', qty: 800, unit: 'g' },
      { id: 'concombre', name: 'Concombre', qty: 1, unit: 'pièce' },
      { id: 'poivron', name: 'Poivron rouge', qty: 1, unit: 'pièce' },
      { id: 'oignon', name: 'Oignon rouge', qty: 0.5, unit: 'pièce' },
      { id: 'ail', name: 'Ail', qty: 1, unit: 'gousse' },
      { id: 'basilic', name: 'Basilic frais', qty: 1, unit: 'bouquet' },
      { id: 'huile', name: 'Huile d’olive', qty: 3, unit: 'c. à soupe' },
      { id: 'vinaigre', name: 'Vinaigre balsamique', qty: 1, unit: 'c. à soupe' },
    ],
  },
  {
    id: 'ete-brochettes-citron',
    name: 'Brochettes de poulet citron & herbes',
    category: 'Barbecue',
    time: 35,
    difficulty: 'Moyen',
    badge: 'Plancha',
    baseServings: 4,
    image: 'linear-gradient(135deg, #ffd43b 0%, #ff922b 45%, #2b8a3e 100%)',
    description: 'Des brochettes lumineuses, marinées au citron, à l’ail et aux herbes avant un passage au grill.',
    sourceName: 'Recettes100faim',
    sourceUrl: 'https://recettes100faim.fr/wp-content/uploads/2020/04/recettes100faim-brochettes-poulet-citron.pdf',
    steps:
      'Détailler le poulet en cubes. Préparer une marinade avec jus de citron, huile d’olive, ail haché, curry, sel, poivre et herbes. Enrober le poulet et laisser mariner 20 minutes. Monter les brochettes avec citron, courgette et tomates cerises, puis cuire au grill ou à la plancha en retournant régulièrement.',
    ingredients: [
      { id: 'poulet', name: 'Filets de poulet', qty: 600, unit: 'g' },
      { id: 'citrons', name: 'Citrons jaunes', qty: 2, unit: 'pièces' },
      { id: 'huile', name: 'Huile d’olive', qty: 4, unit: 'c. à soupe' },
      { id: 'ail', name: 'Ail', qty: 1, unit: 'gousse' },
      { id: 'curry', name: 'Curry doux', qty: 1, unit: 'c. à café' },
      { id: 'herbes', name: 'Herbes fraîches', qty: 1, unit: 'bouquet' },
      { id: 'courgette', name: 'Courgette', qty: 1, unit: 'pièce' },
      { id: 'tomates-cerises', name: 'Tomates cerises', qty: 200, unit: 'g' },
    ],
  },
];

const defaultState = {
  users: [{ username: 'admin', password: 'admin123' }],
  recipes: summerRecipes,
  shopping: [],
  sessionUser: null,
  activeCategory: 'Tout voir',
};

const state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const recipes = saved.recipes?.length ? saved.recipes : summerRecipes;
    return { ...defaultState, ...saved, recipes };
  } catch {
    return { ...defaultState };
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatQty(value) {
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(2).replace(/\.00$/, '').replace(/0$/, '');
}

function categories() {
  return ['Tout voir', ...Array.from(new Set(state.recipes.map((r) => r.category || 'Mes recettes')))];
}

function render() {
  const root = document.getElementById('root');
  if (!state.sessionUser) {
    root.innerHTML = `
      <main class="auth-shell">
        <section class="auth-card">
          <p class="eyebrow">Carnet culinaire privé</p>
          <h1>Recettes d’été</h1>
          <p class="lead">Un site plus moderne pour organiser vos recettes, ajuster les portions et préparer une liste de courses unique.</p>
          <div class="login-panel">
            <input id="login-user" placeholder="Utilisateur" autocomplete="username" />
            <input id="login-pass" type="password" placeholder="Mot de passe" autocomplete="current-password" />
            <button id="login-btn">Se connecter</button>
          </div>
          <p class="small">Démo : admin / admin123</p>
        </section>
      </main>`;
    document.getElementById('login-btn').onclick = () => {
      const u = document.getElementById('login-user').value;
      const p = document.getElementById('login-pass').value;
      const ok = state.users.find((x) => x.username === u && x.password === p);
      if (!ok) return alert('Identifiants invalides');
      state.sessionUser = u;
      save();
      render();
    };
    return;
  }

  const filteredRecipes = state.activeCategory === 'Tout voir' ? state.recipes : state.recipes.filter((r) => (r.category || 'Mes recettes') === state.activeCategory);
  const categoryNav = categories()
    .map((cat) => `<button class="nav-pill ${state.activeCategory === cat ? 'is-active' : ''}" data-cat="${esc(cat)}">${esc(cat)}</button>`)
    .join('');
  const recipeCards = filteredRecipes.map(recipeCard).join('');
  const shopping = renderShopping();

  root.innerHTML = `
    <header class="site-header">
      <div class="brand"><span class="brand-mark">☀️</span><span>Maison Saison</span></div>
      <nav class="top-menu" aria-label="Menu principal">
        <a href="#recettes">Recettes</a>
        <a href="#ajouter">Ajouter</a>
        <a href="#courses">Courses</a>
      </nav>
      <button class="ghost" id="logout">Déconnexion</button>
    </header>

    <main class="page-shell">
      <section class="hero">
        <div>
          <p class="eyebrow">Collection spéciale été</p>
          <h1>Des recettes fraîches, rapides et prêtes pour les beaux jours.</h1>
          <p class="lead">Menus par catégorie, fiches recettes professionnelles, portions ajustables et liste de courses consolidée.</p>
          <div class="hero-actions"><a class="button-link" href="#recettes">Explorer les recettes</a><a class="button-link secondary-link" href="#ajouter">Créer ma recette</a></div>
        </div>
        <aside class="hero-card">
          <span>Au menu</span>
          <strong>${state.recipes.length} recettes</strong>
          <p>${state.shopping.length} ingrédient${state.shopping.length > 1 ? 's' : ''} dans la liste de courses</p>
        </aside>
      </section>

      <section id="recettes" class="section-head">
        <div><p class="eyebrow">Menus</p><h2>Recettes disponibles</h2></div>
        <div class="category-menu">${categoryNav}</div>
      </section>

      <section class="recipe-grid">${recipeCards || '<p class="small">Aucune recette dans ce menu.</p>'}</section>

      <section class="workspace">
        <article id="ajouter" class="panel">
          <p class="eyebrow">Création</p>
          <h2>Ajouter une recette</h2>
          <div class="form-grid">
            <input id="r-name" placeholder="Nom de la recette" />
            <input id="r-category" placeholder="Menu / catégorie" value="Mes recettes" />
            <input id="r-base" type="number" min="1" value="2" aria-label="Nombre de personnes" />
            <input id="r-time" type="number" min="1" value="20" aria-label="Temps en minutes" />
          </div>
          <textarea id="r-description" placeholder="Courte description"></textarea>
          <textarea id="r-steps" placeholder="Étapes de préparation"></textarea>
          <div id="ingredients"></div>
          <div class="row"><button class="secondary" id="add-ing">+ ingrédient</button><button id="save-recipe">Enregistrer</button></div>
        </article>

        <aside id="courses" class="panel sticky-panel">
          <p class="eyebrow">Organisation</p>
          <h2>Liste de courses unique</h2>
          <div class="shopping-list">${shopping || '<p class="small">Liste vide. Ouvrez une recette et cochez les ingrédients.</p>'}</div>
          <button id="clear-shopping">Vider la liste</button>
          <p class="small">Prototype local compatible GitHub Pages. Pour un vrai compte sécurisé, brancher Supabase, Firebase ou une API externe.</p>
        </aside>
      </section>

      <section id="selected" class="selected-zone"></section>
    </main>`;

  bindEvents(root);
  drawIngredientRows();
}

let ingredientRows = [{ id: uid() }];

function recipeCard(r) {
  return `<article class="recipe-card">
    <div class="recipe-visual" style="background:${esc(r.image || 'linear-gradient(135deg, #f08c00, #e8590c)')}"><span>${esc(r.badge || 'Maison')}</span></div>
    <div class="recipe-body">
      <div class="recipe-meta"><span>${esc(r.category || 'Mes recettes')}</span><span>${esc(r.time || 20)} min</span><span>${esc(r.difficulty || 'Facile')}</span></div>
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.description || 'Recette personnelle à adapter selon vos envies.')}</p>
      <div class="card-actions">
        <button data-open="${esc(r.id)}">Voir la recette</button>
        <button class="icon-danger" title="Supprimer" data-del="${esc(r.id)}">×</button>
      </div>
      ${r.sourceUrl ? `<a class="source" href="${esc(r.sourceUrl)}" target="_blank" rel="noreferrer">Inspiration : ${esc(r.sourceName || 'source web')}</a>` : ''}
    </div>
  </article>`;
}

function renderShopping() {
  return state.shopping
    .map(
      (s, i) => `<div class="shopping-item"><span><strong>${esc(s.name)}</strong><small>${esc(s.recipeName)} · ${esc(s.qty)}</small></span>
      <button class="secondary" data-rm-shop="${i}">Retirer</button></div>`,
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

  document.getElementById('add-ing').onclick = () => {
    ingredientRows.push({ id: uid() });
    drawIngredientRows();
  };

  document.getElementById('save-recipe').onclick = () => {
    const name = document.getElementById('r-name').value.trim();
    const category = document.getElementById('r-category').value.trim() || 'Mes recettes';
    const base = Number(document.getElementById('r-base').value) || 1;
    const time = Number(document.getElementById('r-time').value) || 20;
    const description = document.getElementById('r-description').value.trim();
    const steps = document.getElementById('r-steps').value.trim();
    if (!name) return alert('Nom requis');
    const ingredients = ingredientRows
      .map((r) => ({
        id: r.id,
        name: document.querySelector(`[data-in="name-${r.id}"]`).value.trim(),
        qty: Number(document.querySelector(`[data-in="qty-${r.id}"]`).value) || 0,
        unit: document.querySelector(`[data-in="unit-${r.id}"]`).value.trim() || 'u',
      }))
      .filter((x) => x.name);
    state.recipes.push({
      id: uid(),
      name,
      category,
      time,
      difficulty: 'Maison',
      badge: 'Nouveau',
      baseServings: base,
      description,
      steps,
      image: 'linear-gradient(135deg, #74c0fc 0%, #69db7c 100%)',
      ingredients,
    });
    ingredientRows = [{ id: uid() }];
    save();
    render();
  };

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute('data-del');
      if (!confirm('Supprimer cette recette ?')) return;
      state.recipes = state.recipes.filter((r) => r.id !== id);
      state.shopping = state.shopping.filter((s) => s.recipeId !== id);
      save();
      render();
    };
  });

  root.querySelectorAll('[data-rm-shop]').forEach((b) => {
    b.onclick = () => {
      state.shopping.splice(Number(b.getAttribute('data-rm-shop')), 1);
      save();
      render();
    };
  });

  document.getElementById('clear-shopping').onclick = () => {
    state.shopping = [];
    save();
    render();
  };

  root.querySelectorAll('[data-open]').forEach((b) => {
    b.onclick = () => openRecipe(b.getAttribute('data-open'));
  });
}

function drawIngredientRows() {
  const container = document.getElementById('ingredients');
  if (!container) return;
  container.innerHTML = ingredientRows
    .map(
      (r) => `<div class="ingredient-row"><input data-in="name-${r.id}" placeholder="Ingrédient" /><input data-in="qty-${r.id}" type="number" min="0" step="0.1" value="1" /><input data-in="unit-${r.id}" placeholder="unité" value="g" /></div>`,
    )
    .join('');
}

function openRecipe(recipeId) {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) return;
  const selected = document.getElementById('selected');
  selected.innerHTML = `<article class="panel recipe-detail">
    <div>
      <p class="eyebrow">Fiche recette</p>
      <h2>${esc(recipe.name)}</h2>
      <p class="lead">${esc(recipe.description || '')}</p>
      <div class="recipe-meta"><span>${esc(recipe.category || 'Mes recettes')}</span><span>${esc(recipe.time || 20)} min</span><span>${esc(recipe.difficulty || 'Facile')}</span></div>
      ${recipe.sourceUrl ? `<a class="source" href="${esc(recipe.sourceUrl)}" target="_blank" rel="noreferrer">Source d’inspiration : ${esc(recipe.sourceName || 'web')}</a>` : ''}
    </div>
    <div class="serving-box"><label for="servings">Personnes</label><input id="servings" type="number" min="1" value="${esc(recipe.baseServings)}" /></div>
    <div><h3>Ingrédients</h3><ul id="ing-list" class="ingredient-list"></ul></div>
    <div><h3>Préparation</h3><p>${esc(recipe.steps || 'Aucune étape renseignée.')}</p></div>
  </article>`;
  selected.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const redraw = () => {
    const servings = Number(document.getElementById('servings').value) || 1;
    document.getElementById('ing-list').innerHTML = recipe.ingredients
      .map((i) => {
        const qty = formatQty((i.qty * servings) / recipe.baseServings);
        const checked = state.shopping.some((s) => s.recipeId === recipe.id && s.ingredientId === i.id);
        return `<li><label><input type="checkbox" data-check="${esc(recipe.id)}:${esc(i.id)}:${esc(qty)}:${esc(i.unit)}" ${checked ? 'checked' : ''}/> <span>${esc(i.name)}</span><strong>${qty} ${esc(i.unit)}</strong></label></li>`;
      })
      .join('');

    document.querySelectorAll('[data-check]').forEach((c) => {
      c.onchange = () => {
        const [rid, iid, qty, unit] = c.getAttribute('data-check').split(':');
        const exists = state.shopping.find((s) => s.recipeId === rid && s.ingredientId === iid);
        if (exists) {
          state.shopping = state.shopping.filter((s) => !(s.recipeId === rid && s.ingredientId === iid));
        } else {
          const ing = recipe.ingredients.find((x) => x.id === iid);
          state.shopping.push({ recipeId: rid, ingredientId: iid, recipeName: recipe.name, name: ing.name, qty: `${qty} ${unit}` });
        }
        save();
        render();
        openRecipe(recipeId);
      };
    });
  };

  document.getElementById('servings').oninput = redraw;
  redraw();
}

render();
