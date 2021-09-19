import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  EVENT_ON_DEMAND,
  RECEIVE_BRAND_LIST_FAILURE,
  RECEIVE_BRAND_LIST_SUCCESS,
  RECEIVE_ON_DEMAND_SIZING_PREDICTION_FAILURE,
  RECEIVE_ON_DEMAND_SIZING_PREDICTION_SUCCESS,
  RECEIVE_SUPPORTED_BRANDS_FAILURE,
  RECEIVE_SUPPORTED_BRANDS_SUCCESS,
  REQUEST_BRAND_LIST,
  REQUEST_ON_DEMAND_SIZING_PREDICTION,
  REQUEST_SUPPORTED_BRANDS,
  SAVE_ODSP_DATA,
  SET_MODAL_VIEW,
  UPDATE_BRAND,
  UPDATE_PRODUCT_CATEGORY,
  UPDATE_PRODUCT_SIZE
} from 'constants/reduxActions';
import { trackError } from 'helpers/ErrorUtils';
import { BRAND_VIEW, RECOMMENDED_SIZE_VIEW } from 'constants/appConstants';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { brandList } from 'apis/cloudcatalog';
import { sizingPredictionOnDemand, supportedBrands } from 'apis/opal';
import { AppState } from 'types/app';
import { OdspData, OnDemandSizingRequestData, SupportedBrand } from 'types/opal';
import { CloudCatalogBrand } from 'types/cloudCatalog';
import { receiveSizingPredictionFailure, receiveSizingPredictionSuccess } from 'actions/productDetail';

export function setModalView(modalView: typeof BRAND_VIEW | typeof RECOMMENDED_SIZE_VIEW) {
  return {
    type: SET_MODAL_VIEW,
    modalView
  } as const;
}

export function saveOdsp(data: OdspData) {
  return {
    type: SAVE_ODSP_DATA,
    data
  } as const;
}

export function updateProductCategory(productCategory: string) {
  return {
    type: UPDATE_PRODUCT_CATEGORY,
    productCategory
  } as const;
}

export function updateProductSize(productSize: string) {
  return {
    type: UPDATE_PRODUCT_SIZE,
    productSize
  } as const;
}

interface BrandData{
  brandId: string;
  brandName?: string;
  autoCompleteValue: string;
  isBrandInvalid?: boolean;
}
export function updateBrand({ brandId, brandName, autoCompleteValue, isBrandInvalid }: BrandData) {
  return {
    type: UPDATE_BRAND,
    brandId,
    brandName,
    autoCompleteValue,
    isBrandInvalid
  } as const;
}

function requestSizingPredictionOnDemand() {
  return {
    type: REQUEST_ON_DEMAND_SIZING_PREDICTION
  } as const;
}

function receiveSizingPredictionOnDemandSuccess(predictedSize: string, uncertainty?: number) {
  return {
    type: RECEIVE_ON_DEMAND_SIZING_PREDICTION_SUCCESS,
    predictedSize,
    uncertainty
  } as const;
}

function receiveSizingPredictionOnDemandFailure() {
  return {
    type: RECEIVE_ON_DEMAND_SIZING_PREDICTION_FAILURE
  } as const;
}

export function fetchSizingPredictionOnDemand(reqData: OnDemandSizingRequestData): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestSizingPredictionOnDemand());
    const state = getState();
    const { environmentConfig: { api: { opal: opalInfo } } } = state;

    return sizingPredictionOnDemand(opalInfo, reqData)
      .then(fetchErrorMiddleware)
      .then(res => {
        const { error, prediction, uncertainty, onDemandEligible } = res;
        if (onDemandEligible === false) {
          dispatch(receiveSizingPredictionOnDemandFailure());
        } else if (prediction) {
          dispatch(receiveSizingPredictionOnDemandSuccess(prediction, uncertainty));
        } else if (error) {
          dispatch(receiveSizingPredictionOnDemandFailure());
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not load on-demand sizing prediction.', e);
      });
  };
}

function requestSupportedBrands() {
  return {
    type: REQUEST_SUPPORTED_BRANDS
  } as const;
}

function receiveSupportedBrandsSuccess(supportedBrands: SupportedBrand[]) {
  return {
    type: RECEIVE_SUPPORTED_BRANDS_SUCCESS,
    supportedBrands
  } as const;
}

function receiveSupportedBrandsFailure() {
  return {
    type: RECEIVE_SUPPORTED_BRANDS_FAILURE
  } as const;
}

export function fetchSupportedBrands(gender: string | null): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestSupportedBrands());
    const state = getState();
    const { environmentConfig: { api: { opal: opalInfo } } } = state;
    return supportedBrands(opalInfo, gender)
      .then(fetchErrorMiddleware)
      .then(res => {
        if (res.supportedBrands) {
          dispatch(receiveSupportedBrandsSuccess(res.supportedBrands));
        } else {
          dispatch(receiveSupportedBrandsFailure());
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not load supported brands for sizing prediction.', e);
      });
  };
}

function requestBrandList() {
  return {
    type: REQUEST_BRAND_LIST
  } as const;
}

function receiveBrandListSuccess(brandList: CloudCatalogBrand[]) {
  return {
    type: RECEIVE_BRAND_LIST_SUCCESS,
    brandList
  } as const;
}

function receiveBrandListFailure() {
  return {
    type: RECEIVE_BRAND_LIST_FAILURE
  } as const;
}

export function fireOnDemandEvent(event: string, value?: string) {
  return {
    type: EVENT_ON_DEMAND,
    event,
    value
  } as const;
}

export function fetchBrandList(): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestBrandList());
    const state = getState();
    const { environmentConfig: { api: { cloudcatalog } } } = state;
    return brandList(cloudcatalog)
      .then(fetchErrorMiddleware)
      .then(res => {
        if (Array.isArray(res)) {
          dispatch(receiveBrandListSuccess(res));
        } else {
          dispatch(receiveBrandListFailure());
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not load the brand list.', e);
      });
  };
}

export type OnDemandSizingAction =
 | ReturnType<typeof setModalView>
 | ReturnType<typeof saveOdsp>
 | ReturnType<typeof updateProductCategory>
 | ReturnType<typeof updateProductSize>
 | ReturnType<typeof updateBrand>
 | ReturnType<typeof requestSizingPredictionOnDemand>
 | ReturnType<typeof receiveSizingPredictionSuccess>
 | ReturnType<typeof receiveSizingPredictionFailure>
 | ReturnType<typeof receiveSizingPredictionOnDemandFailure>
 | ReturnType<typeof receiveSizingPredictionOnDemandSuccess>
 | ReturnType<typeof requestSupportedBrands>
 | ReturnType<typeof receiveSupportedBrandsSuccess>
 | ReturnType<typeof receiveSupportedBrandsFailure>
 | ReturnType<typeof requestBrandList>
 | ReturnType<typeof receiveBrandListSuccess>
 | ReturnType<typeof receiveBrandListFailure>
 | ReturnType<typeof fireOnDemandEvent>;
