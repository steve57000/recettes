# Recettes (GitHub Pages ready)

Application React (via modules ESM) orientée performance/static hosting pour gérer des recettes, ajuster les quantités selon le nombre de personnes, et consolider une liste de courses unique multi-recettes.

## Fonctionnalités
- Connexion simple (prototype local)
- Ajout/suppression de recettes
- Ingrédients avec quantités de base liées au nombre de personnes
- Ajustement dynamique des quantités selon portions choisies
- Liste de courses unique, avec cases à cocher par ingrédient
- Thème centralisé via `src/theme.css`

## Déploiement GitHub Pages
Comme c'est du statique, vous pouvez publier la branche sur GitHub Pages directement.

> Important sécurité: pour un vrai système de connexion sécurisé sur GitHub Pages, il faut brancher un backend auth (GitHub OAuth via Supabase/Firebase/Auth0), car les secrets côté front ne sont pas réellement secrets.
