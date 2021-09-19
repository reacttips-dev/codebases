export const EXCHANGES_ON_CHANGE_SHIPPING_CLICK = 'BALDER/EXCHANGES_ON_CHANGE_SHIPPING_CLICK ';
export const EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK =
  'BALDER/EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK';
export const EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK =
  'BALDER/EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK';
export const EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK =
  'BALDER/EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK';
export const EXCHANGES_USE_SUGGESTED_ADDRESS = 'BALDER/EXCHANGES_USE_SUGGESTED_ADDRESS';
export const EXCHANGES_CLOSE_SELECT_ADDRESS = 'BALDER/EXCHANGES_CLOSE_SELECT_ADDRESS';
export const EXCHANGES_EDIT_ADDRESS = 'BALDER/EXCHANGES_EDIT_ADDRESS';
export const EXCHANGES_VERIFY_ADDRESS_PAGEVIEW = 'BALDER/EXCHANGES_VERIFY_ADDRESS_PAGEVIEW';
export const EXCHANGES_DELETE_ADDRESS = 'BALDER/EXCHANGES_DELETE_ADDRESS';
export const EXCHANGES_REQUEST_ALL_ADDRESSES = 'BALDER/EXCHANGES_REQUEST_ALL_ADDRESSES';
export const EXCHANGES_SAVE_ADDRESS = 'BALDER/EXCHANGES_SAVE_ADDRESS';
export const EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID =
  'BALDER/EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID';
export const EXCHANGES_SET_SELECTED_SUGGESTED_ADDRESS_ID =
  'BALDER/EXCHANGES_SET_SELECTED_SUGGESTED_ADDRESS_ID';
export const SET_FORM_ERRORS = 'BALDER/SET_FORM_ERRORS';
export const EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT = 'BALDER/EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT';
export const EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS =
  'BALDER/EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS';

export interface SetPrimaryShippingAddressAction {
  type: typeof EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS;
  selectedAddressId: string;
}

interface UseShippingAddressAction {
  type: typeof EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK;
  selectedAddressId: string;
  isValid: boolean;
}

interface ChangeShippingAddressAction {
  type: typeof EXCHANGES_ON_CHANGE_SHIPPING_CLICK;
}

interface EditAddressAction {
  type: typeof EXCHANGES_EDIT_ADDRESS;
  editAddressId: string;
  editAddressIndex: number;
}

interface UseSuggestedAddressAction {
  type: typeof EXCHANGES_USE_SUGGESTED_ADDRESS;
  addressType: number;
  selectedAddressId: string;
}

interface AddOrEditAddressAction {
  type: typeof EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT;
  passedValidation: boolean;
  addressId: string | null;
  addressType: number;
}

interface DeleteAddressAction {
  type: typeof EXCHANGES_DELETE_ADDRESS;
  addressId: string;
}

interface SaveAddressAction {
  type: typeof EXCHANGES_SAVE_ADDRESS;
  isBilling: boolean;
}

export interface SetSelectedShippingAddressIdAction {
  type: typeof EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID;
  selectedAddressId: string;
}

interface SetSelectedSuggestedAddressId {
  type: typeof EXCHANGES_SET_SELECTED_SUGGESTED_ADDRESS_ID;
  selectedAddressId: string;
  selectedAddressIndex: number;
}

interface RequestAllAddressesAction {
  type: typeof EXCHANGES_REQUEST_ALL_ADDRESSES;
}

interface HideNewShippingAddressModalAction {
  type: typeof EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK;
}

interface ShowAddNewShippingAddressModalAction {
  type: typeof EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK;
}

interface CloseSelectAddressAction {
  type: typeof EXCHANGES_CLOSE_SELECT_ADDRESS;
}

interface VerifyAddressPageviewAction {
  type: typeof EXCHANGES_VERIFY_ADDRESS_PAGEVIEW;
}

export interface ExchangesState {
  selectedAddressId: string | null;
  confirmedAddressId: string | null;
  canCancelAddress: boolean;
  canChangeAddress: boolean;
}

export type ExchangesTypes =
  | AddOrEditAddressAction
  | ChangeShippingAddressAction
  | CloseSelectAddressAction
  | DeleteAddressAction
  | EditAddressAction
  | HideNewShippingAddressModalAction
  | RequestAllAddressesAction
  | SaveAddressAction
  | SetPrimaryShippingAddressAction
  | SetSelectedShippingAddressIdAction
  | SetSelectedSuggestedAddressId
  | ShowAddNewShippingAddressModalAction
  | UseShippingAddressAction
  | UseSuggestedAddressAction
  | VerifyAddressPageviewAction;
