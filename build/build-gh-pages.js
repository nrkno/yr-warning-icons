const fs = require("fs").promises;


// This object exist only to format the HTML as designed
// type: warning-type as stored as filename in design/svg-folder
// title: title that will be desplayed in html
// color: wich colored svg to look for
// Order is based on design i figma
const warningTypes = [
  {type: 'avalanches', title: 'Avalanches', colors: ['yellow', 'orange', 'red']},
  {type: 'landslide', title: 'Landslide', colors: ['yellow', 'orange', 'red']},
  {type: 'flood', title: 'Flood', colors: ['yellow', 'orange', 'red']},
  {type: 'wind', title: 'Gust/Wind', colors: ['yellow', 'orange', 'red']},
  {type: 'wind', title: 'Gale', colors: ['yellow']},
  {type: 'rain', title: 'Rain', colors: ['yellow', 'orange', 'red']},
  {type: 'rainflood', title: 'Rain Flood', colors: ['yellow', 'orange']},
  {type: 'lightning', title: 'Lightning', colors: ['yellow']},
  {type: 'snow', title: 'Snow', colors: ['yellow', 'orange', 'red']},
  {type: 'snowstorm', title: 'Snow Storm', colors: ['yellow']},
  {type: 'icing', title: 'Ice', colors: ['yellow', 'orange', 'red']},
  {type: 'stormsurge', title: 'Stormsurge', colors: ['yellow', 'orange', 'red']},
  {type: 'polarlow', title: 'Polarlow', colors: ['yellow', 'orange']},
  {type: 'forestfire', title: 'Forestfire', colors: ['yellow', 'orange']},
  {type: 'generic', title: 'Ising', colors: ['yellow', 'orange']}
];


const outputFolder = "dist";
const iconRegex = /icon-warning-(?<iconName>.+?)(-(?<color>.+?))?.svg/;

(async () => {
  const fileNames = await fs.readdir(`${outputFolder}/svg`);
  let svgFileNames = fileNames.filter(file => file.includes(".svg"));

  svgFileNames = getIconsSortedByTypeAndColor(svgFileNames);

  await fs.writeFile(
    `${outputFolder}/index.html`,
    wrapContentInHtmlPage([header(), iconCards(svgFileNames)])
  );
})();


function getIconsSortedByTypeAndColor(svgFileNames) {
  let iconsWithColorMap = new Map();
  let iconWithOutColor = [];

  svgFileNames.forEach(svgFileName => {
    const iconMatch = iconRegex.exec(svgFileName);

    if (iconMatch && iconMatch.groups.color) {
      const iconName = iconMatch.groups.iconName;
      const icons = iconsWithColorMap.get(iconName) || [];

      icons.push(svgFileName);
      iconsWithColorMap.set(iconName, icons);
    } else if (iconMatch) {
      iconWithOutColor.push(svgFileName);
    }
  });

  const iconsWithColor = [];

  for (const icon of iconsWithColorMap.keys()) {
    const sortedIcons = iconsWithColorMap.get(icon).sort(sortBasedOnColor);
    iconsWithColor.push(...sortedIcons);
  }

  return [...iconsWithColor, ...iconWithOutColor];
}

/**
 *
 * @param {string} a
 * @param {string} b
 */
function sortBasedOnColor(a, b) {
  const colorOrder = {
    yellow: 1,
    orange: 2,
    red: 3
  };
  const iconMatchA = iconRegex.exec(a);
  const iconMatchB = iconRegex.exec(b);

  if (
    iconMatchA != null &&
    iconMatchA.groups.color &&
    iconMatchB != null &&
    iconMatchB.groups.color
  ) {
    const colorA = iconMatchA.groups.color;
    const colorB = iconMatchB.groups.color;

    return colorOrder[colorA] - colorOrder[colorB];
  }

  return 0;
}

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
  
  warningGroups = warningTypes.map((warning) => {
    return {
      title: warning.title,
      icons: [
        ...(svgFileNames.includes(`icon-warning-${warning.type}-yellow.svg`) && warning.colors.includes('yellow') ? [`icon-warning-${warning.type}-yellow.svg`]: []),
        ...(svgFileNames.includes(`icon-warning-${warning.type}-orange.svg`) && warning.colors.includes('orange') ? [`icon-warning-${warning.type}-orange.svg`]: []),
        ...(svgFileNames.includes(`icon-warning-${warning.type}-red.svg`) && warning.colors.includes('red') ? [`icon-warning-${warning.type}-red.svg`]: [])
      ] 
    }
  })

  const groupsHtml = warningGroups.map((group) => {
    return `<h2>${group.title}</h2><div class="icon-groups">${group.icons.map(iconCard).join('')}</div>`;
  })
    return `
  <div class="icon-cards">${groupsHtml.join("")}</div>
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

        .icon-groups {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .icon-card {
          padding: 20px;
          display: inline-block;
          background-color: white;
        }

        .icon-card h3 {
          margin-top: 0;
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
          --icon-size: 128px;
          height: 128px;
          width: 128px;
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
