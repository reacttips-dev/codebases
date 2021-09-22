import {createSelector, Selector} from "reselect";

import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";
import {getLineItemBySku} from "@bbyca/ecomm-checkout-components";
import {LineItemType} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import {ProductRelatedProduct, ProductRelationshipTypes} from "models";
import {State} from "store";
import {getFeatureToggle} from "store/selectors";
import {FEATURE_TOGGLES} from "config/featureToggles";

const getRootState: Selector<State, State> = (state: State): State => state;
export const getProductServicesMap = (
    rootState: State,
    parentSku: string,
    filterByAvailability: boolean = true,
): ProductService[] => {
    let services: ProductService[] = [];
    const hiddenServices = getFeatureToggle(FEATURE_TOGGLES.hiddenServices)(rootState) || [];
    if (rootState?.productRelatedProducts?.products?.[parentSku]) {
        services = Object.values(rootState?.productRelatedProducts?.products?.[parentSku]).reduce(
            (
                data,
                {
                    loading,
                    relationshipType,
                    id,
                    product: {sku, name, shortDescription, regularPrice, thumbnailImage150} = {},
                    availability: {shipping: {purchasable} = {}} = {},
                    offer: {regularPrice: offerRegularPrice} = {},
                    content: {
                        title,
                        description,
                        shortTitle,
                        icon,
                        ctaText: addLabel,
                        checkboxLabel: selectionLabel,
                        serviceBenefits: benefits,
                    } = {},
                } = {} as ProductRelatedProduct,
            ) => {
                const shouldHideService =
                    (filterByAvailability && !purchasable && !loading) ||
                    (!name && !loading) ||
                    hiddenServices.indexOf(sku || id) !== -1;
                if (relationshipType === ProductRelationshipTypes.SERVICE) {
                    if (shouldHideService) {
                        return data;
                    }
                    data.push({
                        id: sku || id,
                        sku: sku || id,
                        regularPrice: offerRegularPrice || regularPrice,
                        loading,
                        title: title || name,
                        description: description || shortDescription,
                        benefits,
                        shortTitle,
                        addLabel,
                        selectionLabel,
                        icon: icon?.url || thumbnailImage150,
                    });
                }
                return data;
            },
            [] as ProductService[],
        );
    }
    return services;
};

export const getProductServices = (sku: string, filterByAvailability = true) =>
    createSelector<State, State, ProductService[]>([getRootState], (rootState: State) => {
        return getProductServicesMap(rootState, sku, filterByAvailability);
    });

export const getSelectedServicesFromSku = (sku: string) =>
    createSelector<State, State, string[]>([getRootState], (rootState: State) => {
        const lineItem = getLineItemBySku(rootState.cart, sku);
        return (
            lineItem?.children?.reduce((result, {lineItemType, sku: {id}}) => {
                if (lineItemType === LineItemType.Service) {
                    result.push(id);
                }
                return result;
            }, [] as string[]) || []
        );
    });
