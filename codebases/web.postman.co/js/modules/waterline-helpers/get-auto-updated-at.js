/**
 * Returns autoUpdatedAt on a waterline model definition.
 *
 * @param {Object} model
 */
export default function (model) {
  return _.reduce(model.attributes, (accumulator, attribute, attributeName) => {
    if (attribute.autoUpdatedAt) {
      accumulator.push(attributeName);
    }

    return accumulator;
  }, []);
}
