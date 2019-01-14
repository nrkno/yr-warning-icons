# Yr warning icons

Warning icons for https://www.yr.no.

All icons are available for download https://nrkno.github.io/yr-warning-icons/ or as an NPM package.

### Description

This project takes SVG exported from illustrator (in `design/`-folder) minifies them and converts them to PDFs and PNGs. The sizes for the PNGs is 32x32, 100x100 and 128x128.

#### How to

Requires Docker or Node.

With node:

1. Run `npm install`.
2. Convert icons with `node convert/convertSvg.js`
3. Generate git-hub page: `node build/build-gh-pages.js`


With docker:

1. Convert icons with `npm run convert-icons`
2. Build github pages with `npm run build-docs`
3. Create zipped icons with `npm run zip-icons`

