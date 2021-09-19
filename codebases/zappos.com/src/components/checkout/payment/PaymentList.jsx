/* eslint-disable sort-vars */
import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { PAYMENT_FIELDS } from 'constants/formFields';
import { SmallLoader } from 'components/Loader';
import { getMelodyPaymentTypeIcon } from 'components/checkout/CheckoutUtils';
import PaginationBar from 'components/checkout/PaginationBar';
import ReEnterCardText from 'components/checkout/payment/ReEnterCardText';
import ReEnterCardForm from 'components/checkout/payment/ReEnterCardForm';
import { CreditCardExpirationMonth, CreditCardExpirationYear } from 'components/common/CreditCardExpirationField';
import { buildPaginationRange, inIframe } from 'helpers/CheckoutUtils';
import { toUSD } from 'helpers/NumberFormats';
import { isCreditCardExpired } from 'helpers/MyAccountUtils';

import css from 'styles/components/checkout/payment/paymentList.scss';

const NUM_PER_PAGE = 4;

export class PaymentList extends Component {
  state = {
    start: 0,
    isInFrame: false
  };

  componentDidMount = () => {
    const { selectedPaymentId, savedPayments = [] } = this.props;
    const paymentDetails = savedPayments.find(item => item.paymentInstrumentId === selectedPaymentId) || {};
    const { expirationMonth, expirationYear } = paymentDetails;
    this.storeFieldsInState({ paymentInstrumentId: selectedPaymentId, expirationMonth, expirationYear });
    if (inIframe()) {
      this.setState({ isInFrame: true });
    }
  };

  onFieldChange = e => {
    const { target: { name, value } } = e;
    this.setState({ [name]: value });
  };

  nextPage = e => {
    e.preventDefault();
    const { start } = this.state;
    this.setState({ start: start + NUM_PER_PAGE });
  };

  prevPage = e => {
    e.preventDefault();
    const { start } = this.state;
    this.setState({ start: start - NUM_PER_PAGE });
  };

  goToPage = (e, page) => {
    e.preventDefault();
    this.setState({ start: (page - 1) * NUM_PER_PAGE });
  };

  storeFieldsInState = params => {
    this.setState(params);
  };

  onSelectPayment = params => {
    const { onSelectPaymentClick } = this.props;
    this.storeFieldsInState(params);
    onSelectPaymentClick(params);
  };

  onUpdateExpirationSubmit = () => {
    const { onUpdateExpirationSubmit } = this.props;
    onUpdateExpirationSubmit(this.state);
  };

  isErrorField = field => !!this.props.formItem.formErrors?.[field];

  makePaymentRow = params => {
    const { formItem, hasVerifyCreditCardError, selectedPaymentId, selectedPaymentNeedsConfirmation, onUsePaymentMethodClick, onVerifyCardClick, purchaseDataIsLoading, usePromoBalanceIsLoading } = this.props;
    const { payment, rowIndex, visibleStart, visibleEnd } = params;
    const { testId } = this.context;
    const { paymentType, addCreditCardNumber, fullName, expirationMonth: paymentExpirationMonth, expirationYear: paymentExpirationYear, paymentInstrumentId } = payment;
    const { expirationMonth, expirationYear } = this.state;
    const isExpired = isCreditCardExpired(payment);
    const isSelected = selectedPaymentId === paymentInstrumentId;
    const itemStyles = cn(css.item, {
      [css.selected]: isSelected,
      [css.invisible]: !(rowIndex >= visibleStart && rowIndex < visibleEnd),
      [css.withoutFormFields]:  !selectedPaymentNeedsConfirmation && !isExpired
    });
    const { formErrors = {} } = formItem;
    const isExpirationError = this.isErrorField(PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName);

    return (
      <div className={itemStyles} key={paymentInstrumentId}>
        <div className={css.row} data-test-id={testId('paymentRow')}>
          <div className={css.selectionBlock}>
            <input
              checked={isSelected}
              disabled={purchaseDataIsLoading}
              onChange={() => this.onSelectPayment({ paymentInstrumentId, expirationMonth: paymentExpirationMonth, expirationYear: paymentExpirationYear, hasVerifyCreditCardError, index: rowIndex })}
              type="radio"
              id={`payment-${paymentInstrumentId}`}
              name="paymentList" />
            <label htmlFor={`payment-${paymentInstrumentId}`} className={css.paymentOptionWrapper} data-test-id={testId('cardLabel')}>
              <div className={css.payLabelContent}>
                <div className={css.paymentLabel}>
                  <div className={css.endingInRow}>
                    {getMelodyPaymentTypeIcon(paymentType)}
                    <div>
                      <span data-test-id={testId('cardEndingIn')}>Ending in {addCreditCardNumber}</span>
                    </div>
                  </div>
                  <div data-test-id={testId('nameOnCard')}>
                    <span>Name on card:</span> {fullName}
                  </div>
                  <div data-test-id={testId('cardExpiry')}>
                    {
                      isExpired
                        ? <span className={css.expired}>Expired: </span>
                        : <span>Expires: </span>
                    }
                    {paymentExpirationMonth}/{paymentExpirationYear}</div>
                </div>
                {
                  isSelected && !isExpired && !selectedPaymentNeedsConfirmation && <div className={css.actionBar}>
                    <button
                      type="button"
                      className={css.usePaymentMethodBtn}
                      disabled={purchaseDataIsLoading}
                      data-test-id={testId('usePaymentBtn')}
                      onClick={e => onUsePaymentMethodClick(e, rowIndex)}>{ purchaseDataIsLoading && !usePromoBalanceIsLoading ? 'Submitting...' : 'Use this payment method' }</button>
                  </div>
                }
              </div>
            </label>
          </div>
          <div>
            {
              isSelected && isExpired && <div>
                <div className={css.expRow}>
                  <div className={css.fieldWrapper}>
                    <div className={cn(css.formField, { [css.fieldError]: isExpirationError })}>
                      <label htmlFor="expirationMonth">Month</label>
                      <CreditCardExpirationMonth
                        value={expirationMonth || ''}
                        onChange={this.onFieldChange}
                        id="expirationMonth"
                        name="expirationMonth" />
                      { isExpirationError && <div>{formErrors[PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName]}</div> }
                    </div>
                  </div>
                  <div className={css.fieldWrapper}>
                    <div className={cn(css.formField, { [css.fieldError]: isExpirationError })}>
                      <label htmlFor="expirationYear">Year</label>
                      <CreditCardExpirationYear
                        value={expirationYear || ''}
                        onChange={this.onFieldChange}
                        id="expirationYear"
                        name="expirationYear" />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    disabled={purchaseDataIsLoading}
                    className={css.usePaymentBtn}
                    data-test-id={testId('updateExpirationBtn')}
                    onClick={this.onUpdateExpirationSubmit}>Update Card</button>
                </div>
              </div>
            }
            <ReEnterCardText isChecked={isSelected} isExpired={isExpired} selectedPaymentNeedsConfirmation={selectedPaymentNeedsConfirmation} />
            <ReEnterCardForm
              formItem={formItem}
              hasVerifyCreditCardError={hasVerifyCreditCardError}
              isChecked={isSelected}
              isExpired={isExpired}
              onVerifyCardClick={onVerifyCardClick}
              paymentInstrumentId={paymentInstrumentId}
              isLoading={purchaseDataIsLoading}
              selectedPaymentNeedsConfirmation={selectedPaymentNeedsConfirmation} />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      doesCartContainGiftCard,
      savedPayments,
      onAddNewPaymentClick,
      onSelectSavedBalancePaymentClick,
      onUsePaymentMethodClick,
      selectedPaymentId,
      doesPurchaseRequireCC,
      eligibleBalances,
      usePromoBalance,
      onUsePromoBalanceClick,
      paymentDataIsLoaded,
      purchaseDataIsLoading,
      showCCIVRPayment,
      usePromoBalanceIsLoading,
      sectionCancel
    } = this.props;
    const { state: { isInFrame, start }, context: { testId = f => f } } = this;
    const hasSavedPayments = !!savedPayments?.length;
    const hasAvailableBalance = !!eligibleBalances.combinedDiscountBalance;

    if (!paymentDataIsLoaded && !hasAvailableBalance) {
      return <SmallLoader />;
    }

    const visibleStart = start,
      visibleEnd = start + NUM_PER_PAGE,
      numPayments = savedPayments.length,
      currentPage = start / NUM_PER_PAGE + 1,
      showPaginationBar = numPayments > NUM_PER_PAGE,
      isPrevBtnEnabled = start > 1 && numPayments > NUM_PER_PAGE,
      isNextBtnEnabled = start < numPayments - NUM_PER_PAGE && numPayments > NUM_PER_PAGE,
      paginationPages = buildPaginationRange(currentPage, Math.ceil(numPayments / NUM_PER_PAGE));

    if (!hasSavedPayments && !showCCIVRPayment && !hasAvailableBalance) {
      return null;
    }

    return (
      <div className={css.wrapper}>
        <form
          action="/marty/checkout/payment"
          data-test-id={testId('paymentListWrapper')}
          method="POST"
          onSubmit={onUsePaymentMethodClick}>

          { savedPayments.map((payment, rowIndex) => this.makePaymentRow({ payment, rowIndex, visibleStart, visibleEnd })) }

          {
            (hasSavedPayments || isInFrame) && <div className={css.newItemLine}>
              <div className={css.paginationBarWrapper}>
                {
                  showPaginationBar && <PaginationBar
                    paginationLabel="Payment"
                    isPrevBtnEnabled={isPrevBtnEnabled}
                    paginationPages={paginationPages}
                    currentPage={currentPage}
                    isNextBtnEnabled={isNextBtnEnabled}
                    goToPage={this.goToPage}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    showPaginationBar={showPaginationBar} />
                }
              </div>
              <div>
                { sectionCancel }
                <button
                  type="button"
                  className={css.addNewCardBtn}
                  disabled={purchaseDataIsLoading}
                  onClick={onAddNewPaymentClick}
                  data-test-id={testId('addNewCard')}>Add a new card</button>
              </div>
            </div>
          }

          { hasAvailableBalance && <h3 className={cn(css.headerRow, { [css.noSavedPayments]: !hasSavedPayments && !isInFrame })}>Your available balance</h3> }

          { hasAvailableBalance && makeSavedBalanceRow({ doesCartContainGiftCard, doesPurchaseRequireCC, eligibleBalances, onSelectSavedBalancePaymentClick, selectedPaymentId, testId, onUsePaymentMethodClick, onUsePromoBalanceClick, usePromoBalance, purchaseDataIsLoading, usePromoBalanceIsLoading }) }
        </form>
      </div>
    );
  }
}

const makeSavedBalanceRow = ({ doesCartContainGiftCard, doesPurchaseRequireCC, eligibleBalances, onSelectSavedBalancePaymentClick, selectedPaymentId, testId, onUsePaymentMethodClick, onUsePromoBalanceClick, usePromoBalance, purchaseDataIsLoading, usePromoBalanceIsLoading }) => {
  const itemStyles = cn(css.item, {
    [css.selected]: selectedPaymentId === 'savedBalance' && !doesPurchaseRequireCC,
    [css.balanceAsCheckbox]: doesPurchaseRequireCC
  });
  const { combinedDiscountBalance, coupons, gcBalance } = eligibleBalances;
  const savedBalances = gcBalance ? [ ...coupons, { balance: gcBalance, description: 'Gift Card Balance' } ] : coupons;
  const savedBalanceLabel = cn({ [css.paymentLabel]: !doesPurchaseRequireCC });
  const disableToggle = doesCartContainGiftCard && !!gcBalance && savedBalances.length === 1;

  return (
    <>
      { doesCartContainGiftCard && !!gcBalance && <p className={css.cautionBox}>Gift cards cannot be applied to order with gift cards.</p> }
      <div className={itemStyles}>
        <div className={css.row}>
          <div className={css.selectionBlock}>
            {
              doesPurchaseRequireCC
                ? <input
                  data-test-id={testId('usePromoBalanceCheckbox')}
                  checked={disableToggle ? false : usePromoBalance}
                  disabled={disableToggle || purchaseDataIsLoading}
                  id="payment-savedBalance"
                  name="payment-savedBalance"
                  onChange={onUsePromoBalanceClick}
                  type="checkbox" />
                : <input
                  checked={selectedPaymentId === 'savedBalance'}
                  data-test-id={testId('usePromoBalanceRadio')}
                  disabled={disableToggle || purchaseDataIsLoading}
                  id="payment-savedBalance"
                  name="paymentList"
                  onChange={onSelectSavedBalancePaymentClick}
                  type="radio" />
            }
            <label htmlFor="payment-savedBalance" className={css.paymentOptionWrapper}>
              <div className={savedBalanceLabel}>
                {
                  usePromoBalanceIsLoading
                    ? 'Updating...'
                    : <ul className={css.balances}>
                      <li>Use your {toUSD(combinedDiscountBalance)} gift card or promotional balance:</li>
                      {
                        savedBalances.map(balance => {
                          const { amountUsed, balance: displayBalance, claimCode, description } = balance;
                          return (<li key={`${claimCode}-${description}`}>
                            { amountUsed && toUSD(amountUsed) } { displayBalance && toUSD(displayBalance) } { description }
                          </li>);
                        })
                      }
                    </ul>
                }
              </div>
            </label>
          </div>
          <div>
            {
              !doesPurchaseRequireCC && selectedPaymentId === 'savedBalance' && <button
                type="button"
                className={css.usePaymentBtn}
                data-test-id={testId('useSavedBalanceBtn')}
                disabled={purchaseDataIsLoading}
                onClick={e => onUsePaymentMethodClick(e, 0)}>{ purchaseDataIsLoading ? 'Submitting' : 'Use saved balance'}</button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

PaymentList.contextTypes = {
  testId: PropTypes.func
};

export default PaymentList;
