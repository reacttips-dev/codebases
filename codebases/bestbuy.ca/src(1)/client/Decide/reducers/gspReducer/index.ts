import {BenefitsMessage} from "models";
import {AnyAction} from "redux";

import {GSPActionTypes} from "../../actions/gspActions";

export interface GSPState {
    [key: string]: {
        benefitsMessage: BenefitsMessage;
        error: {
            msg: string;
            error: object;
        };
    };
}

export const gspInitialState: GSPState = {};

export const gspReducer = (state: GSPState = gspInitialState, action: AnyAction): GSPState => {
           switch (action.type) {
               case GSPActionTypes.FETCH_WARRANTY_BENEFITS_SUCCESS: {
                   const {sku, data} = action.payload;
                   return {
                       ...state,
                       [sku]: {
                           ...state[sku],
                           benefitsMessage: data,
                       },
                   };
               }
               case GSPActionTypes.FETCH_WARRANTY_BENEFITS_ERROR: {
                   const {sku, error} = action.payload;
                   return {
                       ...state,
                       [sku]: {
                           ...state[sku],
                           error: {
                               msg: GSPActionTypes.FETCH_WARRANTY_BENEFITS_ERROR,
                               error,
                           },
                       },
                   };
               }
               default:
                   return state;
           }
       };

export default gspReducer;
