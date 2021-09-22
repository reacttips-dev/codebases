import PropTypes from 'prop-types';
import React from 'react';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ProductPrice from 'bundles/payments/models/productPrice';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import PaymentChoice from './PaymentChoice';
import 'css!./__styles__/PaymentChoiceCapstone';
import _t from 'i18n!nls/s12n-enroll';

class PaymentChoiceCapstone extends React.Component {
  static propTypes = {
    price: PropTypes.instanceOf(ProductPrice).isRequired,
  };

  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
  };

  render() {
    const title = (
      <FormattedMessage
        message={_t('Capstone • {price}')}
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

    return (
      <div className="rc-PaymentChoiceCapstone">
        <PaymentChoice type="single" currentType="single" title={title}>
          <span>
            {_t(
              `Pay for the final course in the Specialization. When you complete the Capstone you'll earn a
            Specialization Certificate.`
            )}
          </span>
          {!this.context.userS12n.isEligibleForCapstone() && (
            <div className="ineligible-message">
              {_t(
                `You can pay for the Capstone now, but you cannot enroll until you have successfully
completed all other courses in the Specialization.`
              )}
            </div>
          )}
        </PaymentChoice>
      </div>
    );
  }
}

export default PaymentChoiceCapstone;
