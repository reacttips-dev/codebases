/**
 * Returns indices on a waterline model definition.
 *
 * @param {Object} model
 */
export default function (model) {
  return _.reduce(model.attributes, (accumulator, attribute, attributeName) => {
    if (_.get(attribute, ['meta', 'index'])) {
      accumulator.push(attributeName);
    }

    return accumulator;
  }, []);
}
