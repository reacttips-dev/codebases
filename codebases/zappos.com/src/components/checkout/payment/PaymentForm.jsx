import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { PAYMENT_FIELDS } from 'constants/formFields';
import { getMelodyPaymentTypeIconForInput } from 'components/checkout/CheckoutUtils';
import { inIframe } from 'helpers/CheckoutUtils';
import { CreditCardExpirationMonth, CreditCardExpirationYear } from 'components/common/CreditCardExpirationField';
import MelodyModal from 'components/common/MelodyModal';
import CCIVRPayment from 'components/checkout/payment/CCIVRPayment';

import css from 'styles/components/checkout/payment/paymentForm.scss';

const initialState = {
  cc: '',
  expiration: '',
  expirationMonth: '',
  expirationYear: '',
  name: '',
  isPrimary: true,
  errors: {}
};

export class PaymentForm extends Component {
  state = initialState;

  onFieldChange = e => {
    const { target: { name, value } } = e;
    this.setState({ [name]: value });
  };

  toggleIsPrimary = () => {
    const { onToggleIsPrimary } = this.props;
    const { isPrimary } = this.state;
    onToggleIsPrimary(isPrimary);
    this.setState({ isPrimary: !isPrimary });
  };

  onSavingPayment = e => {
    e.preventDefault();
    const { onSubmitPayment } = this.props;
    onSubmitPayment(this.state);
  };

  onHideModal = () => {
    const { onCancelAddNewPayment } = this.props;
    this.setState(initialState);
    onCancelAddNewPayment();
  };

  isErrorField = field => !!this.props.formItem.formErrors?.[field];

  makeForm = () => {
    const { formItem, hasSavedPayments } = this.props;
    const { testId } = this.context;
    const { cc, expirationMonth, expirationYear, name, isPrimary } = this.state;
    const { formErrors = {} } = formItem;
    const disableAutoComplete = inIframe();

    return (
      <form
        action="TBD"
        data-test-id={testId('paymentform')}
        method="POST"
        onSubmit={this.onSavingPayment}>
        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.isErrorField(PAYMENT_FIELDS.NAME_ON_CARD.fieldName) })}>
            <label htmlFor={PAYMENT_FIELDS.NAME_ON_CARD.fieldName}>Name on card</label>
            <input
              autoComplete={disableAutoComplete ? 'new-password' : PAYMENT_FIELDS.NAME_ON_CARD.autoComplete}
              autoCorrect="off"
              maxLength={PAYMENT_FIELDS.NAME_ON_CARD.maxLength}
              onChange={this.onFieldChange}
              value={name || ''}
              id={PAYMENT_FIELDS.NAME_ON_CARD.fieldName}
              name={PAYMENT_FIELDS.NAME_ON_CARD.fieldName}
              data-test-id={testId('nameOnCard')}
              required={true} />
            { this.isErrorField(PAYMENT_FIELDS.NAME_ON_CARD.fieldName) && <div>{formErrors[PAYMENT_FIELDS.NAME_ON_CARD.fieldName]}</div> }
          </div>
        </div>

        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.isErrorField(PAYMENT_FIELDS.CC.fieldName) })}>
            <label htmlFor={PAYMENT_FIELDS.CC.fieldName}>Card number</label>
            <input
              autoComplete={disableAutoComplete ? 'new-password' : PAYMENT_FIELDS.CC.autoComplete}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoCorrect="off"
              maxLength={PAYMENT_FIELDS.CC.maxLength}
              onChange={this.onFieldChange}
              value={cc || ''}
              id={PAYMENT_FIELDS.CC.fieldName}
              name={PAYMENT_FIELDS.CC.fieldName}
              data-test-id={testId('cardNumber')}
              required={true} />
            { getMelodyPaymentTypeIconForInput(cc) }
            { this.isErrorField(PAYMENT_FIELDS.CC.fieldName) && <div data-test-id={testId('cardError')}>{formErrors[PAYMENT_FIELDS.CC.fieldName]}</div> }
          </div>
        </div>

        <div className={css.expRow}>
          <div className={css.fieldWrapper}>
            <div className={cn(css.formField, { [css.fieldError]: this.isErrorField(PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName) })}>
              <label htmlFor={PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName}>Month</label>
              <CreditCardExpirationMonth
                autoComplete={disableAutoComplete ? 'new-password' : PAYMENT_FIELDS.CC_EXPIRATION_MONTH.autoComplete}
                value={expirationMonth || ''}
                onChange={this.onFieldChange}
                id={PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName}
                name={PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName} />
              { this.isErrorField(PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName) && <div>{formErrors[PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName]}</div> }
            </div>
          </div>

          <div className={css.fieldWrapper}>
            <div className={cn(css.formField, { [css.fieldError]: this.isErrorField(PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName) })}>
              <label htmlFor={PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName}>Year</label>
              <CreditCardExpirationYear
                autoComplete={disableAutoComplete ? 'new-password' : PAYMENT_FIELDS.CC_EXPIRATION_YEAR.autoComplete}
                value={expirationYear || ''}
                onChange={this.onFieldChange}
                id={PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName}
                name={PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName} />
            </div>
          </div>
        </div>

        {
          hasSavedPayments && <div className={css.fieldWrapper}>
            <div className={cn(css.formField, { [css.fieldError]: false })}>
              <input
                type="checkbox"
                name="isPrimary"
                data-test-id={testId('makeNewPaymentPrimary')}
                id="isPrimary"
                defaultChecked={isPrimary}
                onChange={this.toggleIsPrimary}/>
              <label htmlFor="isPrimary">Use as my default payment</label>
            </div>
          </div>
        }
        <button type="submit" className={css.hiddenBtn}>Submit</button>
      </form>
    );
  };

  render() {
    const { dataIsLoading, hasSavedPayments, isOpen, onCloseCCIVR, showCCIVRPayment } = this.props;
    const { testId } = this.context;

    if (showCCIVRPayment) {
      return !!isOpen && <CCIVRPayment onCloseModalOverlayClick={onCloseCCIVR} />;
    }

    if (hasSavedPayments) {
      const heading = <><span>Add a </span>new payment method</>;
      return (
        <MelodyModal
          className={cn(css.modalContent, { [css.fade]: true })}
          isOpen={isOpen}
          onRequestClose={this.onHideModal}
          heading={heading}
          buttonTestId="closeModal"
        >
          <div className={css.modal} data-test-id={testId('paymentModal')}>
            <div className={css.formWrapper}>
              { this.makeForm() }
            </div>

            <div className={css.footer}>
              <form onSubmit={this.onSavingPayment} action={'tbd'} method="post">
                <button
                  disabled={dataIsLoading}
                  type="button"
                  onClick={this.onHideModal}
                  className={css.cancelBtn}
                  data-test-id={testId('cancelBtn')}>Cancel</button>
                <button
                  disabled={dataIsLoading}
                  type="submit"
                  className={css.addPaymentBtn}
                  data-test-id={testId('savePaymentBtn')}>
                  { dataIsLoading ? 'Saving...' : 'Add this payment method' }
                </button>
              </form>
            </div>
          </div>
        </MelodyModal>
      );
    }

    return (
      <div className={css.inline} data-test-id={testId('paymentModal')}>
        <div>
          <p className={css.header}>
            <span>Add a </span>new payment method
          </p>
        </div>

        <div className={css.formWrapper}>
          { this.makeForm() }
        </div>

        <div>
          <form onSubmit={this.onSavingPayment} action={'tbd'} method="post">
            <button
              disabled={dataIsLoading}
              type="submit"
              className={css.addPaymentBtn}
              data-test-id={testId('savePaymentBtn')}>
              { dataIsLoading ? 'Saving...' : 'Add this payment method' }
            </button>
          </form>
        </div>
      </div>
    );
  }
}

PaymentForm.contextTypes = {
  testId: PropTypes.func
};

PaymentForm.propTypes = {
  payment: PropTypes.object,
  onSubmitPayment: PropTypes.func.isRequired
};

export default PaymentForm;
