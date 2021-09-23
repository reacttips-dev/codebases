'use es6';

export var getFilter = function getFilter(state) {
  return state.filter;
};
export var getFilterType = function getFilterType(state) {
  return state.filter.get('filterType');
};
export var getFilteredExtensions = function getFilteredExtensions(state) {
  return state.filter.get('extensions');
};