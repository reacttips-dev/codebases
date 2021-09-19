import {
  CLEAR_REWARDS_TRANSPARENCY_POINTS_FOR_ALL,
  SET_IS_REDEEMING_REWARDS,
  SET_REDEEMING_REWARDS_STATUS,
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_BRAND,
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_CART,
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM
} from 'store/ducks/rewards/types';

export const defaultState = {
  isEnrolled: null,
  isRedeemingRewards: false,
  transparencyPointsForItem: 0,
  transparencyPointsForCart: 0,
  transparencyPointsForBrand: 0
};

export default function rewardsReducer(state = defaultState, action = {}) {
  const {
    type,
    isEnrolled,
    isRedeemingRewards,
    redeemingRewardsStatus,
    transparencyPointsForBrand,
    transparencyPointsForCart,
    transparencyPointsForItem
  } = action;

  switch (type) {
    case STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM: {
      return { ...state, transparencyPointsForItem, isEnrolled };
    }

    case STORE_REWARDS_TRANSPARENCY_POINTS_FOR_CART: {
      return { ...state, transparencyPointsForCart, isEnrolled };
    }

    case STORE_REWARDS_TRANSPARENCY_POINTS_FOR_BRAND: {
      return { ...state, transparencyPointsForBrand };
    }

    case CLEAR_REWARDS_TRANSPARENCY_POINTS_FOR_ALL: {
      return { ...state, transparencyPointsForItem: 0, transparencyPointsForCart: 0, transparencyPointsForBrand: 0 };
    }

    case SET_REDEEMING_REWARDS_STATUS: {
      return { ...state, redeemingRewardsStatus, isRedeemingRewards: false };
    }

    case SET_IS_REDEEMING_REWARDS: {
      return { ...state, isRedeemingRewards, redeemingRewardsStatus: null };
    }

    default: {
      return state;
    }
  }
}
