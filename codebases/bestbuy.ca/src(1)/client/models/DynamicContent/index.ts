import {SideNavigationNode} from "models";
import {LinkEventType as GlobalLinkEventType} from "@bbyca/apex-components";
import {Theme} from "models/GlobalContent";
import {Contexts, ContentItem} from "models/Context";

export enum SectionItemTypes {
    anchorNav = "anchor-list",
    banner = "banner",
    button = "button",
    categoryIcon = "category-icon",
    categoryIconList = "category-icon-list",
    customContent = "custom-content",
    customContentList = "custom-content-list",
    featureBanner = "feature-banner",
    featureBannerList = "feature-banner-list",
    flexBanner = "flex-banner",
    heroBanner = "hero-banner",
    barBanner = "bar-banner",
    titleBanner = "title-banner",
    imageBlock = "image-block",
    lifestyleBanner = "lifestyle-banner",
    offerList = "offer-list",
    showcaseBanner = "showcase-banner",
    skuList = "sku-list",
    story = "story",
    textBlock = "text-block",
    timeline = "timeline",
    htmlContent = "html-content",
    prodListingBanner = "product-listing-banner",
}

export enum ProductMessageType {
    deliveryInfo = "delivery-info",
    saleMessage = "sale-message",
    browseMode = "browse-mode",
    rpuDisabled = "rpu-disabled",
    correctionNotice = "correction-notice",
}

export enum ContextType {
    saleMessage = "sale_message",
    correctionNotice = "correction_notice",
    returnPolicy = "return_policy",
    vendorFunded = "vendor_funded",
    deliveryNotice = "delivery_notice",
    chat = "chat",
}

export enum CustomContentType {
    criteoSponsoredProducts = "criteo-sponsored-products",
    adobe = "adobe",
    adobeRecentlyViewed = "adobe-recently-viewed",
    adobeTopSellers = "adobe-top-sellers",
    productFinder = "product-finder",
    adSlotGoogle = "ad-slot-google",
}

export enum TextTypes {
    Standard = "standard",
    Legal = "legal",
}

export enum ContentPositions {
    left = "left",
    right = "right",
    centre = "centre",
}

export enum BackgroundWidth {
    browserSize = "browserSize",
    siteSize = "siteSize",
    trueSize = "trueSize",
}

export enum CMSMappedSizing {
    browserSize = "browser",
    siteSize = "site",
    trueSize = "true",
}

export interface Breadcrumb {
    seoText?: string;
    label: string;
    path: string;
}

export interface DynamicContentModel {
    altLangId?: string;
    altLangPath?: string;
    breadcrumbs?: Breadcrumb[];
    contexts?: Contexts<ContentItem>;
    displayContactUs?: boolean;
    h1: string;
    hasDynamicTopSellers?: boolean;
    id: string;
    navigation?: SideNavigationNode[];
    sections: SectionData[];
    seo?: Seo;
    textBlock?: TextBlockType;
    productListing?: {
        displayProductListing?: boolean;
    };
}

export interface Seo {
    seoText: string;
    headerTitle: string;
    metaDescription: string;
    altLangSeoText?: string;
    canonicalUrl?: string;
    disabled?: boolean;
    description?: string;
    overview?: string;
    overviewTitle?: string;
    discoverable?: boolean;
}

export interface DisplayOptions {
    textType?: TextTypes;
    backgroundWidth?: BackgroundWidth;
    theme?: Theme;
    textTheme?: Theme;
    backgroundColour?: string;
    textPosition?: ContentPositions;
    bannerWidth?: BackgroundWidth;
    foregroundImageAlignment?: ContentPositions;
    marginExtraSmall?: MarginSizes;
    marginSmall?: MarginSizes;
    marginMedium?: MarginSizes;
    displayAs?: MerchSkuListDisplayTypes;
    textLayout?: TextLayout;
}

export interface TextBlockType {
    title: string;
    body: string;
    displayOptions: Pick<
        DisplayOptions,
        "textType" | "textPosition" | "textTheme" | "backgroundColour" | "backgroundWidth"
    > & {bodyVideo?: videoProps.ageRestricted};
    accordians: string[];
}

export interface TargettedContentTextBlock {
    title: string;
    body: string;
}

export type BannerDisplayOption = Pick<DisplayOptions, "textPosition" | "theme" | "foregroundImageAlignment">;

export type BackgroundDisplayOptions = Pick<DisplayOptions, "backgroundColour" | "backgroundWidth" | "theme">;
export interface CustomContentList {
    mobileDisplay: 1 | 2;
    customContentList: MerchItem[];
}

export interface OfferItem {
    offerTitle: string;
    text: string;
    event?: LinkEventType;
    image?: SectionImage;
    hasCustomImage: boolean;
    type?: SectionItemTypes;
    customContentType?: CustomContentType;
}

export interface SectionStoryBanner {
    ctaText: string;
    event: any;
    headline1: string;
    headline2: string;
    image: SectionImage;
    alternateText: string;
}

export interface SectionImage extends Partial<ResponsiveImageType> {
    alternateText: string;
    fallbackImage?: ImageResType;
}

export interface SectionData {
    id?: string;
    className?: string;
    title?: string;
    items: MerchItem[];
}
export interface SectionMessageData {
    className?: string;
    title?: string;
    items: MessageItem[];
}

export interface SectionItem {
    event?: LinkEventType;
    type: SectionItemTypes;
    displayOptions: Pick<DisplayOptions, "marginExtraSmall" & "marginSmall" & "marginMedium">;
}

export interface WarrantySectionItem extends SectionItem {
    body: string;
    title?: string;
}

export interface Context {
    items: SectionItem[];
}

export interface WarrantyContext {
    items: WarrantySectionItem[];
}

export enum WarrantyType {
    PSP = "PSP",
    PRP = "PRP",
}

export enum CmsWarrantyType {
    PSP = "gsp",
    PRP = "gsrp",
}

export interface MerchItem extends SectionItem {
    bannerType?: string;
    imageOnly?: boolean;
    customContentType?: string;
    values?: {[key: string]: string};
    adLoaded?: boolean;
}

export interface FlexBannerType extends SectionItem {
    image: ResponsiveImageType;
    bodyText: string;
    highlightedText: string;
    alternateText: string;
    event?: GlobalLinkEventType;
}

export interface MessageItem extends SectionItem {
    ctaText?: string;
    messageType: string;
    messageTitle: string;
    messageBody: string;
}

export interface ShowcaseBannerType extends MerchItem {
    backgroundImage: ResponsiveImageType;
    title: string;
}

export interface MerchBannerType extends MerchItem {
    image: ResponsiveImageType;
    backgroundImage?: ResponsiveImageType;
    description: string;
    tagline?: null;
}

export interface PromoBanner extends MerchBannerType {
    title?: string;
    alternateText?: string;
    headline1?: string;
    headline2?: string;
    ctaText?: string;
}

export interface MerchCategoryListType extends MerchItem {
    categoryList: MerchCategoryType[];
}

export interface MerchCategoryType extends MerchItem {
    alternateText?: string;
    image?: ResponsiveImageType;
    text?: string;
}

export interface MerchOfferType extends MerchItem {
    alternateText?: string;
    ctaText?: string;
    image?: ResponsiveImageType;
    offerTitle?: string;
    text?: string;
}

export enum MerchSkuListDisplayTypes {
    grid = "grid",
    slideshow = "slideshow",
}

type MerchDisplayOptions = Pick<DisplayOptions, "displayAs">;
export interface MerchSkuListType extends MerchItem {
    ctaText?: string;
    skuList?: any[];
    title?: string;
    displayOptions?: MerchDisplayOptions;
}

export enum MarginSizes {
    none = "none",
    extraSmall = "extra-small",
    small = "small",
    medium = "medium",
    large = "large",
}

export interface ImageResType {
    x1: string;
    x2?: string;
    x3?: string;
}

export enum ResponsiveTypes {
    extraSmall = "extraSmall",
    small = "small",
    medium = "medium",
    large = "large",
    infinity = "infinity",
}

export type ResponsiveImageType = {
    [key in keyof typeof ResponsiveTypes]: ImageResType;
};

export enum TextLayout {
    long = "long",
    short = "short",
}

export enum DisplayTypes {
    browserSize = "browser-size",
    siteSize = "site-size",
    trueSize = "true-size",
}

export enum TextPosition {
    left = "left",
    right = "right",
}

export enum videoProps {
    ageRestricted = "ageRestricted",
}

export enum EventTypes {
    product = "product",
    category = "category",
    collection = "collection",
    search = "search",
    externalUrl = "externalUrl",
    internalUrl = "internalUrl",
    video = "video",
}

export interface LinkEventType extends Pick<GlobalLinkEventType, "query" | "eventId" | "seoText" | "url" | "ctaText"> {
    eventType: EventTypes;
    ageRestricted?: boolean;
}
