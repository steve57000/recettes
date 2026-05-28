# Recettes d’été (GitHub Pages ready)

Application frontend statique pour gérer un carnet de recettes, ajuster les portions et consolider une liste de courses unique. Le site a été refondu avec une direction artistique plus professionnelle : hero, navigation, menus par catégories, cartes recettes, fiche détaillée et formulaire enrichi.

## Fonctionnalités
- Connexion simple de démonstration : `admin` / `admin123`
- Navigation principale : Recettes, Ajouter, Courses
- Menus par catégories : salades fraîches, entrées glacées, barbecue et recettes personnelles
- Recettes d’été préchargées avec liens vers les sources d’inspiration web
- Ajout/suppression de recettes personnelles
- Ingrédients avec quantités de base liées au nombre de personnes
- Ajustement dynamique des quantités selon les portions choisies
- Liste de courses unique, avec cases à cocher par ingrédient
- Thème centralisé via `src/theme.css`

## Recettes d’été préchargées
- Salade pastèque, feta & menthe — inspiration Yuka
- Gaspacho tomate, concombre & basilic — inspiration Croq’Kilos
- Brochettes de poulet citron & herbes — inspiration Recettes100faim

## Déploiement GitHub Pages
Comme l’application est statique, vous pouvez publier la branche sur GitHub Pages directement.

> Important sécurité : pour un vrai système de connexion sécurisé sur GitHub Pages, il faut brancher un backend auth (GitHub OAuth via Supabase/Firebase/Auth0), car les secrets côté front ne sont pas réellement secrets.
