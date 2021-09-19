import {
  RECEIVE_CHANGE_SHIPPING_ADDRESS_ERROR,
  RECEIVE_POST_RETURN_INFO,
  RECEIVE_PRE_RETURN_INFO,
  RECEIVE_RETURN_LABEL_INFO,
  RECEIVE_RETURN_LABEL_PRODUCT_INFO,
  RESET_RETURNS_IN_STATE,
  RETURN_SUBMIT_COMPLETE,
  RETURN_SUBMIT_ERROR,
  RETURN_SUBMIT_INITIATE,
  SET_IS_MIXED_RETURN_ERROR,
  STEP_SELECTION,
  UPDATE_BOX_INFO
} from 'constants/reduxActions';

const initialState = {
  preReturnInfo: [],
  contractIds: [],
  step: 'SELECT_RETURN_ITEMS',
  postReturnInfo: [],
  isReturnSubmitting: false,
  labelInfo: {},
  isReturnError: false,
  isMixedReturnError: false
};

export default function returns(state = initialState, action) {
  const {
    type,
    preReturnInfo,
    step,
    boxInfo,
    postReturnInfo,
    labelInfo,
    productInfo,
    isMixedReturnError
  } = action;

  switch (type) {
    case RECEIVE_PRE_RETURN_INFO:
      const newPreReturnInfo = state.preReturnInfo.concat([preReturnInfo]);
      const newContractIds = state.contractIds.concat([preReturnInfo.contractId]);
      return { ...state, preReturnInfo: newPreReturnInfo, contractIds: newContractIds };

    case STEP_SELECTION:
      return { ...state, step };

    case UPDATE_BOX_INFO: // called during both box initialization and update
      return { ...state, boxInfo };

    case RECEIVE_POST_RETURN_INFO:
      const newPostReturnInfo = state.postReturnInfo.concat([postReturnInfo]);
      return { ...state, postReturnInfo: newPostReturnInfo };

    case RETURN_SUBMIT_INITIATE:
      return { ...state, isReturnError: false, isReturnSubmitting: true };

    case RETURN_SUBMIT_COMPLETE:
    case RECEIVE_CHANGE_SHIPPING_ADDRESS_ERROR: // for snail mail form errors
      return { ...state, isReturnSubmitting: false };

    case RECEIVE_RETURN_LABEL_INFO:
      return { ...state, labelInfo };

    case RECEIVE_RETURN_LABEL_PRODUCT_INFO:
      const newLabelInfo = { ...state.labelInfo };
      const products = newLabelInfo.products || [];
      newLabelInfo.products = products.concat(productInfo);
      return { ...state, labelInfo: newLabelInfo };

    case RETURN_SUBMIT_ERROR:
      return { ...state, isReturnError: true, isReturnSubmitting: false };

    case SET_IS_MIXED_RETURN_ERROR:
      return {
        ...state,
        isMixedReturnError
      };

    case RESET_RETURNS_IN_STATE:
      return { ...initialState };

    default:
      return state;
  }
}
