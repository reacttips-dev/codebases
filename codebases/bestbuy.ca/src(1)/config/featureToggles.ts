export enum FEATURE_TOGGLES {
    bazaarVoiceEnabled = "bazaarVoiceEnabled",
    bazaarvoiceQuestionsEnabled = "bazaarvoiceQuestionsEnabled",
    blueShirtChatEnabled = "blueShirtChatEnabled",
    isBrandExpertChatEnabled = "isBrandExpertChatEnabled",
    isBrandExpertChatEnabledForMarketPlace = "isBrandExpertChatEnabledForMarketPlace",
    helpPageLiveChat = "helpPageLiveChat",
    homepageCriteoEnabled = "homepageCriteoEnabled",
    homepageTopDealsDisabled = "homepageTopDealsDisabled",
    isProductVideoEnabled = "isProductVideoEnabled",
    sizeVariants = "sizeVariants",
    solrLabelsEnabled = "solrLabelsEnabled",
    noSearchResults = "noSearchResults",
    isImageZoomEnabled = "isImageZoomEnabled",
    mobileActivationUpgradeCheckEnabled = "mobileActivationUpgradeCheckEnabled",
    pdpFromTheManufacturerTabEnabled = "pdpFromTheManufacturerTabEnabled",
    pdpImportantUpdateText = "pdpImportantUpdateText",
    showRecosAddToCart = "showRecosAddToCart",
    saveForLater = "saveForLater",
    verifiedPurchaserToggleEnabled = "verifiedPurchaserToggleEnabled",
    variantThumbnailEnabled = "variantThumbnailEnabled",
    keyConsiderationEnabled = "keyConsiderationEnabled",
    dynamicContentFeatureToggles = "dynamicContentFeatureToggles",
    bazaarvoiceSellerReviewsEnabled = "bazaarvoiceSellerReviewsEnabled",
    syndigoContentAggregationEnabled = "syndigoContentAggregationEnabled",
    oneWorldSyncContentAggregationEnabled = "oneWorldSyncContentAggregationEnabled",
    flixMediaContentAggregationEnabled = "flixMediaContentAggregationEnabled",
    minMaxPriceFacetEnabled = "minMaxPriceFacetEnabled",
    productServicesEnabled = "productServicesEnabled",
    youMightAlsoLikeWidgetInAddonsPageEnabled = "youMightAlsoLikeWidgetInAddonsPageEnabled",
    gspAboveAddToCart = "gspAboveAddToCart",
    pencilAdsABCDTest = "pencilAdsABCDTest",
    addServiceInCart = "addServiceInCart",
    hiddenServices = "hiddenServices",
    showLowInventory = "showLowInventory"
}

export interface FeaturesMap {
    [FEATURE_TOGGLES.bazaarVoiceEnabled]: boolean;
    [FEATURE_TOGGLES.bazaarvoiceQuestionsEnabled]: boolean;
    [FEATURE_TOGGLES.blueShirtChatEnabled]: boolean;
    [FEATURE_TOGGLES.isBrandExpertChatEnabled]: boolean;
    [FEATURE_TOGGLES.isBrandExpertChatEnabledForMarketPlace]: boolean;
    [FEATURE_TOGGLES.helpPageLiveChat]: boolean;
    [FEATURE_TOGGLES.homepageCriteoEnabled]: boolean;
    [FEATURE_TOGGLES.homepageTopDealsDisabled]: boolean;
    [FEATURE_TOGGLES.isProductVideoEnabled]: boolean;
    [FEATURE_TOGGLES.sizeVariants]: number;
    [FEATURE_TOGGLES.solrLabelsEnabled]: boolean | null;
    [FEATURE_TOGGLES.noSearchResults]: boolean;
    [FEATURE_TOGGLES.isImageZoomEnabled]: boolean;
    [FEATURE_TOGGLES.mobileActivationUpgradeCheckEnabled]: boolean;
    [FEATURE_TOGGLES.pdpFromTheManufacturerTabEnabled]: boolean;
    [FEATURE_TOGGLES.pdpImportantUpdateText]: boolean;
    [FEATURE_TOGGLES.showRecosAddToCart]: boolean;
    [FEATURE_TOGGLES.saveForLater]: boolean;
    [FEATURE_TOGGLES.verifiedPurchaserToggleEnabled]: boolean;
    [FEATURE_TOGGLES.variantThumbnailEnabled]: boolean;
    [FEATURE_TOGGLES.keyConsiderationEnabled]: boolean;
    [FEATURE_TOGGLES.dynamicContentFeatureToggles]: DynamicContentFeatureToggles;
    [FEATURE_TOGGLES.bazaarvoiceSellerReviewsEnabled]: boolean;
    [FEATURE_TOGGLES.syndigoContentAggregationEnabled]: boolean;
    [FEATURE_TOGGLES.oneWorldSyncContentAggregationEnabled]: boolean;
    [FEATURE_TOGGLES.flixMediaContentAggregationEnabled]: boolean;
    [FEATURE_TOGGLES.minMaxPriceFacetEnabled]: boolean;
    [FEATURE_TOGGLES.productServicesEnabled]: boolean;
    [FEATURE_TOGGLES.youMightAlsoLikeWidgetInAddonsPageEnabled]: boolean;
    [FEATURE_TOGGLES.gspAboveAddToCart]: boolean;
    [FEATURE_TOGGLES.pencilAdsABCDTest]: PencilAdsABCDTest;
    [FEATURE_TOGGLES.addServiceInCart]: Boolean;
    [FEATURE_TOGGLES.hiddenServices]: string[];
    [FEATURE_TOGGLES.showLowInventory]: boolean;
}

export enum DYNAMIC_CONTENT_FEATURE_TOGGLES {
    recentlyViewed = "recentlyViewed",
    topSellers = "topSellers"
}

export enum PencilAdsABCDTest {
    control = "control",
    global = "global",
    browseAndPDP = "browseAndPDP",
    browseOnly = "browseOnly",
}

export interface DynamicContentFeatureToggles {
    [DYNAMIC_CONTENT_FEATURE_TOGGLES.recentlyViewed]: boolean;
    [DYNAMIC_CONTENT_FEATURE_TOGGLES.topSellers]: string | undefined;
}

const dynamicContentFeatureToggles = {
    [DYNAMIC_CONTENT_FEATURE_TOGGLES.recentlyViewed]: false,
    [DYNAMIC_CONTENT_FEATURE_TOGGLES.topSellers]: undefined,
};

interface Features {
    [key: string]: FeaturesMap;
}

export const splitIOFeatureToggles = {
    [FEATURE_TOGGLES.variantThumbnailEnabled]: false,
};

export const features: Features = {
    __global: {
        [FEATURE_TOGGLES.bazaarVoiceEnabled]: true,
        [FEATURE_TOGGLES.bazaarvoiceQuestionsEnabled]: true,
        [FEATURE_TOGGLES.blueShirtChatEnabled]: true,
        [FEATURE_TOGGLES.isBrandExpertChatEnabled]: true,
        [FEATURE_TOGGLES.isBrandExpertChatEnabledForMarketPlace]: true,
        [FEATURE_TOGGLES.helpPageLiveChat]: true,
        [FEATURE_TOGGLES.homepageCriteoEnabled]: false,
        [FEATURE_TOGGLES.homepageTopDealsDisabled]: false,
        [FEATURE_TOGGLES.isProductVideoEnabled]: true,
        [FEATURE_TOGGLES.sizeVariants]: 0,
        [FEATURE_TOGGLES.solrLabelsEnabled]: null,
        [FEATURE_TOGGLES.noSearchResults]: false,
        [FEATURE_TOGGLES.isImageZoomEnabled]: true,
        [FEATURE_TOGGLES.mobileActivationUpgradeCheckEnabled]: true,
        [FEATURE_TOGGLES.pdpFromTheManufacturerTabEnabled]: true,
        [FEATURE_TOGGLES.pdpImportantUpdateText]: false,
        [FEATURE_TOGGLES.showRecosAddToCart]: true,
        [FEATURE_TOGGLES.saveForLater]: false,
        [FEATURE_TOGGLES.verifiedPurchaserToggleEnabled]: false,
        [FEATURE_TOGGLES.keyConsiderationEnabled]: false,
        [FEATURE_TOGGLES.dynamicContentFeatureToggles]: {...dynamicContentFeatureToggles},
        [FEATURE_TOGGLES.bazaarvoiceSellerReviewsEnabled]: false,
        [FEATURE_TOGGLES.syndigoContentAggregationEnabled]: false,
        [FEATURE_TOGGLES.oneWorldSyncContentAggregationEnabled]: false,
        [FEATURE_TOGGLES.flixMediaContentAggregationEnabled]: false,
        [FEATURE_TOGGLES.minMaxPriceFacetEnabled]: false,
        [FEATURE_TOGGLES.productServicesEnabled]: false,
        [FEATURE_TOGGLES.youMightAlsoLikeWidgetInAddonsPageEnabled]: false,
        [FEATURE_TOGGLES.gspAboveAddToCart]: false,
        [FEATURE_TOGGLES.pencilAdsABCDTest]: PencilAdsABCDTest.browseAndPDP,
        [FEATURE_TOGGLES.addServiceInCart]: false,
        [FEATURE_TOGGLES.hiddenServices]: [],
        [FEATURE_TOGGLES.showLowInventory]: false,
        ...splitIOFeatureToggles,
    },
};

export const getFeatureToggleConfig = (env: string) => {
    return {
        ...features.__global,
        ...features[env],
    };
};
