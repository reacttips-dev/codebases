import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';
import styles from './PaymentForm.sass';
import { parseUserAgent } from '../../../helpers/serverRenderingUtils';
import NativePayButton from './components/NativePayButton';
import { CreditCardForm } from './components/CreditCardForm';
import { mapPlatformToEventTarget } from '../../money';
import {
  APPLE_PAY_PAYMENT_PLATFORM,
  GOOGLE_PAY_PAYMENT_PLATFORM,
  CREDIT_CARD_PAYMENT_PLATFORM,
  GENERIC_PAYMENT_PLATFORM,
  PROCESSOR_ERROR_MESSAGES,
} from './constants';

const displayNativePayInterfaceForPaymentRequest = paymentRequest => {
  paymentRequest.show();
};

export const SUPPORTED_GOOGLE_PAY_BROWSER = 'gc';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canMakePayment: false,
      doShowCreditCardForm: false,
      didSetUpStripe: false,
      nativePaymentPlatform: CREDIT_CARD_PAYMENT_PLATFORM,
      paymentRequest: null,
    };
  }

  componentWillReceiveProps(newProps) {
    const {
      itemLabel,
      selectedProduct,
      totalLabel, // Apple prefixes this with "Pay"
      stripe,
      isNativePaymentDisabled,
    } = newProps;

    // stripe loaded lazily
    if (stripe && selectedProduct) {
      const { amount } = selectedProduct;
      const displayItems = [
        {
          label: itemLabel,
          amount,
        },
      ];
      if (!this.state.didSetUpStripe) {
        // If isNativePaymentDisabled prop is sent or this is running in Cypress tests, it bypasses
        // the logic around native payment detection and goes straight to Credit Card Payment
        if (isNativePaymentDisabled || window.Cypress) {
          this.setState({
            canMakePayment: false,
            didSetUpStripe: true,
            doShowCreditCardForm: true,
          });
          return;
        }

        // For full documentation of the available paymentRequest options, see:
        // https://stripe.com/docs/stripe.js#the-payment-request-object
        const paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          requestPayerEmail: true,
          requestPayerName: true,
          displayItems,
          total: { label: totalLabel, amount },
        });

        paymentRequest.on(
          'token',
          this.submitTokenizedPaymentRequest.bind(this)
        );

        paymentRequest.canMakePayment().then(result => {
          const { browser } = parseUserAgent();

          let nativePaymentPlatform = CREDIT_CARD_PAYMENT_PLATFORM;
          if (result && result.applePay === true) {
            nativePaymentPlatform = APPLE_PAY_PAYMENT_PLATFORM;
          }
          if (result && result.applePay === false) {
            if (browser === SUPPORTED_GOOGLE_PAY_BROWSER) {
              nativePaymentPlatform = GOOGLE_PAY_PAYMENT_PLATFORM;
            } else {
              // other payment; use Stripe's button
              nativePaymentPlatform = GENERIC_PAYMENT_PLATFORM;
            }
          }
          this.setState((prevState = {}) => {
            // reveal by default if paymentRequest unsupported
            const doShowCreditCardForm =
              !prevState.doShowCreditCardForm && !result;

            return {
              canMakePayment: !!result,
              doShowCreditCardForm,
              nativePaymentPlatform,
            };
          });
        });

        this.setState(prev => ({
          didSetUpStripe: true,
          paymentRequest,
        }));

        return;
      }
      // chosen a new product
      if (
        this.state.paymentRequest &&
        selectedProduct &&
        // deep equality
        selectedProduct.amount !== this.props.selectedProduct.amount
      ) {
        this.state.paymentRequest.update({
          displayItems,
          total: { label: totalLabel, amount },
        });
      }
    }
  }

  // e.g. Apple Pay
  submitTokenizedPaymentRequest({ complete, token, ...data }) {
    const { onSubmitPaymentForm, selectedProduct } = this.props;
    const { nativePaymentPlatform } = this.state;
    onSubmitPaymentForm(
      {
        ...mapPaymentRequestDataToFormData(data),
        selectedProduct,
        token,
      },
      {
        nativePaymentPlatform,
      }
    )
      .then(() => {
        complete('success');
      })
      .catch(() => {
        complete('fail');
        // TODO: necessary to notify user? Native chrome should have error state
      });
  }

  // credit card entry
  createStripeTokenAndSubmit = (values, setError) => {
    const {
      onSubmitPaymentForm,
      selectedProduct,
      stripe,
      onClickPaymentButton,
    } = this.props;

    onClickPaymentButton &&
      onClickPaymentButton(
        mapPlatformToEventTarget(CREDIT_CARD_PAYMENT_PLATFORM)
      );
    return stripe
      .createToken({
        type: 'card',
        name: values.name,
        email: values.email,
      })
      .catch(err => {
        // handle token error
        setError('token', {
          type: 'focus',
        });
      })
      .then(({ token }) => {
        if (!token) {
          // handle unfilled credit card field
          setError('token', {
            type: 'focus',
            message: PROCESSOR_ERROR_MESSAGES.GENERAL_ERROR,
          });
        }
        return {
          ...values,
          selectedProduct,
          token,
        };
      })
      .then(data =>
        onSubmitPaymentForm(data, {
          nativePaymentPlatform: CREDIT_CARD_PAYMENT_PLATFORM,
        }).catch((ApiError = {}) => {
          const { response } = ApiError;
          // handle server error
          setError('', {
            type: 'manual',
            message: getErrorMessageFromErrorCode(response),
          });
        })
      );
  };

  handleClickShowCreditCardForm = evt => {
    this.setState(prevState => ({
      doShowCreditCardForm: !prevState.doShowCreditCardForm,
    }));
  };

  render() {
    const {
      submitButtonLabel,

      isPaymentProcessing,
      className = '',
      nativePayButtonClassName = '',
      creditCardLinkClassName = '',
      loadingSceneClassName = '',

      onClickPaymentButton,
      showUserSelectedBillingCountry,
    } = this.props;

    return (
      <div className={`${styles.root} ${className}`}>
        {this.state.canMakePayment && !this.state.doShowCreditCardForm ? (
          <div className={nativePayButtonClassName}>
            <NativePayButton
              isLoading={isPaymentProcessing}
              paymentPlatform={this.state.nativePaymentPlatform}
              paymentRequest={this.state.paymentRequest}
              onClickPaymentButton={() => {
                onClickPaymentButton &&
                  onClickPaymentButton(this.state.nativePaymentPlatform);
                displayNativePayInterfaceForPaymentRequest(
                  this.state.paymentRequest
                );
              }}
            />
            <div className={styles.payWithCardButton}>
              <button
                onClick={this.handleClickShowCreditCardForm}
                className={creditCardLinkClassName}
              >
                Pay with a credit card instead
              </button>
            </div>
          </div>
        ) : null}
        {this.state.doShowCreditCardForm && (
          <div className={styles.payWithCreditCardLink}>
            <CreditCardForm
              isPaymentProcessing={isPaymentProcessing}
              buttonLabel={submitButtonLabel}
              onSubmitSuccess={this.createStripeTokenAndSubmit}
              showUserSelectedBillingCountry={showUserSelectedBillingCountry}
            />
          </div>
        )}
        {!this.state.canMakePayment && !this.state.doShowCreditCardForm && (
          <div className={loadingSceneClassName}>
            <Spinner color="light-gray" />
          </div>
        )}
      </div>
    );
  }
}

PaymentForm.propTypes = {
  className: PropTypes.string,
  nativePayButtonClassName: PropTypes.string,
  creditCardLinkClassName: PropTypes.string,
  creditCardFormClassName: PropTypes.string,
  loadingSceneClassName: PropTypes.string,
  selectedProduct: PropTypes.shape({
    amount: PropTypes.number,
  }),
  itemLabel: PropTypes.string,
  totalLabel: PropTypes.string,
  // Apple and Google Pay
  isNativePaymentDisabled: PropTypes.bool,
};

/**
  methodName: "apple-pay"
  payerEmail: "Chris+dev@anchor.com"
  payerName: "Chris Bosco"
  payerPhone: null
  shippingAddress: {addressLine: [], country: "", postalCode: "", recipient: "", region: "", …}
  shippingOption: null
 */
function mapPaymentRequestDataToFormData(data = {}) {
  return {
    name: data.payerName,
    email: data.payerEmail,
    methodName: data.methodName,
  };
}

function getErrorMessageFromErrorCode(errorCode) {
  switch (errorCode) {
    case 'card_declined':
      return PROCESSOR_ERROR_MESSAGES.DECLINED_ERROR;
    case 'processing_error':
      return PROCESSOR_ERROR_MESSAGES.PROCESSING_ERROR;
    case 'incorrect_cvc':
    case 'expired_card':
    default:
      return PROCESSOR_ERROR_MESSAGES.GENERAL_ERROR;
  }
}

export default PaymentForm;
