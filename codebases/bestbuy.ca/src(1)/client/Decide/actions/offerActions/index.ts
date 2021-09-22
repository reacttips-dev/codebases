import { ActionCreatorsMapObject, AnyAction } from "redux";

import { Dispatch, getStateFunc, ThunkResult } from "models";
import State from "store";
import { getUserShippingLocationPostalCode } from "store/selectors";
import { getOfferProvider, getSpecialOffersProvider } from "providers";
import { routingActionCreators } from "actions";
import routeManager from "utils/routeManager";
import { productActionCreators } from "../productActions";
import {
  getFutureDatePricingValue,
  getProductSku,
  getIntlLocale,
  getUserShippingLocationRegionCode,
  isFutureDatePricingEnabled,
} from "store/selectors";

export const offerActionTypes = {
  getOffers: "GET_PRODUCT_OFFERS",
  getOffersBySku: "GET_PRODUCT_OFFERS_BY_SKU",
  getSpecialOffers: "GET_PRODUCT_SPECIAL_OFFERS",
  trackSpecialOfferPageView: "SPECIAL_OFFER_PAGE_LOAD",
  trackSpecialOfferClick: "SPECIAL_OFFER_CLICK",
  getOffersFailure: "GET_PRODUCT_OFFERS_FAILURE",
  getOffersSuccess: "GET_PRODUCT_OFFERS_SUCCESS",
  getSpecialOffersFailure: "GET_PRODUCT_SPECIAL_OFFERS_FAILURE",
  getSpecialOffersSuccess: "GET_PRODUCT_SPECIAL_OFFERS_SUCCESS",
};

export interface OfferActionCreators extends ActionCreatorsMapObject {
  getOffers: () => ThunkResult<void>;
  getOffersBySku: (sku: string) => ThunkResult<void>;
  getSpecialOffers: () => ThunkResult<void>;
  trackSpecialOfferPageView: (discountId: string) => AnyAction;
  trackSpecialOfferClick: (discountId: string) => AnyAction;
  syncProductOfferStateWithLocation: (location: Location) => ThunkResult<void>;
}

export const offerActionCreators: OfferActionCreators = (() => {
  const getOffers = () => {
    return getOffersBySku();
  };

  const getOffersBySku = (sku?: string) => {
    return async (dispatch: Dispatch, getState: getStateFunc) => {
      dispatch({ type: offerActionTypes.getOffers });
      const state: State = getState();
      sku = sku ?? state.product?.product?.sku;
      try {
        const date = getFutureDatePricingValue(state);

        const offers = await getOfferProvider(
          state.config.dataSources.offerApiUrl,
          isFutureDatePricingEnabled(state)
        ).getOffers(sku, getUserShippingLocationRegionCode(state), date);

        dispatch({ type: offerActionTypes.getOffersSuccess, offers });
      } catch (error) {
        dispatch({ type: offerActionTypes.getOffersFailure });
      }
    };
  };

  const getSpecialOffers = () => {
    return async (dispatch: Dispatch, getState: getStateFunc) => {
      dispatch({ type: offerActionTypes.getSpecialOffers });
      const state: State = getState();
      try {
        const specialOffers = await getSpecialOffersProvider(
          state.config.dataSources.specialOfferApiUrl,
          isFutureDatePricingEnabled(state)
          ).getSpecialOffers(
            getProductSku(state),
            getIntlLocale(state),
            getFutureDatePricingValue(state),
            getUserShippingLocationPostalCode(state)
            );
        dispatch({ type: offerActionTypes.getSpecialOffersSuccess, specialOffers });
      } catch (error) {
        dispatch({ type: offerActionTypes.getSpecialOffersFailure });
      }
    };
  };

  const trackSpecialOfferPageView = (discountId: string) => {
    return {
      type: offerActionTypes.trackSpecialOfferPageView,
      discountId,
    };
  };

  const trackSpecialOfferClick = (discountId: string) => {
    return {
      type: offerActionTypes.trackSpecialOfferClick,
      discountId,
    };
  };

  const syncProductOfferStateWithLocation = (location: Location) => {
    return async (dispatch: Dispatch, getState: getStateFunc) => {
      await dispatch(productActionCreators.syncProductStateWithLocation(location));
      const state: State = getState();
      const product = state.product?.product;
      let altLangUrl = routeManager.getAltLangPathByKey(
        state.intl.language,
        "productOffers",
        product && product.altLangSeoText,
        product && product.sku
      );

      if (location && location.search) {
        altLangUrl += location.search;
      }

      dispatch(
        routingActionCreators.setAltLangHrefs({
          altLangUrl,
          curLangUrl: routeManager.getCurrLang(location.pathname),
        })
      );
    };
  };

  return {
    getOffers,
    getOffersBySku,
    getSpecialOffers,
    syncProductOfferStateWithLocation,
    trackSpecialOfferPageView,
    trackSpecialOfferClick,
  };
})();
