import {
  CLEAR_REWARDS_SUCCESS,
  RECEIVE_CUSTOMER_IS_BANNED,
  RECEIVE_EASY_FLOW_CONTENT,
  RECEIVE_PRIME_STATUS,
  RECEIVE_REWARDS_ERROR,
  RECEIVE_REWARDS_INFO,
  RECEIVE_REWARDS_TERMS,
  RECEIVE_SIGNUP_FOR_REWARDS,
  RECEIVE_VIP_DASHBOARD_HEADER_CONTENT,
  REQUEST_REDEMPTION_INCREMENTS,
  REQUEST_REWARDS_INFO,
  REQUEST_SIGNUP_FOR_REWARDS
} from 'constants/reduxActions';
import { dashOrSnakeCaseToCamelCaseDeep } from 'helpers/DataFormatUtils';

const initialState = {
  rewardsInfo: null,
  terms: null,
  redemptionIncrements: [],
  isLoading: false,
  redemptionSubmitting: false,
  redemptionError: false,
  redemptionSuccessInfo: null
};

export default function rewards(state = initialState, action) {
  const { type, rewardsInfo, enrolledSince, terms, primeStatus, content } = action;
  switch (type) {
    case RECEIVE_CUSTOMER_IS_BANNED:
      return { ...state, isBanned: true };
    case REQUEST_REWARDS_INFO:
    case REQUEST_REDEMPTION_INCREMENTS:
      return { ...state, isLoading: true };
    case RECEIVE_REWARDS_INFO:
      return {
        ...state,
        rewardsInfo: {
          ...dashOrSnakeCaseToCamelCaseDeep(rewardsInfo),
          isVipOrConsented: rewardsInfo.vip || rewardsInfo.consented
        },
        isLoading: false
      };
    case RECEIVE_REWARDS_TERMS:
      return { ...state, terms, isLoading: false };
    case REQUEST_SIGNUP_FOR_REWARDS:
      return { ...state, isLoading: true };
    case RECEIVE_SIGNUP_FOR_REWARDS:
      return {
        ...state,
        rewardsInfo: {
          ...state.rewardsInfo,
          enrolled: true,
          consented: true,
          isVipOrConsented: true,
          enrolledSince
        },
        isLoading: false
      };
    case RECEIVE_REWARDS_ERROR:
      return { ...state, isLoading: false };
    case CLEAR_REWARDS_SUCCESS:
      return {
        ...state,
        redemptionSuccessInfo: null
      };
    case RECEIVE_PRIME_STATUS:
      return {
        ...state,
        ...primeStatus
      };
    case RECEIVE_EASY_FLOW_CONTENT:
      const { 'primary-3': easyFlowContent } = content;
      return {
        ...state,
        easyFlowContent
      };
    case RECEIVE_VIP_DASHBOARD_HEADER_CONTENT:
      const [ , vipDashboardSlotData] = content;
      return {
        ...state,
        vipDashboardSlotData
      };
    default:
      return state;
  }
}
