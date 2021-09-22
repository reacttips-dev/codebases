import React from 'react';

import ValuePropBulletPoint from 'bundles/enroll/components/common/ValuePropBulletPoint';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import CatalogSubscriptionsEnrollmentState from 'bundles/enroll/components/catalog-subs-hoc/CatalogSubscriptionsEnrollmentState';
import { freeTrial } from 'bundles/payments/common/constants';
import withCatalogSubscriptions from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getHeaderAndValueProps } from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/headerValuePropsText';

type Props = {
  courseId?: string;
  s12nId?: string;
  prioritizeCourse?: boolean;
  showParent?: () => void;
  catalogSubscriptionPrice: ProductPricesV3;
  catalogSubscriptionsEnrollmentState?: CatalogSubscriptionsEnrollmentState;
};

type State = {
  hasUpdatedParent?: boolean;
};

class CatalogSubscriptionsValueProps extends React.Component<Props, State> {
  state = {
    hasUpdatedParent: false,
  };

  componentWillMount() {
    // SSR
    this.checkUpdateParent();
  }

  componentDidUpdate() {
    // CSR
    this.checkUpdateParent();
  }

  getValueProps() {
    const { s12nId, courseId, catalogSubscriptionsEnrollmentState, prioritizeCourse } = this.props;
    const { valueProps } = getHeaderAndValueProps(
      catalogSubscriptionsEnrollmentState,
      courseId,
      s12nId,
      prioritizeCourse
    );

    return valueProps;
  }

  getBulletData() {
    const { catalogSubscriptionPrice } = this.props;
    const { amount, currencyCode } = catalogSubscriptionPrice;
    return {
      monthlyPrice: <ReactPriceDisplay value={amount} currency={currencyCode} hideCurrencyCode={true} />,
      numDays: freeTrial.numDays,
    };
  }

  checkUpdateParent = () => {
    const { showParent } = this.props;
    const { hasUpdatedParent } = this.state;

    if (this.shouldRender() && !hasUpdatedParent) {
      this.setState(() => ({ hasUpdatedParent: true }));
      if (showParent) {
        showParent();
      }
    }
  };

  shouldRender() {
    return this.props.catalogSubscriptionPrice;
  }

  render() {
    if (!this.shouldRender()) {
      return null;
    }

    const bulletData = this.getBulletData();
    return (
      <ul className="rc-CatalogSubscriptionsValueProps value-prop-list nostyle">
        {this.getValueProps().map((bullet: $TSFixMe /* TODO: type getHeaderAndValueProps */, index: number) => {
          const message = bullet.header;
          return (
            <li key={`bullet_${index}`}>
              <ValuePropBulletPoint>
                <p className="value-prop-line headline-1-text">
                  <FormattedMessage message={message} {...bulletData} />
                </p>
              </ValuePropBulletPoint>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default withCatalogSubscriptions(CatalogSubscriptionsValueProps, {
  withProductPrice: true,
});
