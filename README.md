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
- Liste de courses unifiée : cochez uniquement les ingrédients voulus et l’application regroupe les éléments identiques par unité
- Sauvegarde locale dans le navigateur via `localStorage` avec export JSON, copie de sauvegarde texte et import sur un autre appareil
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

Le projet est 100 % statique : publiez simplement la branche sur GitHub Pages. Les données créées par l’utilisateur sont conservées dans le navigateur courant grâce à `localStorage`. Elles ne se synchronisent donc pas automatiquement entre ordinateur et téléphone : utilisez **Exporter JSON**, **Copier sauvegarde** puis **Importer fichier / Importer le texte** sur l’autre appareil.

## Images de partage et icônes

Pour éviter les blocages de demande d’extraction liés aux fichiers binaires, les PNG/ICO ne sont pas versionnés. Les noms attendus sont documentés dans `assets/README.md` et peuvent être générés localement avec :

```bash
python3 scripts/generate_brand_assets.py --output assets
```

