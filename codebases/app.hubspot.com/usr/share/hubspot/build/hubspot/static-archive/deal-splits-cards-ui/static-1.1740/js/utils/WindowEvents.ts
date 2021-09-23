import { SAVE_DEAL_SPLIT } from './EventConstants';
export var refreshDealSplits = function refreshDealSplits() {
  return window.dispatchEvent(new CustomEvent(SAVE_DEAL_SPLIT));
};