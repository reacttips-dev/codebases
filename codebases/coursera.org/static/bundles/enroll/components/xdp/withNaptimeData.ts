import Naptime from 'bundles/naptimejs';
import { compose, mapProps } from 'recompose';
import epic from 'bundles/epic/client';

import {
  SPECIALIZATION,
  VERIFIED_CERTIFICATE,
  CREDENTIAL_TRACK_SUBSCRIPTION,
  SPECIALIZATION_PREPAID,
} from 'bundles/payments/common/ProductType';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductSkuV1 from 'bundles/naptimejs/resources/productSkus.v1';

import CourseraPlusEnrollmentChoices from 'bundles/enroll/utils/CourseraPlusEnrollmentChoices';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import user from 'js/lib/user';

export type PropsToWithEnrollment = {
  s12nId?: string;
  courseId?: string;
  isSpecialization: boolean;
};

export type PropsFromWithEnrollment = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  courseraPlusEnrollmentChoices?: CourseraPlusEnrollmentChoices;
};

const withEnrollment = <InputProps extends PropsToWithEnrollment>() =>
  Naptime.createContainer<InputProps & PropsFromWithEnrollment, InputProps, PropsFromWithEnrollment>(
    ({ s12nId, courseId, isSpecialization }) => {
      const userId = user.get().id;
      const productType = isSpecialization ? SPECIALIZATION : VERIFIED_CERTIFICATE;
      const productId = isSpecialization ? s12nId : courseId;

      if (!user.isAuthenticatedUser() || !productId) {
        return {};
      }

      const id = tupleToStringKey([userId, productType, productId]);
      const query = {
        fields: ['enrollmentChoices', 'enrollmentChoiceReasonCode'],
      };

      return {
        enrollmentAvailableChoices: EnrollmentAvailableChoicesV1.get(id, query),
        courseraPlusEnrollmentChoices: CourseraPlusEnrollmentChoices.get(id, query),
      };
    }
  );

export type PropsToWithPrice = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  s12nId?: string;
  courseId?: string;
  requestCountryCode: string;
};

export type PropsFromWithPrice = {
  s12nDerivative?: S12nDerivativesV1;
  productPrice?: ProductPricesV3;
  productPrices?: Array<ProductPricesV3>;
  multiS12nDerivatives?: Array<S12nDerivativesV1>;
};

type PropsFromWithPriceNaptime = PropsFromWithPrice;

const withPrice = <InputProps extends PropsToWithPrice>(isNotRequired?: boolean) =>
  compose<InputProps & PropsFromWithPrice, InputProps>(
    Naptime.createContainer<InputProps & PropsFromWithPriceNaptime, InputProps, PropsFromWithPriceNaptime>(
      ({ enrollmentAvailableChoices, s12nId, courseId, requestCountryCode }) => {
        if (!enrollmentAvailableChoices) {
          return {};
        }

        // if user can subscribe to multiple s12ns but can't do free trial for any s12n,
        // retrieve the price for every s12n
        if (
          enrollmentAvailableChoices.canSubscribeToMultipleS12ns &&
          !enrollmentAvailableChoices.canEnrollThroughS12nSubscriptionFreeTrial
        ) {
          const enrollmentS12nIds = enrollmentAvailableChoices.subscriptionEnrollmentS12nIds;

          return {
            multiS12nDerivatives: S12nDerivativesV1.multiGet(enrollmentS12nIds, {
              fields: ['catalogPrice'],
              required: !isNotRequired,
            }),
          };
        } else if (enrollmentAvailableChoices.canSubscribeToS12n) {
          if (epic.preview('payments', 'courseraPlusMonthlyEnabled')) {
            return {
              // If we can subscribe to the s12n, it follows that we have a s12nId.
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              s12nDerivative: S12nDerivativesV1.get(s12nId!, {
                fields: ['catalogPrice'],
                required: !isNotRequired,
              }),
            };
          } else {
            return {
              // If we can subscribe to the s12n, it follows that we have a s12nId.
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              s12nDerivative: S12nDerivativesV1.get(s12nId!, {
                fields: ['catalogPrice'],
                required: !isNotRequired,
              }),
            };
          }
        } else if (enrollmentAvailableChoices.canEnrollThroughS12nPrepaid) {
          const prepaidEnrollmentData = enrollmentAvailableChoices.getS12nPrepaidEnrollmentData();

          if (!prepaidEnrollmentData) {
            return {};
          }

          const productType = SPECIALIZATION_PREPAID;
          const productItemIds = prepaidEnrollmentData.enrollmentChoiceData.definition.availablePrepaid.map(
            ({ productItemId }: { productItemId: string }) => productItemId
          );

          return {
            productPrices: ProductPricesV3.multiGetProductPrice(productType, productItemIds, requestCountryCode, {
              required: !isNotRequired,
            }),
          };
        } else {
          return {
            productPrice: ProductPricesV3.getCourseProductPrice(courseId, requestCountryCode, {
              required: !isNotRequired,
            }),
          };
        }
      }
    ),
    mapProps<PropsFromWithPrice, PropsFromWithPriceNaptime>(({ multiS12nDerivatives, productPrices, ...rest }) => ({
      ...(multiS12nDerivatives && {
        multiS12nDerivatives,
        s12nDerivative: multiS12nDerivatives[0],
      }),
      ...(productPrices && {
        // If there is a range of prices, show the lowest price for productPrice
        productPrice: productPrices.sort((priceA, priceB) => priceA.amount - priceB.amount)[0],
      }),
      ...rest,
    }))
  );

type PropsToWithCredentialTrackProductSkus = {
  id: string;
};

type PropsFromWithCredentialTrackProductSkus = {
  productSkus?: ProductSkuV1;
};

const withCredentialTrackProductSKUs = <InputProps extends PropsToWithCredentialTrackProductSkus>() =>
  Naptime.createContainer<PropsFromWithCredentialTrackProductSkus, InputProps>(({ id }) => {
    if (id) {
      return {
        productSkus: ProductSkuV1.finder('findByUnderlying', {
          params: {
            id: tupleToStringKey([CREDENTIAL_TRACK_SUBSCRIPTION, id]),
          },
          fields: ['id', 'productType', 'properties'],
        }),
      };
    } else {
      return {};
    }
  });

export { withEnrollment, withPrice, withCredentialTrackProductSKUs };
