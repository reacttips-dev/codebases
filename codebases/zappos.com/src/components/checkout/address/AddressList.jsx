/* eslint-disable sort-vars */
import React, { Component } from 'react';
import cn from 'classnames';
import { Link } from 'react-router';

import { buildPaginationRange } from 'helpers/CheckoutUtils';
import PaginationBar from 'components/checkout/PaginationBar';
import MultiLineAddress from 'components/checkout/address/MultiLineAddress';
import { MartyContext } from 'utils/context';

import css from 'styles/components/checkout/address/addressList.scss';

const NUM_PER_PAGE = 4;

export class AddressList extends Component {
  state = {
    start: 0
  };

  goToPage = (e, page) => {
    e.preventDefault();
    this.setState({ start: (page - 1) * NUM_PER_PAGE });
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

  render() {
    return (
      <MartyContext.Consumer>
        {context => {
          const {
            testId,
            marketplace: { checkout: { shippingCountriesWhitelist } }
          } = context;

          const { start } = this.state;
          const {
            editAddressBaseLink,
            invalidAddressError,
            savedAddresses,
            onAddressSelected,
            onUseAddressClick,
            onEditAddressClick,
            isLoading,
            selectedAddressId,
            isBilling = false,
            showAddressModal,
            editAddressBaseLinkQueryStringSeparator,
            sectionCancel
          } = this.props;

          const visibleStart = start,
            visibleEnd = start + NUM_PER_PAGE,
            filteredAddresses = savedAddresses.filter(address => filterCountries(isBilling, address, shippingCountriesWhitelist)),
            numFilteredAddresses = filteredAddresses.length,
            currentPage = start / NUM_PER_PAGE + 1,
            showPaginationBar = numFilteredAddresses > NUM_PER_PAGE,
            isPrevBtnEnabled = start > 1 && numFilteredAddresses > NUM_PER_PAGE,
            isNextBtnEnabled = start < numFilteredAddresses - NUM_PER_PAGE && numFilteredAddresses > NUM_PER_PAGE,
            paginationPages = buildPaginationRange(currentPage, Math.ceil(numFilteredAddresses / NUM_PER_PAGE));

          const useAddressMsg = isBilling ? 'Use this address' : 'Ship Here';
          const queryStringSeparator = editAddressBaseLinkQueryStringSeparator || '&';

          if (!savedAddresses?.length) {
            if (!isBilling) {
              return null;
            }

            return (
              <div>
                <button
                  className={css.addNewBtn}
                  disabled={isLoading}
                  onClick={showAddressModal}
                  type="button"
                  data-test-id={testId('addNewBillingAddress')}>Add new address</button>
                { sectionCancel }
              </div>
            );
          }

          return (
            <div className={css.wrapper} data-test-id={testId('addressListWrapper')}>
              {
                !!invalidAddressError && <div className={css.boxError}>
                  {invalidAddressError}
                </div>
              }
              <form onSubmit={onUseAddressClick} method="POST" action="/marty/checkout/address/use">
                {
                  filteredAddresses.map((address, rowIndex) => {
                    const { addressId, mailingAddress: { countryCode } } = address;
                    const itemStyles = cn(css.item, {
                      [css.selected]: selectedAddressId === addressId,
                      [css.invisible]: !(rowIndex >= visibleStart && rowIndex < visibleEnd)
                    });
                    return (
                      <div key={addressId} className={itemStyles}>
                        <div className={css.row} data-test-id={testId('addressSelectionRow')}>
                          <div className={css.selectionBlock} data-test-id={testId('addressSelectionBlock')}>
                            <input
                              checked={selectedAddressId === addressId}
                              value={addressId}
                              data-address-id={addressId}
                              disabled={isLoading}
                              onChange={onAddressSelected}
                              type="radio"
                              id={`address-${addressId}`}
                              name="addressList"
                              data-test-id={testId('addressSelector')} />
                            <label htmlFor={`address-${addressId}`} className={css.addressOptionsWrapper} data-test-id={testId('addressSelectorLabel')}>
                              <div className={css.line1}>
                                <div><MultiLineAddress address={address} hideCountry={countryCode === 'US'} hidePhone={true} /></div>
                                <div className={css.actionBar}>
                                  {
                                    !isBilling && !isLoading && selectedAddressId === addressId && <Link
                                      className={css.editAddressBtn}
                                      data-edit-address-index={rowIndex}
                                      data-edit-address-id={addressId}
                                      to={`${editAddressBaseLink}${queryStringSeparator}addressId=${addressId}`}
                                      onClick={onEditAddressClick}
                                      data-test-id={testId('editLink')}>Edit Address</Link>
                                  }

                                  {
                                    selectedAddressId === addressId && <button
                                      className={css.shipHereBtn}
                                      disabled={isLoading}
                                      type="submit"
                                      data-test-id={testId('useThisBillingAddress')}>{isLoading ? 'Submitting...' : useAddressMsg}</button>
                                  }
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }

                <div className={css.newItemLine}>
                  <div className={css.paginationBarWrapper}>
                    {
                      showPaginationBar && <PaginationBar
                        paginationLabel={isBilling ? 'Billing Address' : 'Shipping Address'}
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
                      className={css.addNewBtn}
                      disabled={isLoading}
                      onClick={showAddressModal}
                      type="button"
                      data-test-id={testId('addNewBillingAddress')}>Add new address</button>
                  </div>
                </div>
              </form>
            </div>
          );
        }}
      </MartyContext.Consumer>
    );

  }
}

const filterCountries = (isBilling, address, shippingCountriesWhitelist) => {
  // TODO: support edit of billing address: https://github01.zappos.net/mweb/marty/issues/7384
  if (isBilling || !isBilling) {
    return true;
  }

  const { mailingAddress: { countryCode } } = address;
  return shippingCountriesWhitelist.includes(countryCode);
};

export default AddressList;
