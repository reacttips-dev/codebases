import * as url from "url";
import fetch from "utils/fetch";
import {HttpRequestType} from "errors";
import {AvailabilityShippingStatus, Region} from "models";
import {Logger} from "common/logging";

export interface SavedProduct {
    sku: string;
    name: string;
    thumbnailUrl: string;
    seoText: string;
    regularPrice: number;
    purchasePrice: number;
    ehf: number;
    onSale: boolean;
    availability: {
        pickup: {
            purchasable: boolean;
        };
        shipping: {
            purchasable: boolean;
            status: AvailabilityShippingStatus;
        };
    };
    isOnline: boolean;
    removed?: boolean;
    removeError?: boolean;
    movedToCart?: boolean;
    moveToCartError?: boolean;
    saleEndDate?: string;
}

export interface ProductListResponse {
    id: string;
    products: SavedProduct[];
}

export interface ProductListErrorResponse {
    timestamp: string;
    status: string;
    message: string;
}
interface MoveProductToCartParams {
    regionCode: Region;
    postalCode: string;
    destinationBasketId: string;
    sku: string;
    productListId: string;
}

export interface SaveForLaterArgs {
    regionCode: Region;
    postalCode: string;
    lineItemId: string;
    basketId: string;
    sku: string;
    productListId: string | undefined;
}

interface MoveProductToCartResponse {
    basketId: string;
    id: string;
    status: number;
}

interface SaveItemForLaterResponse {
    basketId: string;
    id: string;
    status: number;
}

export interface RemoveSavedItemArgs {
    sku: string;
    productListId: string | undefined;
}

export interface ProductListApi {
    getSaveForLaterLists(
        locale: Locale,
        regionCode: Region,
        postalCode: string,
        productListId: string,
    ): Promise<ProductListResponse>;
    moveProductToCart({
        regionCode,
        postalCode,
        destinationBasketId,
        productListId,
    }: MoveProductToCartParams): Promise<MoveProductToCartResponse>;
    saveItemForLater(s4LProps: SaveForLaterArgs): Promise<SaveItemForLaterResponse>;
}

interface Dependencies {
    baseUrl: string;
    logger: Logger;
}

interface Dependencies {
    baseUrl: string;
    logger: Logger;
}

export default class ProductListProvider implements ProductListApi {
    public static DEFAULT_HEADERS = {
        "Content-Type": "application/json",
    };
    private baseUrl: string;
    private logger: Logger;

    constructor(deps: Dependencies) {
        const {baseUrl, logger} = deps;
        this.baseUrl = baseUrl;
        this.logger = logger;
    }

    public async getSaveForLaterLists(
        locale: Locale,
        regionCode: string,
        postalCode: string,
        productListId: string,
    ): Promise<ProductListResponse> {
        try {
            const formattedUrl = url.format({
                ...url.parse(`${this.baseUrl}/saved-items/${productListId}`),
                query: {
                    postalCode,
                    regionCode,
                },
            });

            const response = await fetch(formattedUrl, HttpRequestType.ProductListApi, {
                headers: {
                    ...ProductListProvider.DEFAULT_HEADERS,
                    "Accept-Language": locale,
                },
            });
            return response.json();
        } catch (error) {
            this.logger.error(new Error(`Error calling ProductListApi.getSaveForLaterLists(): ${error}`));
            throw error;
        }
    }

    public async moveProductToCart({
        regionCode,
        postalCode,
        destinationBasketId,
        sku,
        productListId,
    }: MoveProductToCartParams): Promise<MoveProductToCartResponse> {
        try {
            const formattedUrl = url.format({
                ...url.parse(`${this.baseUrl}/saved-items/${productListId}/move-to-basket`),
                query: {
                    postalCode,
                    regionCode,
                },
            });
            const response = await fetch(formattedUrl, HttpRequestType.ProductListApi, {
                headers: {
                    ...ProductListProvider.DEFAULT_HEADERS,
                },
                method: "POST",
                body: JSON.stringify({
                    destinationBasketId,
                    sku,
                }),
            });
            return response.json();
        } catch (error) {
            this.logger.error(new Error(`Error moving product to cart: ${error}`));
            throw error;
        }
    }

    public async saveItemForLater({
        regionCode,
        postalCode,
        lineItemId,
        sku,
        basketId,
        productListId,
    }: SaveForLaterArgs): Promise<SaveItemForLaterResponse> {
        const payload = {
            sku,
            sourceBasket: {
                id: basketId,
                lineItemId,
            },
        };

        try {
            const urlString = productListId
                ? `saved-items/${productListId}/move-from-basket`
                : `saved-items/move-from-basket`;
            const formattedUrl = url.format({
                ...url.parse(`${this.baseUrl}/${urlString}`),
                query: {
                    postalCode,
                    regionCode,
                },
            });

            const response = await fetch(formattedUrl, HttpRequestType.ProductListApi, {
                headers: {
                    ...ProductListProvider.DEFAULT_HEADERS,
                },
                body: JSON.stringify(payload),
                method: "POST",
            });

            return response.json();
        } catch (error) {
            this.logger.error(new Error(`Error calling ProductListApi.saveItemForLater(): ${error}`));
            throw error;
        }
    }

    public async removeSavedItem({sku, productListId}: RemoveSavedItemArgs): Promise<void> {
        try {
            const formattedUrl = url.format({
                ...url.parse(`${this.baseUrl}/saved-items/${productListId}/skus/${sku}`),
            });
            const response = await fetch(formattedUrl, HttpRequestType.ProductListApi, {
                headers: {
                    ...ProductListProvider.DEFAULT_HEADERS,
                },
                method: "DELETE",
            });

            return response;
        } catch (error) {
            this.logger.error(new Error(`Error calling ProductListApi.removeSavedItem(): ${error}`));
            throw error;
        }
    }
}
