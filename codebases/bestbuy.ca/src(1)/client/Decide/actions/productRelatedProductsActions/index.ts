import {ActionCreatorsMapObject} from "redux";
import getLogger from "common/logging/getLogger";
import {ThunkResult, ProductRelationshipTypes, Availability} from "models";
import {createProductContentProvider} from "providers";

export const productRelatedProductsActionTypes = {
    fetchProductRelatedProducts: "FETCH_PRODUCT_RELATED_PRODUCTS",
    fetchProductRelatedProductsSuccess: "FETCH_PRODUCT_RELATED_PRODUCTS_SUCCESS",
    fetchProductRelatedProductsFailure: "FETCH_PRODUCT_RELATED_PRODUCTS_FAILURE",
    fetchRelatedProduct: "FETCH_RELATED_PRODUCT",
    fetchRelatedProductSuccess: "FETCH_RELATED_PRODUCT_SUCCESS",
    fetchRelatedProductFailure: "FETCH_RELATED_PRODUCT_FAILURE",
};

export interface ProductRelatedProductsActionCreators extends ActionCreatorsMapObject {
    getRelatedProducts: (relationshipType: ProductRelationshipTypes, sku: string) => ThunkResult<void>;
    getRelatedRequiredProducts: (sku: string) => ThunkResult<void>;
    getRelatedServices: (sku: string) => ThunkResult<void>;
    getRelatedGSPs: (sku: string) => ThunkResult<void>;
}

export const productRelatedProductsActionCreators: ProductRelatedProductsActionCreators = (() => {
    const getRelatedProducts = (
        relationshipType: ProductRelationshipTypes = ProductRelationshipTypes.REQUIRED_PRODUCT,
        sku: string,
    ): ThunkResult<void> => {
        return async (dispatch, getState, {relatedProductsProvider}) => {
            try {
                dispatch({
                    type: productRelatedProductsActionTypes.fetchProductRelatedProducts,
                    payload: {relationshipType, sku},
                });
                const {
                    config: {dataSources: {contentApiUrl} = {}} = {},
                    intl: {language, locale = "en-CA"} = {},
                    user: {shippingLocation: {regionCode, postalCode = ""} = {}} = {},
                } = getState();
                const {error, productsPromises, result} = await relatedProductsProvider.getRelatedProducts(
                    relationshipType,
                    sku,
                    language,
                    regionCode,
                );
                const skus = result?.items?.map(({id}) => id);
                dispatch({
                    type: productRelatedProductsActionTypes.fetchProductRelatedProductsSuccess,
                    payload: {...result, sku},
                });
                let availabilityResponse: Record<string, Availability>;
                if (skus?.length > 0) {
                    const response = await relatedProductsProvider.availabilityProvider.getAvailabilities(
                        skus,
                        [],
                        locale,
                        postalCode,
                    );
                    availabilityResponse = response.availabilities?.reduce?.((availabilityHash, availability) => {
                        availabilityHash[availability.sku] = availability;
                        return availabilityHash;
                    }, {} as Record<string, any>);
                }
                productsPromises.forEach(async (productPromise: Promise<any>, index: number) => {
                    const serviceSku = skus[index];
                    try {
                        dispatch({
                            type: productRelatedProductsActionTypes.fetchRelatedProduct,
                            payload: result?.items?.[index],
                        });
                        const productResponse = await productPromise;
                        const product = await productResponse.json();
                        const [offer] = await relatedProductsProvider.offerProvider.getOffers(serviceSku);
                        const availability = availabilityResponse?.[serviceSku];
                        const provider = createProductContentProvider(
                            contentApiUrl as string,
                            locale,
                            regionCode as string,
                            serviceSku,
                        );
                        let content;
                        try {
                            content = await provider.getContent();
                        } catch (contentError) {
                            getLogger().error(contentError);
                        }
                        dispatch({
                            type: productRelatedProductsActionTypes.fetchRelatedProductSuccess,
                            payload: {
                                product,
                                offer,
                                availability,
                                content: content?.contexts.product_service?.items?.[0],
                                parentSKU: sku,
                            },
                        });
                    } catch (catchError) {
                        dispatch({
                            type: productRelatedProductsActionTypes.fetchRelatedProductFailure,
                            payload: {sku: serviceSku, error: catchError, parentSKU: sku},
                        });
                        getLogger().error(catchError);
                    }
                });

                if (error) {
                    dispatch({
                        type: productRelatedProductsActionTypes.fetchProductRelatedProductsFailure,
                        payload: {error, parentSKU: sku},
                    });
                }
            } catch (error) {
                dispatch({
                    type: productRelatedProductsActionTypes.fetchProductRelatedProductsFailure,
                    payload: {error, parentSKU: sku},
                });
                getLogger().error(error);
            }
        };
    };

    const getRelatedRequiredProducts = (sku: string) => {
        return getRelatedProducts(ProductRelationshipTypes.REQUIRED_PRODUCT, sku);
    };

    const getRelatedServices = (sku: string) => {
        return getRelatedProducts(ProductRelationshipTypes.SERVICE, sku);
    };

    const getRelatedGSPs = (sku: string) => {
        return getRelatedProducts(ProductRelationshipTypes.GSP, sku);
    };

    return {
        getRelatedProducts,
        getRelatedRequiredProducts,
        getRelatedServices,
        getRelatedGSPs,
    };
})();
