import { NO_VIZ, USE_VIZ_P13N } from 'constants/productRecoTypes';
import { A11Y_IMAGE_TRANSLATIONS, DESKTOP_PDP_VIDEO } from 'constants/appConstants';
import marketplace from 'cfg/marketplace.json';
import { constructMSAImageUrl, indefiniteArticleSelector } from 'helpers/index.js';
import { ProductBundle, ProductImage, ProductSizing, ProductStockData, ProductStyle, ProductVideo } from 'types/cloudCatalog';
import { PDP_GALLERY_CONFIG_TYPE, PDPFeaturedImage, PDPFeaturedVideo, SelectedSizing } from 'types/product';
import { FormattedProductBundle, ProductDetailState } from 'reducers/detail/productDetail';
import { evCreateShareLinkInfluencer } from 'events/influencer';
import { track } from 'apis/amethyst';
import Vegan from 'components/icons/Vegan';
import EcoFriendly from 'components/icons/EcoFriendly';
import Recycled from 'components/icons/Recycled';
import Organic from 'components/icons/Organic';
import GiveBack from 'components/icons/GiveBack';
import VipOnlyLogo from 'components/icons/vipDashboard/VipOnlyLogo';
import Exclusive from 'components/icons/Exclusive';
import { BADGE_MULTIPLIER_VERBIAGE } from 'constants/rewardsInfo';

const VEGAN_ATTR = 'Vegan';
const RECYCLED_ATTR = 'Recycled Material';
const ORGANIC_ATTR = 'Organic';
const ECO_FRIENDLY_ATTR = 'Sustainably Certified';
const GIVE_BACK_ATTR = 'Give Back Products';
export const BONUS_POINTS_ATTR = 'VIP Point Multiplier';
const EXCLUSIVE_ATTR = 'Zappos Exclusives';

interface AttributeDetails {
  Icon: React.ComponentType;
  label: string;
  tooltipText: string;
  amethystEnum: string;
}

export const productCalloutIconMap = new Map<string, AttributeDetails>([
  [VEGAN_ATTR, {
    Icon : Vegan,
    label : VEGAN_ATTR,
    tooltipText : '100% cruelty-free products constructed with zero animal parts.',
    amethystEnum : 'VEGAN'
  }],
  [RECYCLED_ATTR, {
    Icon : Recycled,
    label : RECYCLED_ATTR,
    tooltipText : 'Composed of all or parts of materials from recycled goods, such as water bottles.',
    amethystEnum : 'RECYCLED'
  }],
  [ECO_FRIENDLY_ATTR, {
    Icon : EcoFriendly,
    label : 'Sustainably Certified',
    tooltipText : 'Certified by an industry-certifying organization to comply with at least one industry standard for environmental or socioeconomic impact.',
    amethystEnum : 'ECO_FRIENDLY'
  }],
  [ORGANIC_ATTR, {
    Icon : Organic,
    label : ORGANIC_ATTR,
    tooltipText : 'Composed of organic cotton and other materials with a lower environmental impact.',
    amethystEnum : 'ORGANIC'
  }],
  [GIVE_BACK_ATTR, {
    Icon : GiveBack,
    label : 'Give Back',
    tooltipText : 'Charitable programs where brands make donations in kind or assist with humanitarian projects or organizations.',
    amethystEnum : 'GIVE_BACK'
  }],
  [BONUS_POINTS_ATTR, {
    Icon : VipOnlyLogo,
    label: 'Bonus Points',
    tooltipText: BADGE_MULTIPLIER_VERBIAGE,
    amethystEnum : 'BONUS_POINTS'
  }],
  [EXCLUSIVE_ATTR, {
    Icon : Exclusive,
    label: 'Zappos Exclusive',
    tooltipText : 'This product or color is available to buy exclusively on Zappos.',
    amethystEnum : 'EXCLUSIVE'
  }]
]);

const hasRewards = (hasRewardsTransparency: boolean, rewardsBrandPromos: String[], brandId: any) => hasRewardsTransparency && rewardsBrandPromos[brandId];

/**
 * A collection of pure helper functions for working with styles and stocks
 */
const { pdp: { percentOffThreshold, showVisualRecos } } = marketplace;
const NON_NUMERIC_MATCHER = /[^\d^.]+/g;

/**
 * Since the API doesn't return the styles keyed by styleId, this helper function
 * iterates through the array of styles and creates a dictionary
 */
function getStyleMap(styles: ProductStyle[]) {
  const styleMap = {} as Record<string, ProductStyle>;
  styles.forEach(style => {
    styleMap[style.styleId] = style;
  });
  return styleMap;
}
/**
 * Returns the corresponding style for the provided color.  If color is not provided or is no longer in stock, returns the first available style
 */
function getStyleByColor(styles: ProductStyle[], colorId?: string) {
  if (!colorId) {
    return styles[0];
  }

  for (const style of styles) {
    if (style.colorId === colorId) {
      return style;
    }
  }
  // if that colorId doesn't exist anymore, just return the first style
  return styles[0];
}

function hasMatchingDimensions(stock: ProductStockData, selectedSizing: SelectedSizing) {
  return Object.keys(selectedSizing).every(dimId => stock[dimId] === selectedSizing[dimId]);
}

/**
 * Gets  the stock object for a given  color, and sizing combination.
 *
 * Returns null if there is no stock for that combination of colors and sizing,
 * or if it is out of stock and includeOos is not set.
 *
 * @param stockData {Array} list of stock information for the product
 * @param colorId {String} color to match against
 * @param selectedSizing {Object} map of dimensionId -> dimensionValues represented the selected sizes.
 * @param includeOos {boolean=false} If true, will return stocks that have 0 onHand.
 */
function getStockBySize(stockData: ProductStockData[], colorId: string, selectedSizing: SelectedSizing, includeOos = false) {
  return stockData.find(stock => (stock.color === colorId && hasMatchingDimensions(stock, selectedSizing) && (includeOos || stock.onHand !== '0'))) || null;
}

/**
 * Gets  the stock object for a given  color, and sizing combination.
 *
 * Returns null if there is no stock for that combination of colors and sizing, or if it is out of stock and includeOos is not set.
 *
 * @param stockData {Array} List of stocks of currently selected selected
 * @param selectedSizing {Object} map of dimensionId -> dimensionValues represented the selected sizes.
 * @param includeOos { boolean=false } If true, will return stocks that have 0 onHand.
 */
function getSelectedStyleStockBySize(stockData: ProductStockData[] = [], sizing: ProductSizing, selectedSizing: SelectedSizing = {}) {
  const sizeName = getCurrentSelectedSizeName(sizing, selectedSizing);
  if (sizeName && stockData.length && Object.keys(selectedSizing).length) {
    return stockData.find(({ size }) => sizeName === size);
  }
  return null;
}

/**
 * Returns available colors for given sizing.
 *
 * @param stockData {Array} list of stock information for the product
 * @param selectedSizing {Object} map of dimensionId -> dimensionValues represented the selected sizes.
 */
function getColorsBySize(stockData: ProductStockData[], selectedSizing: SelectedSizing) {
  return stockData.filter(stock => hasMatchingDimensions(stock, selectedSizing)) || [];
}

function getPriceForProduct(styles: ProductStyle[]) {
  let price;
  for (const style of styles) {
    if (!price) {
      ({ price } = style);
    } else if (price !== style.price) {
      return undefined;
    }
  }
  return price;
}

export function priceToFloat(price: string | number) {
  if (typeof price === 'string') {
    return parseFloat(price.replace(NON_NUMERIC_MATCHER, ''));
  }
  return price;
}

// can't actually trust onSale flag to mean price is lower than originalPrice
function isStyleOnSale(style: { originalPrice?: number | string; price: number | string }) {
  if (style?.originalPrice) {
    const originalPrice = priceToFloat(style.originalPrice);
    const currentPrice = priceToFloat(style.price);
    const percentOff = (originalPrice - currentPrice) / originalPrice;
    return originalPrice > currentPrice && percentOff > percentOffThreshold;
  }
  return false;
}

/**
 * Returns the payload for a legacy StockEventHC
 */
function getStockEventPayload(productId: string, styleId: string, colorId: string, sizing: ProductSizing, selectedSizing: SelectedSizing, stock: ProductStockData, inStock: boolean) {
  let payload = `${inStock ? 'IS' : 'OOS'}|p=${productId}&c=${colorId}&y=${styleId}&k=${stock ? stock.id : ''}`;
  for (const dimId of sizing.dimensionsSet) {
    payload += `&r=${selectedSizing[dimId]}`;
  }
  return payload;
}

/**
 * Returns the user friendly name for the first invalid dimension the user has selected.
 * @param selectedSizing {Object}  map of dimensionId to dimensionValue user has selected.
 * @param sizing {Object} sizing 2.0 data for product
 */
function getMissingDimensionName(selectedSizing: SelectedSizing, { dimensionsSet, dimensionIdToName }: ProductSizing) {
  const missingDimId = dimensionsSet.find(dimId => !selectedSizing[dimId]);
  if (missingDimId) {
    return dimensionIdToName[missingDimId];
  }
  return;
}

function isSizeSelectionComplete(sizeData: ProductSizing, selectedSizing: SelectedSizing) {
  if (!sizeData?.dimensions || !selectedSizing) {
    return false;
  }
  const selectedDimensions = Object.keys(selectedSizing);
  return sizeData.dimensions.length === selectedDimensions.length && selectedDimensions.every(dimension => sizeData.dimensionsSet.includes(dimension));
}
/**
 * Returns the percentage off of the original price the item is on sale for rounded to the nearest integer.
 * @param  {Object} style object with price and originalPrice
 * @return {Integer}       number representing the percentage off
 */
function getPercentOff({ originalPrice, price }: Partial<{ originalPrice: string | number; price: string | number }>) {
  return originalPrice && price ? Math.round((1 - priceToFloat(price) / priceToFloat(originalPrice)) * 100) : 0;
}

/**
 * Return sharing link for a given productId/colorId
 * @param productId
 * @param colorId (optional)
 * @returns {string}
 */
function getSharingButtonLink(productId: string, colorId?: string) {
  const { links: { sharing: { baseUrl } } } = marketplace;
  return `${baseUrl}/product/${productId}${colorId ? `/color/${colorId}` : ''}`;
}

/**
 * Return sharing link for a given productId/colorId
 * @param productId
 * @param influencerToken
 * @param colorId (optional)
 * @returns {string}
 */
function getInfluencerSharingButtonLink(productId: string, influencerToken: string, colorId?: string) {
  const { links: { sharing: { baseUrl } } } = marketplace;
  return `${baseUrl}/product/${productId}${colorId ? `/color/${colorId}` : ''}${influencerToken ? `?infToken=${influencerToken}` : ''}`;
}

function generateShareLinkAmethystEvent(obfuscatedCustomerId: string, productId: string, influencerToken: string, colorId?: string) {
  const eventDetails = {
    userId: obfuscatedCustomerId,
    linkId: influencerToken,
    socialMediaId: 0,
    metaData: JSON.stringify({ productId, colorId })
  };
  track(() => ([evCreateShareLinkInfluencer, eventDetails]));
}

function isShoeType(productType: string | undefined) {
  return productType && productType.toLowerCase() === 'shoes';
}

function isGiftCard(productType: string | undefined) {
  return productType && productType.toLowerCase() === 'gift cards';
}

const RECO_NAME_TO_SOURCE: Record<string, string> = {
  'pd_detail_2': 'p13nvisual'
};

function translateRecoNameToAnalyticsSource(recoName: string) {
  if (recoName in RECO_NAME_TO_SOURCE) {
    return RECO_NAME_TO_SOURCE[recoName];
  }
  return 'p13n';
}

/**
   * Returns whether the visual P13N reco endpoint, or standard p13n  should be used for the recos on the current product.
   * @param  {String} productType          product type ('Clothing', 'Accessories', 'Shoes' etc)
   * @return {Symbol}                    The symbol USE_VIZ_P13N, or NO_VIZ
   */
function shouldUseVisualRecos(productType: string) {
  if (showVisualRecos && ProductUtils.isShoeType(productType)) {
    return USE_VIZ_P13N;
  }

  return NO_VIZ;
}

/**
 * Returns the Product URL representing the given asin.
 * @param {Object} Product object
 * @param {String} asin the asin to look for
 * @return {String} the product URL including productId and colorId for the given asin.  If matching asin is not found returns the product's default url
 */
function getProductUrlFromAsin({ defaultProductUrl, styles }: ProductBundle, asin: string) {
  asin = asin && asin.toUpperCase();
  if (styles) {
    const style = styles.find(({ stocks }) => stocks.find(stock => stock.asin === asin));
    return (style && style.productUrl) || defaultProductUrl;
  }
}

/**
 * Returns the Amethyst reco widget type based of title
 * @param {String} title the title of the reco
 */
function translateRecoTitleToAmethystWidget(title: string) {
  if (title) {
    const reco = title.toLowerCase();
    const mapping: Record<string, string> = {
      'customers who viewed this item also viewed': 'CUSTOMERS_WHO_VIEWED_WIDGET',
      'customers who bought this item also bought': 'CUSTOMERS_WHO_BOUGHT_WIDGET',
      'similar styles you might like': 'SIMILAR_PRODUCT_WIDGET',
      'you may also like': 'YOU_MAY_ALSO_LIKE_WIDGET',
      'wear it with': 'COMPLETE_THE_LOOK'
    };
    return mapping[reco] || 'UNKNOWN_RECOMMENDATION_WIDGET';
  }
  return null;
}

/*
  Returns whether the Product Page is loaded and ready to render.  Takes into account that detail data, image data, sizing data, the isLoading flag, and whether the requested productId matches the currently loaded product.
 */
function isProductDataLoaded(
  { selectedSizing, detail, isLoading }: { selectedSizing?: SelectedSizing; detail?: FormattedProductBundle; isLoading?: boolean},
  { productId }: { productId: string }) {
  return detail &&
    detail.productId === productId &&
    detail.styles && detail.styles.length && // if product is oos and loaded [from reviews], force the fetch to occur so natural oos cycle occurs.
    selectedSizing &&
    !isLoading;
}

/**
 * Get the number of reviews for the given product
 *
 * @param product        state.product
 * @param valueIfNoData  the value to return if the data is loading or missing
 *                       (defaults to 0)
 */
function getNumberOfReviews(product: ProductDetailState, valueIfNoData = 0) {
  if (!product) {
    return valueIfNoData;
  }
  const { reviewData } = product;
  if (!reviewData) {
    return valueIfNoData;
  }
  const { isLoading, reviews } = reviewData;
  if (isLoading || !reviews) {
    return valueIfNoData;
  }
  return reviews.length;
}

/**
 * For a given style return a list of complete MSA image URLs for each angle of the style in thumbnail size.
 *
 * TODO figure out why these are arrays of objects and not arrays of strings
 *
 * @return {Array} array of objects with filename property for the image src
 */
function buildAngleThumbnailImages(style: ProductStyle, width: number, height: number) {
  if (!style || !style.images) {
    return [];
  }

  return style.images.map(({ imageId, type }) => ({
    filename: constructMSAImageUrl(imageId, { width, height, autoCrop: true }),
    retinaSrc: constructMSAImageUrl(imageId, generateRetinaImageParams({ width, height, autoCrop: true }, 2)),
    imageId,
    type
  }));
}

function buildSizeMessagingText(dimensionName: string) {
  return `Please select ${indefiniteArticleSelector(dimensionName)} ${dimensionName}`;
}

function getCurrentSelectedSizeName(sizeData: ProductSizing, selectedSizing: SelectedSizing) {
  const { dimensionIdToName } = sizeData;
  const sizeKey = Object.keys(dimensionIdToName).find(key => dimensionIdToName[key] === 'size');
  const selectedSizeId = sizeKey && selectedSizing?.[sizeKey];
  if (selectedSizeId) {
    return sizeData.allValues.find(v => v.id === selectedSizeId)?.value;
  }
  return null;
}

function getGender(product: { gender?: string; genders?: string[] } | undefined) {
  const { gender = '', genders = [] } = product || {};
  if (gender) {
    return gender.toLowerCase();
  }
  const lowercaseGenders = genders.map(s => s.toLowerCase());
  if (lowercaseGenders.length === 1) {
    return lowercaseGenders[0];
  } else if (lowercaseGenders.length === 2 && lowercaseGenders.includes('boys') && lowercaseGenders.includes('girls')) {
    return 'kids';
  }
  return 'general';
}

function hasAvailableStock(style: ProductStyle) {
  return style.stocks.some(({ onHand }) => onHand !== '0');
}

export function isSingleShoe(styles: ProductStyle[]) {
  return styles.some(({ taxonomyAttributes = [] }) => taxonomyAttributes.some(attr => attr.name === 'Single Shoes'));
}

const MAIN_IMAGE_PARAMS = { width: 700, height: 525, autoCrop: true };
type ImageParams = typeof MAIN_IMAGE_PARAMS;
export const generateRetinaImageParams = (baseParams: ImageParams, multiplier: number): ImageParams => ({ width: baseParams.width * multiplier, height: baseParams.height * multiplier, autoCrop: baseParams.autoCrop });

/**
 * Basic settings for the PDP Assets Gallery
 * @return {PDP_GALLERY_CONFIG_TYPE}
 */
export const PDP_GALLERY_CONFIG: PDP_GALLERY_CONFIG_TYPE = {
  image: {
    default: { // 4:5 RATIO
      width: 736,
      height: 920
    },
    get inverted() { // 5:4 RATIO
      const { width: height, height: width } = this.default;
      return { width, height };
    }
  },
  video: { // 16:9 RATIO
    width: 750,
    height: 420
  },
  invertAspectRatio: ['SHOES'], // Product categories that use the inverted image size 5:4
  carouselThreshold: 1024 // > 1024 = Thumbnails carousel and no featured carousel <= 1024 = Featured carousel and no thumbnails carousel
};

/**
 * Formats the raw image assets so they can be rendered in the galler
 * @returns {PDPFeaturedImage[]} Array of images formatted
 */
export const getProductImagesFormatted = (
  images: ProductImage[],
  productType?: string
): PDPFeaturedImage[] => images?.map(({ imageId, type }, index) => {
  const aspectRatio = !PDP_GALLERY_CONFIG.invertAspectRatio.includes(`${productType}`.toUpperCase()) ? PDP_GALLERY_CONFIG.image.default : PDP_GALLERY_CONFIG.image.inverted;
  return {
    index,
    imageId,
    thumbnail: {
      src: constructMSAImageUrl(imageId, { width: aspectRatio.width * .08, height: aspectRatio.height * .08, autoCrop: true }),
      retinaSrc: `${constructMSAImageUrl(imageId, generateRetinaImageParams({ width: aspectRatio.width * .08, height: aspectRatio.height * .08, autoCrop: true }, 2))} 2x`
    },
    featured: {
      src: constructMSAImageUrl(imageId, { width: aspectRatio.width, height: aspectRatio.height, autoCrop: true }),
      retinaSrc: `${constructMSAImageUrl(imageId, generateRetinaImageParams({ width: aspectRatio.width, height: aspectRatio.height, autoCrop: true }, 2))} 2x`
    },
    zoom: {
      src: constructMSAImageUrl(imageId, { width: aspectRatio.width * 1.5, height: aspectRatio.height * 1.5, autoCrop: true }),
      retinaSrc: `${constructMSAImageUrl(imageId, generateRetinaImageParams({ width: aspectRatio.width * 1.5, height: aspectRatio.height * 1.5, autoCrop: true }, 2))} 2x`
    },
    type: 'image',
    alt: A11Y_IMAGE_TRANSLATIONS[type as keyof typeof A11Y_IMAGE_TRANSLATIONS] || `#${index + 1} of ${ images?.length }`
  };
});

/**
 * Formats the raw video asset adding useful props
 * @returns {PDPFeaturedVideo} Video formatted for MelodyVideoPlayer
 */
export const getProductVideoFormatted = (
  productVideos: ProductVideo[],
  productId: string,
  index: number,
  isYouTubeVideo: boolean,
  youtubeSrc: string | undefined
): PDPFeaturedVideo | undefined => {
  const productVideo = productVideos?.length ? productVideos.find(video => video?.videoEncodingExtension === 'mp4') : undefined;
  if (productVideo) {
    return {
      index,
      isYouTubeVideo,
      type: 'video',
      alt: 'View product video',
      widthValue: `${PDP_GALLERY_CONFIG.video.width}px`,
      heightValue: `${PDP_GALLERY_CONFIG.video.height}px`,
      slotDetails: {
        productId,
        autoplay: true,
        componentName: DESKTOP_PDP_VIDEO,
        src: isYouTubeVideo ? youtubeSrc : productVideo?.filename ? `${marketplace.desktopBaseUrl}${productVideo.filename}` : undefined
      }
    };
  }
  return undefined;
};

/**
 * Renders the default tracking attributes for an element
 * @return {Object} data tracking attributes for elements
 */
export const getPDPTrackingPropsFormatted = (
  label: string,
  value: string
): Object => ({
  'data-track-action' : 'Product-Page',
  'data-track-label' : label,
  'data-track-value' : value
});

const ProductUtils = {
  buildAngleThumbnailImages,
  buildSizeMessagingText,
  generateRetinaImageParams,
  getColorsBySize,
  getCurrentSelectedSizeName,
  getSharingButtonLink,
  getInfluencerSharingButtonLink,
  generateShareLinkAmethystEvent,
  getMissingDimensionName,
  getNumberOfReviews,
  getPercentOff,
  getPriceForProduct,
  getGender,
  getProductUrlFromAsin,
  getStockBySize,
  getSelectedStyleStockBySize,
  getStockEventPayload,
  getStyleByColor,
  getStyleMap,
  hasAvailableStock,
  isGiftCard,
  isProductDataLoaded,
  isSingleShoe,
  isSizeSelectionComplete,
  isStyleOnSale,
  MAIN_IMAGE_PARAMS,
  priceToFloat,
  isShoeType,
  shouldUseVisualRecos,
  translateRecoNameToAnalyticsSource,
  translateRecoTitleToAmethystWidget,
  hasRewards
};

export default ProductUtils;
