import * as url from "url";
import {HttpRequestType, StatusCode} from "errors";
import {
    BundleProduct,
    DetailedProduct as Product,
    ProductBaseProps,
    Region,
    Seller,
    SpecItem,
    Specs,
} from "models";
import fetch from "utils/fetch";
import {getProductVideos} from "utils/imageUtils";

import {ProductProvider, ProductProviderProps} from "./";
import productCache from "./productCache";

export class ApiProductProvider implements ProductProvider {
    constructor(private baseUrl: string, private locale: Locale, private regionCode: Region) {}

    public async getProduct(props?: ProductProviderProps): Promise<Product> {
        const productUrl = url.parse(url.resolve(this.baseUrl, props.sku));
        const query: string = url.format({
            query: {
                currentRegion: this.regionCode,
                include: "all",
                lang: this.locale,
            },
        });

        const formattedUrl = `${url.format(productUrl)}${query}`;

        const cacheKey = formattedUrl;
        if (typeof window === "undefined") {
            const productData = productCache.get(cacheKey);
            if (productData) {
                return productData;
            }
        }
        const response = await fetch(formattedUrl, HttpRequestType.ProductApi);
        const json = await response.json();

        const baseProductProps: ProductBaseProps = {
            customerRating: json.customerRating,
            customerRatingCount: json.customerRatingCount,
            ehf: json.ehf,
            hideSaving: json.hideSavings,
            isMarketplace: json.isMarketplace,
            name: json.name,
            regularPrice: json.regularPrice,
            saleEndDate: json.SaleEndDate,
            salePrice: json.salePrice,
            sku: json.sku,
            isAdvertised: json.isAdvertised,
            isOnlineOnly: json.isOnlineOnly,
        };

        const product: Product = new Product(baseProductProps);
        product.brandName = json.brandName;
        product.modelNumber = json.modelNumber;
        product.productImage = json.thumbnailImage.replace(/55x55/, "500x500");
        product.shortDescription = json.shortDescription;
        product.longDescription = json.longDescription;
        product.seoText = json.seoText || undefined;
        product.altLangSeoText = json.altLangSeoText;
        product.preorderReleaseDate = json.PreorderReleaseDate;
        product.primaryParentCategoryId = json.primaryParentCategoryId;
        product.isPreorderable = json.isPreorderable;
        product.isSpecialDelivery = json.isSpecialDelivery;
        product.warranties = json.warranties;
        product.warrantyBenefitsMessages = json.warrantyBenefitsMessages;
        product.seller = json.seller ? ({id: json.seller.id, name: json.seller.name} as Seller) : null;
        product.isAdvertised = json.isAdvertised;
        product.isOnlineOnly = json.isOnlineOnly;
        product.whatsIncluded = json.whatsInTheBox;
        product.requiredProducts = json.requiredProducts;
        product.upcs = (json.relatedUpcs || []).concat(json.upcNumber);

        product.additionalImages = (json.additionalMedia || ([] as any[])).map((x) => x.url);

        product.bundleProducts = await this.getBundleProducts(json.bundle);

        product.specs = this.getProductSpecs(json);

        product.productVideos = getProductVideos(json.videos);

        if (typeof window === "undefined") {
            productCache.set(cacheKey, product);
        }

        return product;
    }

    /**
     * Get bundle products by performing API calls for each subproduct in the
     * bundle property
     */
    private getBundleProducts = async (bundle: [{sku: string}]) => {
        const bundleProducts = [] as BundleProduct[];
        if (bundle && bundle.length) {
            const bundleProductResponses = await Promise.all(
                bundle.map((subproduct) => {
                    const subproductUrl = url.parse(url.resolve(this.baseUrl, subproduct.sku));
                    const query: string = url.format({
                        query: {
                            currentRegion: this.regionCode,
                            lang: this.locale,
                        },
                    });
                    const formattedUrl = `${url.format(subproductUrl)}${query}`;
                    return fetch(formattedUrl, HttpRequestType.ProductApi);
                }),
            );

            bundleProductResponses.forEach(async (bundleProductResponse) => {
                const response = await bundleProductResponse.json();
                bundleProducts.push({
                    name: response.name,
                    seoText: response.seoText,
                    shortDescription: response.shortDescription,
                    sku: response.sku,
                    specs: this.getProductSpecs(response),
                    productImage: response.thumbnailImage.replace(/55x55/, "500x500"),
                } as BundleProduct);
            });
        }
        return bundleProducts;
    };

    /**
     * Get details and specs of the product from raw json data
     */
    private getProductSpecs = (json) => {
        return json.specs.reduce((groups, spec) => {
            groups[spec.group] = [...(groups[spec.group] || []), {name: spec.name, value: spec.value} as SpecItem];
            return groups;
        }, {}) as Specs;
    };
}

export default ApiProductProvider;
