import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { PAYMENT_FIELDS } from 'constants/formFields';
import CCIVRPayment from 'components/checkout/payment/CCIVRPayment';
import { inIframe } from 'helpers/CheckoutUtils';

import { fieldError, fieldWrapper, formField } from 'styles/components/checkout/payment/paymentForm.scss';
import { confirmCardBtn } from 'styles/components/checkout/payment/reEnterCardForm.scss';

export class ReEnterCardForm extends Component {
  state = {
    cc: '',
    showCCIVRModal: false
  };

  onConfirmCardClick = () => {
    const { onVerifyCardClick, paymentInstrumentId } = this.props;
    const { cc } = this.state;
    onVerifyCardClick({ number: cc, paymentInstrumentId });
    return false;
  };

  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  onKeyUp = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onConfirmCardClick();
    }
  };

  onFieldChange = e => {
    const { target: { name, value } } = e;
    this.setState({ [name]: value });
  };

  onHideCCIVRModal = () => {
    this.setState({ showCCIVRModal: false });
  };

  onShowCCIVRModalClick = () => {
    this.setState({ showCCIVRModal: true });
  };

  render() {
    const {
      formItem = {},
      hasVerifyCreditCardError,
      inIframe,
      isChecked,
      isExpired,
      isLoading = false,
      selectedPaymentNeedsConfirmation
    } = this.props;
    const { testId } = this.context;
    const { cc, showCCIVRModal } = this.state;
    const { formErrors = {} } = formItem;
    const showCCIVRPayment = inIframe();

    if (selectedPaymentNeedsConfirmation && isChecked && !isExpired && showCCIVRModal) {
      return (
        <CCIVRPayment
          endpoint="validateCardForm"
          isModal={true}
          title="Confirm Card"
          onCloseModalOverlayClick={this.onHideCCIVRModal} />
      );
    }

    if (selectedPaymentNeedsConfirmation && isChecked && !isExpired && showCCIVRPayment) {
      return (
        <button
          disabled={isLoading}
          className={confirmCardBtn}
          type="button"
          onClick={this.onShowCCIVRModalClick}>Confirm Customer Card</button>
      );
    }

    if (selectedPaymentNeedsConfirmation && isChecked && !isExpired) {
      return (
        <div>
          <div className={fieldWrapper}>
            <div className={cn(formField, { [fieldError]: hasVerifyCreditCardError || formErrors.hasOwnProperty(PAYMENT_FIELDS.CC.fieldName) })}>
              <label htmlFor={PAYMENT_FIELDS.CC.fieldName}>Card number</label>
              <input
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                maxLength={PAYMENT_FIELDS.CC.maxLength}
                onChange={this.onFieldChange}
                value={cc || ''}
                id={PAYMENT_FIELDS.CC.fieldName}
                name={PAYMENT_FIELDS.CC.fieldName}
                data-test-id={testId('cardNumber')}
                required={true}
                placeholder="Card number" />
              { hasVerifyCreditCardError && <div>Credit card number doesn't match. Please try entering it again.</div> }
              { formErrors.hasOwnProperty(PAYMENT_FIELDS.CC.fieldName) && <div>{formErrors[PAYMENT_FIELDS.CC.fieldName]}</div> }
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            className={confirmCardBtn}
            data-test-id={testId('updateExpirationBtn')}
            onClick={this.onConfirmCardClick}>{ isLoading ? 'Submitting...' : 'Confirm Card' }</button>
        </div>
      );
    }

    return null;
  }
}

ReEnterCardForm.contextTypes = {
  testId: PropTypes.func
};

ReEnterCardForm.defaultProps = {
  inIframe
};

export default ReEnterCardForm;
