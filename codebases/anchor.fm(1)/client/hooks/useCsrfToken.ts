import { useEffect, useCallback, useReducer } from 'react';
import { AnchorAPI } from '../modules/AnchorAPI';

const GET_TOKEN = 'GET_TOKEN';
const TOKEN_RECEIVED = 'TOKEN_RECEIVED';
const GET_TOKEN_FAILED = 'GET_TOKEN_FAILED';
enum STATUS {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

type State = {
  csrfToken?: string;
  error: string | null;
  status: STATUS;
};

type Action =
  | { type: typeof GET_TOKEN }
  | { type: typeof TOKEN_RECEIVED; payload: { csrfToken: string } }
  | { type: typeof GET_TOKEN_FAILED; payload: { error: string } };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case GET_TOKEN:
      return { ...state, status: STATUS.LOADING };
    case TOKEN_RECEIVED:
      return {
        ...state,
        status: STATUS.SUCCESS,
        csrfToken: action.payload.csrfToken,
      };
    case GET_TOKEN_FAILED:
      return { ...state, status: STATUS.ERROR, error: action.payload.error };
    default:
      return state;
  }
}

const initialState: State = { error: null, status: STATUS.IDLE };

function useCsrfToken() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { csrfToken } = state;

  const setCsrfToken = useCallback(() => {
    dispatch({ type: GET_TOKEN });
    handleGetCsrfToken()
      .then(newCsrfToken => {
        dispatch({
          type: TOKEN_RECEIVED,
          payload: { csrfToken: newCsrfToken },
        });
      })
      .catch(err => {
        dispatch({
          type: GET_TOKEN_FAILED,
          payload: { error: err.message },
        });
      });
  }, []);

  useEffect(() => {
    if (!csrfToken) {
      setCsrfToken();
    }
  }, [csrfToken, setCsrfToken]);

  return { csrfToken };
}

function handleGetCsrfToken(): Promise<string> {
  return AnchorAPI.getCsrfToken().then(
    ({ csrfToken: newCsrfToken }) => newCsrfToken
  );
}

export { useCsrfToken, handleGetCsrfToken };
