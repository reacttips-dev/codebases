import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  CHECKOUT_STEP_MAP,
  EDIT_ADDRESS_STEP,
  EDIT_BILLING_ADDRESS_STEP,
  NEW_BILLING_ADDRESS_STEP,
  SELECT_BILLING_ADDRESS_STEP
} from 'constants/checkoutFlow';
import {
  onAddNewBillingAddressFromModalAddressListClick,
  onAddNewShippingAddressFromModalAddressListClick,
  onCloseAddressModal,
  onCloseSuggestedAddressModal,
  onHideBillingAddressFormModalFromModalAddressListClick,
  onHideBillingAddressModalClick,
  onHideShippingAddressFormModalFromModalAddressListClick,
  onSelectedBillingAddress,
  onSelectedShippingAddress,
  onSelectedSuggestedBillingAddress,
  onSelectedSuggestedShippingAddress,
  onUseBillingAddressClick,
  onUseNewBillingAddressClick,
  onUseSuggestedAddressClick,
  onVerifyAddressPageView,
  requestAddresses,
  requestPayments,
  saveBillingAddress,
  savePaymentInstrument,
  saveShippingAddress,
  setSelectedAddressId
} from 'store/ducks/checkout/actions';
import {
  clearAddressErrors,
  clearAddressFormItem,
  setAddressFormItem
} from 'store/ducks/address/actions';
import AddressList from 'components/checkout/address/AddressList';
import MelodyModal from 'components/common/MelodyModal';
import AddressForm from 'containers/address/AddressForm';
import { getCleanPath } from 'helpers/CheckoutFlowControl';
import { toFormatted } from 'store/ducks/address/utils';

import css from 'styles/components/checkout/address/modalAddressList.scss';

export class ModalAddressList extends Component {
  state = {
    showAddressModal: false
  };

  componentDidUpdate = prevProps => {
    const {
      clearAddressErrors,
      clearAddressFormItem,
      requestAddresses,
      requestPayments,
      location: { pathname: nextPathName },
      address,
      checkoutData,
      payment,
      setSelectedAddressId
    } = this.props;
    const { location: { pathname: prevPathname }, payment: { isLoaded: isPrevPaymentDataLoaded } } = prevProps;
    const { isLoaded: isAddressesLoaded, isLoading: isAddressesLoading } = address;
    const { isLoaded: isPaymentDataLoaded, isLoading: isPaymentDataLoading, savedPayments = [] } = payment;
    const isSelectBilling = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[SELECT_BILLING_ADDRESS_STEP];
    const isNewAddressStep = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[NEW_BILLING_ADDRESS_STEP];
    const isNewPath = prevPathname !== nextPathName;
    const paymentsJustLoaded = isPaymentDataLoaded && isPaymentDataLoaded !== isPrevPaymentDataLoaded;
    const { showAddressModal } = this.state;

    if ((paymentsJustLoaded || isNewPath) && isSelectBilling) {
      const { purchaseCreditCard: { paymentInstrumentId } } = checkoutData;
      if (paymentInstrumentId && paymentInstrumentId !== 'savedBalance' && isPaymentDataLoaded) {
        const paymentDetails = savedPayments.find(item => item.paymentInstrumentId === paymentInstrumentId) || { billingAddress: {} };
        const addressId = paymentDetails.billingAddress?.addressId;
        if (addressId) {
          setSelectedAddressId(addressId);
        }
      }
    }

    if (!isNewAddressStep && showAddressModal) {
      this.setState({ showAddressModal: false });
      clearAddressErrors();
      clearAddressFormItem();
    }

    if (!isPaymentDataLoaded && !isPaymentDataLoading && isSelectBilling) {
      requestPayments();
    }

    if (!isAddressesLoaded && !isAddressesLoading && isSelectBilling) {
      requestAddresses();
    }

    if (isNewAddressStep && (isNewPath || paymentsJustLoaded)) {
      this.setState({ showAddressModal: true });
    }
  };

  onHideModal = () => {
    const { isBilling, onCloseAddressModal, onHideBillingAddressModalClick } = this.props;
    onCloseAddressModal(isBilling);
    onHideBillingAddressModalClick();
  };

  onUseAddressClick = e => {
    e.preventDefault();
    const { address: { savedAddresses }, isBilling, savePaymentInstrument, onUseBillingAddressClick, checkoutData: { selectedAddressId, purchaseCreditCard } } = this.props;
    const rowIndex = Array.from(savedAddresses).findIndex(listItem => listItem.addressId === selectedAddressId);

    if (isBilling) {
      onUseBillingAddressClick(selectedAddressId, rowIndex);
    }
    savePaymentInstrument({ instrument: purchaseCreditCard, addressId: selectedAddressId, updatingAddress: true });
  };

  onAddressSelected = ({ currentTarget: { dataset: { addressId } } }) => {
    const { isBilling, onSelectedBillingAddress, onSelectedShippingAddress } = this.props;
    isBilling ? onSelectedBillingAddress(addressId) : onSelectedShippingAddress(addressId);
  };

  onSubmitAddress = formAddress => {
    const { isBilling, onUseNewBillingAddressClick, address: { formItem }, saveShippingAddress, saveBillingAddress, setAddressFormItem } = this.props;
    const addressToFormat = isBilling ? { ...formAddress, isPrimary: false } : formAddress;
    const forceOriginal = !!formItem.invalidFields?.length;
    const item = toFormatted(addressToFormat);
    if (isBilling) {
      onUseNewBillingAddressClick();
    }
    setAddressFormItem({ ...item, isBilling, forceOriginal });
    isBilling ? saveBillingAddress() : saveShippingAddress();
  };

  onCancelSelectSuggested = () => {
    this.props.clearAddressErrors();
  };

  onSaveSuggestedAddress = formAddress => {
    const { isBilling, saveBillingAddress, saveShippingAddress, setAddressFormItem } = this.props;
    // TODO: if "editing" should pull if primary from store - this case doesn't currently exist for the modal
    const addressToFormat = isBilling ? { ...formAddress, isPrimary: false } : formAddress;
    const item = toFormatted(addressToFormat);
    setAddressFormItem({ ...item, isBilling, forceOriginal: true });
    isBilling ? saveBillingAddress() : saveShippingAddress();
  };

  onUseSuggestedAddress = (addressType, selectedAddressId) => {
    this.props.onUseSuggestedAddressClick(addressType, selectedAddressId);
  };

  onSuggestedAddressSelected = (addressId, addressIndex) => {
    const { isBilling, onSelectedSuggestedBillingAddress, onSelectedSuggestedShippingAddress } = this.props;
    isBilling ? onSelectedSuggestedBillingAddress(addressId, addressIndex) : onSelectedSuggestedShippingAddress(addressId, addressIndex);
  };

  showAddNewAddressModal = () => {
    const { isBilling, onAddNewBillingAddressFromModalAddressListClick, onAddNewShippingAddressFromModalAddressListClick } = this.props;
    if (isBilling) {
      onAddNewBillingAddressFromModalAddressListClick();
    } else {
      onAddNewShippingAddressFromModalAddressListClick();
    }
  };

  hideAddressFormModal = () => {
    const { isBilling, onHideBillingAddressFormModalFromModalAddressListClick, onHideShippingAddressFormModalFromModalAddressListClick } = this.props;
    if (isBilling) {
      onHideBillingAddressFormModalFromModalAddressListClick();
    } else {
      onHideShippingAddressFormModalFromModalAddressListClick();
    }
  };
  onVerifyAddressPageViewEvent = () => {
    this.props.onVerifyAddressPageView();
  };

  render() {
    const {
      isBilling = false,
      isOpen,
      onCloseSuggestedAddressModal
    } = this.props;

    const {
      address: { savedAddresses = [], isLoading: addressDataIsLoading },
      invalidAddressError,
      payment: { isLoading: isPaymentDataLoading },
      checkoutData: {
        isLoading: purchaseDataIsLoading,
        selectedAddressId
      }
    } = this.props;

    const { location: { pathname } } = this.props;
    const { testId = f => f } = this.context;
    const addressType = isBilling ? 'billing' : 'shipping';
    const isEditAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_BILLING_ADDRESS_STEP];
    const { showAddressModal } = this.state;
    const isLoading = purchaseDataIsLoading || addressDataIsLoading || isPaymentDataLoading;

    if (showAddressModal) {
      return (
        <AddressForm
          isBilling={isBilling}
          isEdit={isEditAddressStep}
          isLoading={isLoading}
          isOpen={showAddressModal}
          onVerifyAddressPageView={this.onVerifyAddressPageViewEvent}
          onCancelAddressForm={this.hideAddressFormModal}
          onCancelSelectSuggested={this.onCancelSelectSuggested}
          onSubmitAddress={this.onSubmitAddress}
          onCloseSuggestedAddressModal={onCloseSuggestedAddressModal}
          onUseSuggestedAddressClick={this.onUseSuggestedAddress}
          onSaveSuggestedAddress={this.onSaveSuggestedAddress}
          onSuggestedAddressSelected={this.onSuggestedAddressSelected} />
      );
    }

    return (
      <MelodyModal
        className={cn(css.modalContent, { [css.fade]: true })}
        isOpen={isOpen}
        onRequestClose={this.onHideModal}
        heading={`Choose a ${addressType} address`}
        buttonTestId="closeModal"
      >
        <div className={css.modal} data-test-id={testId('addressListModal')}>
          <div className={css.formWrapper}>
            <AddressList
              isBilling={isBilling}
              isLoading={isLoading}
              invalidAddressError={invalidAddressError}
              showAddressModal={this.showAddNewAddressModal}
              savedAddresses={savedAddresses}
              onAddressSelected={this.onAddressSelected}
              onUseAddressClick={this.onUseAddressClick}
              selectedAddressId={selectedAddressId} />
          </div>

          <div className={css.footer}>
            <form action={'tbd'} method="post">
              <button
                type="button"
                disabled={!!invalidAddressError || isLoading}
                onClick={this.onHideModal}
                className={css.cancelBtn}
                data-test-id={testId('cancelBtn')}>Cancel</button>
            </form>
          </div>

        </div>
      </MelodyModal>
    );
  }
}

function mapStateToProps({ address, checkoutData, sharedPayment: payment, routing }) {
  return {
    address,
    checkoutData,
    payment,
    location: routing.locationBeforeTransitions
  };
}

ModalAddressList.contextTypes = {
  testId: PropTypes.func
};

export default connect(mapStateToProps, {
  clearAddressErrors,
  clearAddressFormItem,
  onAddNewBillingAddressFromModalAddressListClick,
  onAddNewShippingAddressFromModalAddressListClick,
  onCloseAddressModal,
  onHideBillingAddressFormModalFromModalAddressListClick,
  onHideBillingAddressModalClick,
  onHideShippingAddressFormModalFromModalAddressListClick,
  requestAddresses,
  requestPayments,
  saveBillingAddress,
  savePaymentInstrument,
  saveShippingAddress,
  setAddressFormItem,
  setSelectedAddressId,
  onSelectedBillingAddress,
  onSelectedShippingAddress,
  onSelectedSuggestedBillingAddress,
  onSelectedSuggestedShippingAddress,
  onCloseSuggestedAddressModal,
  onUseBillingAddressClick,
  onUseNewBillingAddressClick,
  onUseSuggestedAddressClick,
  onVerifyAddressPageView
})(ModalAddressList);
