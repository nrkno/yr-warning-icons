"use strict";

exports.type = "full";

exports.active = false;

exports.description = "Remove g elements that is not needed";

/**
 * Remove G-elements that have no attributes
 *
 * @author Simen Saegrov
 */
exports.fn = function(data) {
  const useElements = data.querySelectorAll("g") || [];

  if (useElements.length === 0) {
    return data;
  }

  const gElementsWithoutAttributes = useElements.filter(e => {
    return !e.attrs || Object.keys(e.attrs).length === 0;
  });

  gElementsWithoutAttributes.forEach(gElement => {
    const index = gElement.parentNode.content.indexOf(gElement);

    gElement.parentNode.spliceContent(index, 1, gElement.content);
  });

  return data;
};

function uniqueArray(arr) {
  return Array.from(new Set(arr));
}
