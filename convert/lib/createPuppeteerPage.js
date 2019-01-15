const path = require("path");
const fs = require("fs").promises;
const config = require("./config");
const tempFolder = config.tempFolder;
/**
 *
 * @param {Browser} browser Puppeteer browser object
 * @param svg {Buffer | string}
 * @param iconName {string}
 * @return {Promise<Page>}
 */
module.exports = async function createHtmlPage(browser, svg, iconName) {
  const html = htmlWithSvg(svg.toString());

  const htmlPath = path.resolve(`${tempFolder}/${iconName}.html`);
  await fs.writeFile(htmlPath, html);

  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`);
  return Promise.resolve(page);
};

function htmlWithSvg(svg) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      body {
        margin: 0;
      }
      svg {
        display: block;
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    ${svg}
  </body>
</html>

`;
}
