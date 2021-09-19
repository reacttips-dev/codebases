import Immutable from 'seamless-immutable';

import {
  PAGE_TYPE_CHANGE,
  RECEIVE_SEARCH_RESPONSE,
  REQUEST_SEARCH,
  RESET_FACET_GROUP,
  SET_FACET_CHOSEN,
  TOGGLE_FACET_GROUP_SHOW_MORE,
  TOGGLE_FACETS,
  TOGGLE_SELECTED_FACET,
  TOGGLE_SELECTED_FACET_GROUP, TOGGLE_SIZING_FACET_GROUP
} from 'constants/reduxActions';
import {
  BEST_FOR_YOU_FACETFIELD,
  SINGLE_SELECT_FILTERS
} from 'constants/appConstants';
import { FILTERS_RE } from 'common/regex';
import marketplace from 'cfg/marketplace.json';

const { search: { onlyOneGroupOpen, topBrands, sizeFacetFields, hasCollapsedSizes, usesFacetNavData } } = marketplace;

const initialState = {
  toDisplay: [],
  chosenFacetGroup: null,
  requestedUrl: null,
  mobileFacetSortToggled: false,
  sizingFacetGroupToggled: false,
  navigation: {
    sizing: [],
    core: [],
    zEverythingElse: []
  }
};

const sizeFacets = [
  'hc_women_size',
  'hc_women_width',
  'hc_men_size',
  'hc_men_width',
  'hc_footwear_infant_toddler_youth_size',
  'hc_kids_width'
];

export function isFacetsVisible(state = false, action) {
  const { type, visible, pageType } = action;
  switch (type) {
    case TOGGLE_FACETS:
      return visible;
    case PAGE_TYPE_CHANGE:
      return pageType === 'search' ? state : false;
    default:
      return state;
  }
}

export const sortTopBrands = (facets, orderedBrands = topBrands) => {
  const facetValuesCopy = [ ...facets.values ];
  const foundTopValues = facetValuesCopy.filter((v, i) => {
    const foundIndex = orderedBrands.indexOf(v.name.toLowerCase()) > -1;
    if (foundIndex) {
      facetValuesCopy.splice(i, 1);
      return foundIndex;
    }
  }).sort((a, b) => orderedBrands.indexOf(a.name) - orderedBrands.indexOf(b.name));
  return foundTopValues.concat(facetValuesCopy);
};

const makePersonalizedSizeInfo = sizes => ` (${sizes[0]}-${sizes[sizes.length - 1]})`;

export default function facets(state = initialState, action) {
  const { type, isFresh, selectedFacetGroupIndex, selectedFacetGroupName, selectedFacetIndex, response, url, isPcm, section } = action;
  let newState = Immutable(state);

  switch (type) {
    case TOGGLE_SELECTED_FACET_GROUP:
    {
      if (usesFacetNavData && section) {
        Object.keys(newState.navigation).map(section => {
          (newState.navigation[section] || []).map((group, index) => {
            const { facetField } = group;
            if (facetField === selectedFacetGroupName) {
              newState = newState.set('mobileFacetSortToggled', false);
              newState = newState.set('chosenFacetGroup', { section, ...group });
              newState = newState.updateIn(['navigation', section, index, 'isExpanded'], v => !v);
            }
          });
        });
      } else {
        const groupName = newState.pcm && newState.pcm.findIndex(f => f.facetField === selectedFacetGroupName) > -1 ? 'pcm' : 'toDisplay';
        const index = (newState[groupName] || []).findIndex(facet => facet.facetField === selectedFacetGroupName);

        if (selectedFacetGroupName === 'sort') {
          newState = newState.set('mobileFacetSortToggled', !newState.mobileFacetSortToggled);
          newState = newState.set('chosenFacetGroup', initialState.chosenFacetGroup);
        }

        if (index > -1) {
          newState = newState.set('mobileFacetSortToggled', false);
          newState = newState.set('chosenFacetGroup', !newState.chosenFacetGroup || (onlyOneGroupOpen && newState.chosenFacetGroup?.facetField !== selectedFacetGroupName) ? newState[groupName][index] : initialState.chosenFacetGroup);
          newState = newState.updateIn([groupName, index, 'isExpanded'], v => !v);
        }
      }
      return newState;
    }
    case TOGGLE_SELECTED_FACET:
    {
      if (usesFacetNavData && section) {
        const facet = newState['navigation'][section][selectedFacetGroupIndex];
        if (facet) {
          if (SINGLE_SELECT_FILTERS[facet.facetField]) {
            // chosen facet is a single-select, so remove the group from the tree
            // since only 1 item should be selected from a single-select at a time.
            newState = newState.updateIn(['navigation', section], items => items.filter((item, i) => i !== selectedFacetGroupIndex));
            newState = newState.set('chosenFacetGroup', initialState.chosenFacetGroup);
          } else {
            newState = newState.updateIn(['navigation', section, selectedFacetGroupIndex, 'values', selectedFacetIndex, 'selected'], v => !v);
          }
        }
      } else {
        const facetGroupName = isPcm ? 'pcm' : 'toDisplay';
        const facet = newState[facetGroupName][selectedFacetGroupIndex];
        if (facet) {
          if (SINGLE_SELECT_FILTERS[facet.facetField]) {
            // chosen facet is a single-select, so remove the group from the tree
            // since only 1 item should be selected from a single-select at a time.
            newState = newState.update(facetGroupName, items => items.filter((item, i) => i !== selectedFacetGroupIndex));
            newState = newState.set('chosenFacetGroup', initialState.chosenFacetGroup);
          } else {
            newState = newState.updateIn([facetGroupName, selectedFacetGroupIndex, 'values', selectedFacetIndex, 'selected'], v => !v);
          }
        }
      }
      return newState;
    }
    case REQUEST_SEARCH:
      if (isFresh) {
        newState = Immutable(initialState);
      }
      return newState.set('requestedUrl', url);
    case RECEIVE_SEARCH_RESPONSE:
      if (response.url === state.requestedUrl) {
        const filters = response.filters || {};
        const hasZc1AndGender = filters?.zc1 && filters?.txAttrFacet_Gender;

        if (usesFacetNavData && response.navigation) {
          newState = newState.set('navigation', response.navigation || initialState.navigation);

          if (hasCollapsedSizes && hasZc1AndGender && response.navigation?.sizing && !newState.sizingFacetGroupToggled) {
            newState = newState.set('sizingFacetGroupToggled', !newState.sizingFacetGroupToggled);
          }

          Object.entries(newState.navigation).forEach(([section, values]) => {
            const newSection = values.map(facetGroup => {
              const newFacetGroup = { ...facetGroup };
              const oldFacetGroup = state.navigation[section].find(({ facetField }) => facetField === facetGroup.facetField);
              newFacetGroup.isExpanded = oldFacetGroup ? oldFacetGroup.isExpanded : true;

              if (hasCollapsedSizes && section === 'sizing') {
                newFacetGroup.showMore = false;
                newFacetGroup.isExpanded = !!hasZc1AndGender;
              }

              newFacetGroup.values = facetGroup.values.map(facetValue => {
                const newValue = { ...facetValue };
                if (FILTERS_RE.test(facetValue.facetUrl)) {
                  newValue.facetUrl = null;
                }

                if (!facetValue.displayName) {
                  newValue.displayName = facetValue.name;
                }

                return newValue;
              });
              return newFacetGroup;
            });
            newState = newState.setIn(['navigation', section], newSection);
          });
        } else {
          newState = newState.update('toDisplay', () => response.facets || initialState.toDisplay);

          const newFacets = newState.toDisplay.map(v => {

            const oldFacetGroup = state.toDisplay.find(({ facetField }) => facetField === v.facetField);
            v = v.update('isExpanded', () => {
              if (oldFacetGroup) {
                return oldFacetGroup.isExpanded;
              }
              return true;
            });

            // TODO: Move this logic to response.navigation when Zen/Vrsnl is supported.
            if (topBrands.length > 0 && v.facetField === 'brandNameFacet') {
              v = v.set('values', sortTopBrands(v));
            }

            if (hasCollapsedSizes && !hasZc1AndGender && sizeFacets.includes(v.facetField)) {
              v = v.update('isExpanded', () => true);
            }

            v = v.set('values', v.values.map(g => {

              if (FILTERS_RE.test(g.facetUrl)) {
                g = g.set('facetUrl', null);
              }

              /*
              Display value for facets
              https://github01.zappos.net/mweb/marty/issues/6307
              TODO: This can be removed once support for es.zappos is dropped
              */
              if (!g.displayName) {
                g = g.set('displayName', g.name);
              }

              return g;
            }));
            return v;
          });
          newState = newState.set('toDisplay', newFacets);
        }

        const sizeData = usesFacetNavData ? newState.navigation?.sizing : newState.toDisplay;
        const sizeKey = sizeData?.filter(v => sizeFacetFields.includes(v.facetField));
        if (response.customerPreferences && sizeKey.length) {
          const sizeMessage = `${response.customerPreferences.facets[0].name}${makePersonalizedSizeInfo(response.customerPreferences.sizes)}`;
          const personalizedFacet = { facetField: BEST_FOR_YOU_FACETFIELD, isExpanded: true, facetFieldDisplayName: 'Your Preferences', values: [{ count: null, name: sizeMessage, displayName: sizeMessage, confidence: 1 }] };
          const newFacets = [ personalizedFacet, ...sizeData ];
          newState = usesFacetNavData ? newState.setIn(['navigation', 'sizing'], newFacets) : newState.set('toDisplay', newFacets);
        }
      }

      return newState;
    case TOGGLE_FACET_GROUP_SHOW_MORE:
      const currentVal = newState.navigation[section][selectedFacetIndex].showMore;
      newState = newState.setIn(['navigation', section, selectedFacetIndex, 'showMore'], !currentVal);
      return newState;
    case SET_FACET_CHOSEN:
      if (newState.chosenFacetGroup) {
        if (usesFacetNavData) {
          const chosenIndex = newState.navigation[newState.chosenFacetGroup.section].findIndex(s => !!s.isExpanded);
          newState = newState.updateIn(['navigation', newState.chosenFacetGroup.section, chosenIndex, 'isExpanded'], () => false);
        } else {
          const chosenIndex = newState.toDisplay.findIndex(s => !!s.isExpanded);
          newState = newState.updateIn(['toDisplay', chosenIndex, 'isExpanded'], () => false);
        }
        newState = newState.set('chosenFacetGroup', initialState.chosenFacetGroup);
      }
      return newState;
    case TOGGLE_SIZING_FACET_GROUP:
      newState = newState.set('sizingFacetGroupToggled', !newState.sizingFacetGroupToggled);
      return newState;
    case RESET_FACET_GROUP:
      if (usesFacetNavData) {
        Object.keys(newState.navigation).forEach(section => {
          newState.navigation[section].forEach((v, i) => {
            newState.navigation[section][i].values.forEach((g, ii) => {
              if (newState.navigation[section][i].values[ii].selected) {
                newState = newState.setIn(['navigation', section, i, 'values', ii, 'selected'], false);
              }
            });
          });
        });
      } else {
        newState.toDisplay.forEach((v, i) => {
          newState.toDisplay[i].values.forEach((g, ii) => {
            if (newState.toDisplay[i].values[ii].selected) {
              newState = newState.setIn(['toDisplay', i, 'values', ii, 'selected'], false);
            }
          });
        });
      }

      newState = newState.set('chosenFacetGroup', initialState.chosenFacetGroup);
      return newState;
    default:
      return state;
  }
}
