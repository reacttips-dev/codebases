class FormattedFinalAmount {
  /**
   * @param {object} properties - properties of this object
   * @param {number} properties.amount
   * @param {string} properties.currencyCode
   * @param {string} properties.currencySymbol
   * @param {string} properties.formattedString
   */
  constructor(properties) {
    Object.assign(this, properties);
  }
}

class PromotionInfo {
  constructor(options = {}) {
    this.discountAmount = options.discountAmount;
    this.discountPercent = options.discountPercent;
    this.promotionName = options.promotionName;
  }

  getDiscountString() {
    return this.discountAmount;
  }

  getDiscountPercent() {
    return this.discountPercent;
  }

  getPromotionName() {
    return this.promotionName;
  }
}

class ProductPrice {
  /**
   * @param {string} productType - 'VerifiedCertificate' | 'SparkVerifiedCertificate' |
   *                             'Specialization' | SparkSpecialization
   * @param {string} productItemId - 'SOMEID'
   * @param {string} [currencyCode] - currency this product should be presented in. eg. 'USD'
   * @param {string} [countryIsoCode] - determines the country this product should be presented for. (DEPRECATED)
   * @param {string} [id] - Backend ProductPriceId eg. 'VerifiedCertificate~SOMEID~USD~US'
   * @param {number} [amount] - original price of product
   * @param {number} finalAmount - price this user has to pay, considering payment history and promotion
   * @param {string} priceCountryIsoCode - countryCode associated with price. Note: for display purposes, use
   *                                     formattedFinalAmount.currencyCode instead.
   * @param {Object} Converted into a FormattedFinalAmount instance
   */
  constructor(options = {}) {
    this.productType = options.productType;
    this.productItemId = options.productItemId;
    this.currencyCode = options.currencyCode;
    this.countryIsoCode = options.countryIsoCode;
    this.id = options.id;
    this.amount = options.amount;
    this.finalAmount = options.finalAmount;
    this.priceCountryIsoCode = options.priceCountryIsoCode;
    this.formattedFinalAmount = options.formattedFinalAmount
      ? new FormattedFinalAmount(options.formattedFinalAmount)
      : null;
    this.promotionInfo = options.promotionInfo ? new PromotionInfo(options.promotionInfo) : null;
  }

  /**
   * Throws an error if the price of this module is not displayable
   * due to a missing formattedFinalAmount object.
   */
  _displayCheck() {
    if (!this.formattedFinalAmount) {
      throw new Error('Cannot display price due to missing display format.');
    }
  }

  getOriginalAmount() {
    return this.amount;
  }

  getDisplayAmount() {
    this._displayCheck();

    return this.formattedFinalAmount.amount;
  }

  getDisplayCurrencyCode() {
    this._displayCheck();

    return this.formattedFinalAmount.currencyCode;
  }

  getDisplayCurrencySymbol() {
    this._displayCheck();

    return this.formattedFinalAmount.currencySymbol;
  }

  getServerFormattedString() {
    this._displayCheck();

    return this.formattedFinalAmount.formattedString;
  }

  /**
   * The existence of promotionInfo means that there is a promotion.
   * It should always come with discountAmount and discountPercent.
   */
  hasPromotion() {
    return this.promotionInfo;
  }

  getDiscountPercent() {
    return (this.hasPromotion() && this.promotionInfo.getDiscountPercent()) || 0;
  }

  getDiscountAmount() {
    return (this.hasPromotion() && this.promotionInfo.getDiscountAmount()) || 0;
  }

  getPromotionName() {
    return this.hasPromotion() ? this.promotionInfo.getPromotionName() : null;
  }
}

export default ProductPrice;
