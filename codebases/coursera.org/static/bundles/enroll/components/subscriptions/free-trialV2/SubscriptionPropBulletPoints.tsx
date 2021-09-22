import React from 'react';
import { compose } from 'recompose';

import Naptime from 'bundles/naptimejs';
import waitFor from 'js/lib/waitFor';
import uuid from 'bundles/common/utils/uuid';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';
import SubscriptionVPropBulletPoint from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionVPropBulletPoint';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import withCatalogSubscriptionUserStates from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptionUserStates';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import requestCountry from 'js/lib/requestCountry';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import { MONTHLY } from 'bundles/subscriptions/common/BillingCycleType';
import getBulletDataTranslations from 'bundles/enroll/components/subscriptions/free-trialV2/utils/bulletData';
import user from 'js/lib/user';

import 'css!./__styles__/SubscriptionPropBulletPoints';

type PropsFromCaller = {
  s12nId: string;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsFromNaptime = {
  s12nDerivative: S12nDerivativesV1;
  s12n: OnDemandSpecializationsV1;
  catalogSubscriptionPrice?: ProductPricesV3;
};

type PropsFromPartnersNaptime = {
  partners: Array<PartnersV1> | null;
};
type PropsToComponent = PropsFromCaller & PropsFromNaptime & PropsFromPartnersNaptime;

class SubscriptionPropBulletPoints extends React.Component<PropsToComponent> {
  getMontlyPrice() {
    const { s12nDerivative, catalogSubscriptionPrice } = this.props;

    let currencyCode;
    let amount;

    if (catalogSubscriptionPrice) {
      ({ currencyCode, amount } = catalogSubscriptionPrice);
    } else if (s12nDerivative?.catalogPrice) {
      const { catalogPrice } = s12nDerivative;
      ({ currencyCode, amount } = catalogPrice);
    }

    return <ReactPriceDisplay currency={currencyCode} value={amount} />;
  }

  render() {
    const { s12n, s12nDerivative, catalogSubscriptionPrice, enrollmentAvailableChoices, partners } = this.props;

    if (!(s12nDerivative && s12nDerivative.catalogPrice) && !catalogSubscriptionPrice) {
      return null;
    }

    const {
      FREE_TRIAL_LOGGED_IN_BULLETS,
      FREE_TRIAL_LOGGED_OUT_BULLETS,
      CATALOG_SUBSCRIPTION_BULLETS,
      CATALOG_SUBSCRIPTION_FREE_TRIAL_BULLETS,
    } = getBulletDataTranslations(s12n.isProfessionalCertificate);
    const canSubscribeToCatalog = enrollmentAvailableChoices && enrollmentAvailableChoices.canSubscribeToCatalog;
    const canEnrollThroughCatalogSubscriptionFreeTrial =
      enrollmentAvailableChoices && enrollmentAvailableChoices.canEnrollThroughCatalogSubscriptionFreeTrial;

    let bullets: { header: string; subheader?: string }[];
    if (canEnrollThroughCatalogSubscriptionFreeTrial) {
      bullets = CATALOG_SUBSCRIPTION_FREE_TRIAL_BULLETS;
    } else if (canSubscribeToCatalog) {
      bullets = CATALOG_SUBSCRIPTION_BULLETS;
    } else if (user.isAuthenticatedUser()) {
      bullets = FREE_TRIAL_LOGGED_IN_BULLETS;
    } else {
      bullets = FREE_TRIAL_LOGGED_OUT_BULLETS;
    }

    const highlightHeader = !canSubscribeToCatalog;

    return (
      <div className="rc-SubscriptionPropBulletPoints">
        <ul className="bullet_list nostyle">
          {bullets.map((bullet) => (
            <li key={`bullet_${uuid()}`}>
              <SubscriptionVPropBulletPoint
                messageProps={{ monthlyPrice: this.getMontlyPrice(), partnerName: partners?.[0]?.name }}
                highlightHeader={highlightHeader}
                {...bullet}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const withS12nInformation = compose<PropsFromNaptime, PropsFromCaller>(
  Naptime.createContainer<PropsFromNaptime, PropsFromCaller>(({ s12nId, enrollmentAvailableChoices }) => {
    const canSubscribeToCatalog = enrollmentAvailableChoices && enrollmentAvailableChoices.canSubscribeToCatalog;

    let catalogProductId: string | undefined;
    if (canSubscribeToCatalog) {
      const products = enrollmentAvailableChoices && enrollmentAvailableChoices.availableCatalogSubscriptions;
      catalogProductId = subscriptionPriceUtils.getSubscriptionSkuId(products, MONTHLY) ?? undefined;
    }

    return {
      s12n: OnDemandSpecializationsV1.get(s12nId, {
        fields: ['id', 'name', 'productVariant', 'partnerIds'],
        includes: ['partnerIds'],
        required: true,
      }),
      s12nDerivative: S12nDerivativesV1.get(s12nId, {
        fields: ['catalogPrice'],
      }),
      ...(catalogProductId && {
        catalogSubscriptionPrice: ProductPricesV3.getCatalogSubscriptionProductPrice(
          catalogProductId,
          requestCountry.get(),
          {
            required: false,
          }
        ),
      }),
    };
  }),
  // Workaround for Naptime limitation where it doesn't check `fields` before providing the component with (potentially
  // incomplete) cached data.
  waitFor<PropsFromNaptime>(({ s12n }) => !!s12n.productVariant)
);

const withPartners = Naptime.createContainer<PropsFromPartnersNaptime, PropsFromNaptime>(({ s12n }) => {
  return {
    partners: PartnersV1.multiGet(s12n ? s12n.partnerIds : [], {
      fields: ['name'],
    }),
  };
});
export default compose<PropsToComponent, PropsFromCaller>(
  withCatalogSubscriptionUserStates,
  withS12nInformation,
  withPartners
)(SubscriptionPropBulletPoints);
