import { call, select, takeEvery } from 'redux-saga/effects';

import { STOCK_SELECTION_COMPLETED } from './types';

import { track } from 'apis/amethyst';
import { productBundle } from 'apis/cloudcatalog';
import {
  COLOR_SWATCH_DIMENSION_SELECTION,
  OPAL_RECOMMENDATION_DIMENSION_SELECTION,
  UNKNOWN_PRODUCT_DIMENSION_SELECTION_SOURCE
} from 'constants/productDimensionSelectionSourceTypes';
import { PRODUCT_SWATCH_CHANGE, RECEIVE_SIZING_PREDICTION_SUCCESS } from 'constants/reduxActions';
import { getAmethystPageType, trackLegacyEvent } from 'helpers/analytics';
import ProductUtils from 'helpers/ProductUtils';
import { evProductDimensionSelected } from 'events/product';

export const productSelector = state => state.product;
export const pageTypeSelector = state => state.pageView.pageType;
export const cloudcatalogSelector = state => state.environmentConfig.api.cloudcatalog;

const getSelectionSource = action => {
  switch (action.type) {
    case PRODUCT_SWATCH_CHANGE:
      return COLOR_SWATCH_DIMENSION_SELECTION;
    case RECEIVE_SIZING_PREDICTION_SUCCESS:
      return OPAL_RECOMMENDATION_DIMENSION_SELECTION;
    case STOCK_SELECTION_COMPLETED:
      return action.source || UNKNOWN_PRODUCT_DIMENSION_SELECTION_SOURCE;
    default:
      return UNKNOWN_PRODUCT_DIMENSION_SELECTION_SOURCE;
  }
};

export function* fireStockEvent(action) {
  const product = yield select(productSelector);
  const { colorId, detail: { productId, styles: originalStyles, sizing }, selectedSizing } = action.product || product;
  let styles = originalStyles;
  const { styleId } = ProductUtils.getStyleByColor(styles, colorId);
  let stock = ProductUtils.getStockBySize(sizing.stockData, colorId, selectedSizing);
  let inStock = true;

  if (!stock) {
    // looks like it's OOS, so call cloud catalog to get full list of
    // stocks so we can pass along stockId if such a stockId exists
    inStock = false;
    const cloudcatalog = yield select(cloudcatalogSelector);
    const response = yield call(productBundle, cloudcatalog, { productId, includeOos: true });
    if (response.status === 200) {
      const bundle = yield call([response, response.json]);
      ({ styles } = bundle.product[0]);
      stock = ProductUtils.getStockBySize(bundle.product[0].sizing.stockData, colorId, selectedSizing, true);
    }
  }

  const stockEventPayload = ProductUtils.getStockEventPayload(productId, styleId, colorId, sizing, selectedSizing, stock, inStock);
  yield call(trackLegacyEvent, 'StockEventHC', null, stockEventPayload);

  // Amethyst event tracking
  const pageType = yield select(pageTypeSelector);
  const amethystPageType = getAmethystPageType(pageType);
  const { name, selectedOption = {} } = action || {};
  const selectedStyle = ProductUtils.getStyleByColor(styles, colorId);
  const { asin } = selectedStyle?.stocks.find(({ stockId }) => stockId === stock?.id) || {};
  const eventData = {
    asin,
    stock,
    dimensionDirty: sizing.dimensionIdToName[name],
    dimensionId: selectedOption?.id,
    dimensionLabel: selectedOption?.value,
    sourcePage: amethystPageType,
    productDimensionSelectionSource: getSelectionSource(action)
  };
  yield call(track, () => [evProductDimensionSelected, eventData]);
}

export default function* sagas() {
  yield takeEvery(STOCK_SELECTION_COMPLETED, fireStockEvent);
  yield takeEvery(RECEIVE_SIZING_PREDICTION_SUCCESS, fireStockEvent);
  yield takeEvery(PRODUCT_SWATCH_CHANGE, fireStockEvent);
}
