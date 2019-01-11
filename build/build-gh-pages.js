const fs = require("fs").promises;

const outputFolder = "dist";

(async () => {
  const fileNames = await fs.readdir(`${outputFolder}/svg`);
  const svgFileNames = fileNames.filter(file => file.includes(".svg"));

  await fs.writeFile(
    `${outputFolder}/index.html`,
    wrapContentInHtmlPage([header(), iconCards(svgFileNames)])
  );
})();

function header() {
  return `
    <div class="header"><img src="https://www.yr.no/assets/images/logo-yr--circle.svg" alt="Yr logo"><h1>Yr Warning Icons</h1><p>You can download all icons ${zipFileDownloadLink(
      "here"
    )}(zip-file with PNG, SVG and PDF)</p></div>
  `;
}

function zipFileDownloadLink(linkText) {
  return `
    <a href="icons.zip">${linkText}</a>
  `;
}

function iconCards(svgFileNames) {
  return `
    <div class="icon-cards">${svgFileNames.map(iconCard).join("")}</div>
  `;
}

function iconCard(svgPath) {
  const iconName = svgPath.replace(".svg", "");
  return `
    <div class="icon-card">
      <h3>${iconName}</h3>
      <div class="icon-card__icons-wrapper">
        <img src="svg/${svgPath}" alt="${iconName}" />
        <img src="png/${iconName}.png" alt="${iconName}" />
        <h4>svg</h4>
        <h4>png</h4>
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

        .header {
          background-color: white;
          padding: 10px;
          margin-bottom: 10px;
          display: grid;
          grid-template-columns: 60px auto;
          grid-template-areas:
            "logo title"
            "link link";
        }

        .header h1 {
          grid-area: title;
        }

        .header img {
          align-self: center;
          grid-area: logo;
          width: 100%;
          box-sizing: border-box;
          padding: 5px;
        }

        .header p {
          grid-area: link;
          padding: 10px;
        }

        .icon-cards {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-column-gap: 10px;
          grid-row-gap: 10px;
        }

        .icon-card {
          padding: 0 20px;
          display: inline-block;
          background-color: white;
        }

        .icon-card h3 {
          text-align: center;
          word-break: keep-all;
          white-space: nowrap;
        }

        .icon-card__icons-wrapper {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: center;
          grid-column-gap: 20px;
        }

        .icon-card__icons-wrapper h4 {
          text-align: center;
          margin: 0;
        }

        .icon-card__icons-wrapper img {
          --icon-size: 75px;
          height: 75px;
          width: 75px;
          height: var(--icon-size);
          width: var(--icon-size);
        }
      </style>
    </head>
    <body>
      ${Array.isArray(content) ? content.join("\n") : content}
    </body>
  </html>
`;
