'use es6';

export var errorFetchingData = function errorFetchingData(state) {
  return Boolean(state.folders.get('error') || state.decks.get('error') || state.properties.get('error') || state.permissions.get('error'));
};