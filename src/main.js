import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const KEY='recettes-app-v1';
const defaultState={users:[{username:'admin',password:'admin123'}],recipes:[],shopping:[]};
const load=()=>JSON.parse(localStorage.getItem(KEY)||'null')||defaultState;
const save=(s)=>localStorage.setItem(KEY,JSON.stringify(s));
const uid=()=>Math.random().toString(36).slice(2,10);

function App(){
  const [db,setDb]=useState(load());
  const [user,setUser]=useState(null);
  const [sel,setSel]=useState(null);
  const [servings,setServings]=useState(2);
  const persist=(next)=>{setDb(next);save(next)};

  if(!user) return <Login db={db} onLogin={setUser}/>;

  const selected=db.recipes.find(r=>r.id===sel);
  const scale=selected?servings/selected.baseServings:1;
  const scaledIngredients=selected?selected.ingredients.map(i=>({...i,scaledQty:(i.qty*scale).toFixed(2)})):[];

  return <div className="container grid grid-2">
    <div className="card">
      <h2>Recettes</h2>
      <RecipeForm onCreate={(recipe)=>persist({...db,recipes:[...db.recipes,recipe]})}/>
      <div className="list">{db.recipes.map(r=><div className="recipe-item" key={r.id}><span onClick={()=>{setSel(r.id);setServings(r.baseServings)}}>{r.name} <span className="small">({r.baseServings} pers.)</span></span><button className="secondary" onClick={()=>persist({...db,recipes:db.recipes.filter(x=>x.id!==r.id)})}>Supprimer</button></div>)}</div>
      {selected && <div className="card" style={{marginTop:'1rem'}}>
        <h3>{selected.name}</h3>
        <div className="row"><label>Personnes:</label><input type="number" min="1" value={servings} onChange={e=>setServings(Number(e.target.value)||1)}/></div>
        <p>{selected.steps}</p>
        <ul>{scaledIngredients.map(i=><li key={i.id}><label><input type="checkbox" checked={db.shopping.some(s=>s.recipeId===selected.id && s.ingredientId===i.id)} onChange={e=>{
          const exist=db.shopping.some(s=>s.recipeId===selected.id && s.ingredientId===i.id);
          const shopping=exist?db.shopping.filter(s=>!(s.recipeId===selected.id&&s.ingredientId===i.id)):[...db.shopping,{recipeId:selected.id,ingredientId:i.id,name:i.name,qty:`${i.scaledQty} ${i.unit}`}];
          persist({...db,shopping});
        }}/>{i.name} - {i.scaledQty} {i.unit}</label></li>)}</ul>
      </div>}
    </div>
    <div className="card">
      <h2>Liste de course unique</h2>
      <div className="list">{db.shopping.map((s,idx)=><div key={idx} className="recipe-item"><span>{s.name} ({s.qty})</span><button className="secondary" onClick={()=>persist({...db,shopping:db.shopping.filter((_,i)=>i!==idx)})}>Retirer</button></div>)}</div>
      <button onClick={()=>persist({...db,shopping:[]})}>Vider</button>
      <p className="small">Prototype localStorage. Pour GitHub Pages, connecter ce front à Supabase/Firebase + OAuth GitHub pour une sécurité réelle.</p>
    </div>
  </div>
}

function Login({db,onLogin}){const [u,setU]=useState('');const [p,setP]=useState('');const ok=db.users.find(x=>x.username===u&&x.password===p);return <div className="container"><div className="card"><h2>Connexion</h2><div className="row"><input placeholder="Utilisateur" value={u} onChange={e=>setU(e.target.value)}/><input type="password" placeholder="Mot de passe" value={p} onChange={e=>setP(e.target.value)}/><button onClick={()=>ok?onLogin(u):alert('Identifiants invalides')}>Se connecter</button></div><p className="small">Identifiants démo: admin / admin123</p></div></div>}

function RecipeForm({onCreate}){const [name,setName]=useState('');const [base,setBase]=useState(2);const [steps,setSteps]=useState('');const [ing,setIng]=useState([{id:uid(),name:'',qty:1,unit:'g'}]);
return <div className="card"><h3>Ajouter recette</h3><div className="row"><input placeholder="Nom" value={name} onChange={e=>setName(e.target.value)}/><input type="number" min="1" value={base} onChange={e=>setBase(Number(e.target.value)||1)}/></div><textarea placeholder="Étapes" value={steps} onChange={e=>setSteps(e.target.value)}/>
{ing.map((it,i)=><div className="row" key={it.id}><input placeholder="Ingrédient" value={it.name} onChange={e=>setIng(ing.map((x,idx)=>idx===i?{...x,name:e.target.value}:x))}/><input type="number" value={it.qty} onChange={e=>setIng(ing.map((x,idx)=>idx===i?{...x,qty:Number(e.target.value)||0}:x))}/><input placeholder="unité" value={it.unit} onChange={e=>setIng(ing.map((x,idx)=>idx===i?{...x,unit:e.target.value}:x))}/></div>)}
<div className="row"><button className="secondary" onClick={()=>setIng([...ing,{id:uid(),name:'',qty:1,unit:'g'}])}>+ ingrédient</button><button onClick={()=>{if(!name.trim())return;onCreate({id:uid(),name,baseServings:base,steps,ingredients:ing.filter(i=>i.name.trim())});setName('');setSteps('');setIng([{id:uid(),name:'',qty:1,unit:'g'}]);}}>Enregistrer</button></div></div>}

createRoot(document.getElementById('root')).render(<App/>);
