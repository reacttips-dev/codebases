import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  FETCH_RECOS,
  RECEIVE_RECOS
} from 'constants/reduxActions';
import { evRecommendationImpressionWrapper } from 'events/recommendations';
import { getJanusRecos } from 'apis/mafia';
import marketplace from 'cfg/marketplace.json';
import recommenderFilterFormatter from 'helpers/recommenderFilterFormatter';
import { buildProductPageRecoKey, buildRecosKey, buildRequestSlots, getRecosSlot, parseRecommenderFilterValue } from 'helpers/RecoUtils';
import ProductUtils from 'helpers/ProductUtils';
import { track } from 'apis/amethyst';
import { AppState } from 'types/app';
import { AllJanusSlotNames, JanusParams, Recos } from 'types/mafia';

const {
  api: {
    mafia
  },
  pdp: { recos: productRecoSlots },
  recos: { slots }
} = marketplace;

const DEFAULT_NUMBER_OF_RECOS = 5;

export function fetchingRecos() {
  return {
    type: FETCH_RECOS
  } as const;
}

export function receiveRecos(key: string, data: Recos, imageHost: string) {
  return {
    type: RECEIVE_RECOS,
    data,
    key,
    imageHost
  } as const;
}

function getImageHost(state: AppState): string {
  const {
    environmentConfig: {
      imageServer: {
        url: imageHost
      }
    }
  } = state;
  return imageHost;
}

interface RecoSlotDetails {
  limit: string;
  widget: string;
  filters?: Filter[];
}
interface Filter {
  name: string;
  value: string[];
}
export function fetchRecos(slotDetails: RecoSlotDetails, janusFetcher = getJanusRecos): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  const { filters = [], limit, widget } = slotDetails;
  const parsedFilters: Record<string, string[]> = {};
  filters.forEach(f => {
    parsedFilters[f.name] = parseRecommenderFilterValue(f.value);
  });

  const janusFilter = recommenderFilterFormatter(parsedFilters)?.setState();
  // Apply custom widget parameter if declared
  const nameList = widget || janusFilter?.getRecommenderName() as string;
  const { filterString } = janusFilter!; // TODO ts get rid of the `!` directive here, recommenderFilterFormatter was a bit of a mess so i didn't type it.
  const recommenderNames = Array.isArray(nameList) ? nameList.join(',') : nameList;
  return (dispatch, getState) => {
    const state = getState();
    const { cookies = {} } = state;

    const paramObj = { params: { filter: filterString }, widgets: recommenderNames, limit: limit || DEFAULT_NUMBER_OF_RECOS, credentials: cookies, dispatch, getState };

    return janusFetcher(mafia, paramObj)
      .then((resp = {}) => {
        Promise.all((Object.keys(resp) as AllJanusSlotNames[]).map(recoName => {
          dispatch(receiveRecos(buildRecosKey(slotDetails, recoName),
            { [recoName]: resp[recoName] }, getImageHost(state)));
        }));
      });
  };
}

export function fetchProductPageRecos(productId: string, styleId: string, isVisualRecos = false, hydraBlueSkyPdp = false, janusFetcher = getJanusRecos): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    const state = getState();

    const { cookies } = state;

    let params: JanusParams = { item: productId };
    if (styleId) {
      params.teen = styleId;
    }
    const shouldLoadDetail0Slot = slots.hasOwnProperty('detail-0');
    const { limits, widgets } = buildRequestSlots(isVisualRecos, false, shouldLoadDetail0Slot, hydraBlueSkyPdp);
    params = { ...params, ...limits };
    const recoKey = buildProductPageRecoKey(productId, styleId);
    dispatch(fetchingRecos());

    return janusFetcher(mafia, { params, widgets, limit: DEFAULT_NUMBER_OF_RECOS, credentials: cookies, dispatch, getState })
      .then(resp => {
        dispatch(receiveRecos(recoKey, resp, getImageHost(state)));
        if (resp) {
          Object.keys(productRecoSlots).forEach(slot => {
            const shownReco = getRecosSlot(resp, slot as 'slot0' | 'slot1' | 'slot2' | 'slot3');
            if (shownReco) {
              const recommendationImpression = [{
                numberOfRecommendations: shownReco.sims.length,
                recommendationType: 'PRODUCT_RECOMMENDATION',
                recommendationSource: 'EP13N',
                widgetType: ProductUtils.translateRecoTitleToAmethystWidget(shownReco.title)
              }];

              track(() => ([evRecommendationImpressionWrapper, { recommendationImpression }]));
            }
          });
        }
      });
  };
}

interface ProductRecosFetchOpts {
  productIds?: string[];
  styleIds?: string[];
  productId: string;
  styleId: string;
  slot: string;
  limit: number;
  janusFetcher?: typeof getJanusRecos;
  storageKey?: string;
}

/**
 * Used to fetch a single slot for a product and style.  Data is stored in the state under the requested slot name.
 * @param {Object} options
 * @param {String} options.productId
 * @param {Array}  options.productIds list of all unique product ids in cart
 * @param {Array}  options.styleIds list of all unique style ids in cart - this should positionally line up with productIds array
 * @param {String} options.styleId
 * @param {String} options.slot the slot to request.
 * @param {Number} options.limit number
 * @param {function} [options.janusFetcher] api function for fetching recos
 * @param {String} [options.storageKey] optional string for where to store results under. Default to the requested slot name.
 */
export function fetchProductRecos({
  productIds = [],
  styleIds = [],
  productId,
  styleId,
  slot,
  limit,
  janusFetcher = getJanusRecos,
  storageKey
}: ProductRecosFetchOpts): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies } = state;

    dispatch(fetchingRecos());

    interface Params {
      item: string;
      limit: number;
      teen: string;
      items?: string;
      teens?: string;
    }
    let params: Params = { item: productId, limit, teen: styleId };

    if (productIds.length && styleIds.length) {
      params = { ...params, items: productIds.join(';'), teens: styleIds.join(';') };
    }

    return janusFetcher(mafia, { params, widgets: slot, limit, credentials: cookies, dispatch, getState })
      .then(resp => {
        dispatch(receiveRecos(storageKey || slot, resp, getImageHost(state)));
      });
  };
}

export type RecoAction =
| ReturnType<typeof fetchingRecos>
| ReturnType<typeof receiveRecos>;
