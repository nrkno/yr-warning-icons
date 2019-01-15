"use strict";

exports.type = "full";

exports.active = false;

exports.description = "Inline symbol elements that are only used once ";

/**
 * Inline use references
 *
 * @author Simen Saegrov
 */
exports.fn = function(data) {
  const useElements = data.querySelectorAll("use") || [];
  const symbolElements = data.querySelectorAll("symbol") || [];

  const useIds = useElements.map(useElement =>
    useElement.attrs["xlink:href"].value.replace("#", "")
  );
  const uniqueUseIds = uniqueArray(useIds);
  const symbolsToBeInlined = symbolElements.filter(
    symbolElement =>
      symbolElement.attrs.id &&
      uniqueUseIds.includes(symbolElement.attrs.id.value)
  );

  const useElementParentIndex = new Map();
  const symbolsById = new Map();

  symbolsToBeInlined.forEach(symbolElement => {
    const id = symbolElement.attrs.id.value;
    symbolsById.set(id, symbolElement);

    // Remove the Symbol element
    symbolElement.parentNode.content = symbolElement.parentNode.content.filter(
      el => el !== symbolElement
    );
  });

  useElements.forEach(useElement => {
    const id = useElement.attrs["xlink:href"].value.replace("#", "");

    // Get the index of the useElement in the parent
    useElement.parentNode.content.forEach((parentChild, index) => {
      if (parentChild === useElement) {
        useElementParentIndex.set(id, index);
      }
    });

    const symbolElement = symbolsById.get(id);

    // Replace the useElement with the symbolElement
    symbolElement.parentNode = useElement.parentNode;
    useElement.parentNode.content[
      useElementParentIndex.get(id)
      ] = symbolElement;

    if (useElement.attrs.transform) {
      symbolsById.get(id).attrs.transform = useElement.attrs.transform;
    }

    symbolElement.elem = "g";
    symbolElement.local = "g";
    symbolElement.removeAttr('id');
    symbolElement.removeAttr('viewBox');
  });

  return data;
};

function uniqueArray(arr) {
  return Array.from(new Set(arr));
}