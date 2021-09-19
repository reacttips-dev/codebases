import {
  REMOVE_PERSONALIZED_SIZE,
  RESET_FACET_GROUP,
  ROLLBACK_FILTERS,
  SET_FACET_CHOSEN,
  TOGGLE_FACET_GROUP_SHOW_MORE,
  TOGGLE_PERSONALIZED_SIZE,
  TOGGLE_SELECTED_FACET,
  TOGGLE_SELECTED_FACET_GROUP,
  TOGGLE_SIZING_FACET_GROUP
} from 'constants/reduxActions';

export function resetFacetGroup(facetField) {
  return {
    type: RESET_FACET_GROUP,
    facetField
  };
}

export function setFacetChosen() {
  return {
    type: SET_FACET_CHOSEN
  };
}

export function rollbackFilters(facetGroup) {
  return {
    type: ROLLBACK_FILTERS,
    facetGroup
  };
}

export function toggleSelectedFacetGroup(selectedFacetGroupName, section) {
  return {
    type: TOGGLE_SELECTED_FACET_GROUP,
    selectedFacetGroupName,
    section
  };
}

export function toggleSelectedFacet(facetGroup, facetName, selectedFacetGroupIndex, selectedFacetIndex, section) {
  return {
    type: TOGGLE_SELECTED_FACET,
    facetGroup,
    facetName,
    selectedFacetIndex,
    selectedFacetGroupIndex,
    section
  };
}

export function toggleSizingFacetGroup() {
  return {
    type: TOGGLE_SIZING_FACET_GROUP
  };
}

export function togglePersonalizedSize(response) {
  return {
    type: TOGGLE_PERSONALIZED_SIZE,
    response
  };
}

export function removePersonalizedSize() {
  return {
    type: REMOVE_PERSONALIZED_SIZE
  };
}

export function toggleFacetGroupShowMore(selectedFacetGroupName, selectedFacetIndex, section) {
  return {
    type: TOGGLE_FACET_GROUP_SHOW_MORE,
    selectedFacetGroupName,
    selectedFacetIndex,
    section
  };
}
