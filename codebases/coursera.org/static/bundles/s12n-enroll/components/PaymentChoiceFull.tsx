import PropTypes from 'prop-types';
import React from 'react';

import epic from 'bundles/epic/client';
import PriceWithDiscountIndicator from 'bundles/payments-common/components/PriceWithDiscountIndicator';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ProductPrice from 'bundles/payments/models/productPrice';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';

import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/s12n-enroll';

class PaymentChoiceFull extends React.Component {
  static propTypes = {
    price: PropTypes.instanceOf(ProductPrice).isRequired,
    currentType: PropTypes.oneOf(['full', 'single', 'free', 'program']).isRequired,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
    course: PropTypes.object,
    onSdp: PropTypes.bool,
  };

  getBulkPayBodyMessage() {
    const { userS12n } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'price' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const hasDiscount = this.props.price.hasPromotion();

    const unownedCourseCount = userS12n.getUnownedCourses().length;

    // Used for (ISC)² Systems Security Certified Practitioner (SSCP) - https://www.coursera.org/specializations/sscp-training
    // This is the only "Professional Certificate" branded s12n on bulk pay, and it will not be migrated for Prof Cert v1 crawl phase
    // TODO remove/update in Prof Cert v1 walk/run phase
    const isCertificate = epic.get('Growth', 'isCertificate', { specialization_id: userS12n.getMetadata().id });

    if (userS12n.isSpark() && !userS12n.canSparkBulkPay()) {
      return _t('Pre-pay is currently unavailable because not all courses have scheduled sessions.');
    } else if (userS12n.isTakingS12n()) {
      if (hasDiscount) {
        return !isCertificate
          ? _t(
              `Pre-pay for the remaining courses in the Specialization
            and Specialization Certificate, and get a special one-time discount.`
            )
          : _t('Pre-pay for the remaining courses in the Certificate, and get a special one-time discount.');
      } else {
        return !isCertificate
          ? _t('Pre-pay for the remaining courses in the Specialization and Specialization Certificate.')
          : _t('Pre-pay for the remaining courses in the Certificate.');
      }
    } else if (hasDiscount) {
      return !isCertificate ? (
        <FormattedMessage
          message={_t(
            'Pre-pay for all {unownedCourseCount} courses in the Specialization ' +
              'and Specialization Certificate, and get a special one-time discount.'
          )}
          unownedCourseCount={unownedCourseCount}
        />
      ) : (
        <FormattedMessage
          message={_t(
            'Pre-pay for all {unownedCourseCount} courses in the Certificate and get a special one-time discount.'
          )}
          unownedCourseCount={unownedCourseCount}
        />
      );
    } else {
      return !isCertificate ? (
        <FormattedMessage
          message={_t(
            `Pre-pay for all {unownedCourseCount} courses in the Specialization
           and Specialization Certificate.`
          )}
          unownedCourseCount={unownedCourseCount}
        />
      ) : (
        <FormattedMessage
          message={_t('Pre-pay for all {unownedCourseCount} courses in the Certificate.')}
          unownedCourseCount={unownedCourseCount}
        />
      );
    }
  }

  getBulkPayTitleMessage() {
    const isTakingS12n = this.context.userS12n.isTakingS12n();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'price' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { price } = this.props;

    function takingS12nDisplay() {
      return (
        <span>
          {_t('Buy Remaining Courses')}
          &nbsp;•&nbsp;
          <span className="price">
            <ReactPriceDisplay value={price.getDisplayAmount()} currency={price.getDisplayCurrencyCode()} />
          </span>
        </span>
      );
    }

    function notTakingS12nDisplay() {
      return (
        <span>
          <span>
            {/* @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message */}
            {this.context.onSdp ? _t('Pre-Pay') : _t('Purchase Specialization')}
            &nbsp;•&nbsp;
          </span>
          <PriceWithDiscountIndicator
            amount={price.getOriginalAmount()}
            finalAmount={price.getDisplayAmount()}
            currencyCode={price.getDisplayCurrencyCode()}
          />
        </span>
      );
    }

    return isTakingS12n ? takingS12nDisplay.call(this) : notTakingS12nDisplay.call(this);
  }

  render() {
    const { userS12n } = this.context;

    return (
      <PaymentChoice
        title={this.getBulkPayTitleMessage()}
        disabled={userS12n.isSpark() && !userS12n.canSparkBulkPay()}
        type="full"
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentType' does not exist on type 'Rea... Remove this comment to see the full error message
        currentType={this.props.currentType}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
        onClick={this.props.onClick}
      >
        <span>{this.getBulkPayBodyMessage()}</span>
      </PaymentChoice>
    );
  }
}

export default PaymentChoiceFull;
