const KEY = 'recettes-app-v2';

const defaultState = {
  users: [{ username: 'admin', password: 'admin123' }],
  recipes: [],
  shopping: [],
  sessionUser: null,
};

const state = load();

function load() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
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
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function render() {
  const root = document.getElementById('root');
  if (!state.sessionUser) {
    root.innerHTML = `
      <div class="container">
        <div class="card">
          <h2>Connexion</h2>
          <div class="row">
            <input id="login-user" placeholder="Utilisateur" />
            <input id="login-pass" type="password" placeholder="Mot de passe" />
            <button id="login-btn">Se connecter</button>
          </div>
          <p class="small">Démo: admin / admin123</p>
        </div>
      </div>`;
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

  const recipeList = state.recipes
    .map(
      (r) => `<div class="recipe-item">
      <button class="secondary" data-open="${r.id}">${esc(r.name)} (${r.baseServings} pers.)</button>
      <button class="secondary" data-del="${r.id}">Supprimer</button>
    </div>`,
    )
    .join('');

  const shopping = state.shopping
    .map(
      (s, i) => `<div class="recipe-item"><span>${esc(s.recipeName)} · ${esc(s.name)} (${esc(s.qty)})</span>
      <button class="secondary" data-rm-shop="${i}">Retirer</button></div>`,
    )
    .join('');

  root.innerHTML = `
    <div class="container grid grid-2">
      <div class="card">
        <h2>Ajouter une recette</h2>
        <div class="row"><input id="r-name" placeholder="Nom" /><input id="r-base" type="number" min="1" value="2" /></div>
        <textarea id="r-steps" placeholder="Étapes"></textarea>
        <div id="ingredients"></div>
        <div class="row"><button class="secondary" id="add-ing">+ ingrédient</button><button id="save-recipe">Enregistrer</button></div>
        <h3>Recettes</h3>
        <div class="list">${recipeList || '<p class="small">Aucune recette pour le moment.</p>'}</div>
        <div id="selected"></div>
      </div>
      <div class="card">
        <h2>Liste de course unique</h2>
        <div class="list">${shopping || '<p class="small">Liste vide.</p>'}</div>
        <button id="clear-shopping">Vider</button>
        <p class="small">Pour GitHub Pages: frontend statique oui, backend/base de données non (pas directement). Utiliser Supabase/Firebase/API externe.</p>
      </div>
    </div>`;

  let ingredientRows = [{ id: uid() }];
  const drawIngredients = () => {
    document.getElementById('ingredients').innerHTML = ingredientRows
      .map(
        (r) => `<div class="row"><input data-in="name-${r.id}" placeholder="Ingrédient" /><input data-in="qty-${r.id}" type="number" value="1" /><input data-in="unit-${r.id}" placeholder="unité" value="g" /></div>`,
      )
      .join('');
  };
  drawIngredients();

  document.getElementById('add-ing').onclick = () => {
    ingredientRows.push({ id: uid() });
    drawIngredients();
  };

  document.getElementById('save-recipe').onclick = () => {
    const name = document.getElementById('r-name').value.trim();
    const base = Number(document.getElementById('r-base').value) || 1;
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
    state.recipes.push({ id: uid(), name, baseServings: base, steps, ingredients });
    save();
    render();
  };

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute('data-del');
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

function openRecipe(recipeId) {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) return;
  const selected = document.getElementById('selected');
  selected.innerHTML = `<div class="card" style="margin-top:1rem">
    <h3>${esc(recipe.name)}</h3>
    <div class="row"><label>Personnes:</label><input id="servings" type="number" min="1" value="${recipe.baseServings}" /></div>
    <p>${esc(recipe.steps || '—')}</p>
    <ul id="ing-list"></ul>
  </div>`;

  const redraw = () => {
    const servings = Number(document.getElementById('servings').value) || 1;
    document.getElementById('ing-list').innerHTML = recipe.ingredients
      .map((i) => {
        const qty = ((i.qty * servings) / recipe.baseServings).toFixed(2);
        const checked = state.shopping.some((s) => s.recipeId === recipe.id && s.ingredientId === i.id);
        return `<li><label><input type="checkbox" data-check="${recipe.id}:${i.id}:${qty}:${esc(i.unit)}" ${checked ? 'checked' : ''}/> ${esc(i.name)} - ${qty} ${esc(i.unit)}</label></li>`;
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
