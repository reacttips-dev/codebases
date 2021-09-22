import {DetailedProduct, Seller} from "models";
export interface BVProductCatalogue {
    productId: string;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productPageURL?: string;
    brandName: string;
    upcs: string[];
}
export const sendProductContentCollection = (product: BVProductCatalogue, locale: Locale): void => {
    if (typeof window !== "undefined") {
        (window as any).bvDCC = {
            catalogData: {
                locale: convertLocaleToBazaarVoiceLocale(locale),
                catalogProducts: [product],
            },
        };

        (window as any).bvCallback = (BV) => {
            BV.pixel.trackEvent("CatalogUpdate", {
                type: "Product",
                locale: convertLocaleToBazaarVoiceLocale(locale),
                catalogProducts: [product],
            });
        };
    }
};

export const convertLocaleToBazaarVoiceLocale = (locale: Locale): string => {
    return locale.substring(0, 2) + "_CA";
};

export type ConvertProductType = Pick<
    DetailedProduct,
    "sku" | "name" | "shortDescription" | "productImage" | "brandName" | "upcs"
>;

export const convertProductToBVProductCatalogue = (product: ConvertProductType): BVProductCatalogue => ({
    productId: product.sku,
    productName: product.name,
    productDescription: product.shortDescription,
    productImageUrl: product.productImage,
    brandName: product.brandName,
    productPageURL: window && window.location.href,
    upcs: product.upcs,
});

export type ConvertSellerType = Pick<Seller, "id" | "name" | "description" | "imageUrl">;

export const convertSellerToBVProductCatalogue = (seller: ConvertSellerType): BVProductCatalogue => ({
    productId: seller.id,
    productName: seller.name,
    productDescription: seller.description,
    productImageUrl: seller.imageUrl || "",
    brandName: seller.name,
    productPageURL: window && window.location.href,
    upcs: [],
});
