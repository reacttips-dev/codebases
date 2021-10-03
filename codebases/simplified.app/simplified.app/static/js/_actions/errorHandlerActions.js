import * as actionTypes from "./types";
import { logoutUser } from "./authActions";
import {
  ABORT_FETCH_REQUEST_MESSAGE,
  ABORT_AXIOS_REQUEST_MESSAGE,
  AXIOS_NETWORK_ERROR,
  FAILED_TO_FETCH,
  FAILED_FETCH,
} from "../_components/details/constants";

const execute404Handler = (props) => {
  return {
    type: actionTypes.HTTP_404_ERROR,
    props: props,
  };
};

const execute500Handler = (props) => {
  return {
    type: actionTypes.HTTP_500_ERROR,
    props: props,
  };
};

const executeOtherErrorHandler = (error) => {
  return {
    type: actionTypes.HTTP_OTHER_ERROR,
    error: error,
  };
};

const executeUserAbortedRequest = (error) => {
  return {
    type: actionTypes.HTTP_REQUEST_ABORTED,
    error: error,
  };
};

const execute400Handler = (error) => {
  return {
    type: actionTypes.HTTP_400_ERROR,
    error: error,
  };
};

const executeErrorMessageHandler = (error) => {
  return {
    type: actionTypes.NO_MEDIA_RESULTS_MESSAGE,
    error: error,
  };
};

const executeFetchFailureHandler = (error) => {
  return {
    type: actionTypes.FETCH_FAILED_NETWORK_ERROR,
    error: error,
  };
};

const executeDataFetchFailureHandler = (error) => {
  return {
    type: actionTypes.FAILED_TO_FETCH_DATA_API_ERROR,
    error: error,
  };
};

export const clearErrors = () => {
  return {
    type: actionTypes.CLEAR_ERRORS,
  };
};

export const handleHTTPError = (error, props) => {
  //https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253

  if (error.response) {
    if (error.response.status === 401) {
      return logoutUser();
    } else if (error.response.status === 404) {
      return execute404Handler(props);
    } else if (error.response.status === 500) {
      return execute500Handler(props);
    } else if (error.response.status === 403) {
      return logoutUser();
    }
    if (error.response.status === 400) {
      return execute400Handler(error.response);
    } else {
      return executeOtherErrorHandler(error);
    }
  } else if (error.message) {
    if (
      error.message === AXIOS_NETWORK_ERROR ||
      error.message.includes(FAILED_FETCH)
    ) {
      return executeOtherErrorHandler(error);
    } else if (error.message === ABORT_AXIOS_REQUEST_MESSAGE) {
      return executeUserAbortedRequest(error);
    } else if (error.message.includes("Cannot read property ")) {
      return executeErrorMessageHandler(error.message);
    } else if (error.message.includes("map is not a function")) {
      return executeDataFetchFailureHandler(error.message);
    } else if (error.message === FAILED_TO_FETCH || AXIOS_NETWORK_ERROR) {
      return executeFetchFailureHandler(error.message);
    } else {
      return executeOtherErrorHandler(error);
    }
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    return executeOtherErrorHandler(error);
  } else if (error.name === ABORT_FETCH_REQUEST_MESSAGE) {
    return executeUserAbortedRequest(error);
  } else {
    // Something happened in setting up the request and triggered an Error
    return executeUserAbortedRequest(error);
  }
};

export function cancelActionRequest(actionType) {
  return { type: actionTypes.CANCEL_ACTION_REQUESTS, actionType };
}

export function cancelAllActionRequests() {
  return { type: actionTypes.CANCEL_ALL_ACTION_REQUESTS };
}

/**
 *
 * @param {string} source Image Provier source string
 * @param {Object} errors errors must be in the form {code: "no_app_found", non_field_errors:[<list of errors>]}
 */
export function addImageProviderErrors(source, errors) {
  return {
    type: actionTypes.IMAGE_PROVIDER_ERRORS,
    payload: { imageSource: source, errors },
  };
}

export function clearMessageToUser() {
  return { type: actionTypes.CLEAR_MESSAGE_TO_USER };
}
