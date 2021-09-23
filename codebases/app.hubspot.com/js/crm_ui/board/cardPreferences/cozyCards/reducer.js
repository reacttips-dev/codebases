'use es6';

export var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'COZY_CARDS_SET_STYLE':
      {
        return state.mergeDeep({
          STYLE: action.payload
        });
      }

    case 'COZY_CARDS_SET_BOTTOM_PANEL':
      {
        return state.mergeDeep({
          BOTTOM_PANEL: action.payload
        });
      }

    case 'COZY_CARDS_RESET':
      {
        return action.payload;
      }

    default:
      {
        return state;
      }
  }
};