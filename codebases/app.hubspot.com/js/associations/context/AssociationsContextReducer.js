'use es6';

export var ASSOCIATIONS_SUCCEEDED = 'ASSOCIATIONS_SUCCEEDED';
export var UPDATE_ASSOCIATIONS = 'UPDATE_ASSOCIATIONS';
export var associationsReducer = function associationsReducer(state, action) {
  var payload = action.payload;

  switch (action.type) {
    case ASSOCIATIONS_SUCCEEDED:
      return payload;

    case UPDATE_ASSOCIATIONS:
      return state.set('associations', payload);

    default:
      return state;
  }
};