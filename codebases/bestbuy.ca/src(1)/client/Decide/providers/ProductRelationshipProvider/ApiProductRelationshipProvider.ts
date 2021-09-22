import * as url from "url";

import {ProductVariant} from "models";
import {HttpRequestType, StatusCode} from "errors";
import fetch from "utils/fetch";

import {ProductRelationshipProvider} from "./";
import {compareProductVariant} from "./compareProductVariant";
import Link from "react-router/lib/Link";

export interface VariantProducts {
    id: string;
    variations: Variation[];
}

export interface Variation {
    type: string;
    unit: string;
    value: string;
    image?: Image;
}

export interface Image {
    _links: Link;
}

export interface VariantDefinition {
    type: string;
    name: string;
    variantType: string;
    displayLimit: string;
}

export interface ProductVariantCollection {
    variantDefinitions: VariantDefinition[];
    variantProducts: VariantProducts[];
}

export class ApiProductRelationshipProvider implements ProductRelationshipProvider {
    private getDefaultHeaders = {
        "BestBuy-Access-Token": this.apiKey,
    };

    constructor(private baseUrl: string, private apiKey: string) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    }

    public async getProductVariants(
        sku: string,
        locale: Locale,
        callback?: (resourceUrl: string, sku: string) => void,
    ): Promise<ProductVariant[][]> {
        const pathName: string = `/products/${sku}/variants`;
        const productVariantUrl = url.parse(this.baseUrl + pathName);
        const formattedUrl = url.format({
            ...productVariantUrl,
            query: {
                lang: locale,
            },
        });

        try {
            const response = await fetch(formattedUrl, HttpRequestType.ProductRelationshipApi, {
                headers: {...this.getDefaultHeaders},
            });

            const json = await response.json();

            return this.transformProductVariantResponse(sku, json);
        } catch (error) {
            if (error.statusCode === StatusCode.NotFound) {
                return [] as ProductVariant[][];
            }
            throw error;
        } finally {
            if (callback) {
                callback(formattedUrl, sku);
            }
        }
    }

    private transformProductVariantResponse = (
        sku: string,
        productVariantResponse: ProductVariantCollection,
    ): ProductVariant[][] => {
        const multiProductVariants: ProductVariant[][] = [];

        if (!productVariantResponse.variantProducts || productVariantResponse.variantProducts.length === 0) {
            return multiProductVariants;
        }

        const variantDefinitions: VariantDefinition[] = productVariantResponse.variantDefinitions || [];

        if (variantDefinitions.length === 0) {
            const productVariants: ProductVariant[] = productVariantResponse.variantProducts.map(
                (variant: VariantProducts) => ({sku: variant.id, variantDisplayType: "swatch"} as ProductVariant),
            );

            multiProductVariants.push(productVariants);
            return multiProductVariants;
        }

        const currentProduct: VariantProducts =
            productVariantResponse.variantProducts.find(
                (variantProduct: VariantProducts) => variantProduct.id === sku,
            ) || ({} as VariantProducts);

        const currentProductVariations: Variation[] = currentProduct && currentProduct.variations;

        variantDefinitions.forEach((variantDefinition: VariantDefinition) => {
            const {type: variantType, name: variantName, variantType: variantDisplayType, displayLimit} = variantDefinition;

            const sameVariations: Variation[] =
                currentProductVariations &&
                currentProductVariations.filter((variation) => variation.type !== variantType);

            const removeIndirectVariants = (variantProduct: VariantProducts): boolean => {
                for (const sameVariation of sameVariations) {
                    const currentVariantType = sameVariation.type;
                    const variationToCompare =
                        variantProduct.variations &&
                        variantProduct.variations.find((variation) => variation.type === currentVariantType);
                    if (sameVariation.value !== (variationToCompare && variationToCompare.value)) {
                        return false;
                    }
                }
                return true;
            };

            const productVariants: ProductVariant[] = productVariantResponse.variantProducts
                .filter(removeIndirectVariants)
                .map((variantProducts: VariantProducts) => {
                    const variationType =
                        variantProducts.variations &&
                        variantProducts.variations.find((variation: Variation) => variation.type === variantType);

                    return {
                        sku: variantProducts.id,
                        label: variantName,
                        value: variationType && variationType.value,
                        unit: variationType && variationType.unit,
                        variantType,
                        variantDisplayType,
                        displayLimit,
                        variantImageUrl: variationType && variationType.image && variationType.image._links.self.href,
                    };
                });

            const uniqueProductVariants =
                productVariants.length > 0
                    ? Array.from(new Set(productVariants.sort(compareProductVariant)))
                    : productVariants;

            if (uniqueProductVariants && uniqueProductVariants.length > 0) {
                multiProductVariants.push(uniqueProductVariants);
            }
        });

        return multiProductVariants;
    };
}

export default ApiProductRelationshipProvider;
