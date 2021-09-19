import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Outfit } from 'types/outfits';
import { OUTFITS_LOADED, OUTFITS_STYLE_CHANGED } from 'constants/reduxActions';
import { getOutfits } from 'apis/outfits';
import { sanitizeApiData } from 'helpers/outfitUtils';
import { trackError } from 'helpers/ErrorUtils';
import { AppState } from 'types/app';
import { HYDRA_OUTFITS_ON_WEB } from 'constants/hydraTests';
import { triggerAssignment } from 'actions/ab';
import { err, setError } from 'actions/errors';

export function updateDisplayedOutfitStyles(styleId: string) {
  return { type: OUTFITS_STYLE_CHANGED, payload: { styleId } } as const;
}

export function dataLoaded(productId: string, styleId: string, outfits: Outfit[]) {
  return {
    type: OUTFITS_LOADED,
    payload: { productId, styleId, outfits }
  } as const;
}

export function loadOutfitData(productId: string, styleId: string, isCrucial = false) {
  return async (dispatch: ThunkDispatch<AppState, void, AnyAction>, getState: () => AppState) => {
    const { outfits: initialState } = getState();
    if (productId === initialState.currentProductId && initialState.data[styleId]) {
      return dispatch(updateDisplayedOutfitStyles(styleId));
    } else {
      try {
        // load the style data
        const apiResp = await getOutfits(productId, styleId);
        let outfits: Outfit[] = [];
        if (apiResp.outfits) {
          outfits = sanitizeApiData(apiResp, productId, styleId);
        }
        dispatch(dataLoaded(productId, styleId, outfits));
        if (outfits.length) {
          dispatch(triggerAssignment(HYDRA_OUTFITS_ON_WEB));
        }
      } catch (e) {
        // Full page requests should show full page error screen, in flow PDP pages shouldn't error the entire page
        if (e.status >= 500 && isCrucial) {
          dispatch(setError(err.GENERIC, e));
        } else {
          trackError('NON-FATAL', 'Could not load outfit data.', e);
          dispatch(dataLoaded(productId, styleId, []));
        }

      }
    }

  };
}

export type OutfitsAction = ReturnType<typeof dataLoaded> | ReturnType<typeof updateDisplayedOutfitStyles>;
