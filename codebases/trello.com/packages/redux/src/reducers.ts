import { Action } from 'redux';

type ReducerHandler<S> = (state: S, action: Action) => S;

interface ReducerHandlerMap<S> {
  [key: string]: ReducerHandler<S>;
}

const UndefinedKeyError =
  'Misconfigured reducer keyed off undefined, possibly caused by a circular dependency';

export function createReducer<S>(
  initialState: S,
  handlers: ReducerHandlerMap<S>,
) {
  if (process.env.NODE_ENV === 'development') {
    if (Object.prototype.hasOwnProperty.call(handlers, 'undefined')) {
      const undefinedHandler = handlers.undefined;
      throw new Error(
        [UndefinedKeyError, undefinedHandler.toString()].join('\n\n'),
      );
    }
  }

  return function reducer(state: S = initialState, action: Action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
