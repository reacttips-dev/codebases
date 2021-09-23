import { useEffect, useReducer, useRef } from 'react';

const FETCH = 'FETCH';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAIL = 'FETCH_FAIL';
const RESET = 'RESET';
const SET_IDLE = 'SET_IDLE';

export type Status = 'idle' | 'loading' | 'success' | 'error';
type Action<JsonResponse> =
  | { type: typeof FETCH }
  | { type: typeof FETCH_SUCCESS; json: JsonResponse }
  | { type: typeof FETCH_FAIL; error: string }
  | { type: typeof SET_IDLE }
  | { type: typeof RESET };

type State<JsonResponse> = {
  error: string;
  json: JsonResponse;
  status: Status;
};

const initialState = {
  error: '',
  json: {},
  status: 'idle' as Status,
};

const createReducer = <JsonResponse>() => (
  state: State<JsonResponse>,
  action: Action<JsonResponse>
) => {
  switch (action.type) {
    case FETCH:
      return { ...state, error: '', status: 'loading' as Status };
    case FETCH_SUCCESS:
      return {
        ...state,
        json: action.json,
        status: 'success' as Status,
      };
    case FETCH_FAIL:
      return {
        ...state,
        error: action.error,
        status: 'error' as Status,
      };
    case SET_IDLE:
      return {
        ...state,
        status: 'idle' as Status,
      };
    case RESET:
    default:
      return initialState as State<JsonResponse>;
  }
};

type UseFetchDataParameters<Parameters, JsonResponse> = {
  fetchFunction: (parameters: Parameters) => Promise<JsonResponse>;
  parameters?: Parameters;
  dependencies?: any[];
  options?: { fetchOnFirstRender: boolean };
};

/**
 * @deprecated use react-query
 */
export function useFetchData<Parameters, JsonResponse>({
  fetchFunction,
  parameters = {} as Parameters,
  dependencies = [],
  options = {
    fetchOnFirstRender: true,
  },
}: UseFetchDataParameters<Parameters, JsonResponse>): {
  state: { error: string; status: Status; json: JsonResponse };
  fetchData: () => void;
  reset: () => void;
  setIdle: () => void;
} {
  const canFetch = useRef(options.fetchOnFirstRender);
  const reducer = createReducer<JsonResponse>();
  const [state, dispatch] = useReducer(
    reducer,
    initialState as State<JsonResponse>
  );
  async function fetchData() {
    dispatch({ type: FETCH });
    try {
      const json = await fetchFunction(parameters);
      dispatch({ type: FETCH_SUCCESS, json });
    } catch (err) {
      dispatch({ type: FETCH_FAIL, error: err.message });
    }
  }
  function reset() {
    dispatch({ type: RESET });
  }

  function setIdle() {
    dispatch({ type: SET_IDLE });
  }
  useEffect(() => {
    if (canFetch && canFetch.current) {
      fetchData();
    }
    canFetch.current = true;
  }, [...dependencies]);
  return { state, fetchData, reset, setIdle };
}
