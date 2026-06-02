# Maison Saison — livre de recettes premium

Application frontend statique pour gérer un carnet de recettes complet, compatible GitHub Pages. L’interface a été transformée en véritable livre de recettes premium : menus par catégories, fiches enrichies, médias, édition complète, portions dynamiques et liste de courses intelligente.

## Connexion de démonstration

- Utilisateur : `admin`
- Mot de passe : `admin123`

> Cette connexion reste volontairement locale pour une démo statique. Pour un produit réel, il faut brancher un backend d’authentification comme Supabase, Firebase ou Auth0.

## Fonctionnalités principales

- Navigation premium : Menus, Ajouter / modifier, Courses
- Collection enrichie de recettes préchargées : salades, entrées, plats, desserts et boissons
- Création de recettes avec :
  - nom, catégorie/menu, temps, difficulté, badge
  - description, étapes et notes du chef
  - ingrédients illimités avec quantités et unités
  - URL de photo, upload de photo locale, URL vidéo et URL source
- Correction du système d’ingrédients : ajouter une ligne ne supprime plus les ingrédients déjà saisis
- Modification complète d’une recette existante depuis la carte ou la fiche détail
- Suppression des recettes
- Fiche recette détaillée avec couverture photo, vidéo intégrée, source web et notes
- Ajustement automatique des quantités selon le nombre de personnes
- Liste de courses synchronisée : cochez les ingrédients un par un ou utilisez **Tout sélectionner / Tout désélectionner** sur une recette complète, avec regroupement automatique des éléments identiques par unité, sauvegarde JSON et affichage au choix global ou par recette(s)
- Portions synchronisées : modifier le nombre de personnes dans une fiche met à jour les quantités déjà envoyées en courses
- Actions rapides sur les courses : marquer toute la liste comme achetée ou à acheter, sans perdre les ingrédients sélectionnés
- Interface responsive renforcée pour mobile, tablette, desktop et grands écrans : listes plus lisibles, boutons tactiles, filtres confortables et cartes plus premium
- Sauvegarde locale dans le navigateur via `localStorage`, export/import manuel et synchronisation automatique dans un JSON GitHub avec token personnel
- Balises de partage social Open Graph / Twitter et icônes d’installation mobile avec favicon SVG dédié; les PNG/ICO sont générables à part pour intégration manuelle
- Thème centralisé via `src/theme.css`

## Recettes préchargées

- Salade niçoise grand soleil — Salades
- Risotto crémeux aux champignons — Plats
- Poulet yassa citronné — Plats
- Tarte aux fraises pâtissière — Desserts
- Velouté potimarron & noisettes — Entrées
- Smoothie mangue passion — Boissons

## Déploiement GitHub Pages

Le projet est 100 % statique : publiez simplement la branche sur GitHub Pages. Les données créées par l’utilisateur sont conservées dans le navigateur courant grâce à `localStorage`. Pour ce site personnel, l’interface peut aussi enregistrer automatiquement les recettes dans un fichier JSON du dépôt GitHub grâce à un token personnel renseigné dans le panneau **Courses → Synchronisation GitHub automatique**.

Par défaut, la synchronisation GitHub écrit dans `data/recipes.json`. Le détail de configuration du token et du fichier est documenté dans [`docs/github-json-sync.md`](docs/github-json-sync.md).

## Images de partage et icônes

Pour éviter les blocages de demande d’extraction liés aux fichiers binaires, les PNG/ICO ne sont pas versionnés. Les noms attendus sont documentés dans `assets/README.md` et peuvent être générés localement avec :

```bash
python3 scripts/generate_brand_assets.py --output assets
```

