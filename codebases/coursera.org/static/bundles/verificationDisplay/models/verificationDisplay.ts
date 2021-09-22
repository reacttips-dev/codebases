import Backbone from 'backbone-associations';

/**
 * VerificationDisplay contains all verification parameters that toggle the
 * visibility of verification UI components for a particular (user, product)
 * pair.
 */
const VerificationDisplay = Backbone.AssociatedModel.extend({
  defaults: {
    // Whether the product has verification enabled.
    isProductVerificationEnabled: false,

    // A ProductOwnership model for the (user, product) pair. Is null if the
    // product does not have verification enabled.
    productOwnership: null,

    // A related S12n id. Is null if there is no associated s12n.
    s12nId: null,

    skipVerification: true,
  },

  shouldPromptForVerification() {
    return this.get('isProductVerificationEnabled');
  },

  showS12nAdvertising() {
    return (
      this.get('isProductVerificationEnabled') &&
      this.get('s12nId') &&
      this.get('productOwnership') &&
      !this.get('productOwnership.owns')
    );
  },

  showCCAdvertising() {
    return (
      this.get('isProductVerificationEnabled') &&
      !this.get('s12nId') &&
      this.get('productOwnership') &&
      !this.get('productOwnership.owns')
    );
  },

  showAdvertising() {
    return this.showCCAdvertising() || this.showS12nAdvertising();
  },

  getS12NId() {
    return this.get('s12nId');
  },
});

export default VerificationDisplay;
