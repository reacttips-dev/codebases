import { useEffect, useState } from 'react';

import { REDEEM_REWARDS_ERROR, REDEEM_REWARDS_SUCCESS, REDEEM_REWARDS_TIMEOUT } from 'constants/rewardsInfo';
import { toThousandsSeparator } from 'helpers/NumberFormats';
import useMartyContext from 'hooks/useMartyContext';
import usePrevious from 'hooks/usePrevious';

import css from 'styles/components/checkout/redeemableRewardsRightCol.scss';

export const RedeemableRewardsRightCol = props => {
  const { testId } = useMartyContext();
  const {
    hideRewardsRedemption,
    isGcOnlyCart,
    isRedeemingRewards,
    onChangeRedemptionAmount,
    onRedeemRewardsComponentView,
    onRedeemRewardsPoints,
    redeemableRewards = [],
    redeemingRewardsStatus,
    spendPointDollarValue,
    spendPoints
  } = props;
  const [spendPointsToApply, setSpendPointsToApply] = useState(0);
  const previous = usePrevious({ hideRewardsRedemption }) || {};

  useEffect(() => {
    if (!hideRewardsRedemption) {
      onRedeemRewardsComponentView();
    }
  }, [hideRewardsRedemption, onRedeemRewardsComponentView]);

  useEffect(() => {
    const { hideRewardsRedemption: previousHideRewardsRedemption } = previous;
    if (previousHideRewardsRedemption && !hideRewardsRedemption) {
      onRedeemRewardsComponentView();
    }
  }, [hideRewardsRedemption, onRedeemRewardsComponentView, previous]);

  const onSelectChange = ({ currentTarget: { value } }) => {
    onChangeRedemptionAmount();
    setSpendPointsToApply(value);
  };

  const onSubmitForm = e => {
    e.preventDefault();
    onRedeemRewardsPoints(parseInt(spendPointsToApply, 10));
  };

  const makeMessageBox = () => { // @todo Remove this and consolidate with new VIP mocks https://zpl.io/V0L99LQ. Currently being used in Checkout.
    switch (redeemingRewardsStatus) {
      case REDEEM_REWARDS_SUCCESS:
        return <div className={css.successBox}>VIP points have been applied to your purchase!</div>;
      case REDEEM_REWARDS_TIMEOUT:
        return <div className={css.cautionBox}>Sorry, things are taking longer than expected. Please wait a few moments and refresh the page.</div>;
      case REDEEM_REWARDS_ERROR:
        return (
          <div className={css.errorBox}>
            <p>Unable to Redeem</p>
            <p>Contact Support for help</p>
          </div>
        );
      default:
        return null;
    }
  };

  const makeRedeemingRewardsInProgress = () => (
    <div className={css.pendingRedeemMsg}>
      <span className={css.redeemingImg} />
      <p className={css.redeemingTitle}>Redeeming VIP points</p>
      This could take a moment
    </div>
  );

  const noRedemptionsAvailable = !redeemableRewards?.length;

  if (hideRewardsRedemption) {
    return null;
  }

  if (isGcOnlyCart) {
    return (
      <div className={css.wrap}>
        <h3>Redeem VIP Points</h3>
        { !!spendPoints && spendPoints > 0 && <h4>Balance: {toThousandsSeparator(spendPoints)} VIP Points ({spendPointDollarValue})</h4> }
        <p className={css.gcOnlyCartMessage}><span>Info:</span>VIP Points cannot be used to buy gift cards</p>
      </div>
    );
  }

  return (
    <div className={css.wrap}>
      <form
        data-test-id={testId('redeemRewardsForm')}
        onSubmit={onSubmitForm}
        method="POST"
        action="/marty/checkout/rewards">
        <fieldset>
          <legend><h3>Redeem VIP Points</h3></legend>
          { !!spendPoints && spendPoints > 0 && <h4>Balance: {toThousandsSeparator(spendPoints)} VIP Points ({spendPointDollarValue})</h4> }
          { makeMessageBox() }

          {isRedeemingRewards
            ? makeRedeemingRewardsInProgress()
            : (
            <>
              <label htmlFor="spendPoints">Select point amount</label>
              <div className={css.couponBar}>
                <select
                  aria-describedby="hintText"
                  className={css.rewardsDropdown}
                  data-test-id={testId('spendPoints')}
                  defaultValue={spendPointsToApply}
                  disabled={noRedemptionsAvailable}
                  id="spendPoints"
                  name="spendPoints"
                  onChange={onSelectChange}
                  required={true}>
                  <option key="selectAmount" value="">Select...</option>
                  {
                    redeemableRewards.sort((a, b) => b.spend_points - a.spend_points).map(({ dollar_value: dollarValue, spend_points: spendPoints }) => (
                      <option key={spendPoints} value={spendPoints}>{toThousandsSeparator(spendPoints)} pts ({dollarValue})</option>
                    ))
                  }
                </select>
                <button type="submit" disabled={noRedemptionsAvailable || !spendPointsToApply} data-test-id={testId('applyBtn')}>Redeem Points</button>
              </div>
              {
                noRedemptionsAvailable ?
                  (<p id="hintText" className={css.redemptionWarning}>Collect at least 100 points to redeem your points for a discount on your next purchase</p>) :
                  (<p id="hintText" className={css.redemptionWarning}>Once redeemed, the amount <strong>cannot</strong> be converted back into points and will be applied when you place an order.</p>)
              }
            </>
            )
          }
        </fieldset>
      </form>
    </div>
  );
};

export default RedeemableRewardsRightCol;
