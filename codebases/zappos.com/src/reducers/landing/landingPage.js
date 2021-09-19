import {
  RECEIVE_LANDING_PAGE_INFO,
  RECEIVE_RESET_LANDING_PAGE_INFO,
  RECEIVE_SYMPHONY_PREVIEW_INFO,
  RECEIVE_TAXONOMY_BRAND_PAGE_INFO,
  REQUEST_LANDING_PAGE_INFO,
  REQUEST_SYMPHONY_PREVIEW_INFO,
  REQUEST_TAXONOMY_BRAND_PAGE_INFO,
  SET_IP_RESTRICTED_STATUS,
  TOGGLE_EASYFLOW_MODAL
} from 'constants/reduxActions';
import marketplace from 'cfg/marketplace.json';

export const defaultState = {
  isLoaded: false,
  isEasyFlowShowing: false,
  ipStatus: { valid: false, callCompleted: false }
};

export default function landingPage(state = defaultState, action) {
  const { type, pageName, pageInfo, brandId, slot, ipStatus, isEasyFlowShowing } = action;
  const { landing: { layout } } = marketplace;

  switch (type) {
    case RECEIVE_RESET_LANDING_PAGE_INFO:
      return defaultState;
    case REQUEST_LANDING_PAGE_INFO:
      return { ...state, pageName, isLoaded: false };
    case RECEIVE_LANDING_PAGE_INFO:
      // brandId must be reset to null so we know it's no longer on a brand page
      const newLandingObj = { ...state, pageName, isLoaded: true, pageInfo, slotOrder: [], brandId: null };
      const { slotNames, pageLayout } = pageInfo;
      const newSlotOrder = layout[pageLayout];
      let finalSlotNames = slotNames;
      // Check if a specified Marty pageLayout is present in cfg/marketplace.
      // If so, select ONLY those slots and rearrange them to display in the specified cfg/marketplace order.
      if (newSlotOrder && newSlotOrder.length > 0 && slotNames && slotNames.length > 0) {
        finalSlotNames = newSlotOrder.filter(slot => slotNames.indexOf(slot) !== -1);
      }
      newLandingObj.slotOrder = finalSlotNames;
      return newLandingObj;
    case REQUEST_TAXONOMY_BRAND_PAGE_INFO:
      return { ...state, isLoaded: false, brandId };
    case RECEIVE_TAXONOMY_BRAND_PAGE_INFO:
      const slotOrder = [
        'primary-8',
        'primary-2',
        'primary-4',
        'primary-6',
        'primary-10'
      ];
      return { ...state, isLoaded: true, brandId, pageInfo, slotOrder, pageName };
    case REQUEST_SYMPHONY_PREVIEW_INFO:
      return { ...state, slot };
    case RECEIVE_SYMPHONY_PREVIEW_INFO:
      return { ...state, slot, pageInfo };
    case SET_IP_RESTRICTED_STATUS:
      return { ...state, ipStatus: { ...ipStatus, callCompleted: true } };
    case TOGGLE_EASYFLOW_MODAL:
      return { ...state, isEasyFlowShowing };
    default:
      return state;
  }
}
