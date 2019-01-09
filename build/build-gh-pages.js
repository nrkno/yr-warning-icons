const fs = require("fs").promises;

const outputFolder = "dist";

(async () => {
  const fileNames = await fs.readdir(`${outputFolder}/svg`);
  const svgFileNames = fileNames.filter(file => file.includes(".svg"));

  await fs.writeFile(
    `${outputFolder}/index.html`,
    wrapContentInHtmlPage(iconCards(svgFileNames))
  );
})();

function iconCards(svgFileNames) {
  return `<div class="icon-cards"> 
            ${svgFileNames.map(iconCard).join("")}
          </div>`;
}

function iconCard(svgPath) {
  const iconName = svgPath.replace(".svg", "");
  return `
<div class="icon-card">
  <h1>${iconName.replace("icon-warning-", "")}</h1>
  <div class="icon-card__icons-wrapper">
    <img src="svg/${svgPath}" alt="${iconName}" />
    <img src="png/${iconName}.png" alt="${iconName}" />
    <h2>svg</h2>
    <h2>png</h2>
  </div>
</div>
`;
}

const wrapContentInHtmlPage = content => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Yr Warning Icons</title>
    <style>
      body {
        background-color: lightgray;
      }
      .icon-cards {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 10px;
        grid-row-gap: 10px;
      }

      .icon-card {
        padding: 20px;
        display: inline-block;
        background-color: white;
      }

      .icon-card h1 {
        text-align: center;
        word-break: keep-all;
      }

      .icon-card__icons-wrapper {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: center;
        grid-column-gap: 20px;
      }

      .icon-card__icons-wrapper h2 {
        text-align: center;
      }

      .icon-card__icons-wrapper img {
        height: 100px;
        width: 100px;
      }
      </style>
  </head>
  <body>
    ${content}
  </body>
</html>
`;
