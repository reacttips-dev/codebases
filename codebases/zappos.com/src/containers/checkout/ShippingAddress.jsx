import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';

import { isAssigned, triggerAssignment } from 'actions/ab';
import { HYDRA_ADDRESS_AUTO_COMPLETE } from 'constants/hydraTests';
import { CHECKOUT_STEP_MAP, EDIT_ADDRESS_STEP, LIST_ADDRESS_STEP, NEW_ADDRESS_STEP, REVIEW_STEP } from 'constants/checkoutFlow';
import { DIGITAL_GC_ONLY_CART } from 'constants/cartTypes';
import { DIGITAL_DELIVERY_ONLY_MESSAGE } from 'constants/siteMessages';
import {
  configurePurchase,
  onChangeShippingAddressClick,
  onCloseSelectShippingAddressListClick,
  onCloseSuggestedAddressModal,
  onDeleteShipAddressClick,
  onEditAddressClick,
  onFetchLatLong,
  onHideNewShippingAddressModalClick,
  onLoadAddressAutocompleteSuggestions,
  onSelectedShippingAddress,
  onSelectedSuggestedShippingAddress,
  onSendToNewAddressWhenNoSavedAddresses,
  onShowAddNewShippingAddressModalClick,
  onUseShippingAddressClick,
  onUseSuggestedAddressClick,
  onVerifyAddressPageView,
  requestAddresses,
  saveShippingAddress
} from 'store/ducks/checkout/actions';
import {
  clearAddressErrors,
  clearAddressFormItem,
  setAddressFormItem,
  storeTempFailureMsg,
  storeTempSuccessMsg
} from 'store/ducks/address/actions';
import { toFormatted } from 'store/ducks/address/utils';
import { SmallLoader } from 'components/Loader';
import MultiLineAddress from 'components/checkout/address/MultiLineAddress';
import AddressList from 'components/checkout/address/AddressList';
import SectionChangeInline from 'components/checkout/SectionChangeInline';
import SectionCancelInline from 'components/checkout/SectionCancelInline';
import SectionTitle from 'components/checkout/SectionTitle';
import AddressFormWithAutoComplete from 'containers/address/AddressFormWithAutoComplete';
import AddressForm from 'containers/address/AddressForm';
import {
  inIframe,
  isGeneralAddressContstraintPresent,
  isInactiveShippingAddress,
  isMissingShippingDestination,
  isShippableAddress,
  needsValidShippingAddress
} from 'helpers/CheckoutUtils';
import { getCleanPath } from 'helpers/CheckoutFlowControl';
import { isDesktop } from 'helpers/ClientUtils';

import css from 'styles/containers/checkout/shippingAddress.scss';

export class ShippingAddress extends Component {
  state = {
    showAddressModal: false,
    isMobileDevice: false
  };

  componentDidMount = () => {
    const { requestAddresses, setAddressFormItem, location: { pathname, search }, address, triggerAssignment } = this.props;
    const { isLoaded, savedAddresses } = address;
    const isNewAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[NEW_ADDRESS_STEP];
    const isEditAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP];
    const isAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[LIST_ADDRESS_STEP] || isNewAddressStep || isEditAddressStep;
    const { addressId } = queryString.parse(search);
    const isLoadedWithoutAddresses = isLoaded && !savedAddresses.length;

    this.setState({ isMobileDevice: !isDesktop() });

    if (isAddressStep && !isLoaded) {
      requestAddresses();
    }

    if (!inIframe() && (isLoadedWithoutAddresses || isNewAddressStep || isEditAddressStep)) {
      triggerAssignment(HYDRA_ADDRESS_AUTO_COMPLETE);
    }

    if (isNewAddressStep || isEditAddressStep) {
      this.setState({ showAddressModal: true });
    }

    if (isEditAddressStep) {
      const address = (savedAddresses || []).find(
        item => item.addressId === addressId);

      if (address) {
        setAddressFormItem(address);
      }
    }
  };

  componentDidUpdate(prevProps) {
    const { requestAddresses, location: { pathname: prevPathName }, address: { isLoaded: prevIsLoaded, tmpFailureMsg: prevTmpFailureMsg, tmpSuccessMsg: prevTmpSuccessMsg } } = prevProps;
    const {
      onSendToNewAddressWhenNoSavedAddresses,
      clearAddressErrors,
      clearAddressFormItem,
      setAddressFormItem,
      location: { pathname: nextPathName, search: nextSearch },
      address: { isLoaded, savedAddresses, tmpFailureMsg, tmpSuccessMsg },
      storeTempSuccessMsg,
      storeTempFailureMsg,
      triggerAssignment
    } = this.props;
    const { addressId: nextAddressId } = queryString.parse(nextSearch);
    const isNewPath = prevPathName !== nextPathName;
    const isJustLoaded = isLoaded !== prevIsLoaded && isLoaded;
    const isListAddressStep = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[LIST_ADDRESS_STEP];
    const isEditAddressStep = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP];
    const isNewAddressStep = getCleanPath(nextPathName) === CHECKOUT_STEP_MAP[NEW_ADDRESS_STEP];
    const { showAddressModal } = this.state;

    if (tmpSuccessMsg && tmpSuccessMsg !== prevTmpSuccessMsg) {
      setTimeout(storeTempSuccessMsg, 5000);
    }

    if (tmpFailureMsg && tmpFailureMsg !== prevTmpFailureMsg) {
      setTimeout(storeTempFailureMsg, 5000);
    }

    if (isListAddressStep && showAddressModal) {
      this.setState({ showAddressModal: false });
      clearAddressErrors();
      clearAddressFormItem();
    }

    if (isListAddressStep && isJustLoaded && !savedAddresses?.length) {
      onSendToNewAddressWhenNoSavedAddresses();
    }

    if (isEditAddressStep && (isJustLoaded || isNewPath)) {
      const address = (savedAddresses || []).find(
        item => item.addressId === nextAddressId);

      // issue right now as we do not redirect to edit form on invalid address,
      // will tweak once related mafia ticket is live/I get around to adding suggested address support
      if (address) {
        setAddressFormItem(address);
      }

      this.setState({ showAddressModal: true });
    }

    if (isNewAddressStep && (isJustLoaded || isNewPath)) {
      this.setState({ showAddressModal: true });
    }

    if (!inIframe() && (isEditAddressStep || isNewAddressStep) && (isJustLoaded || isNewPath)) {
      triggerAssignment(HYDRA_ADDRESS_AUTO_COMPLETE);
    }

    if (isNewPath && (isListAddressStep || isNewAddressStep || isEditAddressStep) && !isLoaded) {
      requestAddresses();
    }
  }

  showAddNewAddressModal = () => {
    this.props.onShowAddNewShippingAddressModalClick();
  };

  hideAddressModal = () => {
    this.props.onHideNewShippingAddressModalClick();
  };

  onUseAddressClick = e => {
    e.preventDefault();
    const { address: { savedAddresses }, configurePurchase, onUseShippingAddressClick, checkoutData: { selectedAddressId } } = this.props;
    const rowIndex = Array.from(savedAddresses).findIndex(listItem => listItem.addressId === selectedAddressId);
    onUseShippingAddressClick(selectedAddressId, rowIndex);
    configurePurchase({ addressId: selectedAddressId, advanceOnSuccess: true });
  };

  onEditAddressClick = ({ currentTarget: { dataset: { editAddressId, editAddressIndex } } }) => {
    this.props.onEditAddressClick(editAddressId, editAddressIndex);
  };

  onAddressSelected = ({ currentTarget: { dataset: { addressId } } }) => {
    this.props.onSelectedShippingAddress(addressId);
  };

  onCancelSelectSuggested = e => {
    e.preventDefault();
    this.props.clearAddressErrors();
  };

  onSubmitAddress = formAddress => {
    const { address: { formItem }, saveShippingAddress, setAddressFormItem } = this.props;
    const forceOriginal = !!formItem.invalidFields?.length;
    const item = toFormatted(formAddress);
    setAddressFormItem({ ...item, isBilling: false, forceOriginal });
    saveShippingAddress();
  };

  onSaveSuggestedAddress = formAddress => {
    const { saveShippingAddress, setAddressFormItem } = this.props;
    const item = toFormatted(formAddress);
    setAddressFormItem({ ...item, isBilling: false, forceOriginal: true });
    saveShippingAddress();
  };

  onUseSuggestedAddress = (addressType, addressId) => {
    this.props.onUseSuggestedAddressClick(addressType, addressId);
  };

  onSuggestedAddressSelected = (addressId, addressIndex) => {
    this.props.onSelectedSuggestedShippingAddress(addressId, addressIndex);
  };

  onVerifyAddressPageViewEvent = () => {
    this.props.onVerifyAddressPageView();
  };

  onDeleteAddressClick = ({ addressId }) => {
    const doDelete = confirm('Are you sure you wish to delete this address?');
    if (doDelete) {
      this.props.onDeleteShipAddressClick(addressId);
    }
  };

  onLoadAddressAutocompleteSuggestions = ({ near, query, countryCode }) => {
    this.props.onLoadAddressAutocompleteSuggestions({ near, query, countryCode });
  };

  render() {
    const {
      address: { isLoaded: addressDataIsLoaded, isLoading: addressDataIsLoading, savedAddresses = [], tmpFailureMsg, tmpSuccessMsg },
      onCloseSelectShippingAddressListClick,
      onChangeShippingAddressClick,
      checkoutData: {
        canCancelAddress,
        canChangeAddress,
        cartType,
        constraintViolations,
        isLoading: purchaseDataIsLoading,
        formattedPurchaseAddress,
        links,
        purchase: { shippingAddress },
        selectedAddressId
      },
      isAssignedAddressAutoComplete,
      onFetchLatLong
    } = this.props;

    const { location: { pathname } } = this.props;
    const isAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[LIST_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP] || getCleanPath(pathname) === CHECKOUT_STEP_MAP[NEW_ADDRESS_STEP];
    const isEditAddressStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[EDIT_ADDRESS_STEP];
    const { isMobileDevice, showAddressModal } = this.state;
    const isDigitalDeliveryOnly = DIGITAL_GC_ONLY_CART === cartType;
    const { testId } = this.context;

    const errorMessageText = `Your order cannot be shipped to the current address.  Please ${savedAddresses?.length ? 'select or add' : 'add'} a new one.`;
    const isMissingDestination = isMissingShippingDestination(constraintViolations);
    const hasGeneralAddressConstraint = isGeneralAddressContstraintPresent(constraintViolations);
    const needsValidShipping = needsValidShippingAddress(constraintViolations);
    const isAddressShippable = shippingAddress && shippingAddress.countryCode && isShippableAddress(shippingAddress.countryCode);
    const hasAddressAndItIsNotShippable = shippingAddress && !isAddressShippable;
    const hasInactiveShippingAddress = isInactiveShippingAddress(constraintViolations);
    const errorMessage = hasInactiveShippingAddress || hasAddressAndItIsNotShippable || savedAddresses?.length && !hasGeneralAddressConstraint && !isMissingDestination && needsValidShipping
      ? <p className={css.cautionBox} data-test-id={testId('cantUseAddressError')}>{errorMessageText}</p>
      : null;

    const hideCountry = shippingAddress?.countryCode === 'US';
    const editAddressBaseLink = links[EDIT_ADDRESS_STEP];
    const isInline = !savedAddresses?.length;
    const sectionTitle = (<SectionTitle
      isActive={isAddressStep}
      isComplete={true}
      step="1"
      title="Shipping Address"
      id="shipping-address-section" />);
    const sectionCancel = (<SectionCancelInline
      describedby="shipping-address-section"
      to={links[REVIEW_STEP]}
      onClickEvent={onCloseSelectShippingAddressListClick}
      showLink={!purchaseDataIsLoading && canCancelAddress} />);

    if (isAddressStep) {
      return (
        <ul className={css.sectionOpen} data-test-id={testId('shippingSection')}>
          <li>{sectionTitle}</li>
          <li>
          </li>
          <li>
            {
              !addressDataIsLoaded && getCleanPath(pathname) === CHECKOUT_STEP_MAP[LIST_ADDRESS_STEP]
                ? <SmallLoader />
                : <div>
                  { errorMessage }
                  { tmpFailureMsg && <p className={css.failureBox}>{tmpFailureMsg}</p> }
                  { tmpSuccessMsg && <p className={css.successBox}>{tmpSuccessMsg}</p> }
                  <AddressList
                    editAddressBaseLink={editAddressBaseLink}
                    isLoading={purchaseDataIsLoading || addressDataIsLoading}
                    showAddressModal={this.showAddNewAddressModal}
                    savedAddresses={savedAddresses}
                    onAddressSelected={this.onAddressSelected}
                    onUseAddressClick={this.onUseAddressClick}
                    onEditAddressClick={this.onEditAddressClick}
                    selectedAddressId={selectedAddressId}
                    sectionCancel={sectionCancel} />
                  {
                    !inIframe() && isAssignedAddressAutoComplete && isMobileDevice
                      ? <AddressFormWithAutoComplete
                        onFetchLatLong={onFetchLatLong}
                        isBilling={false}
                        isEdit={isEditAddressStep}
                        isInline={isInline}
                        isLoading={purchaseDataIsLoading || addressDataIsLoading}
                        isOpen={showAddressModal}
                        onVerifyAddressPageView={this.onVerifyAddressPageViewEvent}
                        onCancelAddressForm={this.hideAddressModal}
                        onCancelSelectSuggested={this.onCancelSelectSuggested}
                        onCloseSuggestedAddressModal={onCloseSuggestedAddressModal}
                        onDeleteAddressClick={this.onDeleteAddressClick}
                        onSubmitAddress={this.onSubmitAddress}
                        onSaveSuggestedAddress={this.onSaveSuggestedAddress}
                        onUseSuggestedAddressClick={this.onUseSuggestedAddress}
                        onSuggestedAddressSelected={this.onSuggestedAddressSelected}
                        onLoadAddressAutocompleteSuggestions={this.onLoadAddressAutocompleteSuggestions}
                        showDeleteBtn={true} />
                      : <AddressForm
                        isBilling={false}
                        isEdit={isEditAddressStep}
                        isInline={isInline}
                        isLoading={purchaseDataIsLoading || addressDataIsLoading}
                        isOpen={showAddressModal}
                        onVerifyAddressPageView={this.onVerifyAddressPageViewEvent}
                        onCancelAddressForm={this.hideAddressModal}
                        onCancelSelectSuggested={this.onCancelSelectSuggested}
                        onCloseSuggestedAddressModal={onCloseSuggestedAddressModal}
                        onDeleteAddressClick={this.onDeleteAddressClick}
                        onSubmitAddress={this.onSubmitAddress}
                        onSaveSuggestedAddress={this.onSaveSuggestedAddress}
                        onUseSuggestedAddressClick={this.onUseSuggestedAddress}
                        onSuggestedAddressSelected={this.onSuggestedAddressSelected}
                        showDeleteBtn={true} />
                  }
                </div>
            }
          </li>
        </ul>
      );
    }

    return (
      <ul className={css.section} data-test-id={testId('shippingSection')}>
        <li>{sectionTitle}</li>
        <li>
        </li>
        <li className={css.inSectionButton}>
          {
            isDigitalDeliveryOnly
              ? <div>{DIGITAL_DELIVERY_ONLY_MESSAGE}</div>
              : <MultiLineAddress address={formattedPurchaseAddress} hideCountry={hideCountry} hidePhone={true} />
          }
          <div className={css.sectionButtons}>
            <SectionChangeInline
              label="Change Shipping Address"
              describedby="shipping-address-section"
              to={links[LIST_ADDRESS_STEP]}
              onClickEvent={onChangeShippingAddressClick}
              showLink={!purchaseDataIsLoading && canChangeAddress} />
          </div>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  const { address, checkoutData, routing } = state;
  const isAssignedAddressAutoComplete = isAssigned(HYDRA_ADDRESS_AUTO_COMPLETE, 1, state);

  return {
    address,
    checkoutData,
    isAssignedAddressAutoComplete,
    location: routing.locationBeforeTransitions
  };
}

ShippingAddress.contextTypes = {
  testId: PropTypes.func
};

export default connect(mapStateToProps, {
  clearAddressErrors,
  clearAddressFormItem,
  configurePurchase,
  onDeleteShipAddressClick,
  onChangeShippingAddressClick,
  onCloseSuggestedAddressModal,
  onFetchLatLong,
  onHideNewShippingAddressModalClick,
  onLoadAddressAutocompleteSuggestions,
  onSendToNewAddressWhenNoSavedAddresses,
  onShowAddNewShippingAddressModalClick,
  requestAddresses,
  saveShippingAddress,
  setAddressFormItem,
  onCloseSelectShippingAddressListClick,
  onSelectedShippingAddress,
  onSelectedSuggestedShippingAddress,
  onUseShippingAddressClick,
  onVerifyAddressPageView,
  onUseSuggestedAddressClick,
  onEditAddressClick,
  storeTempFailureMsg,
  storeTempSuccessMsg,
  triggerAssignment
})(ShippingAddress);
