import { ProductId } from './products/ids';
import { PremiumFeature, ProductDesc, Product, ProductFamily } from './types';
import { memberProducts } from './products/member';
import { organizationProducts } from './products/organization';
import { enterpriseProducts } from './products/enterprise';

class FeatureSet {
  private products: Map<ProductId, Product> = new Map();

  constructor(products: Product[]) {
    for (const product of products) {
      this.products.set(product.id, product);
    }
  }

  /**
   * Please check the `premiumFeatures` of the Member/Org/Enterprise
   * model you're looking at rather than using this method for
   * better accuracy. The `premiumFeatures` returned by server
   * should be used as the source of truth of whether a feature
   * is enabled for the user
   *
   * @deprecated
   */
  isFeatureEnabled = (feature: PremiumFeature, desc?: ProductDesc) => {
    const product = this.findProduct(desc);
    if (!product) {
      return false;
    }

    return product.features.has(feature);
  };

  /**
   * Find the product by product number or by shortName. Used
   * by all methods below to find a given product. Has guards
   * in place for stringified product numbers and for finding
   * the product by name instead of number for legacy support
   *
   * @param desc - product number or short name
   */
  private findProduct(desc?: ProductDesc): Product | undefined {
    if (!desc) {
      return undefined;
    }

    if (typeof desc === 'number') {
      return this.products.get(desc as ProductId);
    }

    if (typeof desc === 'string' && /^\d+$/.test(desc)) {
      return this.products.get(parseInt(desc, 10) as ProductId);
    }

    return [...this.products.values()].find((p) => p.shortName === desc);
  }

  /*
   * Identify products by their family
   */

  isGoldProduct = (desc?: ProductDesc) => {
    return this.findProduct(desc)?.family === ProductFamily.Gold;
  };

  isBusinessClassProduct = (desc?: ProductDesc) => {
    return this.findProduct(desc)?.family === ProductFamily.BusinessClass;
  };

  isRetiredBusinessClassProduct = (desc?: ProductDesc) => {
    const product = this.findProduct(desc);
    return product?.family === ProductFamily.BusinessClass && !product?.current;
  };

  isStandardProduct = (desc?: ProductDesc) => {
    return this.findProduct(desc)?.family === ProductFamily.Standard;
  };

  isEnterpriseProduct = (desc?: number) => {
    const product = this.findProduct(desc);
    return (
      product?.family === ProductFamily.Enterprise &&
      product?.features.has('enterpriseUI')
    );
  };

  /*
   * Get product metadata
   */

  hasProduct(desc?: ProductDesc) {
    return !!this.findProduct(desc);
  }

  getProductName(desc?: ProductDesc) {
    return this.findProduct(desc)?.name;
  }

  getProductFeatures(desc?: ProductDesc): PremiumFeature[] {
    return [...(this.findProduct(desc)?.features ?? new Set())];
  }

  /**
   * Use price quotes endpoints to get pricing information
   *
   * @deprecated
   */
  getPrice(desc?: ProductDesc) {
    return this.findProduct(desc)?.price;
  }

  getInterval(desc?: ProductDesc) {
    return this.findProduct(desc)?.interval;
  }

  isMonthly(desc?: ProductDesc) {
    return this.getInterval(desc) === 'monthly';
  }

  isYearly(desc?: ProductDesc) {
    return this.getInterval(desc) === 'yearly';
  }

  isPerActiveUser(desc: ProductDesc) {
    return !!this.findProduct(desc)?.smartBill;
  }

  isPerUser(desc?: ProductDesc) {
    return !!this.findProduct(desc)?.perUser;
  }

  isUpgrade(desc?: ProductDesc) {
    return !!this.findProduct(desc)?.upgrade;
  }

  usesPurchaseOrder(desc?: ProductDesc) {
    return !!this.findProduct(desc)?.purchaseOrder;
  }

  getYearlyEquivalent(desc?: ProductDesc) {
    return this.findProduct(desc)?.yearlyEquivalent;
  }

  getBCUpgradeProduct(desc?: ProductDesc) {
    return this.findProduct(desc)?.bcUpgradeProduct;
  }

  getUpdateProduct(desc: ProductDesc) {
    return this.findProduct(desc)?.updateProduct;
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const ProductFeatures = new FeatureSet(
  // eslint-disable-next-line @trello/no-module-logic
  memberProducts.concat(organizationProducts).concat(enterpriseProducts),
);
