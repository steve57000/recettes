# Enregistrer automatiquement les recettes dans un JSON GitHub

Le site est personnel : l’application peut donc écrire directement dans un fichier JSON du dépôt GitHub avec un **token personnel GitHub** renseigné dans l’interface.

## Fonctionnement ajouté dans l’application

Dans le panneau **Courses → Synchronisation GitHub automatique** :

1. renseignez le propriétaire du dépôt, par exemple `steve57000` ;
2. renseignez le dépôt, par exemple `recettes` ;
3. laissez la branche `main` ou indiquez votre branche de publication ;
4. laissez le chemin `data/recipes.json` ou choisissez un autre fichier JSON ;
5. collez un token GitHub ;
6. cochez **Activer l’enregistrement automatique sur GitHub** ;
7. cliquez sur **Enregistrer réglages** puis **Enregistrer maintenant**.

Ensuite, chaque ajout, modification ou suppression de recette déclenche une sauvegarde automatique dans le JSON GitHub. Si GitHub signale qu’une autre sauvegarde a modifié `data/recipes.json` entre la lecture et l’écriture, l’application relit automatiquement la dernière version du fichier et retente l’enregistrement afin d’éviter l’erreur `does not match ...`. Le bouton **Charger depuis GitHub** permet de récupérer le JSON sur un autre appareil.

## Token GitHub conseillé

Créez un token finement limité au dépôt de recettes :

- accès uniquement au dépôt concerné ;
- permission **Contents: Read and write** ;
- durée d’expiration courte ou adaptée à votre usage.

Le token est stocké dans le `localStorage` du navigateur pour ce site personnel. Si le site devient public, il faudra éviter de partager ce token avec d’autres utilisateurs.

## Fichier créé ou mis à jour

Par défaut, l’application écrit dans :

```text
data/recipes.json
```

Si ce fichier n’existe pas encore, GitHub le crée au premier clic sur **Enregistrer maintenant** ou à la première sauvegarde automatique.
