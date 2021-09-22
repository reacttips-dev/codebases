import {DynamicContentModel} from "models";
import {BrandActionTypes} from "../../actions/brandActions";

export interface BrandState {
    loading: boolean;
    dynamicContent?: DynamicContentModel;
}

export const initialBrandState: BrandState = {
    dynamicContent: undefined,
    loading: false,
};

export const brand = (state = initialBrandState, action): BrandState => {
    switch (action.type) {
        case BrandActionTypes.fetchContent:
            return {
                ...state,
                loading: true,
            };
        case BrandActionTypes.fetchContentSuccess:
            return {
                dynamicContent: action.dynamicContent,
                loading: false,
            };
        case BrandActionTypes.fetchContentError:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
