import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isInAssignment, triggerAssignment } from 'actions/ab';
import { DIGITAL_GC_ONLY_CART } from 'constants/cartTypes';
import {
  CHECKOUT_STEP_MAP,
  EDIT_BILLING_ADDRESS_STEP,
  NEW_BILLING_ADDRESS_STEP,
  PAYMENT_STEP,
  REVIEW_STEP,
  SELECT_BILLING_ADDRESS_STEP
} from 'constants/checkoutFlow';
import { HYDRA_CHECKOUT_NO_PAYMENT_MSG } from 'constants/hydraTests';
import { SmallLoader } from 'components/Loader';
import SectionChangeInline from 'components/checkout/SectionChangeInline';
import SectionCancelInline from 'components/checkout/SectionCancelInline';
import Payment from 'components/checkout/payment/Payment';
import PaymentForm from 'components/checkout/payment/PaymentForm';
import PaymentList from 'components/checkout/payment/PaymentList';
import SectionTitle from 'components/checkout/SectionTitle';
import ModalAddressList from 'components/checkout/address/ModalAddressList';
import {
  hasInactiveInstrument,
  inIframe,
  isNonRetailOnlyCart,
  needsToReAssociatePaymentToAddressForPayment,
  needsValidBillingAddress
} from 'helpers/CheckoutUtils';
import { getCleanPath } from 'helpers/CheckoutFlowControl';
import {
  configurePurchase,
  onAddNewPaymentClickEvent,
  onApplyPromo,
  onChangeBillingAddressClick,
  onChangePaymentClick,
  onCloseNewPaymentEvent,
  onClosePaymentEvent,
  onRedeemPoints,
  onToggleIsPrimary,
  onTogglePromoBox,
  onUpdateExpiration,
  onUsePaymentMethodClickEvent,
  requestAddresses,
  requestPayments,
  savePaymentInstrument,
  setSelectedPaymentInstrumentId,
  setUsePromoBalance,
  verifyCreditCard
} from 'store/ducks/checkout/actions';
import { clearPaymentFormItem } from 'store/ducks/payment/actions';
import { toFormatted } from 'store/ducks/address/utils';

import css from 'styles/containers/checkout/paymentMethod.scss';

export class PaymentMethod extends Component {
  state = {
    showPaymentModal: false
  };

  componentDidMount = () => {
    const {
      address: { isLoaded: isAddressesLoaded },
      checkoutData: { doesPurchaseRequireCC, selectedPaymentInstrumentId },
      location: { pathname },
      payment,
      requestPayments,
      requestAddresses,
      triggerAssignment
    } = this.props;
    const { isLoaded, savedPayments } = payment;
    const isPaymentStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[PAYMENT_STEP];
    const isBillingStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[SELECT_BILLING_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[NEW_BILLING_ADDRESS_STEP];

    const hasSavedPayments = !!savedPayments?.length;
    if (doesPurchaseRequireCC && hasSavedPayments && (!selectedPaymentInstrumentId || selectedPaymentInstrumentId === 'savedBalance')) {
      const cnpmAssignment = triggerAssignment(HYDRA_CHECKOUT_NO_PAYMENT_MSG);
      if (isInAssignment(cnpmAssignment)) {
        const { savedPayments } = payment;
        this.onPaymentSelected({ paymentInstrumentId: savedPayments[0].paymentInstrumentId });
      }
    }

    if (isBillingStep && !isAddressesLoaded) {
      requestAddresses();
    }

    if (!isPaymentStep) {
      return;
    }

    if (isLoaded && !savedPayments?.length) {
      this.setState({ showPaymentModal: true });
    }

    if (!isLoaded) {
      requestPayments();
    }
  };

  componentDidUpdate(prevProps) {
    const { payment: { isLoaded: prevIsLoaded } } = prevProps;
    const { requestPayments, location: { pathname: nextPathName }, payment, checkoutData } = this.props;
    const { isLoaded, isLoading, savedPayments } = payment;
    const { purchaseCreditCard, selectedPaymentInstrumentId } = checkoutData;
    const isJustLoaded = isLoaded && isLoaded !== prevIsLoaded;
    const isPaymentStep = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[PAYMENT_STEP];
    const hasPurchasePayment = !!purchaseCreditCard;
    const needsPaymentLookup = selectedPaymentInstrumentId && selectedPaymentInstrumentId !== 'savedBalance';
    const { showPaymentModal } = this.state;

    if (!isPaymentStep && showPaymentModal) {
      this.setState({ showPaymentModal: false });
    }

    if (isJustLoaded && !hasPurchasePayment && !savedPayments?.length) {
      this.setState({ showPaymentModal: true });
    }

    if ((isPaymentStep || needsPaymentLookup) && !isLoaded && !isLoading) {
      requestPayments();
    }
  }

  showPaymentModal = () => {
    const { onAddNewPaymentClickEvent } = this.props;
    onAddNewPaymentClickEvent();
    this.setState({ showPaymentModal: true });
  };

  hidePaymentModal = () => {
    const { onCloseNewPaymentEvent, clearPaymentFormItem } = this.props;
    this.setState({ showPaymentModal: false });
    onCloseNewPaymentEvent();
    clearPaymentFormItem();
  };

  onAddCouponClick = coupon => {
    this.props.onApplyPromo();
    this.props.configurePurchase({ coupon, advanceOnSuccess: true });
  };

  onSubmitPayment = newPayment => {
    const { onCloseNewPaymentEvent, savePaymentInstrument } = this.props;
    onCloseNewPaymentEvent();
    savePaymentInstrument({ instrument: newPayment });
  };

  onUsePaymentMethodClick = (e, rowIndex) => {
    e.preventDefault();
    const { configurePurchase, setUsePromoBalance, checkoutData, onUsePaymentMethodClickEvent } = this.props;
    const { doesPurchaseRequireCC, selectedPaymentInstrumentId } = checkoutData;
    const useSavedBalance = selectedPaymentInstrumentId === 'savedBalance';
    const paymentMethods = useSavedBalance ? [] : [
      {
        paymentInstrumentId: selectedPaymentInstrumentId,
        paymentMethodCode: 'CC'
      }
    ];

    if (useSavedBalance) {
      setUsePromoBalance(true);
    } else {
      if (!doesPurchaseRequireCC) {
        setUsePromoBalance(false);
      }
    }

    if (rowIndex) {
      onUsePaymentMethodClickEvent(selectedPaymentInstrumentId, useSavedBalance, rowIndex);
    }
    configurePurchase({ paymentMethods, advanceOnSuccess: true });
  };

  onPaymentSelected = paymentInstrumentId => {
    this.props.setSelectedPaymentInstrumentId(paymentInstrumentId);
  };

  onSavedBalancePaymentSelected = () => {
    this.props.setSelectedPaymentInstrumentId({ paymentInstrumentId: 'savedBalance' });
  };

  onUsePromoBalanceClick = () => {
    const { configurePurchase, setUsePromoBalance, checkoutData: { usePromoBalance } } = this.props;
    setUsePromoBalance(!usePromoBalance);
    configurePurchase({});
  };

  onRedeemRewardsPoints = spendPoints => {
    this.props.onRedeemPoints(spendPoints);
  };

  onUpdateExpirationSubmit = ({ paymentInstrumentId, expirationMonth, expirationYear }) => {
    const { onUpdateExpiration, payment: { savedPayments }, savePaymentInstrument } = this.props;
    const paymentDetails = savedPayments.find(item => item.paymentInstrumentId === paymentInstrumentId) || {};
    const instrument = { ...paymentDetails, expirationMonth, expirationYear };
    const { billingAddress: { addressId } } = paymentDetails;
    onUpdateExpiration();
    savePaymentInstrument({ instrument, addressId });
  };

  onVerifyCardClick = ({ number, paymentInstrumentId }) => {
    this.props.verifyCreditCard({ number, paymentInstrumentId });
  };

  getPaymentCvMessage = () => {
    const { checkoutData: { constraintViolations } } = this.props;

    if (hasInactiveInstrument(constraintViolations)) {
      return 'Inactive payment method. Select a new payment.';
    }

    return;
  };

  render() {
    const { testId } = this.context;
    const {
      payment,
      checkoutData,
      location: { pathname },
      onChangeBillingAddressClick,
      onChangePaymentClick,
      onClosePaymentEvent,
      onToggleIsPrimary
    } = this.props;
    const { formItem, hasVerifyCreditCardError, isLoaded: paymentDataIsLoaded, isLoading: paymentDataIsLoading, savedPayments = [] } = payment;
    const {
      canCancelPayment,
      canChangePayment,
      cartType,
      constraintViolations,
      doesPurchaseRequireCC,
      isLoading: purchaseDataIsLoading,
      links,
      purchase: { eligibleBalances, useDiscount, shippingAddressId },
      purchaseCreditCard,
      purchaseGiftCard: hasPurchaseGiftCard,
      selectedPaymentInstrumentId,
      usePromoBalance,
      usePromoBalanceIsLoading
    } = checkoutData;
    const dataIsLoading = paymentDataIsLoading || purchaseDataIsLoading;
    const { showPaymentModal } = this.state;
    const { couponBalance } = eligibleBalances;
    const isPaymentStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[PAYMENT_STEP];
    const hasPurchasePromoCode = useDiscount && couponBalance;
    const isBillingStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[SELECT_BILLING_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[NEW_BILLING_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_BILLING_ADDRESS_STEP];
    let billingAddress = toFormatted({});
    let selectedPaymentNeedsConfirmation = false;

    if (selectedPaymentInstrumentId && selectedPaymentInstrumentId !== 'savedBalance' && paymentDataIsLoaded) {
      const hasToValidatePayment = needsToReAssociatePaymentToAddressForPayment(constraintViolations, selectedPaymentInstrumentId);
      const paymentDetails = (savedPayments || []).find(item => item.paymentInstrumentId === selectedPaymentInstrumentId) || { billingAddress: {} };
      const { associatedAddress, billingAddress: unFormattedAddress } = paymentDetails;
      billingAddress = toFormatted(unFormattedAddress || {});
      if (associatedAddress?.associated === false || (!associatedAddress && cartType !== DIGITAL_GC_ONLY_CART) || hasToValidatePayment) {
        selectedPaymentNeedsConfirmation = true;
      }
    }

    const errorMessageFromCv = this.getPaymentCvMessage();
    const { addressId: billingAddressId } = billingAddress;
    const isBillingSameAsShipping = billingAddressId === shippingAddressId;
    const doesCartContainGiftCard = isNonRetailOnlyCart(cartType);
    const needsBillingAddress = needsValidBillingAddress(constraintViolations) && !!billingAddressId;
    const hasSavedPayments = !!savedPayments?.length;
    const sectionCancel = (<SectionCancelInline
      describedby="payment-section"
      to={links[REVIEW_STEP]}
      onClickEvent={onClosePaymentEvent}
      showLink={!purchaseDataIsLoading && canCancelPayment} />);
    const showChangeBillingAddressButton = doesPurchaseRequireCC || !!purchaseCreditCard;

    if (isPaymentStep) {
      return (
        <ul className={css.sectionOpen} data-test-id={testId('paymentSectionOpen')}>
          <li><SectionTitle
            isActive={true}
            id="payment-section"
            isComplete={true}
            step="2"
            title="Select Payment" /></li>
          <li>
          </li>
          <li>
            {
              !paymentDataIsLoaded
                ? <SmallLoader />
                : <div>
                  { !!errorMessageFromCv && <div className={css.cvError}>{errorMessageFromCv}</div> }
                  <PaymentList
                    paymentDataIsLoaded={paymentDataIsLoaded}
                    doesPurchaseRequireCC={doesPurchaseRequireCC}
                    eligibleBalances={eligibleBalances}
                    formItem={formItem}
                    hasVerifyCreditCardError={hasVerifyCreditCardError}
                    doesCartContainGiftCard={doesCartContainGiftCard}
                    onAddNewPaymentClick={this.showPaymentModal}
                    onSelectSavedBalancePaymentClick={this.onSavedBalancePaymentSelected}
                    onSelectPaymentClick={this.onPaymentSelected}
                    onUpdateExpirationSubmit={this.onUpdateExpirationSubmit}
                    onUsePaymentMethodClick={this.onUsePaymentMethodClick}
                    onUsePromoBalanceClick={this.onUsePromoBalanceClick}
                    onVerifyCardClick={this.onVerifyCardClick}
                    purchaseDataIsLoading={dataIsLoading}
                    savedPayments={savedPayments}
                    sectionCancel={sectionCancel}
                    selectedPaymentId={selectedPaymentInstrumentId}
                    selectedPaymentNeedsConfirmation={selectedPaymentNeedsConfirmation}
                    showCCIVRPayment={inIframe()}
                    usePromoBalance={usePromoBalance}
                    usePromoBalanceIsLoading={usePromoBalanceIsLoading} />
                  { (showPaymentModal || !hasSavedPayments) && <PaymentForm
                    dataIsLoading={dataIsLoading}
                    formItem={formItem}
                    isOpen={showPaymentModal}
                    hasSavedPayments={hasSavedPayments}
                    onToggleIsPrimary={onToggleIsPrimary}
                    onCancelAddNewPayment={this.hidePaymentModal}
                    onCloseCCIVR={this.hidePaymentModal}
                    onSubmitPayment={this.onSubmitPayment}
                    showCCIVRPayment={inIframe()} />
                  }
                </div>
            }
          </li>
        </ul>
      );
    }

    return (
      <ul className={css.section} data-test-id={testId('paymentSectionClosed')}>
        <li>
          <SectionTitle
            id="payment-section"
            isComplete={true}
            step="2"
            title="Payment Method" />
        </li>
        <li>
        </li>
        <li className={css.inSectionButton}>
          <Payment
            billingAddress={billingAddress}
            hasPurchaseGiftCard={hasPurchaseGiftCard}
            hasPurchasePromoCode={hasPurchasePromoCode}
            isBillingSameAsShipping={isBillingSameAsShipping}
            payment={purchaseCreditCard}
          />

          <div className={css.sectionButtons}>
            <SectionChangeInline
              onClickEvent={onChangePaymentClick}
              label="Change Payment Method"
              describedby="payment-method"
              to={links[PAYMENT_STEP]}
              showLink={!purchaseDataIsLoading && canChangePayment} />
            {
              showChangeBillingAddressButton && <SectionChangeInline
                onClickEvent={onChangeBillingAddressClick}
                label="Change Billing Address"
                describedby="payment-billing-address"
                to={links[SELECT_BILLING_ADDRESS_STEP]}
                showLink={!purchaseDataIsLoading && canChangePayment} />
            }
          </div>

          <ModalAddressList
            isOpen={isBillingStep}
            isBilling={true}
            invalidAddressError={needsBillingAddress && 'Please select or add a new billing address.'} />
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  const { address, checkoutData, killswitch, routing, sharedPayment: payment, sharedRewards: rewards } = state;

  return {
    address,
    killswitch,
    location: routing.locationBeforeTransitions,
    checkoutData,
    payment,
    rewards
  };
}

PaymentMethod.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

export default connect(mapStateToProps, {
  clearPaymentFormItem,
  configurePurchase,
  isInAssignment,
  onAddNewPaymentClickEvent,
  onApplyPromo,
  onChangeBillingAddressClick,
  onChangePaymentClick,
  onCloseNewPaymentEvent,
  onClosePaymentEvent,
  onToggleIsPrimary,
  onTogglePromoBox,
  onRedeemPoints,
  onUpdateExpiration,
  onUsePaymentMethodClickEvent,
  requestAddresses,
  requestPayments,
  savePaymentInstrument,
  setSelectedPaymentInstrumentId,
  setUsePromoBalance,
  triggerAssignment,
  verifyCreditCard
})(PaymentMethod);
