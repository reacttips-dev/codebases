/**
 ***************************************************
 * Rewards info (tiers, etc)
 ***************************************************
 **/

export const HF_TOPBANNER_CONTENT_TYPE_PHRASES = 'phrases';
export const HF_TOPBANNER_CONTENT_TYPE_REWARDS = 'rewards';
export const CHANCE_OF_SHOWING_UPS_PICKUP = .35;

export const EASYFLOW_ENROLLMENT_URL = '/c/vip-prime-link';
export const EASYFLOW_LANDING_PAGES = ['prime-link'];

export const TIER_INFO = [
  {
    name: 'Silver',
    start: 0,
    size: 1200,
    nextTier: 'Gold'
  },
  {
    name: 'Gold',
    start: 1200,
    size: 4800,
    nextTier: 'Platinum'
  },
  {
    name: 'Platinum',
    start: 6000
  },
  {
    name: 'Elite'
  }
];

export const REDEEM_REWARDS_ERROR = 'REDEEM_REWARDS_ERROR';
export const REDEEM_REWARDS_TIMEOUT = 'REDEEM_REWARDS_TIMEOUT';
export const REDEEM_REWARDS_SUCCESS = 'REDEEM_REWARDS_SUCCESS';
export const BADGE_MULTIPLIER_VERBIAGE = 'Zappos VIPs earn bonus points when shopping this brand and select others. Limited time only.';
