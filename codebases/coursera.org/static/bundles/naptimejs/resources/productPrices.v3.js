import ProductType from 'bundles/payments/common/ProductType';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import prices from 'js/lib/prices';
import NaptimeResource from './NaptimeResource';

class ProductPrices extends NaptimeResource {
  static RESOURCE_NAME = 'productPrices.v3';

  static getProductType({ courseId, specializationId, onDemandSpecializationId } = {}) {
    if (courseId) {
      if (courseId.indexOf('v1-') === 0) {
        return ProductType.SPARK_VERIFIED_CERTIFICATE;
      } else {
        return ProductType.VERIFIED_CERTIFICATE;
      }
    } else if (specializationId) {
      return ProductType.SPARK_SPECIALIZATION;
    } else if (onDemandSpecializationId) {
      return ProductType.SPECIALIZATION;
    } else {
      throw new Error('Did not find any recognizable product to get type for');
    }
  }

  static deduceProductTypeAndGetProductPrice(
    { courseId, specializationId, onDemandSpecializationId, requestCountryCode } = {},
    query = {}
  ) {
    const productType = ProductPrices.getProductType({
      courseId,
      specializationId,
      onDemandSpecializationId,
    });
    return this.getProductPrice(
      productType,
      courseId || specializationId || onDemandSpecializationId,
      requestCountryCode,
      query
    );
  }

  static deduceProductTypeAndGetProductPrices({ courseId, specializationId, onDemandSpecializationId } = {}) {
    const productType = ProductPrices.getProductType({
      courseId,
      specializationId,
      onDemandSpecializationId,
    });
    return this.getProductPrices([
      { productType, productTypeId: courseId || specializationId || onDemandSpecializationId },
    ]);
  }

  static getProductPrice(productType, productItemId, requestCountryCode = 'US', query = {}) {
    const currencyCode = prices.getCurrencyFromCountry(requestCountryCode);
    if (!currencyCode) {
      throw new Error('Cannot get currency code for ' + requestCountryCode);
    }

    const productPriceId = tupleToStringKey([productType, productItemId, currencyCode, requestCountryCode]);

    // No query necessary to make the price API call
    return this.get(productPriceId, query, (productPrice) => productPrice || null);
  }

  static multiGetProductPrice(productType, productItemIds, requestCountryCode = 'US', query = {}) {
    const currencyCode = prices.getCurrencyFromCountry(requestCountryCode);
    if (!currencyCode) {
      throw new Error('Cannot get currency code for ' + requestCountryCode);
    }

    const productPriceIds = productItemIds.map((productId) =>
      tupleToStringKey([productType, productId, currencyCode, requestCountryCode])
    );

    // No query necessary to make the price API call
    return this.multiGet(productPriceIds, query);
  }

  static getCourseProductPrice(courseId, requestCountryCode, query = {}) {
    return ProductPrices.deduceProductTypeAndGetProductPrice({ courseId, requestCountryCode }, query);
  }

  static multiGetCourseProductPrice(courseIds, requestCountryCode, query = {}) {
    return this.multiGetProductPrice(ProductType.VERIFIED_CERTIFICATE, courseIds, requestCountryCode);
  }

  static multiGetCredentialTrackProductPrice(productIds, requestCountryCode, productType) {
    return this.multiGetProductPrice(productType, productIds, requestCountryCode);
  }

  static getSparkSpecializationProductPrice(specializationId, requestCountryCode, query = {}) {
    return ProductPrices.deduceProductTypeAndGetProductPrice({ specializationId, requestCountryCode }, query);
  }

  static getOnDemandSpecializationProductPrice(onDemandSpecializationId, requestCountryCode, query = {}) {
    return ProductPrices.getProductPrice(
      ProductType.SPECIALIZATION,
      onDemandSpecializationId,
      requestCountryCode,
      query
    );
  }

  static getSpecializationSubscriptionProductPrice(onDemandSpecializationId, requestCountryCode, query = {}) {
    return ProductPrices.getProductPrice(
      ProductType.SPECIALIZATION_SUBSCRIPTION,
      onDemandSpecializationId,
      requestCountryCode,
      query
    );
  }

  static getCatalogSubscriptionProductPrice(productId, requestCountryCode, query = {}) {
    return ProductPrices.getProductPrice(ProductType.CATALOG_SUBSCRIPTION, productId, requestCountryCode, query);
  }

  static getCourseraPlusProductPrice(productId, requestCountryCode, query = {}) {
    return ProductPrices.getProductPrice(ProductType.COURSERA_PLUS_SUBSCRIPTION, productId, requestCountryCode, query);
  }

  /**
   * Get prices of multiple products.
   *
   * @param {Array} productList - Array of objects consisting of productType and productTypeId
   * @returns {Promise.<Array.<ProductPrice>>} - Promise array of product prices.
   */
  static getProductPrices(productList = []) {
    if (productList.length === 0) {
      throw new Error('productList cannot be empty');
    }

    const productIds = productList.map(({ productType, productTypeId }) => {
      return tupleToStringKey([productType, productTypeId]);
    });

    return this.finder('byProductIds', { params: { productIds } });
  }
}

export default ProductPrices;
