import Immutable from 'seamless-immutable';

import {
  ADD_ON_SALE,
  CLEAR_SAVED_FILTERS,
  RECEIVE_SEARCH_RESPONSE,
  REMOVE_PERSONALIZED_SIZE,
  REQUEST_SEARCH,
  RESET_FACET_GROUP,
  ROLLBACK_FILTERS,
  SET_URL_UPDATED,
  TOGGLE_PERSONALIZED_SIZE,
  TOGGLE_SAVED_FILTERS,
  TOGGLE_SELECTED_FACET,
  TYPED_SEARCH,
  UPDATE_BEST_FOR_YOU,
  UPDATE_SAVED_FILTERS,
  UPDATE_SORT
} from 'constants/reduxActions';
import { SINGLE_SELECT_FILTERS } from 'constants/appConstants';
import { ZSO_URL_RE } from 'common/regex';
import { buildSearchFilterChecksum, organizeSelects } from 'helpers/SearchUtils';
import { retrieveSeoData } from 'helpers/SeoOptimizedDataHelper';
import { convertPageParamToUrlPath } from 'helpers/ClientUtils';
import marketplace from 'cfg/marketplace.json';

const initialFacetsState = {
  breadcrumbs: [],
  page: 0,
  pageCount: null,
  si: null,
  selected: {
    singleSelects: {},
    multiSelects: {}
  },
  sort: {},
  autocorrect: {},
  executedSearchUrl: null,
  urlFilterMapping: {},
  filterToZsoMapping: {},
  isSingleSelectCompleted: false,
  originalTerm: '',
  term: '',
  honeTag: '',
  seoText: '',
  staleProducts: false,
  requestedUrl: null,
  bestForYouSortEligible: false,
  applySavedFilters: false,
  shouldUrlUpdate: false,
  autoFacetApplied: false
};

const initialState = {
  ...initialFacetsState,
  bestForYou: true
};

const { search: { sizeFacetFields } } = marketplace;

const singles = Object.keys(SINGLE_SELECT_FILTERS);
const singleRemovals = {
  [singles[0]]: singles,
  [singles[1]]: singles.slice(1),
  [singles[2]]: singles.slice(2),
  [singles[3]]: singles.slice(3),
  [singles[4]]: singles.slice(4)
};

const allSingleSelectsChosen = chosenSingles => singles.filter(v => v !== 'pricingTag').every(key => {
  const facet = chosenSingles[key];
  return facet && facet.length > 0;
});

const updateIsSingleSelectCompleted = state => state.set('isSingleSelectCompleted', allSingleSelectsChosen(state.selected.singleSelects));

export default function filters(state = initialState, action) {
  const { type, facetField, facetGroup, facetName, isFresh, response, sort, url, oldFilters } = action;
  let newState = Immutable(state);
  switch (type) {
    case TOGGLE_SELECTED_FACET:
      const isSingleSelect = SINGLE_SELECT_FILTERS[facetGroup];
      const parentSelect = isSingleSelect ? 'singleSelects' : 'multiSelects';
      newState = newState.updateIn(['selected', parentSelect, facetGroup], v => {
        let list = v ? Immutable(v) : Immutable([]);
        if (list.length && list.indexOf(facetName) > -1) {
          // remove facet from selected array
          list = list.filter(name => (name !== facetName));
        } else {
          // add new facet to selected array
          list = list.set(list.length, facetName);
        }
        return list;
      });
      newState = newState.set('si', initialState.si);
      newState = newState.set('page', 0);
      newState = updateIsSingleSelectCompleted(newState);
      newState = newState.set('staleProducts', true);
      return newState;
    case SET_URL_UPDATED:
      newState = newState.set('shouldUrlUpdate', false);
      return newState;
    case UPDATE_SORT:
      newState = newState.set('page', 0);
      newState = newState.set('si', initialState.si);
      newState = newState.set('sort', sort);
      newState = newState.set('staleProducts', true);
      return newState;
    case ROLLBACK_FILTERS:
      if (SINGLE_SELECT_FILTERS[facetGroup]) {
        const { singleSelects } = newState.selected;
        newState = newState.setIn(['selected', 'singleSelects'], singleSelects.without(singleRemovals[facetGroup]));
        newState = updateIsSingleSelectCompleted(newState);
        newState = newState.set('page', 0);
        newState = newState.set('si', initialState.si);

        // Clear out multi-selects
        newState = newState.setIn(['selected', 'multiSelects'], {});
        newState = newState.set('staleProducts', true);
      }
      return newState;
    case TYPED_SEARCH:
      return initialState;
    case REQUEST_SEARCH:
      if (isFresh) {
        newState = Immutable({ ...newState, ...initialFacetsState });
      }
      newState = newState.set('requestedUrl', url);
      return newState;
    case RECEIVE_SEARCH_RESPONSE:
      if (newState.requestedUrl === response.url) {
        const si = response.si ? response.si.split(',') : initialState.si;
        const executedSearchUrl = response.executedSearchUrl || initialState.executedSearchUrl;
        newState = newState.set('shouldUrlUpdate', !!newState.staleProducts);
        newState = newState.set('staleProducts', false);
        newState = newState.set('page', typeof response.currentPage !== undefined ? parseInt(response.currentPage, 10) - 1 : 0);
        newState = newState.set('pageCount', parseInt(response.pageCount, 10));
        newState = newState.set('selected', response.filters ? organizeSelects(response.filters) : initialState.selected);
        newState = updateIsSingleSelectCompleted(newState);
        newState = newState.set('pills', response.facetPredictionModel || null);
        newState = newState.set('term', response.term || '');
        newState = newState.set('honeTag', response.honeTag || '');
        newState = newState.set('seoData', retrieveSeoData(response));
        newState = newState.set('seoText', response.seoText || '');
        newState = newState.set('termLander', response.termLander || false);
        newState = newState.set('originalTerm', response.originalTerm || '');
        newState = newState.set('sort', response.sort || initialState.sort);
        newState = newState.set('bestForYouSortEligible', response.bestForYouSortEligible || initialState.bestForYouSortEligible);
        newState = newState.set('executedSearchUrl', ZSO_URL_RE.test(executedSearchUrl) ? executedSearchUrl : convertPageParamToUrlPath(executedSearchUrl));
        newState = newState.set('si', si);
        newState = newState.set('breadcrumbs', response.breadcrumbs || []);
        newState = newState.set('savedsizes', response.savedsizes || null);
        newState = newState.set('autocorrect', response.autocorrect || initialFacetsState.autocorrect);
        newState = newState.set('autoFacetApplied', !!response.autoFacetApplied);

        const sizeKey = response.facets.reduce((acc, v) => (sizeFacetFields.includes(v.facetField) ? acc.concat(v) : acc), []);

        if (sizeKey.length) {
          newState = newState.set('personalizedSize', response.customerPreferences || {});
        }

        if (response.url) {
          const checksum = buildSearchFilterChecksum(newState);
          newState = newState.set('urlFilterMapping', {
            [response.url]: {
              selected: newState.selected,
              term: newState.term,
              sort: newState.sort,
              page: newState.page
            }
          });
          newState = newState.setIn(['filterToZsoMapping', checksum], response.url);
        }

        if (newState.wasSaveFiltersToggled) {
          newState = newState.set('wasSaveFiltersToggled', false);
        }
      }
      return newState;
    case RESET_FACET_GROUP:
      if (facetField) {
        newState = newState.setIn(['selected', 'multiSelects'], newState.selected.multiSelects.without(facetField));
      } else {
        // This is when "reset all" button is clicked
        newState = newState.set('selected', initialState.selected);
      }
      newState = newState.set('staleProducts', true);
      return newState;
    case ADD_ON_SALE:
      newState = newState.updateIn(['selected', 'multiSelects'], v => {
        let list = v ? Immutable(v) : Immutable([]);
        list = list.set('onSale', ['true']);
        return list;
      });
      newState = newState.set('staleProducts', true);
      return newState;
    case UPDATE_SAVED_FILTERS:
      const newSavedFilters = response.sizes.reduce((filters, size) => {
        const { name, value } = size;
        if (!filters[name]) {
          filters[name] = [];
        }
        filters[name].push(value);
        return filters;
      }, {});

      if (oldFilters) {
        Object.keys(oldFilters).forEach(key => {
          if (!newSavedFilters[key]) {
            newSavedFilters[key] = [];
          }
        });
      }
      newState = newState.updateIn(['savedsizes', 'id'], () => response.id);
      newState = newState.updateIn(['savedsizes', 'gender'], () => response.gender);
      newState = newState.updateIn(['savedsizes', 'filters'], () => newSavedFilters);
      return newState;
    case TOGGLE_SAVED_FILTERS:
      if (newState.applySavedFilters) {
        const newMultiSelects = Object.keys(newState.selected.multiSelects).reduce((obj, f) => {
          if (newState.savedsizes.filters[f] && newState.selected.multiSelects[f].length > 1) {
            obj[f] = newState.selected.multiSelects[f].filter(v => !newState.savedsizes.filters[f].includes(v));
          }
          return obj;
        }, {});
        newState = newState.updateIn(['selected', 'multiSelects'], () => newMultiSelects);
      }
      newState = newState.set('staleProducts', true);
      newState = newState.set('wasSaveFiltersToggled', true);
      newState = newState.set('applySavedFilters', !newState.applySavedFilters);
      return newState;
    case CLEAR_SAVED_FILTERS:
      const currentFilters = { ...newState.savedsizes.filters };
      const currentSavedFilters = Object.keys(currentFilters).reduce((filters, key) => {
        filters[key] = [];
        return filters;
      }, {});
      newState = newState.updateIn(['savedsizes', 'filters'], () => currentSavedFilters);
      return newState;
    case UPDATE_BEST_FOR_YOU:
      newState = newState.set('bestForYou', response);
      return newState;
    case TOGGLE_PERSONALIZED_SIZE:
      const isSelected = !newState.personalizedSize?.facets?.[0]?.selected;

      if (response) {
        const sizeKey = Object.values(response.navigation).reduce((arr, section) => {
          const foundKey = section.find(v => sizeFacetFields.includes(v.facetField));
          if (foundKey) {
            arr.push(foundKey);
          }
          return arr;
        }, []);
        if (sizeKey.length && sizeKey?.[0]?.facetField && newState.personalizedSize.sizes) {
          const sizeFacetField = sizeKey[0].facetField;
          if (isSelected) {
            // get current filters and append new ones
            const currentMultiSelects = newState.selected.multiSelects[sizeFacetField] || [];
            const newMultiSelects = currentMultiSelects.concat(newState.personalizedSize.sizes);
            newState = newState.setIn(['selected', 'multiSelects', sizeFacetField], newMultiSelects);
          } else if (!isSelected) {
            // remove
            const newMultiSelects = newState.selected.multiSelects[sizeFacetField].filter(v => !newState.personalizedSize.sizes.includes(v));
            newState = newState.setIn(['selected', 'multiSelects', sizeFacetField], newMultiSelects);
          }
        }
      }

      newState = newState.setIn(['personalizedSize', 'facets', [0], 'selected'], isSelected);
      newState = newState.set('staleProducts', true);
      return newState;
    case REMOVE_PERSONALIZED_SIZE:
      newState = newState.setIn(['personalizedSize', 'facets', [0], 'selected'], false);
      return newState;
    default:
      return state;
  }
}
