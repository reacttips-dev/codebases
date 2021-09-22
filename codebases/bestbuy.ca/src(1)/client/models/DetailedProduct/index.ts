import {ProductBase, ProductBaseProps} from "../ProductBase";
import {Seller} from "../Seller";
import {Offer} from "../Offer";
import {WarrantyType} from "models/DynamicContent";
import {ProductMedia} from "models";
import {ProductVideo} from "models/ProductMedia";
import {BazaarVoiceWindow} from "Decide/pages/ProductDetailPage/utils/bazaarVoiceAnalytics";

interface DetailedProductInitArgs {
    brandName: string;
    shortDescription: string;
    longDescription: string;
    modelNumber: string;
    productImage: string;
    placeholderImage: string;
    preorderReleaseDate: string;
    isPreorderable: boolean;
    isSpecialDelivery: boolean;
    seller: Seller;
    seoText: string;
    altLangSeoText: string;
    bundleProducts: BundleProduct[];
    specs: Specs;
    additionalImages: string[];
    warranties: Warranty[];
    warrantyBenefittsMessages: WarrantyBenefitsMessage[];
    primaryParentCategoryId: string;
    whatsIncluded: string[];
    requiredProducts: RequiredProduct[];
    productVariants: ProductVariant[][];
    productVideos: ProductVideo[];
    upcs: string[];
    media: ProductMedia;
}

export class DetailedProduct extends ProductBase {
    public brandName: string;
    public shortDescription: string;
    public longDescription: string;
    public modelNumber: string;
    public productImage: string;
    public placeholderImage: string;
    public preorderReleaseDate: string;
    public isPreorderable: boolean;
    public isSpecialDelivery: boolean;
    public seller: Seller;
    public seoText: string;
    public altLangSeoText: string;
    public bundleProducts: BundleProduct[] | null;
    public specs: Specs;
    public additionalImages: string[];
    public warranties: Warranty[];
    public warrantyBenefitsMessages: WarrantyBenefitsMessage[];
    public primaryParentCategoryId: string;
    public whatsIncluded: string[];
    public requiredProducts: RequiredProduct[];
    public productVariants: ProductVariant[][];
    public productVideos: ProductVideo[];
    public upcs: string[];
    public media: ProductMedia;
    public marketplaceDeliveryPromise?: number;

    constructor(props: ProductBaseProps & DetailedProductInitArgs) {
        super(props);
        this.brandName = props.brandName;
        this.shortDescription = props.shortDescription;
        this.longDescription = props.longDescription;
        this.modelNumber = props.modelNumber;
        this.productImage = props.productImage;
        this.placeholderImage = props.placeholderImage;
        this.preorderReleaseDate = props.preorderReleaseDate;
        this.isPreorderable = props.isPreorderable;
        this.isSpecialDelivery = props.isSpecialDelivery;
        this.seller = props.seller;
        this.seoText = props.seoText;
        this.altLangSeoText = props.altLangSeoText;
        this.bundleProducts = props.bundleProducts;
        this.specs = props.specs;
        this.additionalImages = props.additionalImages;
        this.warranties = props.warranties;
        this.warrantyBenefitsMessages = props.warrantyBenefittsMessages;
        this.primaryParentCategoryId = props.primaryParentCategoryId;
        this.whatsIncluded = props.whatsIncluded;
        this.requiredProducts = props.requiredProducts;
        this.productVariants = props.productVariants;
        this.productVideos = props.productVideos;
        this.upcs = props.upcs;
        this.media = props.media;

        this.bundleProducts = null;
    }
}

export interface Specs {
    [groupId: string]: SpecItem[];
}

export interface SpecItem {
    name: string;
    value: string;
}

export type BundleProductKeys = "name" | "seoText" | "shortDescription" | "sku" | "specs" | "productImage";

export interface BundleProduct extends Pick<DetailedProduct, BundleProductKeys> {}

export enum WarrantySubType {
    InHome = "InHome",
    InStore = "InStore",
}

export interface Warranty {
    parentSku: string;
    sku: string;
    title: string;
    type: WarrantyType | string;
    subType: WarrantySubType | string;
    termMonths: number;
    regularPrice: number;
    id: string;
}

export interface SpecialOffer {
    promotionId: string;
    promotionText: string;
    promotionDetails: string;
}

export interface ProductSellerSummary {
    count: number;
    lowestOffer?: Offer;
}

export function toProductSellerSummary(offers: Offer[]): ProductSellerSummary {
    return {
        count: offers.length || 0,
        lowestOffer: offers.find((offer) => offer.isWinner),
    };
}

export function isBundle(product: DetailedProduct): boolean {
    return product.bundleProducts && product.bundleProducts.length > 0;
}

export interface WarrantyBenefitsMessage {
    articleId: string;
    associationLevel: string;
    type: string;
    warrantyType: string;
    title: string;
    benefits: Benefit[];
    description: string;
    articleBody: string;
}

export interface Benefit {
    description: string;
    imageUrl: string;
}

export interface CmsMessage {
    body: string;
}

export enum RequiredProductType {
    Required = "Required",
}

/**
 *
 * sku: Sku number of the Required Product.
 * name: The Name of the Required Product.
 * type: RequiredProductType.
 * thumbnailImage: url to Required Product img thumbnail.
 *
 * @export
 * @interface RequiredProduct
 */

export interface RequiredProduct {
    sku: string;
    name: string;
    type: RequiredProductType;
    thumbnailImage: string;
}

export interface ProductVariant {
    sku: string;
    name?: string;
    seoName?: string;
    label?: string;
    value?: string;
    unit?: string;
    salePrice?: number;
    regularPrice?: number;
    variantDisplayType?: string;
    variantType?: string;
    displayLimit?: VariantDisplayLimit;
}

export enum VariantDisplayLimit {
    all = "all",
    default = "default"
}

export interface SyndigoWindow extends BazaarVoiceWindow {
    SYNDI: {
        push: (sku: string) => void;
        reset: () => void;
    };
}
export interface OneWorldSyncWindow extends BazaarVoiceWindow {
    ccs_cc_set_param: (key: string, value: string) => void;
    ccs_cc_load_content: () => void;
    ccs_cc_args: string[][];
}
