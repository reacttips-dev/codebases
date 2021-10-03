import {
  GET_ERRORS,
  CLEAR_ERRORS,
  HTTP_404_ERROR,
  HTTP_500_ERROR,
  HTTP_OTHER_ERROR,
  HTTP_400_ERROR,
  NO_MEDIA_RESULTS_MESSAGE,
  FETCH_FAILED_NETWORK_ERROR,
  FAILED_TO_FETCH_DATA_API_ERROR,
} from "../_actions/types";
import {
  FAILED_TO_FETCH_DATA,
  FAILED_TO_FETCH_DATA_API,
} from "../_components/details/constants";

const initialState = {
  error_message: "",
};

const execute404 = (state, action) => {
  action.props?.history?.push("/404");
  return { ...state };
};

const execute500 = (state, action) => {
  action.props?.history?.push("/500");
  return { ...state };
};

const executeOtherError = (state, action) => {
  return action.error;
};

const showNoResultsMessage = (state, action) => {
  return {
    ...state,
    error_message: "No results found.",
  };
};

const showDataFetchErrorMessage = (state) => {
  return {
    ...state,
    error_message: FAILED_TO_FETCH_DATA_API,
  };
};

const showNetworkErrorMessage = (state) => {
  return {
    ...state,
    error_message: FAILED_TO_FETCH_DATA,
  };
};

export default function (state = initialState, action) {
  switch (action.type) {
    case HTTP_400_ERROR:
      return action.error.data;
    case HTTP_404_ERROR:
      return execute404(state, action);
    case HTTP_500_ERROR:
      return execute500(state, action);
    case HTTP_OTHER_ERROR:
      return executeOtherError(state, action);
    case NO_MEDIA_RESULTS_MESSAGE:
      return showNoResultsMessage(state, action);
    case FETCH_FAILED_NETWORK_ERROR:
      return showNetworkErrorMessage(state, action);
    case FAILED_TO_FETCH_DATA_API_ERROR:
      return showDataFetchErrorMessage(state, action);
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return initialState;

    default:
      return state;
  }
}
