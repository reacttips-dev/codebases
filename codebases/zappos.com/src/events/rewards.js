import {
  REQUEST_SIGNUP_FOR_REWARDS,
  RR_CHANGE_REDEEM_AMOUNT,
  RR_COMPONENT_VIEW
} from 'constants/reduxActions';
import { TE_PV_REWARDS } from 'constants/analytics';
import { trackEvent } from 'helpers/analytics';

// ZFC Tracking events
const teRewardsChangeRedemptionAmount = () => trackEvent('TE_REWARDS_CHANGE_REDEMPTION_AMOUNT', 'rewardsDashboard');
const teRewardsDashboardPageView = () => trackEvent('TE_PV_REWARDS');
const teRewardsRedeemPointsComponentView = () => trackEvent('TE_CV_REDEEMABLE_REWARDS', 'rewardsDashboard');
const teSignUpForRewards = () => trackEvent('TE_VIP_SIGN_UP');

export default {
  pageEvent: TE_PV_REWARDS,
  events: {
    [REQUEST_SIGNUP_FOR_REWARDS]: [teSignUpForRewards],
    [RR_CHANGE_REDEEM_AMOUNT]: [teRewardsChangeRedemptionAmount],
    [TE_PV_REWARDS]: [teRewardsDashboardPageView],
    [RR_COMPONENT_VIEW]: [teRewardsRedeemPointsComponentView]
  }
};
