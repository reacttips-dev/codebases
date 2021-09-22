/**
 * Object that holds auxiliary information. It can change the way the payment checkout and confirmation
 * pages operate.
 *
 * See bundles/payments/models/cart.js
 */

/**
 * @typedef {Object} AuxiliaryInfoItem
 * @param {string} options.typeName
 * @param {Object} options.definition
 * @param {boolean} options.providesContinueLink - This item specifies a continue link to send the user to
 */
class AuxiliaryInfoItem {
  constructor({ typeName, definition, providesContinueLink = false }) {
    this.typeName = typeName;
    this.definition = definition;

    // If this is true, then this.getContinueInfo() is expected to be truthy
    this.providesContinueLink = providesContinueLink;
  }

  getContinueInfo() {
    return undefined;
  }

  /**
   * Serialize to JSON to send to server
   */
  toJSON() {
    const serializeDefinition = ['object', 'array', 'string', 'number'].indexOf(typeof this.definition) === -1;

    return {
      typeName: this.typeName,
      definition: serializeDefinition ? this.definition.toJSON() : this.definition,
    };
  }
}

export default AuxiliaryInfoItem;
