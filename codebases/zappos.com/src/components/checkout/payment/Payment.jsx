import PropTypes from 'prop-types';

import MultiLineAddress from 'components/checkout/address/MultiLineAddress';
import { getMelodyPaymentTypeIcon } from 'components/checkout/CheckoutUtils';
import { isCreditCardExpired } from 'helpers/MyAccountUtils';

import css from 'styles/components/checkout/payment/payment.scss';

const Payment = (props, { testId }) => {
  const {
    billingAddress = {},
    hasPurchaseGiftCard,
    hasPurchasePromoCode,
    isBillingSameAsShipping,
    payment
  } = props;

  const hasPayment = !!payment;

  if (!hasPayment && !hasPurchaseGiftCard && !hasPurchasePromoCode) {
    return <div>Please add or select a shipping address to proceed.</div>;
  }

  return (
    <div className={css.wrapper} data-test-id={testId('paymentSection')}>
      { hasPayment && <div> { makePaymentLine(payment, testId) } </div> }
      { !!hasPurchasePromoCode && <div>Promotional Code</div> }
      { !!hasPurchaseGiftCard && <div>Gift Card</div> }
      { hasPayment && (<div id="payment-billing-address">
        <p className={css.addressTitle}>Billing Address:</p>
        {
          isBillingSameAsShipping
            ? 'Same as shipping'
            : <MultiLineAddress
              address={billingAddress}
              hideName={false}
              highlightName={false}
              hidePhone={true}
              hideCountry={true} />
        }
      </div>)
      }
    </div>
  );
};

const makePaymentLine = (payment, testId) => {
  const { expirationMonth, expirationYear, ccIssuer, tail } = payment;
  const isExpired = isCreditCardExpired(payment);
  return (
    <div className={css.endingInRow} id="payment-method">
      {
        getMelodyPaymentTypeIcon(ccIssuer)
      }
      <span data-test-id={testId('cardEndingIn')}>Ending in {tail}</span>
      {
        isExpired && <span className={css.expired} data-test-id={testId('expirationInfo')}>
          Exp: {expirationMonth}/{expirationYear}
        </span>
      }
    </div>
  );
};

Payment.contextTypes = {
  testId: PropTypes.func
};

export default Payment;
