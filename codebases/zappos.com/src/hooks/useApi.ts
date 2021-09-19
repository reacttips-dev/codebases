import { useCallback, useEffect, useReducer } from 'react';
import { deepEqual } from 'fast-equals';

interface State<Data, Params> {
  isRequested: boolean;
  isLoaded: boolean;
  data: null | Data;
  requestedParams: null | Params;
  promise: any;
}

const initialState = {
  isRequested: false,
  isLoaded: false,
  data: null,
  requestedParams: null,
  promise: null // exposed for testing
};

type ActionTypes<Data, Params> =
 | { type: 'sentRequest'; requestedParams: Params; promise: any }
 | { type: 'receivedResponse'; requestedParams: Params; data: Data };

type ReducerType<Data, Params> = (state: State<Data, Params>, action: ActionTypes<Data, Params>) => State<Data, Params>;

const reducer = <Data, Params>(state: State<Data, Params>, action: ActionTypes<Data, Params>) => {
  switch (action.type) {
    case 'sentRequest':
      return {
        ...state,
        isRequested: true,
        data: null,
        isLoaded: false,
        requestedParams: action.requestedParams,
        promise: action.promise
      };
    case 'receivedResponse':
      return deepEqual(action.requestedParams, state.requestedParams)
        ? { ...state, data: action.data, isLoaded: true, promise: null }
        : state;
  }
};

/*
  callCondition can be used to prevent the api call from being called based on the args
*/
const useApi = <Data, Args extends any[]>(func: (...args: Args) => Promise<Data>, params: Args = [] as any, callCondition: (...args: Args) => boolean = () => true, apiErrorCallback?: ((e: Error) => void)): State<Data, Args>& { setData: (data: Data) => void} => {
  const [state, dispatch] = useReducer(reducer as ReducerType<Data, Args>, initialState as State<Data, Args>);
  const { isRequested, requestedParams } = state;

  const stableCallCondition = useCallback(callCondition, [...params]);
  const setData = useCallback(data => dispatch({ type: 'receivedResponse', requestedParams: params, data }), [params, dispatch]) ;
  useEffect(() => {
    if (stableCallCondition.apply(undefined, params) && (!isRequested || !deepEqual(requestedParams, params))) {
      // request the api data
      const promise = func.apply(undefined, params);
      const responseHandler = promise.then(data => {
        setData(data);
      });
      if (apiErrorCallback) {
        responseHandler.catch(apiErrorCallback);
      }

      // update state to reflect that the data is loading
      dispatch({ type: 'sentRequest', requestedParams: params, promise });
    }
  }, [params, func, isRequested, requestedParams, stableCallCondition, apiErrorCallback, setData]);

  return { ...state, setData };
};

export default useApi;
