import { parse } from 'query-string';

import {
  ADD_ITEM_TO_CART,
  EVENT_ON_DEMAND,
  EVENT_SIZING_IMPRESSION,
  PRODUCT_DESCRIPTION_TOGGLE,
  PRODUCT_SWATCH_CHANGE,
  RECEIVE_PDP_STORY_SYMPHONY_COMPONENTS
} from 'constants/reduxActions';
import { PRODUCT_PAGE_VIEW, SIZING_IMPRESSION } from 'constants/amethyst';
import { middlewareTrack } from 'apis/amethyst';
import { sendMonetateEvent } from 'apis/monetate';
import { toFloatInt } from 'helpers/NumberFormats';
import ProductUtils, { productCalloutIconMap } from 'helpers/ProductUtils';
import { trackEvent } from 'helpers/analytics';
import marketplace from 'cfg/marketplace.json';

const PRODUCT_PAGEVIEW = 'PRODUCT_PAGEVIEW';

const { crossSiteQsParam } = marketplace;

export const pvProduct = ({
  productId,
  styleId,
  price,
  isQuickView
}) => {

  // For xsll AKA cross site selling. When we show a Zen/Vrnsl product on Zappos search
  // we want to be able to link the sessions.
  const crossSiteSellingUniqueIdentifier = parse(window?.location?.search)[crossSiteQsParam];
  if (crossSiteSellingUniqueIdentifier) {
    trackEvent('TE_PDP_CROSS_SITE_PRODUCT', crossSiteSellingUniqueIdentifier);
  }

  return {
    [PRODUCT_PAGE_VIEW]: {
      productIdentifiers: {
        productId: toFloatInt(productId),
        styleId: toFloatInt(styleId),
        supplementalData: { crossSiteSellingUniqueIdentifier }
      },
      viewedPrice: toFloatInt(price),
      isAmp: false,
      isQuickView
    }
  };
};

const productDimensions = [ 'SIZE_DIMENSION', 'WIDTH_DIMENSION', 'INSEAM_DIMENSION', 'COLOR_DIMENSION' ];
const getCleanDimension = dimension => productDimensions.find(d => d.includes(dimension?.toUpperCase())) || 'UNKNOWN_PRODUCT_DIMENSION';
export const evProductDimensionSelected = ({
  asin,
  dimensionDirty,
  dimension,
  dimensionId,
  dimensionLabel,
  productDimensionSelectionSource = 'UNKNOWN_PRODUCT_DIMENSION_SELECTION_SOURCE',
  stock,
  sourcePage
}) => {

  if (!dimension) {
    dimension = dimensionDirty ? getCleanDimension(dimensionDirty) : 'UNKNOWN_PRODUCT_DIMENSION';
  }

  const eventData = {
    asin,
    dimension,
    dimensionId: toFloatInt(dimensionId),
    dimensionLabel,
    productDimensionSelectionSource,
    sourcePage
  };
  if (stock?.onHand < 10) {
    eventData.stockAlert = true;
    eventData.itemsLeft = toFloatInt(stock.onHand);
  }
  return {
    productDimensionSelected: eventData
  };
};

const monetateAddedToCart = appState => {
  const { cart: { cartObj } } = appState;
  const cartItems = cartObj.activeItems.map(v => {
    const { productId, quantity, price, styleId } = v;
    return { productId, sku: styleId, quantity, unitPrice: price };
  });
  sendMonetateEvent(
    ['setPageType', 'product'],
    ['addCartRows', cartItems]
  );
};

const monetateProductView = appState => {
  const { product } = appState;
  const { colorId } = product;
  const style = product.detail.styles.find(s => colorId === s.colorId);
  if (style) {
    const { productId, styleId } = style;
    const payload = { productId, sku: styleId };
    sendMonetateEvent(
      ['setPageType', 'product'],
      ['addProductDetails', [payload]]
    );
  }
};

const ameOnDemand = (appState, { event, value }) => {
  if (event) {
    const eventTypeMap = {
      start: 'ON_DEMAND_START',
      exit: 'ON_DEMAND_EXIT',
      next: 'ON_DEMAND_NEXT',
      edit: 'ON_DEMAND_EDIT',
      apply: 'ON_DEMAND_APPLY_SIZE',
      save: 'ON_DEMAND_SAVE',
      brand: 'BRAND_INPUT',
      category: 'PRODUCT_CATEGORY_INPUT',
      size: 'SIZE_INPUT'
    };
    const payload = {
      onDemandInputType: eventTypeMap[event] || 'UNKNOWN_ON_DEMAND_INPUT'
    };

    if (value) {
      payload.inputValue = value;
    }

    middlewareTrack({
      onDemandSizing: payload
    });
  }
};

const ameSizingImpression = ({ product }, { event, sizeObj }) => {
  const { detail, colorId, selectedSizing } = product;
  if (event) {
    const payload = {
      sizingImpressionType: event
    };
    if (sizeObj?.value) {
      const { id, value } = sizeObj;
      const stock = ProductUtils.getStockBySize(detail.sizing.stockData, colorId, selectedSizing);
      payload.sizeId = toFloatInt(id);
      payload.sizeLabel = value;

      if (stock?.onHand < 10) {
        payload.stockAlert = true;
        payload.itemsLeft = toFloatInt(stock.onHand);
      }
    }
    middlewareTrack({
      [SIZING_IMPRESSION]: payload
    });
  }
};

const pdpStoryImpressions = appState => {
  const { product: { symphonyStory: { stories, productId, slotData } } } = appState;
  if (stories?.length) {
    trackEvent('TE_PDP_STORIES_IMPRESSION', `productId:${productId}:componentCount:${stories.length}`);
  }
  Object.keys(slotData).forEach(slotName => {
    if (slotName.includes('buybox')) {
      trackEvent('TE_PDP_BUYBOX_CONTENT_IMPRESSION', slotName);
    }
  });
};

export const sizeBiasImpression = ({ text, productId, sizeBiases }) => {
  trackEvent('TE_PDP_BUYBOX_SIZE_BIAS_IMPRESSION', `productId:${productId}:${text}`);
  return {
    sizeBiasImpression: {
      sourcePage: 'PRODUCT_PAGE',
      productIdentifiers: { productId },
      text,
      sizeBiases
    }
  };
};

const evProductDescriptionToggle = (_, { payload }) => {
  // Naming convention on this dataset was legacy, didn't want to change if there was other tracking being used elsewhere
  switch (payload) {
    case 'Show-More': {
      return middlewareTrack({
        showMoreInformationClick: {}
      });
    }
    case 'Show-less': {
      return middlewareTrack({
        showLessInformationClick: {}
      });
    }
    default: {
      return;
    }
  }
};

export const evProductCalloutImpression = value => {
  const productCalloutAttribute = productCalloutIconMap.get(value)?.amethystEnum || value;

  if (!productCalloutAttribute) {
    return;
  }

  return {
    productCalloutImpression: {
      productCalloutAttribute
    }
  };
};

export default {
  pageEvent: PRODUCT_PAGEVIEW,
  events: {
    [PRODUCT_PAGEVIEW]: [monetateProductView],
    [ADD_ITEM_TO_CART]: [monetateAddedToCart],
    [PRODUCT_SWATCH_CHANGE]: [monetateProductView],
    [EVENT_ON_DEMAND]: [ameOnDemand],
    [EVENT_SIZING_IMPRESSION]: [ameSizingImpression],
    [RECEIVE_PDP_STORY_SYMPHONY_COMPONENTS]: [pdpStoryImpressions],
    [PRODUCT_DESCRIPTION_TOGGLE]: [evProductDescriptionToggle]
  }
};
