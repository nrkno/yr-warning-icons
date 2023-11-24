# Yr warning icons

Warning icons for https://www.yr.no.

All icons are available for download https://nrkno.github.io/yr-warning-icons/ or as an NPM package.

There is no javascript component for consuming and the NPM package only contain SVGs, PNGs and PDFs.


## How to
This project takes SVG exported from illustrator (in `design/`-folder) minifies them and converts them to PDFs and PNGs. The sizes for the PNGs is 32x32, 100x100 and 128x128.

Requires Docker or Node.

With node:

1. Run `npm install`.
2. Convert icons with `node convert/convertSvg.js`
3. Generate git-hub page: `node build/build-gh-pages.js`


With docker:

1. Convert icons with `npm run convert-icons`
2. Build github pages with `npm run build-docs`
3. Create zipped icons with `npm run zip-icons`



## Mapping

Each warning icon includes a yellow, orange, and red variant.

| Event type        | Icon id                        |
|-------------------|--------------------------------|
| Avalanches        | icon-warning-avalanches        |
| BlowingSnow       | icon-warning-snow              |
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
| Lightning         | icon-warning-lightning         |
| Wind              | icon-warning-wind              |
| Unknown           | icon-warning-generic           |

In addition there is an extreme warning icon, `icon-warning-extreme`,
which only is available in red.