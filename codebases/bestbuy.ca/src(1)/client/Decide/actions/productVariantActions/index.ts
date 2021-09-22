import {ActionCreatorsMapObject, Dispatch} from "redux";
import {ProductVariant, ThunkResult, getStateFunc, SearchResult, SimpleProduct} from "models";
import State from "store";
import {productRelationshipApiInstrumentation} from "../../providers/ProductRelationshipProvider/productRelationshipAPIInstrumentation";
import {ApiSearchProvider} from "providers";

export const productVariantActionTypes = {
    sendAnalytics: "PRODUCT_VARIANT_INTERACTION",
    fetchProductVariants: "FETCH_VARIANT_PRODUCTS",
    getProductVariantsSuccess: "GET_VARIANT_PRODUCTS_SUCCESS",
    getProductVariantsFailure: "GET_VARIANT_PRODUCTS_FAILURE",
};

export interface ProductVariantActionCreators extends ActionCreatorsMapObject {
    sendAnalytics: (productVariant: ProductVariant) => void;
    getProductVariants: (sku?: string) => ThunkResult<void>;
}

export const productVariantActionCreators: ProductVariantActionCreators = (() => {
    const sendAnalytics = (productVariant: ProductVariant) => {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: productVariantActionTypes.sendAnalytics,
                payload: {
                    sku: productVariant.sku,
                    label: productVariant.label,
                    value: productVariant.value,
                    unit: productVariant.unit,
                    variantDisplayType: productVariant.variantDisplayType,
                },
            });
        };
    };

    const getProductVariants = (sku?: string): ThunkResult<void> => {
        return async (dispatch, getState, {productRelationshipProvider, searchProvider}) => {
            const state: State = getState();
            const _sku = sku || (state.product && state.product.product.sku);

            if (_sku === null) {
                return;
            }

            dispatch({type: productVariantActionTypes.fetchProductVariants});

            try {
                const relationshipApiResponse = await productRelationshipProvider.getProductVariants(
                    _sku,
                    state.intl.locale,
                    productRelationshipApiInstrumentation,
                );

                const productVariants: ProductVariant[][] = await filterOnlineProductVariantsSearchApi(
                    relationshipApiResponse,
                    getState,
                    searchProvider,
                );
                dispatch({type: productVariantActionTypes.getProductVariantsSuccess, productVariants});
            } catch (error) {
                dispatch({type: productVariantActionTypes.getProductVariantsFailure});
            }
        };
    };

    const filterOnlineProductVariantsSearchApi = async (
        productVariants: ProductVariant[][],
        getState: getStateFunc,
        searchProvider: ApiSearchProvider,
    ): Promise<ProductVariant[][]> => {
        const skus: string[] = [];
        productVariants.forEach((productVariant: ProductVariant[]) => {
            productVariant.forEach((variant) => skus.push(variant.sku));
        });

        try {
            const searchResult: SearchResult = await getProductsSearchApi(skus, getState, searchProvider);
            const findOnlineProduct = (variant: ProductVariant) =>
                searchResult.products.find((product) => product.sku === variant.sku);

            return productVariants.map((productVariant) =>
                productVariant
                    .filter(findOnlineProduct)
                    .filter(Boolean)
                    .map((variant) => {
                        const searchProduct =
                            searchResult.products.find((product) => product.sku === variant.sku) ||
                            ({} as SimpleProduct);
                        return {
                            ...variant,
                            name: searchProduct.name,
                            seoName: searchProduct.seoName,
                            salePrice: searchProduct.priceWithoutEhf,
                            regularPrice: searchProduct.regularPrice,
                        };
                    }),
            );
        } catch (error) {
            return productVariants;
        }
    };

    const getProductsSearchApi = async (
        skus: string[],
        getState: getStateFunc,
        searchProvider: ApiSearchProvider,
    ): Promise<SearchResult> => {
        const state: State = getState();

        if (!skus || !Array.isArray(skus) || skus.length < 1) {
            throw new Error("Argument skus is required.");
        }
        const querySkus = skus.join(" ");

        return searchProvider.search({
            page: 1,
            pageSize: skus.length,
            path: state.search.path,
            query: querySkus,
            sort: state.search.sort,
        });
    };

    return {
        sendAnalytics,
        getProductVariants,
    };
})();
