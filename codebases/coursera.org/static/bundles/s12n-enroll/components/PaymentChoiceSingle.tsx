import PropTypes from 'prop-types';
import React from 'react';
import Course from 'bundles/catalogP/models/course';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ProductPrice from 'bundles/payments/models/productPrice';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { showPremiumGrading } from 'bundles/ondemand/utils/premiumGradingExperimentUtils';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/s12n-enroll';

import PaymentChoice from './PaymentChoice';

class PaymentChoiceSingle extends React.Component {
  static propTypes = {
    price: PropTypes.instanceOf(ProductPrice).isRequired,
    currentType: PropTypes.oneOf(['full', 'single', 'free', 'program']).isRequired,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
    course: PropTypes.instanceOf(Course),
    prices: PropTypes.object,
    isCoherentX: PropTypes.bool,
    onSdp: PropTypes.bool,
  };

  getTitle() {
    const { onSdp, userS12n } = this.context;
    const isTakingS12n = userS12n.isTakingS12n();

    let message;
    if (isTakingS12n) {
      if (onSdp) {
        message = _t('Buy Next Course');
      } else {
        message = _t('Buy This Course');
      }
    } else if (onSdp) {
      message = _t('Pay by Course');
    } else {
      message = _t('Purchase Course');
    }
    return message + ' • {price}';
  }

  render() {
    const title = (
      <FormattedMessage
        message={this.getTitle()}
        price={
          <ReactPriceDisplay
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'price' does not exist on type 'Readonly<... Remove this comment to see the full error message
            value={this.props.price.getDisplayAmount()}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'price' does not exist on type 'Readonly<... Remove this comment to see the full error message
            currency={this.props.price.getDisplayCurrencyCode()}
          />
        }
      />
    );

    const message = this.context.onSdp
      ? _t('Individual payments, paid before you start each course, beginning with {courseName}.')
      : _t(
          `Pay for this course only, and get a shareable certificate after you've completed the course.
          You can upgrade to the full Specialization later.`
        );

    return (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentType' does not exist on type 'Rea... Remove this comment to see the full error message
      <PaymentChoice type="single" title={title} currentType={this.props.currentType} onClick={this.props.onClick}>
        <FormattedMessage message={message} courseName={this.context.course.get('name')} />
      </PaymentChoice>
    );
  }
}

export default PaymentChoiceSingle;
