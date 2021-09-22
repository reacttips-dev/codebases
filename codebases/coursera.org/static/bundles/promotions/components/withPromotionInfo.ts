import Naptime from 'bundles/naptimejs';
import { compose, mapProps, withProps } from 'recompose';
import _ from 'underscore';
import Q from 'q';
import {
  ENROLL_THROUGH_S12N_SUBSCRIPTION,
  ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductSkuV1 from 'bundles/naptimejs/resources/productSkus.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import PromotionDetailsV1 from 'bundles/naptimejs/resources/promotionDetails.v1';
import ProductTypeObject, { ProductType } from 'bundles/payments/common/ProductType';

import {
  getLatestSeenPromotion,
  loadLocalStorage,
  savePromotion,
  savePromoFromUrlFlag,
  removePromoFromUrlFlag,
  removePromotion,
} from 'bundles/promotions/utils/productDiscountPromoUtils';

import {
  getPromotionDataFromQuery,
  clearAbandonedCartPromotionFromStorage,
  loadAbandonedCartPromoDataFromStorage,
  isValidAbandonedCartPromotion,
  saveAbandonedCartPromoDataToStorage,
} from 'bundles/promotions/utils/abandonedCartPromoUtils';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import getPropsFromPromise from 'js/lib/getPropsFromPromise';
import user from 'js/lib/user';
import userPreferencesApi from 'bundles/user-preferences/lib/api';
import waitFor from 'js/lib/waitFor';
import { InjectedRouter } from 'js/lib/connectToRouter';
import { stringKeyToTuple, tupleToStringKey } from 'js/lib/stringKeyTuple';
import BillingCycleTypes from 'bundles/subscriptions/common/BillingCycleType';
import promotionDetailsUtils from 'bundles/promotions/utils/promotionDetailsUtils';
import promotionEligibilityUtils from 'bundles/promotions/utils/promotionEligibilityUtils';
import promotionCodeUtils from 'bundles/promotions/utils/promotionCodeUtils';

type PropsFromWithUserPreferences = {
  promoCodes: string[];
};

type AvailableForEveryoneResponse = {
  elements: [
    {
      code: string;
    }
  ];
};

// Cache promise calls since we don't want to call it multiple times in parallel
// There's also no use case for invalidating the cache at a later point since this HOC
// directly knows when a new promoCode is added, and no other util / component will change the
// data on a per browser session basis.
let userPreferencesPromise: Q.Promise<PropsFromWithUserPreferences> | null = null;
let cachedAvailableForEveryonePromotionPromise: Q.Promise<AvailableForEveryoneResponse> | null = null;

// May have to fetch promotion eligibility and details for many promos and products
const promoEligibilityPromiseMap = new Map();
const promoDetailsPromiseMap = new Map();

const nullPromoResponse = {
  promotionDetails: null,
  promotionEligibilities: null,
  promoCode: null,
};

type PropsToWithAbandonedCartPromotion = {
  router: InjectedRouter;
};

export type PropsFromWithAbandonedCartPromotion = {
  askUserToLogIn: boolean;
  urlHasAbandonedCartPromotion: boolean;
};

export const withAbandonedCartPromotion = <
  TProps extends PropsToWithAbandonedCartPromotion = PropsToWithAbandonedCartPromotion
>() =>
  withProps<PropsFromWithAbandonedCartPromotion, TProps>(({ router }) => {
    let askUserToLogIn = false;
    let urlHasAbandonedCartPromotion = false;
    const promoQuery = router && router.location && router.location.query;
    // abandoned cart promoData can either be in URL or saved in local storage
    const promoDataFromUrl = getPromotionDataFromQuery(promoQuery);
    const authenticated = user.isAuthenticatedUser();
    if (promoDataFromUrl) {
      urlHasAbandonedCartPromotion = true;
      const promoData = promoDataFromUrl;
      const { promoCode, userId, expiresAt } = promoData;
      const isExpired = expiresAt ? new Date() > new Date(expiresAt) : true;
      if (authenticated && userId && expiresAt && isValidAbandonedCartPromotion(userId, expiresAt)) {
        savePromotion(promoCode);
        // remove promo from url flag if it exists since latest seen promotion is now abandoned cart
        removePromoFromUrlFlag();
      } else if (!authenticated && !isExpired) {
        // save promoData to local storage for future verification if user is logged out
        saveAbandonedCartPromoDataToStorage(promoData);
        // ask user to log in
        askUserToLogIn = true;
      }
    } else {
      const localStoragePromoData = loadAbandonedCartPromoDataFromStorage();
      if (localStoragePromoData) {
        const { promoCode, expiresAt, userId } = localStoragePromoData;
        const isExpired = expiresAt ? new Date() > new Date(expiresAt) : true;
        if (authenticated && userId && expiresAt && isValidAbandonedCartPromotion(userId, expiresAt)) {
          savePromotion(promoCode);
          // remove promo from url flag if it exists since latest seen promotion is now abandoned cart
          removePromoFromUrlFlag();
          clearAbandonedCartPromotionFromStorage();
        } else if (!authenticated && !isExpired) {
          askUserToLogIn = true;
        } else {
          clearAbandonedCartPromotionFromStorage();
        }
      }
    }
    return { askUserToLogIn, urlHasAbandonedCartPromotion };
  });

type PropsToWithPromoCodeFromUrl = {
  router: InjectedRouter;
  urlHasAbandonedCartPromotion: boolean;
};

export const withPromoCodeFromUrl = <TProps extends PropsToWithPromoCodeFromUrl = PropsToWithPromoCodeFromUrl>() =>
  withProps<{}, TProps>(({ router, urlHasAbandonedCartPromotion }) => {
    const promoCode = router && router.location && router.location.query && router.location.query.edocomorp;
    if (!urlHasAbandonedCartPromotion && promoCode) {
      savePromotion(promoCode);
      savePromoFromUrlFlag();
    }
  });

export type PropsToWithPromotionInfo = {
  course?: CoursesV1;
  courseId?: string;
  s12n?: OnDemandSpecializationsV1;
  s12nId?: string;
  isFromS12nSelection?: boolean;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  masterTrackUnderlyingProductItemId?: string;
};

type ProductMetadata = {
  productType?: ProductType;
  productId?: string;
};

export const getProductMetadata = ({
  course,
  courseId,
  s12n,
  s12nId,
  isFromS12nSelection,
  masterTrackUnderlyingProductItemId,
}: Omit<PropsToWithPromotionInfo, 'enrollmentAvailableChoices'>): ProductMetadata => {
  let productType: ProductType | undefined;
  let productId: string | undefined;

  // TODO check edge case of payg s12n
  if (s12nId || s12n || (course && !_(course.s12nIds).isEmpty())) {
    productType = ProductTypeObject.SPECIALIZATION;
    productId =
      (!isFromS12nSelection && course && course.s12nIds && _(course.s12nIds).first()) || (s12n && s12n.id) || s12nId;
  } else if (courseId || course) {
    productType = ProductTypeObject.VERIFIED_CERTIFICATE;
    productId = (course && course.id) || courseId;
  } else if (masterTrackUnderlyingProductItemId) {
    productType = ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION;
    productId = masterTrackUnderlyingProductItemId;
  }

  return { productType, productId };
};

export const withUserPreferences = () =>
  getPropsFromPromise(
    (): Q.Promise<PropsFromWithUserPreferences> => {
      const isServerContext = typeof window === 'undefined';
      // If this code executes on SSR, `S12nGoogleSchemaMarkup` will throw an error and SDP won't render
      if (!isServerContext && user.isAuthenticatedUser()) {
        if (userPreferencesPromise) {
          return userPreferencesPromise;
        }

        userPreferencesPromise = Q(userPreferencesApi.get(userPreferencesApi.keyEnum.PROMOTION_LANDING_PAGE))
          .then((definition) => {
            return {
              promoCodes: (definition && definition.promoCodes) || [],
            };
          })
          .fail(() => {
            return { promoCodes: [] };
          });

        return userPreferencesPromise;
      } else {
        return Q({ promoCodes: [] });
      }
    }
  );

type PropsFromWithProductSkus = {
  productSkus?: Array<ProductSkuV1>;
};

export const withProductSkus = (isNotRequired?: boolean) =>
  Naptime.createContainer<PropsFromWithProductSkus, PropsToWithPromotionInfo & PropsFromWithUserPreferences>(
    ({ course, courseId, s12n, s12nId, isFromS12nSelection, masterTrackUnderlyingProductItemId, promoCodes }) => {
      if (promoCodes && promoCodes.length > 0) {
        loadLocalStorage(promoCodes);
      }

      const { productType, productId } = getProductMetadata({
        course,
        courseId,
        s12n,
        s12nId,
        isFromS12nSelection,
        masterTrackUnderlyingProductItemId,
      });

      return {
        ...(productType && productId
          ? {
              productSkus: ProductSkuV1.finder('findByUnderlying', {
                params: {
                  id: tupleToStringKey([productType, productId]),
                },
                fields: ['properties'],
                required: !isNotRequired,
              }),
            }
          : {}),
      };
    }
  );

type PropsFromWithPromotion = {
  promotionDetails?: PromotionDetailsV1 | null;
  promotionEligibilities?: PromotionEligibilitiesV1 | null;
};

function getProductMetadataFromProductSkus(
  productSkus: Array<ProductSkuV1>
): { productType: ProductType; productItemId: string } | undefined {
  const matchingSku: ProductSkuV1 | undefined = _(productSkus).find(
    (
      { id, properties }: $TSFixMe // TODO: type ProductSkuV1
    ) => {
      if (
        id.includes(ProductTypeObject.SPECIALIZATION_SUBSCRIPTION) ||
        id.includes(ProductTypeObject.CREDENTIAL_TRACK_SUBSCRIPTION_V2)
      ) {
        // Subscription product SKUs contain monthly and annual SKUs. They may also be disabled.
        // TODO(htran): add support for `PrepaidProductProperties` once BE is ready
        const subscriptionProperties = properties?.['org.coursera.product.SubscriptionProductProperties'];
        return (
          subscriptionProperties &&
          subscriptionProperties.billingCycle === BillingCycleTypes.MONTHLY &&
          subscriptionProperties.status === 'ENABLED'
        );
      } else {
        return id.includes(ProductTypeObject.VERIFIED_CERTIFICATE);
      }
    }
  );

  if (matchingSku) {
    const [productType, productItemId] = stringKeyToTuple(matchingSku.id);
    return { productType: productType as ProductType, productItemId };
  } else {
    return undefined;
  }
}

type DetailsAndEligibilityResponse =
  | {
      promotionDetails: PromotionDetailsV1;
      promotionEligibilities: PromotionEligibilitiesV1;
      promoCode: string;

      // The promotion is offered for everyone when they land on the product description page
      shouldShowLegalDisclaimerForOpenPromotion?: boolean;
    }
  | {
      promotionDetails: null;
      promotionEligibilities: null;
      promoCode: null;
    };

function fetchPromotionDetailsAndEligibility(
  promoCode: string,
  productType: ProductType,
  productItemId: string
): Q.Promise<DetailsAndEligibilityResponse> {
  const promoEligibilityId = tupleToStringKey([promoCode, `${productType}!`, productItemId]);
  let promoEligibilityPromise = promoEligibilityPromiseMap.get(promoEligibilityId);
  let promotionDetailsPromise = promoDetailsPromiseMap.get(promoCode);

  if (!promotionDetailsPromise) {
    promotionDetailsPromise = promotionDetailsUtils.byPromoCodeId(promoCode);
    promoDetailsPromiseMap.set(promoCode, promotionDetailsPromise);
  }

  if (!promoEligibilityPromise) {
    promoEligibilityPromise = promotionEligibilityUtils.get(promoEligibilityId);
    promoEligibilityPromiseMap.set(promoEligibilityId, promoEligibilityPromise);
  }

  return Q.all([promotionDetailsPromise, promoEligibilityPromise])
    .then(([promotionDetailsResponse, promoEligibilityResponse]) => {
      const promotionDetails =
        promotionDetailsResponse && promotionDetailsResponse.elements && promotionDetailsResponse.elements[0];
      const promotionEligibilities =
        promoEligibilityResponse && promoEligibilityResponse.elements && promoEligibilityResponse.elements[0];

      const promotionDetailsObject = promotionDetails && new PromotionDetailsV1(promotionDetails);
      const promotionEligibilitiesObject =
        promotionEligibilities && new PromotionEligibilitiesV1(promotionEligibilities);

      if (promotionDetailsObject && promotionEligibilitiesObject) {
        return {
          promotionDetails: promotionDetailsObject,
          promotionEligibilities: promotionEligibilitiesObject,
          promoCode,
        };
      } else {
        return nullPromoResponse;
      }
    })
    .fail(() => {
      removePromotion(promoCode);
      return nullPromoResponse;
    });
}

// We are not using naptime create container because promo details and eligibility can return 404 which prevents rendering
// When a 404 happens we want to remove the promo code so that the user doesn't see it again
export const withPromotion = () =>
  getPropsFromPromise(({ productSkus, courseId, course }: PropsToWithPromotionInfo & PropsFromWithProductSkus) => {
    if (!productSkus) {
      return Q(nullPromoResponse);
    }

    let productType: ProductType | undefined;
    let productItemId: string | undefined;

    const metadata = getProductMetadataFromProductSkus(productSkus);

    if (metadata) {
      productType = metadata.productType;
      productItemId = metadata.productItemId;
    } else {
      const productMetadata = getProductMetadata({ courseId, course });
      // This covers courses that are free. They don't have a product sku, but can be part of the promotion.
      // Learner is allowed to enroll for free irrespective of the promotion setting. The VC check is to make it explicit that
      // this only applies to a course.
      if (productMetadata?.productType === ProductTypeObject.VERIFIED_CERTIFICATE) {
        productType = productMetadata?.productType;
        productItemId = productMetadata?.productId;
      }
    }

    if (!productType || !productItemId) {
      return Q(nullPromoResponse);
    }

    // 1. A promotion may exist for the product and is surfaced to the user when they land on the XDP. A promo code is not needed to be in the URL.
    // The user does not need to come from the landing page. We attempt to retrieve this promo code and refer to it here as PROMO_ALL.
    // 2. Verify that user is eligible for PROMO_ALL. If so ignore the promo code that the user last saw.
    // 3. If PROMO_ALL is not valid, attempt to validate the last seen promotion.
    if (!cachedAvailableForEveryonePromotionPromise) {
      cachedAvailableForEveryonePromotionPromise = promotionCodeUtils.findAvailableForEveryonePromoByProductId(
        productType,
        productItemId
      );
    }

    return cachedAvailableForEveryonePromotionPromise
      .then((promoCodeResponse) => {
        const promoCode = promoCodeResponse.elements[0]?.code;
        if (promoCode && productType && productItemId) {
          return fetchPromotionDetailsAndEligibility(promoCode, productType, productItemId);
        } else {
          return Q(nullPromoResponse);
        }
      })
      .then((response) => {
        if (response?.promotionEligibilities?.isEligible) {
          const { promotionDetails, promotionEligibilities, promoCode } = response;
          return {
            promotionDetails,
            promotionEligibilities,
            promoCode,
            shouldShowLegalDisclaimerForOpenPromotion: true,
          };
        } else {
          const promoCode = getLatestSeenPromotion();
          if (promoCode && productType && productItemId) {
            return fetchPromotionDetailsAndEligibility(promoCode, productType, productItemId);
          } else {
            return Q(nullPromoResponse);
          }
        }
      })
      .fail(() => {
        return Q(nullPromoResponse);
      });
  });

export type PropsFromWithPromotionInfo = PropsFromWithUserPreferences &
  PropsFromWithProductSkus &
  PropsFromWithPromotion;

export const withEnrollmentPromotionOverride = () =>
  mapProps<
    PropsToWithPromotionInfo & PropsFromWithPromotionInfo,
    PropsToWithPromotionInfo & PropsFromWithPromotionInfo
  >(({ enrollmentAvailableChoices, promotionEligibilities, ...rest }) => {
    if (!enrollmentAvailableChoices || !promotionEligibilities || !promotionEligibilities.isEligible) {
      return { enrollmentAvailableChoices, promotionEligibilities, ...rest };
    }

    // Don't display promotion if user can't purchase/subscribe to the product
    if (enrollmentAvailableChoices.hasEarnedS12nCertificate || enrollmentAvailableChoices.didPurchase) {
      return { enrollmentAvailableChoices, ...rest };
    }

    const choicesWithoutFreeTrial = _(enrollmentAvailableChoices.enrollmentChoices).map((choice) => {
      const updatedChoice = { ...choice };
      if (choice.enrollmentChoiceType === ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL) {
        /* eslint-disable no-param-reassign */
        updatedChoice.enrollmentChoiceType = ENROLL_THROUGH_S12N_SUBSCRIPTION;
      }
      return updatedChoice;
    });

    const eacWithoutFreeTrial = new EnrollmentAvailableChoicesV1({
      ...enrollmentAvailableChoices,
      enrollmentChoices: choicesWithoutFreeTrial,
    });

    return {
      enrollmentAvailableChoices: eacWithoutFreeTrial,
      promotionEligibilities,
      ...rest,
    };
  });

export const withPromotionInfo = <T extends PropsToWithPromotionInfo>(isNotRequired?: boolean) =>
  compose<T & PropsFromWithPromotionInfo, T>(
    // The order of these HOCs is important
    withUserPreferences(),
    waitFor((props: PropsFromWithUserPreferences) => isNotRequired || props.promoCodes),
    withProductSkus(isNotRequired),
    withPromotion(),
    waitFor(
      ({ promotionDetails, promotionEligibilities }: PropsFromWithPromotion) =>
        isNotRequired || (typeof promotionDetails !== 'undefined' && typeof promotionEligibilities !== 'undefined')
    ),
    withEnrollmentPromotionOverride()
  );

export default withPromotionInfo;
