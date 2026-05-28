# Images à intégrer manuellement

Les fichiers binaires de cette identité visuelle ne sont pas versionnés afin de garder les demandes d’extraction GitHub légères.
Le site référence volontairement les images de partage et d’écran d’accueil ci-dessous : ajoutez-les manuellement dans ce dossier lorsque vous serez prêt à publier. Les favicons PNG/ICO sont fournis comme compléments optionnels au favicon SVG déjà versionné.

## Fichiers attendus

| Fichier | Dimensions | Usage |
| --- | ---: | --- |
| `social-card.png` | 1200 × 630 | Image de partage Open Graph / Twitter / réseaux sociaux |
| `apple-touch-icon.png` | 180 × 180 | Icône écran d’accueil iPhone / iPad |
| `icon-192.png` | 192 × 192 | Icône Android / Samsung / PWA |
| `icon-512.png` | 512 × 512 | Grande icône Android / Samsung / PWA |
| `favicon-32x32.png` | 32 × 32 | Favicon PNG moderne |
| `favicon-16x16.png` | 16 × 16 | Favicon PNG basse résolution |
| `favicon.ico` | 16 × 16 et 32 × 32 | Favicon de compatibilité |

## Génération locale

Depuis la racine du projet :

```bash
python3 scripts/generate_brand_assets.py --output assets
```

Les PNG/ICO générés sont ignorés par Git. Si vous voulez vraiment les pousser depuis un clone local, utilisez `git add -f assets/*.png assets/*.ico`; sinon, téléversez-les simplement dans GitHub via l’interface web.

Le fichier `favicon.svg` reste versionné, car il est léger, lisible et non binaire.
