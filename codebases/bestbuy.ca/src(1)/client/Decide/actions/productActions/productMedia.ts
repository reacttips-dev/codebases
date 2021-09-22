import {AnyAction} from "redux";
import {ThunkAction} from "redux-thunk";

import State from "store";
import getLogger from "common/logging/getLogger";

import {selectProductMedia} from "../../store/selectors";
import {ApiMediaProvider} from "../../providers";
import normalizeMedia from "./utils/normalizeMediaApiResponse";

export type FetchProductMediaThunk = ThunkAction<
    Promise<undefined | {payload: any; type: string}>,
    State,
    any,
    AnyAction
>;

interface GetProductMediaParams {
    sku: string;
    locale: Locale;
}

export interface ProductMediaActionCreators {
    getProductMedia: ({sku, locale}: GetProductMediaParams) => FetchProductMediaThunk;
}

export const productMediaActionTypes = {
    productMediaLoading: "productMedia/PRODUCT_MEDIA_LOADING",
    setProductMediaSuccess: "productMedia/SET_PRODUCT_MEDIA_SUCCESS",
};

export const productMediaActionCreators: ProductMediaActionCreators = (() => {
    const getProductMedia = ({sku, locale}: GetProductMediaParams): FetchProductMediaThunk => async (
        dispatch,
        getState,
    ) => {
        const state = getState();

        const mediaFromState = selectProductMedia(state);
        const hasMedia = mediaFromState && !mediaFromState.loading;

        if (!sku || !locale || hasMedia) {
            return;
        }

        try {
            const mediaProvider = new ApiMediaProvider(
                state.config.dataSources.productGatewayApiUrl,
                state.config.productGatewayApiKey,
            );

            dispatch({
                type: productMediaActionTypes.productMediaLoading,
            });

            const media = await mediaProvider.getProductMedia({sku, locale, normalizer: normalizeMedia});
            if (Object.keys(media).length) {
                return dispatch({
                    payload: {...media},
                    type: productMediaActionTypes.setProductMediaSuccess,
                });
            }
        } catch (error) {
            // Ignore Error when api is unreachable, we shouldnt break the page.
            getLogger().error(`get product media error: ${error}`);
            return;
        }
    };

    return {
        getProductMedia,
    };
})();

export default productMediaActionCreators;
