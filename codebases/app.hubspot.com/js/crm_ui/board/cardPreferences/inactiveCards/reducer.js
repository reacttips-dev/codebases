'use es6';

export var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'INACTIVE_CARDS_SET_IS_TURNED_ON':
      {
        return state.mergeDeep({
          ISTURNEDON: action.payload
        });
      }

    case 'INACTIVE_CARDS_SET_UNIT':
      {
        return state.mergeDeep({
          UNIT: action.payload
        });
      }

    case 'INACTIVE_CARDS_SET_VALUE':
      {
        if (action.payload <= 0) {
          return state.mergeDeep({
            error: 'inactiveCardsErrors.valueIsZeroError',
            VALUE: action.payload
          });
        } else if (isNaN(action.payload)) {
          return state.mergeDeep({
            error: 'inactiveCardsErrors.valueIsZeroError',
            VALUE: action.payload
          });
        }

        return state.mergeDeep({
          VALUE: action.payload
        }).delete('error');
      }

    case 'INACTIVE_CARDS_RESET':
      {
        return action.payload;
      }

    default:
      {
        return state;
      }
  }
};