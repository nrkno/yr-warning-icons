const OptimizeSvg = require("svgo");
const inlineUse = require("./inlineUse");
const removeUnnecessaryGElements = require("./removeUnnecessaryGElements");
/**
 *
 * @param svgContent {string | Buffer}
 * @return Promise<string>
 */
module.exports = function optimizeSvg(svgContent) {
  return svgOptimize
    .optimize(svgContent)
    .then(output => output.data)
    .then(svgContentPass2 => svgOptimize.optimize(svgContentPass2))
    .then(output => output.data);
};

const svgOptimize = new OptimizeSvg({
  plugins: [
    {
      removeUnnecessaryGElements
    },
    {
      inlineUse //Custom plugin
    },
    {
      cleanupIDs: true
    },
    {
      cleanupAttrs: true
    },
    {
      removeDoctype: true
    },
    {
      removeXMLProcInst: true
    },
    {
      removeComments: true
    },
    {
      removeMetadata: true
    },
    {
      removeTitle: true
    },
    {
      removeDesc: true
    },
    {
      removeUselessDefs: true
    },
    {
      removeEditorsNSData: true
    },
    {
      removeEmptyAttrs: true
    },
    {
      removeHiddenElems: true
    },
    {
      removeEmptyText: true
    },
    {
      removeEmptyContainers: true
    },
    {
      removeViewBox: true
    },
    {
      cleanupEnableBackground: true
    },
    {
      convertStyleToAttrs: true
    },
    {
      convertColors: true
    },
    {
      convertPathData: true
    },
    {
      convertTransform: true
    },
    {
      removeUnknownsAndDefaults: true
    },
    {
      removeNonInheritableGroupAttrs: true
    },
    {
      removeUselessStrokeAndFill: true
    },
    {
      removeUnusedNS: true
    },
    {
      cleanupNumericValues: true
    },
    {
      moveElemsAttrsToGroup: true
    },
    {
      moveGroupAttrsToElems: true
    },
    {
      collapseGroups: true
    },
    {
      removeRasterImages: false
    },
    {
      mergePaths: true
    },
    {
      convertShapeToPath: true
    },
    {
      sortAttrs: true
    },
    {
      removeDimensions: true
    },
    {
      removeAttrs: { attrs: "data.*" }
    },
    {
      inlineStyles: {
        onlyMatchedOnce: false
      }
    }
  ]
});
