import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import { subscriptionTrialPromoId } from 'bundles/payments/common/constants';
import type { AuxiliaryInfoItem, Cart, CartItem, CartItems } from 'bundles/payments/common/types';
import type { ProductType } from 'bundles/payments/common/ProductType';
import ProductTypeObject from 'bundles/payments/common/ProductType';
import CourseraPlusProductVariant from 'bundles/payments-common/common/CourseraPlusProductVariant';

import NaptimeResource from './NaptimeResource';

class Carts extends NaptimeResource {
  static RESOURCE_NAME = 'carts.v2';

  // These properties are always included.
  id!: number;

  totalCartAmount!: number;

  originalTotalCartAmount!: number;

  currencyCode!: string;

  cart!: Cart;

  cartItems!: CartItems;

  @requireFields('originalTotalCartAmount')
  get originalTotalAmount(): number {
    return this.originalTotalCartAmount;
  }

  @requireFields('totalCartAmount')
  get totalAmount(): number {
    return this.totalCartAmount;
  }

  @requireFields('cart')
  get countryIsoCode(): string {
    return this.cart.countryIsoCode;
  }

  @requireFields('cart')
  get currencyId(): number {
    return this.cart.currencyId;
  }

  @requireFields('cart')
  get auxiliaryCartInfo(): Array<AuxiliaryInfoItem> {
    return this.cart.auxiliaryCartInfo || [];
  }

  @requireFields('cart')
  get userId(): number {
    return this.cart.userId;
  }

  @requireFields('cartItems')
  get items(): CartItems {
    return this.cartItems;
  }

  @requireFields('cartItems')
  get firstCartItem(): CartItem {
    return this.cartItems[0];
  }

  @requireFields('cartItems')
  get discountAmount(): number | null {
    // refactor when we support buying multiple products in the same cart
    const {
      cartItem: { originalAmount, amount, tax },
    } = this.firstCartItem;
    let discountAmount: number | null = null;

    if (typeof originalAmount === 'number' && typeof amount === 'number') {
      discountAmount = originalAmount - amount;
      if (tax) {
        discountAmount += tax;
      }
    }

    return discountAmount;
  }

  @requireFields('cartItems')
  get discountPercent(): number | null {
    // refactor when we support buying multiple products in the same cart
    const {
      cartItem: { originalAmount },
    } = this.firstCartItem;
    return typeof this.discountAmount === 'number' && typeof originalAmount === 'number'
      ? (100 * this.discountAmount) / originalAmount
      : null;
  }

  @requireFields('cartItems')
  get hasDiscountPercent(): boolean {
    return !!this.discountPercent;
  }

  @requireFields('cartItems')
  get topLevelCartItems(): CartItems {
    return this.items.filter(({ cartItem }) => !cartItem.parentCartItemId);
  }

  @requireFields('cartItems')
  get productType(): ProductType {
    return this.firstCartItem.cartItem.productType;
  }

  @requireFields('cartItems')
  get productItemId(): string {
    return this.firstCartItem.cartItem.productItemId;
  }

  @requireFields('cartItems')
  get allProductTypes(): Array<ProductType> {
    return this.topLevelCartItems.map(({ cartItem }) => cartItem.productType);
  }

  @requireFields('cartItems')
  get hasDiscount(): boolean {
    if (this.discountAmount) {
      // amounts aren't discrete so sometimes we won't get perfect 0's
      return Math.abs(this.discountAmount) > 0.01;
    }

    return false;
  }

  @requireFields('cartItems')
  get couponId(): number | undefined {
    const { cartItem } = this.firstCartItem;
    return cartItem?.couponId;
  }

  @requireFields('cartItems')
  get promotionId(): number | undefined {
    const { promotionInfo } = this.firstCartItem;
    return promotionInfo?.promotionId;
  }

  @requireFields('cartItems')
  get hasPromotion(): boolean {
    // subscriptionTrialPromoId is for free trial - not an actual promotion
    return this.promotionId ? this.promotionId !== subscriptionTrialPromoId : false;
  }

  @requireFields('cartItems')
  get isZeroCart(): boolean {
    // TODO DLE: This is a hack to fix GR-15704. Remove check for MasterTrack when fixed.
    if (this.isCredentialTrackSubscription) {
      return false;
    } else {
      return (
        this.totalAmount === 0 &&
        !(this.isSpecializationSubscription || this.isCatalogSubscription || this.isCourseraPlusSubscription)
      );
    }
  }

  @requireFields('cartItems')
  get hasFreeTrial(): boolean {
    return this.promotionId ? this.promotionId === subscriptionTrialPromoId : false;
  }

  @requireFields('cartItems')
  get isSpecialization(): boolean {
    return ([ProductTypeObject.SPECIALIZATION, ProductTypeObject.SPARK_SPECIALIZATION] as Array<ProductType>).includes(
      this.productType
    );
  }

  @requireFields('cartItems')
  get isSpecializationPrepaid(): boolean {
    return this.productType === ProductTypeObject.SPECIALIZATION_PREPAID;
  }

  @requireFields('cartItems')
  get isSpecializationSubscription(): boolean {
    return this.productType === ProductTypeObject.SPECIALIZATION_SUBSCRIPTION;
  }

  @requireFields('cartItems')
  get isCourseraPlusSubscription(): boolean {
    return this.productType === ProductTypeObject.COURSERA_PLUS_SUBSCRIPTION;
  }

  @requireFields('cartItems')
  get isCourseraPlusAnnualSubscriptionWithNoFreeTrialProductVariant(): boolean {
    return this.isCourseraPlusSubscription && this.productItemId === CourseraPlusProductVariant.ANNUAL_NO_FREE_TRIAL;
  }

  @requireFields('cartItems')
  get isCourseraPlusAnnualSubscriptionWithSevenDayFreeTrialProductVariant(): boolean {
    return (
      this.isCourseraPlusSubscription && this.productItemId === CourseraPlusProductVariant.ANNUAL_SEVEN_DAY_FREE_TRIAL
    );
  }

  @requireFields('cartItems')
  get isCourseraPlusMonthlySubscriptionProductVariant(): boolean {
    return this.isCourseraPlusSubscription && this.productItemId === CourseraPlusProductVariant.MONTHLY_WITH_FREE_TRIAL;
  }

  @requireFields('cartItems')
  get isCatalogSubscription(): boolean {
    return this.productType === ProductTypeObject.CATALOG_SUBSCRIPTION;
  }

  @requireFields('cartItems')
  get isSubscription(): boolean {
    return (
      this.isSpecializationSubscription ||
      this.isCatalogSubscription ||
      this.isCredentialTrackSubscription ||
      this.isCourseraPlusSubscription
    );
  }

  @requireFields('cartItems')
  get isEnterpriseContract(): boolean {
    return this.productType === ProductTypeObject.ENTERPRISE_CONTRACT;
  }

  @requireFields('cartItems')
  get isVC(): boolean {
    return ([
      ProductTypeObject.VERIFIED_CERTIFICATE,
      ProductTypeObject.SPARK_VERIFIED_CERTIFICATE,
      ProductTypeObject.SPARK_COURSE_SHELL,
    ] as Array<ProductType>).includes(this.productType);
  }

  @requireFields('cartItems')
  get isInterestDeposit(): boolean {
    return this.productType === ProductTypeObject.INTEREST_DEPOSIT;
  }

  @requireFields('cartItems')
  get isCredentialTrackSubscription(): boolean {
    return (
      this.productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION ||
      this.productType === ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION_V2
    );
  }

  @requireFields('cartItems')
  get isForGuidedProject(): boolean {
    const metadata = this.cartItems[0]?.cartItem?.metadata;
    // @ts-ignore TODO: refine or CartItem type
    return metadata !== undefined && metadata['org.coursera.payment.GuidedProjectCartItemMetadata'] !== undefined;
  }

  @requireFields('cartItems')
  get specializationDuration(): number | undefined {
    const productActionMetadata = this.cartItems[0]?.cartItem?.productActionMetadata;
    const duration =
      productActionMetadata?.['org.coursera.payment.BuyProductActionMetadata']?.ownershipInterval?.[
        'org.coursera.payment.DurationBased'
      ]?.duration;

    return duration;
  }

  /**
   * Get the productId that the user will be enrolled in after checkout. Ex Specialization~W62RsyrdEeeFQQqyuQaohA.
   */
  getCourseraPlusProductIdToEnroll(): string | undefined {
    const metadata = this.cartItems[0]?.cartItem?.metadata;
    return (
      metadata &&
      // @ts-ignore TODO: refine or CartItem type
      metadata['org.coursera.payment.CourseraPlusSubscriptionCartItemMetadata']?.productEnrollmentInformation
        ?.productIdToEnroll
    );
  }

  /**
   * Get the courseId of the course that the user will be enrolled in after checking out a coursera plus subscription. Ex W62RsyrdEeeFQQqyuQaohA.
   */
  getCourseraPlusCourseIdToGrantMembership(): string | undefined {
    const metadata = this.cartItems[0]?.cartItem?.metadata;
    return (
      metadata &&
      // @ts-ignore TODO: refine or CartItem type
      metadata['org.coursera.payment.CourseraPlusSubscriptionCartItemMetadata']?.productEnrollmentInformation
        ?.courseIdToGrantMembership
    );
  }

  getSpecializationItemFromCartItem(item: CartItem): CartItem | undefined {
    if (this.isSpecializationSubscription || this.isSpecializationPrepaid) {
      const {
        cartItem: { id },
      } = item;
      const childItems = this.items.filter(({ cartItem }) => cartItem.parentCartItemId === id);
      if (
        childItems &&
        childItems.length > 0 &&
        ([ProductTypeObject.SPECIALIZATION, ProductTypeObject.SPARK_SPECIALIZATION] as Array<ProductType>).includes(
          childItems[0].cartItem.productType
        )
      ) {
        return childItems[0];
      }
    }
    return undefined;
  }

  getSpecializationIdFromCartItem(item: CartItem): string | undefined {
    const s12nItem = this.getSpecializationItemFromCartItem(item);
    return s12nItem?.cartItem?.productItemId;
  }

  getSpecializationProductTypeFromCartItem(item: CartItem): string | undefined {
    const s12nItem = this.getSpecializationItemFromCartItem(item);
    return s12nItem?.cartItem?.productType;
  }

  groupCartItems() {
    const parentItems: { [key: number]: string | number } = {};

    return this.items.reduce<Record<string, CartItem[]>>((groupedCartItems, item) => {
      const {
        cartItem: { parentCartItemId, id },
      } = item;
      const key = (parentCartItemId && (parentItems[parentCartItemId] || parentCartItemId)) || id;
      parentItems[id] = key;

      /* eslint-disable no-param-reassign */
      groupedCartItems[key] = groupedCartItems[key] || [];
      groupedCartItems[key].push(item);
      return groupedCartItems;
    }, {});
  }
}

export default Carts;
