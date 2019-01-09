const fs = require("fs").promises;
const path = require("path");
const config = require("./lib/config");
const optimizeSvg = require("./lib/optimizeSvg");
const createPuppeteerPage = require("./lib/createPuppeteerPage");

const outputFolder = "dist";
const inputFolder = `design/svg`;

(async () => {
  let svgFiles = await fs.readdir(path.resolve(inputFolder));
  svgFiles = svgFiles.filter(file => file.includes(".svg"));
  console.log(
    `Creating png, pdf and optimized svg for ${svgFiles.length} icons.`
  );
  await Promise.all(
    svgFiles.map(async icon => {
      const iconName = icon.replace(".svg", "");
      const svgFile = await fs.readFile(path.resolve(inputFolder, icon));
      const page = await createPuppeteerPage(svgFile, iconName);

      const optimizedSvgIcon = await optimizeSvg(svgFile);
      const pngIcon = await page.screenshot({
        type: "png",
        omitBackground: true
      });

      const pdfIcon = await page.pdf({
        width: `${config.size}px`,
        height: `${config.size}px`
      });

      await Promise.all([
        writeFile(`${iconName}.png`, pngIcon),
        writeFile(`${iconName}.pdf`, pdfIcon),
        writeFile(`${iconName}.svg`, optimizedSvgIcon)
      ]);

      return page.browser().close();
    })
  );

  console.log("Finished");
})();

function writeFile(fileName, content) {
  const extension = fileName.substr(fileName.length - 3);
  return fs.writeFile(path.resolve(outputFolder, extension, fileName), content);
}