import Q from 'q';
import ProductType from 'bundles/payments/common/ProductType';
import productPricesData from 'bundles/payments/data/productPrices';
import ProductPrice from 'bundles/payments/models/productPrice';
import logger from 'js/app/loggerSingleton';
import prices from 'js/lib/prices';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import requestCountry from 'js/lib/requestCountry';

/**
 * @typedef {Object} ProductPrice
 * @property {number} [amount] - original price of product
 * @property {string} [countryIsoCode] - determines the country this product should be presented for eg. 'US'
 * @property {string} [currencyCode] - currency this product should be presented in. eg. 'USD'
 * @property {string} [id] - Backend ProductPriceId eg. 'VerifiedCertificate~SOMEID~USD~US'
 * @property {string} productItemId - 'SOMEID'
 * @property {string} productType - 'VerifiedCertificate'
 * @property {number} finalAmount - price this user has to pay, considering payment history and promotion
 * @property {Object} formattedFinalAmount - We use this object for displaying prices
 */

/**
 * Get price for a product.
 *
 * @param {string}  productType - ProductType.{VERIFIED_CERTIFICATE,
 *                                                      SPARK_VERIFIED_CERTIFICATE,
 *                                                      SPECIALIZATION}
 * @param {string} productTypeId - ProductTypeId, depends on productType
 * @returns {Promise.<ProductPrice>} - A product price.
 */
const getPriceForProduct = (productType, productTypeId) => {
  const requestCountryCode = requestCountry.get();
  const currencyCode = prices.getCurrencyFromCountry(requestCountryCode);

  const promise = productPricesData(tupleToStringKey([productType, productTypeId, currencyCode, requestCountryCode]))
    .then((response) => new ProductPrice(response.elements[0]))
    .catch((err) => logger.warn('Could not get price for product'));

  promise.done();
  return promise;
};

export { getPriceForProduct };

/**
 * Gets the price (promise) for a specialization subscription
 * @param  {string]} subscriptionProductId - The SKU ID of the s12n subscription type.
 * Note that this is not necessarily the s12n id
 */
export const getPriceForSpecializationSubscription = (subscriptionProductId) => {
  return getPriceForProduct(ProductType.SPECIALIZATION_SUBSCRIPTION, subscriptionProductId);
};

/**
 * Get prices of multiple products.
 *
 * @param {Array} productArray - Array of objects consistint og productType and productTypeId
 * @returns {Promise.<Array.<ProductPrice>>} - Promise array of product prices.
 */
export const getPricesForProducts = function (productArray) {
  if (productArray.length === 0) {
    return Q([]);
  }

  const params = productArray.map(({ productType, productTypeId }) => {
    const requestCountryCode = requestCountry.get();
    const currencyCode = prices.getCurrencyFromCountry(requestCountryCode);
    return tupleToStringKey([productType, productTypeId, currencyCode, requestCountryCode]);
  });

  const promise = productPricesData(params).then((response) => {
    if (!response.elements) {
      return [];
    }

    return response.elements.map((productPriceData) => new ProductPrice(productPriceData));
  });

  promise.done();
  return promise;
};

/**
 * Get product price for a VC.
 *
 * @param {string} options.courseId - Course Id for VC Product
 * @param {string} [options.currency] - 3 character currency string
 * @param {string} [options.country] - Alpha2 country code
 * @returns {ProductPrice}
 */
export const getPriceForVC = function (options) {
  return getPriceForProduct(ProductType.VERIFIED_CERTIFICATE, options.courseId);
};

/**
 * Get product price for a Specialization.
 *
 * @param {string} options.specializationId - Specialization id
 * @param {string} [options.currency] - 3 character currency string
 * @param {string} [options.country] - Alpha2 country code
 * @returns {ProductPrice}
 */
export const getPriceForSpecialization = function (options) {
  return getPriceForProduct(ProductType.SPECIALIZATION, options.specializationId);
};

/**
 * Gets product price for a Spark VC.
 * @param options.sessionId - Session Id of spark session
 * @param options.currecy - 3 character currency string
 * @param options.country - Alpha2 country code
 */
export const getPriceForSparkVC = function (options) {
  return getPriceForProduct(ProductType.SPARK_VERIFIED_CERTIFICATE, options.sessionId);
};
