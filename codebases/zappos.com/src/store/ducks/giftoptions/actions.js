import {
  GIFT_OPTIONS_IMPRESSION,
  GIFT_OPTIONS_NOT_ELIGIBLE,
  REQUEST_GIFT_OPTIONS,
  SET_GIFT_OPTIONS_SAVING,
  TOGGLE_GIFT_OPTIONS
} from 'store/ducks/giftoptions/types';

export const fetchGiftOptions = () => ({ type: REQUEST_GIFT_OPTIONS });
export const setGiftOptionsSaving = ({ isRemovingGiftOptions }) => ({ type: SET_GIFT_OPTIONS_SAVING, isRemovingGiftOptions });
export const onToggleGiftOptions = () => ({ type: TOGGLE_GIFT_OPTIONS });
export const onGiftOptionsImpression = () => ({ type: GIFT_OPTIONS_IMPRESSION });
export const onGiftOptionsNotEligible = () => ({ type: GIFT_OPTIONS_NOT_ELIGIBLE });
