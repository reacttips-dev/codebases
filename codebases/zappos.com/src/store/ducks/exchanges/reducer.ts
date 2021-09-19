import {
  EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS,
  EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID,
  ExchangesState,
  ExchangesTypes,
  SetPrimaryShippingAddressAction,
  SetSelectedShippingAddressIdAction
} from 'store/ducks/exchanges/types';

const defaultState = {
  selectedAddressId: null,
  confirmedAddressId: null,
  canCancelAddress: true,
  canChangeAddress: true
};

export default (state = defaultState, action: Partial<ExchangesTypes> = {}): ExchangesState => {
  switch (action.type) {
    case EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS: {
      return {
        ...state,
        confirmedAddressId: (action as SetPrimaryShippingAddressAction).selectedAddressId
      };
    }

    case EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID: {
      return {
        ...state,
        selectedAddressId: (action as SetSelectedShippingAddressIdAction).selectedAddressId
      };
    }

    default: {
      return state;
    }
  }
};
