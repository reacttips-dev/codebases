import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { deepEqual } from 'fast-equals';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

import { AriaLiveTee } from 'components/common/AriaLive';
import {
  onHasLoadedAacSuggestions,
  onHasSelectedAacSuggestion,
  onSawAddressFormWithAac,
  onToggleIsAlsoBilling,
  storeEditOfInactiveAddressError
} from 'store/ducks/address/actions';
import { ADDRESS_FIELDS } from 'constants/formFields';
import { CountryList } from 'components/common/CountryList';
import MelodyModal from 'components/common/MelodyModal';
import MultiLineAddress from 'components/checkout/address/MultiLineAddress';
import HighlightedAddress from 'components/checkout/address/HighlightedAddress';
import { inIframe } from 'helpers/CheckoutUtils';
import { toFormatted } from 'store/ducks/address/utils';

import css from 'styles/containers/address/addressFormWithAutoComplete.scss';
import { header } from 'styles/components/common/modal.scss';
import { suggestedAddressHighlight } from 'styles/components/checkout/address/highlightedAddress.scss';
// eslint-disable-next-line css-modules/no-unused-class
import theme from 'styles/containers/address/addressFormWithAutoCompleteTheme.scss';

const initialState = {
  addressId: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  countryCode: 'US',
  fullName: '',
  postalCode: '',
  primaryVoiceNumber: '',
  stateOrRegion: '',
  isPrimary: true,
  formErrors: {},
  selectedAddressId: 0,
  hasLoadedSuggestions: false
};

function renderSuggestion({ number, street, city, state, countryCode }) {
  let address = '';
  if (number && street) {
    address += `${number} ${street}, `;
  }

  if (city) {
    address += `${city} `;
  }
  address += `${state}, ${countryCode}`;
  return address;
}

export class AddressFormWithAutoComplete extends Component {
  state = initialState;

  componentDidMount() {
    const { isInline, address: { isAlsoBilling, savedAddresses }, onSawAddressFormWithAac, isOpen, onFetchLatLong, geoLocation } = this.props;
    if (!savedAddresses.length && isInline && !isAlsoBilling) {
      this.toggleIsAlsoBilling();
    }

    onFetchLatLong(geoLocation);

    if (isOpen) {
      onSawAddressFormWithAac();
    }
  }

  componentDidUpdate(prevProps) {
    const { address: { formItem: prevFormItem }, isOpen: prevIsOpen } = prevProps;
    const { address: { formItem: nextFormItem }, isOpen, onSawAddressFormWithAac } = this.props;
    const { formErrors: prevFormErrors = {} } = prevFormItem;
    const { formErrors: nextFormErrors = {} } = nextFormItem;

    if (isOpen && isOpen !== prevIsOpen) {
      onSawAddressFormWithAac();
    }

    if (!deepEqual(prevFormErrors, nextFormErrors)) {
      this.setState({ formErrors: nextFormErrors });
    }

    if (!deepEqual(prevFormItem, nextFormItem) && nextFormItem.hasOwnProperty('mailingAddress')) {
      const {
        addressId,
        mailingAddress,
        name: { fullName },
        phone: {
          voice: {
            primary: {
              number
            }
          }
        }
      } = nextFormItem;

      this.setState({ addressId, ...mailingAddress, fullName, primaryVoiceNumber: number });
    }

    if (!deepEqual(prevFormItem, nextFormItem) && deepEqual(nextFormItem, {})) {
      this.setState(initialState);
    }
  }

  toggleIsAlsoBilling = () => {
    const { address: { isAlsoBilling }, onToggleIsAlsoBilling } = this.props;
    onToggleIsAlsoBilling(!isAlsoBilling);
  };

  onSetSelected = (selectedAddressId, rowIndex) => {
    const { onSuggestedAddressSelected } = this.props;
    this.setState({ selectedAddressId });
    onSuggestedAddressSelected && (selectedAddressId === 'original' ? onSuggestedAddressSelected(selectedAddressId, rowIndex) : onSuggestedAddressSelected('suggested', rowIndex));
  };

  onDeleteAddress = () => {
    const { isBilling = false, onDeleteAddressClick, storeEditOfInactiveAddressError } = this.props;
    const { addressId } = this.state;
    storeEditOfInactiveAddressError(false);
    onDeleteAddressClick({ addressId, isBilling });
  };

  onFieldChange = e => {
    const { target: { name, value } } = e;
    this.setState({ [name]: value });
  };

  onSavingSuggestedAddress = e => {
    e.preventDefault();
    const { addressId, selectedAddressId } = this.state;
    const { isBilling, address: { formItem: { suggestedAddresses } }, onSaveSuggestedAddress, onUseSuggestedAddressClick } = this.props;

    let address = {};

    if (selectedAddressId === 'original') {
      address = this.state;
    } else {
      const { mailingAddress } = suggestedAddresses[selectedAddressId];
      const { fullName, isPrimary, primaryVoiceNumber } = this.state;
      address = { addressId, ...mailingAddress, fullName, isPrimary, primaryVoiceNumber };
    }
    onUseSuggestedAddressClick && (isBilling ? onUseSuggestedAddressClick(1, selectedAddressId) : onUseSuggestedAddressClick(2, selectedAddressId)); // event tracking
    onSaveSuggestedAddress(address);
  };

  onSavingAddress = e => {
    e.preventDefault();
    this.props.onSubmitAddress(this.state);
  };

  toggleIsPrimary = () => {
    const { isPrimary } = this.state;
    this.setState({ isPrimary: !isPrimary });
  };

  onHideModal = () => {
    const { onCancelAddressForm, storeEditOfInactiveAddressError } = this.props;
    this.setState(initialState);
    onCancelAddressForm();
    storeEditOfInactiveAddressError(false);
  };

  isInvalidField = field => {
    const { address: { formItem: { invalidFields } } } = this.props;
    return !!(invalidFields || []).find(row => row.fieldName?.search(field) > 0);
  };

  isErrorField = field => {
    const { formErrors } = this.state;
    return formErrors.hasOwnProperty(field);
  };

  hasError(field) {
    return this.isErrorField(field) || this.isInvalidField(field);
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  loadSuggestions(query) {
    const { hasLoadedSuggestions } = this.state;
    const { address: { latLong }, onHasLoadedAacSuggestions, onLoadAddressAutocompleteSuggestions } = this.props;
    const countryCode = 'US';

    if (!hasLoadedSuggestions) {
      onHasLoadedAacSuggestions();
      this.setState({ hasLoadedSuggestions: true });
    }

    if (query.length > 2) {
      onLoadAddressAutocompleteSuggestions({ query, near: latLong, countryCode });
    }
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (_event, { suggestion }) => {
    const {
      number,
      street,
      city,
      stateCode,
      countryCode,
      postalCode
    } = suggestion;

    const {
      onHasSelectedAacSuggestion
    } = this.props;

    const addressLine1 = `${number} ${street}`;

    this.setState({ addressLine1 });
    this.setState({ countryCode });
    this.setState({ city });
    this.setState({ stateOrRegion: stateCode });
    this.setState({ postalCode });

    onHasSelectedAacSuggestion();
  };

  getSuggestionValue = ({ number, street }) => `${number} ${street}`;

  makeModalSuggested() {
    const { isBilling = false, onCancelSelectSuggested } = this.props;
    const { testId } = this.context;
    const addressType = isBilling ? 'billing' : 'shipping';

    return (
      <div className={css.modal} data-test-id={testId('addressModal')}>
        <div className={header}>
          <p className={css.header}>
            Verify {addressType} address
          </p>
        </div>

        <div className={css.formWrapper}>
          { this.makeSuggestedForm() }
        </div>

        <div className={css.footer}>
          <button
            type="button"
            onClick={onCancelSelectSuggested}
            className={css.cancelBtn}
            data-test-id={testId('cancelBtn')}>Cancel</button>
        </div>
      </div>
    );
  }

  makeSuggestedForm = () => {
    const { address: { formItem: { suggestedAddresses } }, isBilling = false, isLoading, onVerifyAddressPageView } = this.props;
    const { testId } = this.context;
    const {
      countryCode,
      fullName,
      primaryVoiceNumber,
      selectedAddressId
    } = this.state;
    const originalAddress = { ...toFormatted(this.state), selectedAddressId: 'original' };
    const useAddressMsg = isBilling ? 'Bill to this address' : 'Ship to this address';
    const useAddressBtn = (
      <button
        className={css.useAddressBtn}
        disabled={isLoading}
        onClick={this.onSavingSuggestedAddress}
        type="submit"
        data-test-id={testId('useAddressBtn')}>{isLoading ? 'Submitting...' : useAddressMsg}</button>
    );

    onVerifyAddressPageView();

    return (
      <form
        action="/address"
        method="POST"
        onSubmit={this.onSavingAddress}>
        <p>
          Our system has a few <span className={suggestedAddressHighlight}>suggestions</span> regarding this address. Please choose which version of the address is more accurate.
        </p>
        <div>
          <div className={css.suggestedTitle}>Original Address:</div>
          {
            <div className={cn(css.item, { [css.selected]: selectedAddressId === 'original' })}>
              <div className={css.row}>
                <div className={css.selectionBlock}>
                  <input
                    checked={selectedAddressId === 'original'}
                    disabled={isLoading}
                    onChange={() => this.onSetSelected('original', 0)}
                    type="radio"
                    id="original"
                    name="original" />

                  <label htmlFor="original" className={css.addressOptionsWrapper}>
                    <MultiLineAddress address={originalAddress} hideCountry={countryCode === 'US'} hidePhone={true} />
                  </label>
                </div>
                { selectedAddressId === 'original' && useAddressBtn }
              </div>
            </div>
          }
        </div>
        <div>
          <div className={css.suggestedTitle}>Suggested Address:</div>
          {
            suggestedAddresses.map((address, rowIndex) => {
              const { mailingAddress: { countryCode } } = address;
              const addressId = rowIndex;
              const decoratedAddress = {
                ...address,
                selectedAddressId: addressId,
                name: { fullName },
                phone: { voice: { primary: { number: primaryVoiceNumber } } }
              };
              const itemStyles = cn(css.item, { [css.selected]: selectedAddressId === addressId });
              return (
                <div key={addressId} className={itemStyles}>
                  <div className={css.row}>
                    <div className={css.selectionBlock}>
                      <input
                        checked={selectedAddressId === addressId}
                        disabled={isLoading}
                        onChange={() => this.onSetSelected(addressId, rowIndex + 1)}
                        type="radio"
                        id={`address-${addressId}`}
                        name={`address-${addressId}`} />
                      <label htmlFor={`address-${addressId}`} className={css.addressOptionsWrapper}>
                        <HighlightedAddress
                          address={decoratedAddress}
                          baseAddress={originalAddress}
                          hideCountry={countryCode === 'US'} />
                      </label>
                    </div>
                    { selectedAddressId === addressId && useAddressBtn }
                  </div>
                </div>
              );
            })
          }
        </div>
      </form>
    );
  };

  makeInlineSuggested() {
    const { isBilling = false, onCancelSelectSuggested } = this.props;
    const { testId } = this.context;
    const addressType = isBilling ? 'billing' : 'shipping';

    return (
      <div className={css.inline} data-test-id={testId('addressModal')}>
        <p className={css.header}>
            Verify {addressType} address
        </p>

        <div className={css.formWrapper}>
          { this.makeSuggestedForm() }
        </div>

        <div className={css.inlineFooter}>
          <form onSubmit={onCancelSelectSuggested} action="/address" method="post">
            <button
              type="button"
              onClick={onCancelSelectSuggested}
              className={css.cancelBtn}
              data-test-id={testId('cancelBtn')}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }

  makeForm = () => {
    const {
      address: {
        isAlsoBilling,
        isEditOfInactiveAddressError,
        formItem: { invalidFields },
        savedAddresses,
        autoCompleteSuggestions = []
      },
      isBilling = false
    } = this.props;
    const { testId } = this.context;
    const {
      addressLine1,
      addressLine2,
      city,
      countryCode,
      fullName,
      postalCode,
      primaryVoiceNumber,
      stateOrRegion,
      isPrimary,
      formErrors
    } = this.state;
    const disableAutoComplete = inIframe();

    const inputProps = {
      'value': addressLine1 || '',
      'maxLength':ADDRESS_FIELDS.ADDRESS_LINE_1.maxLength,
      'onChange':this.onFieldChange,
      'id': ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName,
      'name': ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName,
      'placeholder': 'Street address, company name, c/o',
      'data-test-id': testId('addressLine1'),
      'required':true
    };

    return (
      <form
        action="/address"
        method="POST"
        onSubmit={this.onSavingAddress}>
        <AriaLiveTee role="alert">
          {
            !!invalidFields?.length && <p className={css.cautionBox} data-test-id={testId('addressInvalidError')}>
              It seems we are unable to determine if the address is valid or not.  If you are sure of your entry please try submitting again.
            </p>
          }
          {
            isEditOfInactiveAddressError && <p className={css.cautionBox}>
            This address is not active and cannot be edited.
            </p>
          }
        </AriaLiveTee>

        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.COUNTRY_CODE.fieldName) })}>
            <label htmlFor={ADDRESS_FIELDS.COUNTRY_CODE.fieldName}>Country</label>
            <CountryList
              defaultValue={countryCode || 'US'}
              autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.COUNTRY_CODE.autoComplete}
              isBilling={isBilling}
              onChange={this.onFieldChange}
              maxLength={ADDRESS_FIELDS.COUNTRY_CODE.maxLength}
              id={ADDRESS_FIELDS.COUNTRY_CODE.fieldName}
              name={ADDRESS_FIELDS.COUNTRY_CODE.fieldName} />
            { this.hasError(ADDRESS_FIELDS.COUNTRY_CODE.fieldName) && <div>{formErrors[ADDRESS_FIELDS.COUNTRY_CODE.fieldName]}</div> }
          </div>
        </div>

        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.FULL_NAME.fieldName) })}>
            <label htmlFor={ADDRESS_FIELDS.FULL_NAME.fieldName}>Full Name</label>
            <input
              autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.FULL_NAME.autoComplete}
              autoCorrect="off"
              maxLength={ADDRESS_FIELDS.FULL_NAME.maxLength}
              onChange={this.onFieldChange}
              value={fullName || ''}
              id={ADDRESS_FIELDS.FULL_NAME.fieldName}
              name={ADDRESS_FIELDS.FULL_NAME.fieldName}
              data-test-id={testId('addressName')}
              required={true}
              placeholder="First and last name" />
            { this.hasError(ADDRESS_FIELDS.FULL_NAME.fieldName) && <div>{formErrors[ADDRESS_FIELDS.FULL_NAME.fieldName]}</div> }
          </div>
        </div>

        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName) })}>
            <label htmlFor={ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName}>Address Line 1</label>
            <Autosuggest
              theme={theme}
              suggestions={autoCompleteSuggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionSelected={this.onSuggestionSelected}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps} />
            { this.hasError(ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName) && <div>{formErrors[ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName]}</div> }
          </div>
        </div>

        <div className={css.fieldWrapper}>
          <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName) })}>
            <label htmlFor={ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName}>Address Line 2</label>
            <input
              autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.ADDRESS_LINE_2.autoComplete}
              autocorrect="off"
              maxLength={ADDRESS_FIELDS.ADDRESS_LINE_2.maxLength}
              onChange={this.onFieldChange}
              value={addressLine2 || ''}
              id={ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName}
              name={ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName}
              data-test-id={testId('addressLine2')}
              required={false}
              placeholder="Apartment, suite, unit, building, floor, etc" />
            { this.hasError(ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName) && <div>{formErrors[ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName]}</div> }
          </div>
        </div>

        <div className={css.stateRow}>
          <div className={cn(css.fieldWrapper, css.city)}>
            <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.CITY.fieldName) })}>
              <label htmlFor={ADDRESS_FIELDS.CITY.fieldName}>City</label>
              <input
                autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.CITY.autoComplete}
                autocorrect="off"
                maxLength={ADDRESS_FIELDS.CITY.maxLength}
                onChange={this.onFieldChange}
                value={city || ''}
                id={ADDRESS_FIELDS.CITY.fieldName}
                name={ADDRESS_FIELDS.CITY.fieldName}
                data-test-id={testId('addressCity')}
                required={true}
                placeholder="eg. Las Vegas" />
              { this.hasError(ADDRESS_FIELDS.CITY.fieldName) && <div>{formErrors[ADDRESS_FIELDS.CITY.fieldName]}</div> }
            </div>
          </div>

          <div className={cn(css.fieldWrapper, css.state)}>
            <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.STATE_OR_REGION.fieldName) })}>
              <label htmlFor={ADDRESS_FIELDS.STATE_OR_REGION.fieldName}>State</label>
              <input
                autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.STATE_OR_REGION.autoComplete}
                autocorrect="off"
                maxLength={ADDRESS_FIELDS.STATE_OR_REGION.maxLength}
                onChange={this.onFieldChange}
                value={stateOrRegion || ''}
                id={ADDRESS_FIELDS.STATE_OR_REGION.fieldName}
                name={ADDRESS_FIELDS.STATE_OR_REGION.fieldName}
                data-test-id={testId('addressState')}
                required={true}
                placeholder="eg. Nevada" />
              { this.hasError(ADDRESS_FIELDS.STATE_OR_REGION.fieldName) && <div>{formErrors[ADDRESS_FIELDS.STATE_OR_REGION.fieldName]}</div> }
            </div>
          </div>

          <div className={cn(css.fieldWrapper, css.zip)}>
            <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.POSTAL_CODE.fieldName) })}>
              <label htmlFor={ADDRESS_FIELDS.POSTAL_CODE.fieldName}>Zip</label>
              <input
                autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.POSTAL_CODE.autoComplete}
                autocorrect="off"
                maxLength={ADDRESS_FIELDS.POSTAL_CODE.maxLength}
                onChange={this.onFieldChange}
                value={postalCode || ''}
                id={ADDRESS_FIELDS.POSTAL_CODE.fieldName}
                name={ADDRESS_FIELDS.POSTAL_CODE.fieldName}
                data-test-id={testId('addressPostalCode')}
                required={true}
                placeholder="eg. 89101" />
              { this.hasError(ADDRESS_FIELDS.POSTAL_CODE.fieldName) && <div data-test-id={testId('postalCodeError')}>{formErrors[ADDRESS_FIELDS.POSTAL_CODE.fieldName]}</div> }
            </div>
          </div>
        </div>

        <div className={cn(css.fieldWrapper, css.phone)}>
          <div className={cn(css.formField, { [css.fieldError]: this.hasError(ADDRESS_FIELDS.PHONE_NUMBER.fieldName) })}>
            <label htmlFor={ADDRESS_FIELDS.PHONE_NUMBER.fieldName}>Phone Number</label>
            <input
              autoComplete={disableAutoComplete ? 'new-password' : ADDRESS_FIELDS.PHONE_NUMBER.autoComplete}
              type="tel"
              inputMode="tel"
              autocorrect="off"
              maxLength={ADDRESS_FIELDS.PHONE_NUMBER.maxLength}
              onChange={this.onFieldChange}
              value={primaryVoiceNumber || ''}
              id={ADDRESS_FIELDS.PHONE_NUMBER.fieldName}
              name={ADDRESS_FIELDS.PHONE_NUMBER.fieldName}
              data-test-id={testId('addressPhoneNumber')}
              required={true}
              placeholder="Including area code" />
            { this.hasError(ADDRESS_FIELDS.PHONE_NUMBER.fieldName) && <div data-test-id={testId('phoneNumberError')}>{formErrors[ADDRESS_FIELDS.PHONE_NUMBER.fieldName]}</div> }
          </div>
        </div>

        {
          !savedAddresses.length && <div className={css.fieldWrapper}>
            <div className={css.formField}>
              <input
                type="checkbox"
                name="isAlsoBilling"
                data-test-id={testId('isAlsoBilling')}
                id="isAlsoBilling"
                defaultChecked={typeof isAlsoBilling === 'undefined' ? true : isAlsoBilling}
                onChange={this.toggleIsAlsoBilling}/>
              <label htmlFor="isAlsoBilling" data-test-id={testId('isAlsoBillingLabel')}>Use address for billing</label>
            </div>
          </div>
        }

        {
          !!savedAddresses.length && !isBilling && <div className={css.fieldWrapper}>
            <div className={css.formField}>
              <input
                type="checkbox"
                name="isPrimary"
                data-test-id={testId('saveAsDefault')}
                id="isPrimary"
                defaultChecked={isPrimary}
                onChange={this.toggleIsPrimary}/>
              <label htmlFor="isPrimary">Save as default shipping address</label>
            </div>
          </div>
        }
        <button type="submit" className={css.hiddenBtn}>Submit</button>
      </form>
    );
  };

  makeInlineForm = () => {
    const { isBilling = false, isLoading } = this.props;
    const { testId } = this.context;
    const addressType = isBilling ? 'billing' : 'shipping';
    const useAddressMsg = isBilling ? 'Bill to this address' : 'Ship to this address';

    return (
      <div className={css.inline} data-test-id={testId('addressFormInline')}>
        <p className={css.header}>
          <span>Add a </span>new {addressType} address
        </p>

        <div className={css.formWrapper}>
          { this.makeForm() }
        </div>

        <form onSubmit={this.onSavingAddress} action="/address" method="post">
          <button
            type="submit"
            className={css.addAddressBtn}
            disabled={isLoading}
            data-test-id={testId('shipToNewAddress')}>{ isLoading ? 'Saving...' : useAddressMsg }</button>
        </form>
      </div>
    );
  };

  makeModalForm = () => {
    const { isBilling = false, isEdit, isLoading, showDeleteBtn } = this.props;
    const { testId } = this.context;
    const addressType = isBilling ? 'billing' : 'shipping';
    const useAddressMsg = isBilling ? 'Bill to this address' : 'Ship to this address';

    return (
      <div className={css.modal} data-test-id={testId('addressFormModal')}>
        <div className={header}>
          <p className={css.header}>
            {
              isEdit
                ? `Edit ${addressType} address`
                : <><span>Add a </span>new {addressType} address</>
            }
          </p>
        </div>

        <div className={css.formWrapper}>
          { this.makeForm() }
        </div>

        <div className={css.footer}>
          <form onSubmit={this.onSavingAddress} action="/address" method="post">
            <button
              type="button"
              disabled={isLoading}
              onClick={this.onHideModal}
              className={css.cancelBtn}
              data-test-id={testId('cancelBtn')}>Cancel</button>

            {
              isEdit && showDeleteBtn && <button
                type="button"
                disabled={isLoading}
                onClick={this.onDeleteAddress}
                className={css.deleteBtn}
                data-test-id={testId('deleteAddressBtn')}>Delete This Address</button>
            }

            <button
              type="submit"
              className={css.addAddressBtn}
              disabled={isLoading}
              data-test-id={testId('shipToNewAddress')}>{ isLoading ? 'Saving...' : useAddressMsg }</button>
          </form>
        </div>
      </div>
    );
  };

  render() {
    const { address: { formItem: { suggestedAddresses } }, isOpen, isInline } = this.props;

    if (isInline) {
      return suggestedAddresses?.length ? this.makeInlineSuggested() : this.makeInlineForm();
    }

    return (
      <MelodyModal
        buttonTestId="closeModal"
        className={cn(css.modalContent, { [css.fade]: true })}
        isOpen={isOpen}
        onRequestClose={this.onHideModal}
        contentLabel="Enter Your Address"
      >
        {
          suggestedAddresses?.length
            ? this.makeModalSuggested()
            : this.makeModalForm()
        }
      </MelodyModal>
    );
  }
}

const getGeoLocation = (geoCookie = '') => {
  const geoParts = geoCookie.split('/');

  if (!geoParts.length || geoParts.length === 1) {
    return 'Lebanon, KS'; // geographic center of the US
  }

  if (geoParts.length === 4) {
    return `${geoParts[3]}, ${geoParts[1]}`;
  }

  return geoParts[1];
};

AddressFormWithAutoComplete.contextTypes = {
  testId: PropTypes.func
};

const mapStateToProps = ({ address, cookies: { geo } = {} }) => ({ address, geoLocation: getGeoLocation(geo) });

export default connect(mapStateToProps, {
  onHasLoadedAacSuggestions,
  onHasSelectedAacSuggestion,
  onSawAddressFormWithAac,
  onToggleIsAlsoBilling,
  storeEditOfInactiveAddressError
})(AddressFormWithAutoComplete);
