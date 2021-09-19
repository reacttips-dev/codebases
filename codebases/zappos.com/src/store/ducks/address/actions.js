import {
  ADDRESS_HAS_LOADED_AAC_SUGGESTIONS,
  ADDRESS_HAS_SELECTED_AAC_SUGGESTION,
  ADDRESS_SAW_ADDRESS_FORM_WITH_AAC,
  CLEAR_ADDRESS_FORM_ITEM,
  CLEAR_INVALID_ADDRESS_FIELDS_AND_ERRORS,
  ON_TOGGLE_IS_ALSO_BILLING,
  SET_ADDRESS_FORM_ITEM,
  SET_EDIT_OF_INACTIVE_ADDRESS_ERROR,
  SET_TEMP_ADDRESS_FAILURE_MSG,
  SET_TEMP_ADDRESS_SUCCESS_MSG
} from 'store/ducks/address/types';

export const clearAddressErrors = () => ({ type: CLEAR_INVALID_ADDRESS_FIELDS_AND_ERRORS });
export const clearAddressFormItem = () => ({ type: CLEAR_ADDRESS_FORM_ITEM });
export const setAddressFormItem = item => ({ type: SET_ADDRESS_FORM_ITEM, payload: item });
export const storeTempFailureMsg = msg => ({ type: SET_TEMP_ADDRESS_FAILURE_MSG, msg });
export const storeTempSuccessMsg = msg => ({ type: SET_TEMP_ADDRESS_SUCCESS_MSG, msg });
export const onToggleIsAlsoBilling = isAlsoBilling => ({ type: ON_TOGGLE_IS_ALSO_BILLING, isAlsoBilling });
export const storeEditOfInactiveAddressError = isEditOfInactiveAddressError => ({ type: SET_EDIT_OF_INACTIVE_ADDRESS_ERROR, isEditOfInactiveAddressError });
export const onSawAddressFormWithAac = () => ({ type: ADDRESS_SAW_ADDRESS_FORM_WITH_AAC });
export const onHasLoadedAacSuggestions = () => ({ type: ADDRESS_HAS_LOADED_AAC_SUGGESTIONS });
export const onHasSelectedAacSuggestion = () => ({ type: ADDRESS_HAS_SELECTED_AAC_SUGGESTION });
