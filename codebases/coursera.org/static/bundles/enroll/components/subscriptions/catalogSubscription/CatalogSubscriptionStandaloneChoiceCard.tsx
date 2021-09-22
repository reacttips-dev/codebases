import React from 'react';
import Naptime from 'bundles/naptimejs';
import classnames from 'classnames';

import { CatalogSubscriptionStandaloneChoiceCardProps } from 'bundles/enroll/types/CatalogSubscriptionEnrollModalTypes';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import TrackedButton from 'bundles/page/components/TrackedButton';
import logger from 'js/app/loggerSingleton';
import { freeTrial } from 'bundles/payments/common/constants';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getHeaderAndValueProps } from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/catalogSubsStandaloneCourseText';
import ValuePropBulletPoint from 'bundles/enroll/components/common/ValuePropBulletPoint';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/enroll';
import { CATALOG_SUBSCRIPTION, VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
import requestCountry from 'js/lib/requestCountry';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import Imgix from 'js/components/Imgix';
import RedirectToCheckout from 'bundles/payments/components/RedirectToCheckout';
import Icon from 'bundles/iconfont/Icon';

import 'css!./__styles__/CatalogSubscriptionStandaloneChoiceCard';

import config from 'js/app/config';

const CERTIFICATE_ICON = `${config.url.resource_assets}growth_catalog_subscription/ic_cert.png`;

type State = {
  goToCheckout: boolean;
};

type InputProps = Omit<CatalogSubscriptionStandaloneChoiceCardProps, 'productPrice'>;

class CatalogSubscriptionStandaloneChoiceCard extends React.Component<
  CatalogSubscriptionStandaloneChoiceCardProps,
  State
> {
  state = {
    goToCheckout: false,
  };

  shouldComponentUpdate() {
    // if we're already in the process of going to the checkout page,
    // don't do anything
    return !this.state.goToCheckout;
  }

  onContinue = () => {
    this.setState(
      () => ({
        goToCheckout: true,
      }),
      () => {
        this.props.onEnroll();
      }
    );
  };

  getTextData() {
    const { productPrice } = this.props;

    if (!productPrice) {
      return null;
    }

    const { amount, currencyCode } = productPrice;

    return {
      price: <ReactPriceDisplay currency={currencyCode} value={amount} hideCurrencyCode={true} />,
      numDays: freeTrial.numDays,
    };
  }

  render() {
    const {
      courseId,
      productType,
      enrollmentChoiceType,
      productId,
      disableContinueButton,
      iconSrc,
      canEnrollThroughCatalogSubscriptionFreeTrial,
    } = this.props;
    const { goToCheckout } = this.state;
    const textData = this.getTextData();
    const text = getHeaderAndValueProps(
      productType,
      enrollmentChoiceType,
      canEnrollThroughCatalogSubscriptionFreeTrial
    );

    if (!textData) {
      logger.error(`Pricing data unavailable for card ${productType}.`);
      return null;
    }

    if (!text) {
      logger.error(`Product type ${productType} and enrollment choice ${enrollmentChoiceType} not supported.`);
      return null;
    }

    const { header, subheader, valueProps, ribbonText } = text;

    const subheadlineClassNames = classnames('choice-card-subheadline body-2-text', {
      'payg-color': productType === VERIFIED_CERTIFICATE,
      'catalog-subs-color': productType === CATALOG_SUBSCRIPTION,
    });

    const valuePropBulletClassName = classnames({
      'payg-color-checkmark': productType === VERIFIED_CERTIFICATE,
      'catalog-subs-color-checkmark': productType === CATALOG_SUBSCRIPTION,
    });

    const buttonText = <strong>{_t('Continue')}</strong>;
    const certificateIconSrc = iconSrc || CERTIFICATE_ICON;
    return (
      <div className="rc-CatalogSubscriptionStandaloneChoiceCard">
        {ribbonText && (
          <div className="ribbon-container">
            <div className="ribbon align-horizontal-center">
              <span className="ribbon-text">{ribbonText}</span>
            </div>
          </div>
        )}
        <div className="header-row horizontal-box">
          <Imgix className="cert-icon flex-1" alt={Imgix.DECORATIVE} src={certificateIconSrc} height={54} width={39} />
          <div className="headers flex-4">
            <h2 className="choice-card-headline headline-2-text">
              <FormattedMessage message={header} {...textData} />
            </h2>
            <h3 className={subheadlineClassNames}>
              <FormattedMessage message={subheader} {...textData} />
            </h3>
          </div>
        </div>
        <ul className="nostyle choice-card-value-props">
          {valueProps.map((bullet: $TSFixMe /* TODO: type getHeaderAndValueProps */, index: number) => (
            <li key={`bullet_${index}`}>
              <ValuePropBulletPoint className={valuePropBulletClassName}>
                <p className="value-prop-line body-1-text">
                  <FormattedMessage message={bullet} {...textData} />
                </p>
              </ValuePropBulletPoint>
            </li>
          ))}
        </ul>
        <div className="choice-card-button-container align-horizontal-center">
          {disableContinueButton ? (
            <button className="choice-card-continue primary" disabled={true}>
              {buttonText}
            </button>
          ) : (
            <TrackedButton
              trackingName="choice_card_continue"
              data={{ productType, productId, enrollmentChoiceType }}
              className="choice-card-continue primary"
              onClick={this.onContinue}
            >
              {goToCheckout ? <Icon name="spinner" spin={true} /> : buttonText}
            </TrackedButton>
          )}
        </div>
        {goToCheckout && (
          <RedirectToCheckout courseId={courseId} enrollmentChoice={enrollmentChoiceType} productSkuId={productId} />
        )}
      </div>
    );
  }
}

const CatalogSubscriptionStandaloneChoiceCardNC = Naptime.createContainer<
  CatalogSubscriptionStandaloneChoiceCardProps,
  InputProps
>(({ productId, productType }) => ({
  productPrice: ProductPricesV3.getProductPrice(productType, productId, requestCountry.get()),
}))(CatalogSubscriptionStandaloneChoiceCard);

export default CatalogSubscriptionStandaloneChoiceCardNC;
