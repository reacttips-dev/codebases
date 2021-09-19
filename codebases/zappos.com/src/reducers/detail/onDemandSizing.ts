import {
  RECEIVE_BRAND_LIST_FAILURE,
  RECEIVE_BRAND_LIST_SUCCESS,
  RECEIVE_ON_DEMAND_SIZING_PREDICTION_FAILURE,
  RECEIVE_ON_DEMAND_SIZING_PREDICTION_SUCCESS,
  RECEIVE_SUPPORTED_BRANDS_FAILURE,
  RECEIVE_SUPPORTED_BRANDS_SUCCESS,
  REQUEST_BRAND_LIST,
  REQUEST_ON_DEMAND_SIZING_PREDICTION,
  REQUEST_PRODUCT_DETAIL,
  REQUEST_SUPPORTED_BRANDS,
  SET_MODAL_VIEW,
  UPDATE_BRAND,
  UPDATE_PRODUCT_CATEGORY,
  UPDATE_PRODUCT_SIZE
} from 'constants/reduxActions';
import { BRAND_VIEW, RECOMMENDED_SIZE_VIEW } from 'constants/appConstants';
import { AppAction } from 'types/app';
import { CloudCatalogBrand } from 'types/cloudCatalog';
import { SupportedBrand } from 'types/opal';

export interface OnDemandSizingState {
  autoCompleteValue: string;
  brandId: string;
  brandName?: string;
  brandList: CloudCatalogBrand[];
  modalView: typeof BRAND_VIEW | typeof RECOMMENDED_SIZE_VIEW;
  hasBrandListLoaded: boolean;
  hasSupportedBrandsLoaded: boolean;
  hasPredictionLoaded: boolean;
  isBrandInvalid?: boolean;
  productCategory: string;
  productSize: string;
  predictedSize: string;
  supportedBrands: SupportedBrand[];
  uncertainty?: number | null;
}

const initialState: OnDemandSizingState = {
  autoCompleteValue: '',
  brandId: '',
  brandName: '',
  brandList: [],
  modalView: BRAND_VIEW,
  hasBrandListLoaded: false,
  hasSupportedBrandsLoaded: false,
  hasPredictionLoaded: false,
  isBrandInvalid: false,
  productCategory: '',
  productSize: '',
  predictedSize: '',
  supportedBrands: [],
  uncertainty: null
};

export default function onDemandSizing(state: OnDemandSizingState = initialState, action: AppAction): OnDemandSizingState {
  switch (action.type) {
    case SET_MODAL_VIEW:
      const { modalView } = action;
      return { ...state, modalView };
    case UPDATE_PRODUCT_CATEGORY:
      const { productCategory } = action;
      return { ...state, productCategory };
    case UPDATE_PRODUCT_SIZE:
      const { productSize } = action;
      return { ...state, productSize };
    case UPDATE_BRAND:
      const { autoCompleteValue, brandId, brandName, isBrandInvalid } = action;
      return { ...state, brandId, brandName, autoCompleteValue, isBrandInvalid };
    case REQUEST_BRAND_LIST:
      return { ...state, hasBrandListLoaded: false };
    case RECEIVE_BRAND_LIST_SUCCESS:
      const { brandList } = action;
      return { ...state, brandList, hasBrandListLoaded: true };
    case RECEIVE_BRAND_LIST_FAILURE:
      return { ...state, hasBrandListLoaded: true };
    case REQUEST_SUPPORTED_BRANDS:
      return { ...state, hasSupportedBrandsLoaded: false };
    case RECEIVE_SUPPORTED_BRANDS_SUCCESS:
      const { supportedBrands } = action;
      return { ...state, supportedBrands, hasSupportedBrandsLoaded: true };
    case RECEIVE_SUPPORTED_BRANDS_FAILURE:
      return { ...state, hasSupportedBrandsLoaded: true };
    case REQUEST_ON_DEMAND_SIZING_PREDICTION:
      return { ...state, predictedSize: '', hasPredictionLoaded: false };
    case RECEIVE_ON_DEMAND_SIZING_PREDICTION_SUCCESS:
      const { predictedSize, uncertainty } = action;
      return { ...state, predictedSize, uncertainty, hasPredictionLoaded: true };
    case RECEIVE_ON_DEMAND_SIZING_PREDICTION_FAILURE:
      return { ...state, hasPredictionLoaded: true };
    case REQUEST_PRODUCT_DETAIL:
      return initialState;
    default:
      return state;
  }
}
