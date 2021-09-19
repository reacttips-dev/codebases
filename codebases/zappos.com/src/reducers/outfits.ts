import { Outfit } from 'types/outfits';
import { AppAction } from 'types/app';
import { OUTFITS_LOADED, OUTFITS_STYLE_CHANGED } from 'constants/reduxActions';

export type OutfitsState = {
  currentProductId: string | undefined;
  currentStyleId: string | undefined;
  data: Record<string, Outfit[]>;
};
const initialState = { currentProductId: undefined, currentStyleId: undefined, data:{} };
export default function reducer(state: Readonly<OutfitsState> = initialState, action: AppAction): OutfitsState {
  switch (action.type) {
    case OUTFITS_LOADED:
      let newState;
      const { payload: { styleId, productId, outfits } } = action;
      if (state.currentProductId !== action.payload.productId) {
        newState = { currentProductId: productId, currentStyleId: styleId, data: { [styleId]: outfits } };
      } else {
        newState = { ...state, currentStyleId: styleId, data: { ...state.data, [styleId]: outfits } };
      }
      return newState;
    case OUTFITS_STYLE_CHANGED:
      return {
        ...state,
        currentStyleId: action.payload.styleId
      };
    default:
      return state;
  }
}

