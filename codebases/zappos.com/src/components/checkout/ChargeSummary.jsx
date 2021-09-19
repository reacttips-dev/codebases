import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import PropTypes from 'prop-types';

import PlaceOrder from 'components/checkout/OrderTotal/PlaceOrder';
import { pluralize } from 'helpers';
import { isNonRetailOnlyCart } from 'helpers/CheckoutUtils';
import { toUSD } from 'helpers/NumberFormats';
import TermsAndConditions from 'components/checkout/OrderTotal/TermsAndConditions';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/checkout/chargeSummary.scss';

export class ChargeSummary extends Component {
  getShippingCharge = ({ shippingSubtotal, shippingCharge }) => {
    const { marketplace: { checkout: { showShippingDiscountLineItem } } } = this.context;
    if (showShippingDiscountLineItem) {
      return toUSD(shippingSubtotal);
    }

    return shippingCharge === 0
      ? 'Free'
      : toUSD(shippingCharge);
  };

  getShippingLineItemDiscount = ({ shippingDiscount }) => {
    const { marketplace: { checkout: { showShippingDiscountLineItem } } } = this.context;
    if (showShippingDiscountLineItem && shippingDiscount) {
      return toUSD(shippingDiscount);
    }
  };

  render() {
    const {
      asinErrors,
      giftMessage,
      isOrderReadyToSubmit,
      isPlacingOrder,
      isReviewStep,
      isStickyPlaceOrder,
      checkoutData: {
        cartType,
        purchaseGiftCard,
        purchase: { chargeSummary = {}, eligibleBalances },
        numItems
      },
      onPlaceOrderClick,
      showAddAddressMessage
    } = this.props;

    const {
      couponTotal,
      estimatedTax,
      giftWrapCharge,
      grandTotal,
      shippingCharge,
      shippingDiscount,
      shippingSubtotal,
      subTotal,
      total,
      totalBeforeTax
    } = chargeSummary;

    const { testId = f => f } = this.context;
    const { amountRemaining = 0 } = purchaseGiftCard || {};
    const shippingParams = { shippingDiscount, shippingSubtotal, shippingCharge };
    const displayedShippingCharge = this.getShippingCharge(shippingParams);
    const displayedShippingDiscount = this.getShippingLineItemDiscount(shippingParams);
    const doesCartHaveGiftCard = isNonRetailOnlyCart(cartType);
    const isGcNotAppliedMessage = doesCartHaveGiftCard && !!eligibleBalances?.gcBalance && !purchaseGiftCard;

    return (
      <>
        <div className={cn({ [css.isStickyPlaceOrder]: isStickyPlaceOrder })}>
          { isReviewStep && !!asinErrors && !!Object.keys(asinErrors).length && <div className={css.errorBox}>There is a problem with an item on your purchase. Please view item details for more information.</div> }
          <PlaceOrder isOrderReadyToSubmit={isOrderReadyToSubmit} isPlacingOrder={isPlacingOrder} onPlaceOrderClick={onPlaceOrderClick}/>
        </div>

        <div className={cn({ [css.isStickyPlaceOrder]: isStickyPlaceOrder })}><TermsAndConditions /></div>
        <div>
          <div className={css.table}>
            <div>Order Summary (<span data-test-id={testId('itemCount')}>{numItems} { pluralize('Item', numItems) }</span>)</div>

            <div className={cn(css.label, css.subTotal)}>Subtotal:</div>
            <div className={cn(css.value, css.subTotal)} data-test-id={testId('itemSubTotal')}>{toUSD(subTotal)}</div>

            { !!giftWrapCharge && <div className={css.label}>Gift Wrap:</div> }
            { !!giftWrapCharge && <div className={css.value} data-test-id={testId('giftWrapTotal')}>{toUSD(giftWrapCharge)}</div> }

            <div className={css.label}>Shipping:</div>
            <div className={css.value} data-test-id={testId('shippingCharge')}>{ displayedShippingCharge }</div>

            { !!displayedShippingDiscount && <div className={css.label}>Free Shipping:</div> }
            { !!displayedShippingDiscount && <div className={css.value} data-test-id={testId('shippingDiscount')}>-{displayedShippingDiscount}</div> }

            { !!couponTotal && <div className={css.label}>Discounts:</div> }
            { !!couponTotal && <div className={css.value} data-test-id={testId('couponDiscount')}>-{toUSD(couponTotal)}</div> }

            { showAddAddressMessage && <div className={css.noAddressLabel}>Discounts:</div> }
            { showAddAddressMessage && <div className={css.noAddressValue} data-test-id={testId('noAddressMessage')}>Auto-applied discounts will appear here once a shipping address is entered</div> }

            <div className={css.label}>Total before tax:</div>
            <div className={cn(css.tbt, css.value)} data-test-id={testId('preTaxTotal')}>{toUSD(totalBeforeTax)}</div>

            <div className={css.label}>Estimated tax to be collected:*</div>
            <div className={css.value} data-test-id={testId('estimatedTax')}>{toUSD(estimatedTax)}</div>

            { !!total && !!amountRemaining && <div className={css.label}>Total:</div> }
            { !!total && !!amountRemaining && <div className={css.value} data-test-id={testId('totalAmountRemaining')}>{toUSD(total)}</div> }

            { !!amountRemaining && <div className={css.label}>Gift Cards:</div> }
            { !!amountRemaining && <div className={css.value} data-test-id={testId('gcRemaining')}>-{toUSD(amountRemaining)}</div> }

            { isGcNotAppliedMessage && <div className={css.label}>Gift Cards:</div> }
            { isGcNotAppliedMessage && <div className={css.value} data-test-id={testId('gcRemaining')}>Not applicable</div> }
            { isGcNotAppliedMessage && <div className={cn(css.value, css.noGcMsg)}data-test-id={testId('gcRemaining')}>
            Gift cards cannot be applied to orders with gift cards.
            </div> }

            <div className={cn(css.orderTotal, css.label)}>Order Total:</div>
            <div className={cn(css.orderTotal, css.value)} data-test-id={testId('grandTotal')}>{toUSD(grandTotal)}</div>
          </div>
          {
            giftMessage && <div className={css.giftMessageLine}>
              <span className={css.giftIcon}></span>
              Includes a FREE gift message and receipt
            </div>
          }
        </div>
      </>
    );
  }
}

ChargeSummary.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

const mapStateToProps = ({ checkoutData }) => ({ checkoutData });

const ChargeSummaryConnected = connect(mapStateToProps, {})(ChargeSummary);

const ChargeSummaryConnectedWithErrorBoundary = withErrorBoundary('ChargeSummary', ChargeSummaryConnected);
export default ChargeSummaryConnectedWithErrorBoundary;
