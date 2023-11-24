const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const config = require("./lib/config");
const optimizeSvg = require("./lib/optimizeSvg");
const createHtmlPageWithIcon = require("./lib/createPuppeteerPage");

const inputFolder = `design/svg`;

const puppeteerOptions = process.env.IS_DOCKER
  ? {
      executablePath:process.env.PUPPETEER_EXECUTABLE_PATH,

      // We need run Puppeteer without a sandbox because because we are running as root.
      // See `Dockerfile` for more details.
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  : undefined;

(async () => {
  let svgFiles = await fs.readdir(path.resolve(inputFolder));
  svgFiles = svgFiles.filter(file => file.includes(".svg"));
  console.log(
    `Creating png, pdf and optimized svg for ${svgFiles.length} icons.`
  );

  await createFolderIfMissing(path.resolve(config.outputFolder));
  await createFolderIfMissing(path.resolve(config.tempFolder));

  await createFolderInOutputFolderIfMissing("png");
  await createFolderInOutputFolderIfMissing("pdf");
  await createFolderInOutputFolderIfMissing("svg");

  const browser = await puppeteer.launch(puppeteerOptions);

  await Promise.all(
    svgFiles.map(async icon => {
      const iconName = icon.replace(".svg", "");
      const svgFile = await fs.readFile(path.resolve(inputFolder, icon));
      const page = await createHtmlPageWithIcon(browser, svgFile, iconName);

      const optimizedSvgIcon = await optimizeSvg(svgFile);

      // Using
      await config.pngSizes.reduce(async (previousPromise, size) => {
        await previousPromise;
        await createFolderInOutputFolderIfMissing("png", size.toString());

        await page.setViewport({ width: size, height: size });

        const pngIcon = await page.screenshot({
          type: "png",
          omitBackground: true
        });

        return writeFile(`${iconName}.png`, pngIcon, size.toString());
      }, Promise.resolve());

      await page.setViewport({
        width: config.defaultSize,
        height: config.defaultSize
      });

      const pngIcon = await page.screenshot({
        type: "png",
        omitBackground: true
      });

      // Enable transparent background for PDF
      // https://github.com/GoogleChrome/puppeteer/issues/2545
      await page.emulateMedia("screen");
      await page._emulationManager._client.send(
        "Emulation.setDefaultBackgroundColorOverride",
        { color: { r: 0, g: 0, b: 0, a: 0 } }
      );

      // The default resolution should be 128x128, but becomes 96x96 for some reason.
      // See https://github.com/GoogleChrome/puppeteer/issues/2278
      const pdfIcon = await page.pdf({
        width: `${config.defaultSize}px`,
        height: `${config.defaultSize}px`
      });

      await Promise.all([
        writeFile(`${iconName}.png`, pngIcon),
        writeFile(`${iconName}.pdf`, pdfIcon),
        writeFile(`${iconName}.svg`, optimizedSvgIcon)
      ]);

      console.log("Closing page.");
      return page ? page.close() : Promise.resolve();
    })
  );
  await browser.close();
  console.log("Finished");
})();

async function createFolderInOutputFolderIfMissing(...sizes) {
  const folderPath = path.resolve(config.outputFolder, ...sizes);
  return createFolderIfMissing(folderPath);
}

async function createFolderIfMissing(folderPath) {
  const folderExist = fsSync.existsSync(folderPath);

  if (folderExist) {
    return Promise.resolve();
  } else {
    return fs.mkdir(folderPath);
  }
}
/**
 *
 * @param fileName {string}
 * @param content {any}
 * @param [sizeFolder] {string} Optional size folder
 * @return {Promise<void>}
 */
function writeFile(fileName, content, sizeFolder = "") {
  const extension = fileName.substr(fileName.length - 3);
  const fullPath = path.resolve(
    config.outputFolder,
    extension,
    sizeFolder,
    fileName
  );
  return fs.writeFile(fullPath, content).then(() => {
    console.log("File written: ", fullPath.replace(path.resolve(), ""));
  });
}
