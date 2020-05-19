# Yr warning icons

Warning icons for https://www.yr.no.

All icons are available for download https://nrkno.github.io/yr-warning-icons/ or as an NPM package.

There is no javascript component for consuming and the NPM package only contain SVGs, PNGs and PDFs.

This project takes SVG exported from illustrator (in `design/`-folder) minifies them and converts them to PDFs and PNGs. The sizes for the PNGs is 32x32, 100x100 and 128x128.

## How to add a new icon
Place an SVG file with 24px width and 24px height in `design/svg`.

## Mapping

Each warning icon includes a yellow, orange, and red variant.

| Event type        | Icon id                        |
|-------------------|--------------------------------|
| Avalanches        | icon-warning-avalanches        |
| BlowingSnow       | icon-warning-snow              |
| DrivingConditions | icon-warning-drivingconditions |
| Flood             | icon-warning-flood             |
| ForestFire        | icon-warning-forestfire        |
| Gale              | icon-warning-wind              |
| Ice               | icon-warning-ice               |
| Icing             | icon-warning-generic           |
| Landslide         | icon-warning-landslide         |
| PolarLow          | icon-warning-polarlow          |
| Rain              | icon-warning-rain              |
| RainFlood         | icon-warning-rainflood         |
| Snow              | icon-warning-snow              |
| StormSurge        | icon-warning-stormsurge        |
| Thunder           | icon-warning-thunder           |
| Wind              | icon-warning-wind              |
| Unknown           | icon-warning-generic           |

In addition there is an extreme warning icon, `icon-warning-extreme`,
which only is available in red.

## Publishing
### Production
Make sure you are on master then update the `version` field in `package.json` then run these commands:

```bash
git add package.json
git commit -m "Release 10.0.0"
git push
git tag -a 10.0.0 -m "Release 10.0.0"
git push --tags
npm publish
npm run deploy-docs
```

The `npm publish` command automatically runs the `build` script first which also builds the documentation. `npm run deploy-docs` will deploy the docs from `dist` to http://yr.github.io/icons/

### Beta
Make sure you are on the correct branch then update the `version` field in `package.json` then run these commands:

```bash
git add package.json
git commit -m "Release 10.0.0-beta.0"
git push
git tag -a 10.0.0-beta.0 -m "Release 10.0.0-beta.0"
git push --tags
npm publish --tag beta
```