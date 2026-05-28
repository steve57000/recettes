# Enregistrer les recettes dans un JSON GitHub

Oui, c’est possible d’avoir un fichier JSON commun dans le dépôt GitHub, mais **pas directement et proprement depuis une page GitHub Pages publique**.

## Pourquoi l’app ne peut pas écrire directement dans GitHub

L’application actuelle est un site statique : tout le code JavaScript est téléchargé dans le navigateur. Pour modifier un fichier du dépôt GitHub depuis ce navigateur, il faudrait appeler l’API GitHub avec un jeton d’écriture.

Ce jeton ne doit pas être mis dans le code du site, car n’importe quel visiteur pourrait le récupérer et modifier le dépôt.

## Solution recommandée

La solution propre est d’ajouter une petite API sécurisée entre l’application et GitHub :

1. L’utilisateur ajoute ou modifie une recette dans l’app.
2. L’app envoie la recette à une API privée, par exemple une fonction Netlify, Vercel, Cloudflare Worker ou Supabase Edge Function.
3. Cette API garde le jeton GitHub côté serveur, jamais dans le navigateur.
4. L’API met à jour un fichier comme `data/recipes.json` via l’API GitHub Contents.
5. Tous les appareils relisent le même JSON publié.

## Variante possible mais moins sûre

Pour un usage strictement personnel, on peut aussi demander un jeton GitHub dans l’interface et l’utiliser depuis le navigateur. Cette variante est plus rapide à développer, mais elle expose le jeton dans la session du navigateur et doit utiliser un jeton GitHub très limité au dépôt concerné.

## État actuel

En attendant une API sécurisée, l’app garde les recettes localement dans le navigateur et permet de transférer les données avec l’export JSON ou la copie de sauvegarde.
