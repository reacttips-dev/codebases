import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { AriaLiveTee } from 'components/common/AriaLive';
import usePrevious from 'hooks/usePrevious';
import useMartyContext from 'hooks/useMartyContext';
import { GC_AND_PROMO_CONSTRAINTS } from 'constants/constraintViolations';
import RedeemableRewardsRightCol from 'components/checkout/RedeemableRewardsRightCol';
import { onChangeRedemptionAmountEvent, onRedeemRewardsComponentView } from 'actions/account/rewards';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/checkout/payment/paymentCouponCode.scss';

export const PaymentCouponCode = props => {
  const { testId } = useMartyContext();

  const {
    constraintViolations,
    isGcOnlyCart,
    openByDefault,
    onTogglePromoBox,
    showPromoSuccessMessage,
    purchaseDataIsLoading,
    purchaseHasShippingAddress
  } = props;

  let errorMsg = false;

  Object.keys(constraintViolations).some(key => {
    errorMsg = GC_AND_PROMO_CONSTRAINTS.includes(key) && constraintViolations[key].message;
    return !!errorMsg;
  });

  const [isOpen, setOpen] = useState(openByDefault);
  const [couponCode, setCouponCode] = useState('');
  const { location } = props;
  const previous = usePrevious({ errorMsg, location }) || {};

  useEffect(() => {
    const { errorMsg: previousErrorMsg = false } = previous;
    if (previousErrorMsg !== errorMsg && !errorMsg) {
      setCouponCode('');
    }
  }, [previous, errorMsg]);

  const onTypeCouponCode = e => {
    const { target: { value } } = e;
    setCouponCode(value);
  };

  const toggleIsOpen = e => {
    e.preventDefault();
    onTogglePromoBox();
    setOpen(isOpen => !isOpen);
  };

  const onSubmitCoupon = e => {
    e.preventDefault();
    const { onAddCouponClick } = props;
    onAddCouponClick(couponCode);
  };

  return (
    <>
      <div className={css.rightCol}>
        <button
          type="button"
          aria-expanded={isOpen}
          className={css.toggleBtn}
          onClick={toggleIsOpen}
          data-test-id={testId('giftCardPromoArea')}>
          <h3 className={cn([ isOpen ? css.arrowUp : css.arrowDown, css.rightColText ])}>
            Apply Gift Card or Promo Code
          </h3>
        </button>

        {
          isOpen && <div>
            <form
              data-test-id={testId('addCouponForm')}
              onSubmit={onSubmitCoupon}
              method="POST"
              action="/marty/checkout/coupon"
              className={css.promoBar}
              data-search-container>
              <input
                aria-label="Enter Code"
                className={cn({ [css.error]: !!errorMsg })}
                disabled={isGcOnlyCart}
                onChange={onTypeCouponCode}
                value={couponCode}
                id="code"
                name="code"
                data-test-id={testId('giftCardCodeInput')}
                required={true}
                autoComplete="off"
                placeholder="Enter Code" />
              <button
                aria-describedby={ !purchaseHasShippingAddress ? 'addShippingAddressInfo' : null }
                aria-label="Apply Code"
                data-test-id={testId('giftCardCodeSubmit')}
                disabled={isGcOnlyCart || purchaseDataIsLoading || !purchaseHasShippingAddress || !couponCode?.length}
                type="submit">Apply</button>
            </form>
            { !!errorMsg && <p className={css.errorMsg} data-test-id={testId('giftCardCodeError')}><AriaLiveTee>{ errorMsg }</AriaLiveTee></p> }
            { showPromoSuccessMessage && <p className={css.successMsg} data-test-id={testId('giftCardCodeSuccess')}><AriaLiveTee>Code was successfully redeemed.</AriaLiveTee></p>}
            { (!isGcOnlyCart && !purchaseHasShippingAddress) && <p id="addShippingAddressInfo" className={css.addShippingAddressInfoText}><span>Info:</span>Add or select a shipping address before applying codes</p> }
            { isGcOnlyCart && <p className={css.gcOnlyCartMessage}><span>Info:</span>Gift cards or promo codes cannot be used to buy gift cards</p> }
          </div>
        }
      </div>

      {
        makeRedeemableRewards(props)
      }
    </>
  );
};

const makeRedeemableRewards = props => {
  const {
    hideRewardsRedemption,
    isGcOnlyCart,
    isRedeemingRewards,
    onRedeemRewardsPoints,
    redeemableRewards,
    redeemingRewardsStatus,
    spendPointDollarValue,
    spendPoints,
    onRedeemRewardsComponentView,
    onChangeRedemptionAmountEvent
  } = props;

  if (hideRewardsRedemption) {
    return null;
  }

  return (
    <div className={css.rightCol}>
      <RedeemableRewardsRightCol
        isGcOnlyCart={isGcOnlyCart}
        hideRewardsRedemption={hideRewardsRedemption}
        isRedeemingRewards={isRedeemingRewards}
        onRedeemRewardsPoints={onRedeemRewardsPoints}
        redeemableRewards={redeemableRewards}
        redeemingRewardsStatus={redeemingRewardsStatus}
        spendPointDollarValue={spendPointDollarValue}
        spendPoints={spendPoints}
        onChangeRedemptionAmount={onChangeRedemptionAmountEvent}
        onRedeemRewardsComponentView={onRedeemRewardsComponentView} />
    </div>
  );
};

const mapStateToProps = ({ routing }) => ({ location: routing.locationBeforeTransitions });

const PaymentCouponCodeConnected = connect(mapStateToProps, {
  onChangeRedemptionAmountEvent,
  onRedeemRewardsComponentView
})(PaymentCouponCode);

const PaymentCouponCodeConnectedWithErrorBoundary = withErrorBoundary('PaymentCouponCode', PaymentCouponCodeConnected);

export default PaymentCouponCodeConnectedWithErrorBoundary;
