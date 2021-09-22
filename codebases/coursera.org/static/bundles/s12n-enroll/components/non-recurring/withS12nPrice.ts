import { compose, withProps } from 'recompose';

import Naptime from 'bundles/naptimejs';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import { SPECIALIZATION_PREPAID } from 'bundles/payments/common/ProductType';

import requestCountry from 'js/lib/requestCountry';
import waitFor from 'js/lib/waitFor';

type PropsFromCallerSubscriptionPrice = {
  s12nId: string;
};

type PropsFromCallerPrepaidPrice = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

export type PropsFromWithS12nPrepaidPrices = {
  productPrices?: Array<ProductPricesV3> | undefined;
};

export type PropsFromWithS12nPrepaidPrice = {
  s12nPrepaidPrice?: ProductPricesV3 | undefined;
};

export const withS12nPrepaidPrices = <InputProps extends PropsFromCallerPrepaidPrice>() =>
  Naptime.createContainer<PropsFromWithS12nPrepaidPrices, InputProps>(({ enrollmentAvailableChoices }) => {
    const prepaidEnrollmentData = enrollmentAvailableChoices?.getS12nPrepaidEnrollmentData();

    if (!prepaidEnrollmentData) {
      return {};
    }

    const productType = SPECIALIZATION_PREPAID;
    const productItemIds = prepaidEnrollmentData.enrollmentChoiceData.definition.availablePrepaid.map(
      ({ productItemId }: { productItemId: string }) => productItemId
    );
    return {
      productPrices: ProductPricesV3.multiGetProductPrice(productType, productItemIds, requestCountry.get(), {
        required: false,
      }),
    };
  });

// Returns the most inexpensive s12n prepaid product price
export const withS12nPrepaidPrice = <InputProps extends PropsFromCallerPrepaidPrice>() =>
  compose<PropsFromWithS12nPrepaidPrice, InputProps>(
    withS12nPrepaidPrices<InputProps>(),
    withProps<PropsFromWithS12nPrepaidPrice, PropsFromWithS12nPrepaidPrices>(({ productPrices }) => {
      if (!productPrices?.length) {
        return {};
      }

      const sortedProductPrices = productPrices.sort((priceA, priceB) => priceA.amount - priceB.amount);
      return { s12nPrepaidPrice: sortedProductPrices[0] };
    })
  );

type PropsFromS12nDerivativesNaptime = {
  s12nDerivatives: S12nDerivativesV1;
};

export type PropsFromWithS12nSubscriptionPrice = {
  s12nSubscriptionPrice: ProductPricesV3;
};

export const withS12nSubscriptionPrice = <InputProps extends PropsFromCallerSubscriptionPrice>() =>
  compose<PropsFromWithS12nSubscriptionPrice & InputProps, InputProps>(
    Naptime.createContainer<PropsFromS12nDerivativesNaptime, InputProps>(({ s12nId }) => {
      return {
        s12nDerivatives: S12nDerivativesV1.get(s12nId, {
          fields: ['catalogPrice'],
        }),
      };
    }),
    waitFor<PropsFromS12nDerivativesNaptime>(({ s12nDerivatives }) => !!s12nDerivatives?.catalogPrice),
    withProps<PropsFromWithS12nSubscriptionPrice, PropsFromS12nDerivativesNaptime>(({ s12nDerivatives }) => {
      return {
        s12nSubscriptionPrice: new ProductPricesV3({
          amount: s12nDerivatives.catalogPrice!.amount, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          currencyCode: s12nDerivatives.catalogPrice!.currencyCode, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        }),
      };
    })
  );
