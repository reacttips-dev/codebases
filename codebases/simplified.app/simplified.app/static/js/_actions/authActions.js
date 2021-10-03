import axios from "axios";
import {
  SET_CURRENT_USER,
  USER_LOGGED_OUT,
  SWITCH_ORG,
  SET_NONCE,
  SET_CURRENT_WORKSPACE,
  UPDATE_CURRENT_USER,
  SYNC_WORKSPACES,
} from "./types";
import {
  REGISTER_USER,
  LOGIN_USER,
  LOGIN_WITH_GOOGLE,
  RESET_PASSWORD,
  WORKSPACE,
} from "./endpoints";
import * as errorHandlerActions from "./errorHandlerActions";
import {
  REGISTRATION_EMAIL_SENT,
  PROJECTS,
  PASSWORD_RESET_EMAIL_SENT,
  CREATE_WORKSPACE,
  LOGIN,
  ACCESS_DENIED,
} from "../_utils/routes";
import {
  analyticsTrackEvent,
  setAuthToken,
  setAuthTokenInLocalStorage,
  switchTeamId,
} from "../_utils/common";
import { redirect } from "./commonAction";
import { batch } from "react-redux";

// REGISTER USER
/// Reason we need pass 'history' , is because we cannot push to the next page(Login here),
/// from an action like we can from a component.

export const registerUser = (userData, props, signalToken) => (dispatch) => {
  return axios
    .post(REGISTER_USER, userData, {
      cancelToken: signalToken,
    })
    .then((res) => {
      analyticsTrackEvent("signUp", {
        logInType: "standard",
        email: userData.email,
      });

      props.history.push(
        REGISTRATION_EMAIL_SENT + "?email=" + encodeURIComponent(userData.email)
      );
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

//Login : Get user token
export const loginUser = (userData, props) => (dispatch) => {
  return axios
    .post(LOGIN_USER, userData)
    .then((res) => {
      dispatch(processLogin(res.data, props));
      //GA - Custom events
      analyticsTrackEvent("login", {
        logInType: "standard",
      });
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const processLogin = (data, props) => (dispatch) => {
  const { key } = data;

  localStorage.setItem("Token", key);
  localStorage.setItem("User", JSON.stringify(data.user));

  if (data.orgs.length === 0) {
    batch(() => {
      dispatch(setAuthTokenInLocalStorage(key, null, null, props));
      dispatch(redirect(CREATE_WORKSPACE, props));
    });
    return;
  }
  // Set the first available org
  const orgID = data.orgs[0].id;
  dispatch(setAuthTokenInLocalStorage(key, orgID, data.orgs, props));
};

//Login with Google:
export const loginWithGoogle =
  (tokenJSON, props, action = "login") =>
  (dispatch) => {
    return axios
      .post(LOGIN_WITH_GOOGLE, tokenJSON)
      .then((res) => {
        dispatch(processLogin(res.data, props));
        //GA - Custom events
        analyticsTrackEvent(action, {
          logInType: "Google",
        });
      })

      .catch((err) => {
        dispatch(errorHandlerActions.handleHTTPError(err, props));
      });
  };

// Set logged in user
export const setCurrentUser = (key) => {
  return {
    type: SET_CURRENT_USER,
    payload: key,
  };
};

export const updateUserPersonalInfo = (key) => {
  return {
    type: UPDATE_CURRENT_USER,
    payload: key,
  };
};

export const logoutUser = () => (dispatch) => {
  if (localStorage.getItem("Token") === null) {
    window.location.href = ACCESS_DENIED;
    return;
  }
  // Remove token from local storage
  localStorage.removeItem("Token");
  localStorage.removeItem("User");
  localStorage.removeItem("Orgs");
  localStorage.removeItem("SelectedOrgID");
  // Remove auth header for future requests
  setAuthToken(false);
  //set current user to an empty object {} which will also set isAuthenticated to false
  //dispatch(setCurrentUser({}));
  dispatch({
    type: USER_LOGGED_OUT,
    payload: null,
  });
  window.location.href = LOGIN;
};

export const switchTeam = (orgId, props) => (dispatch) => {
  localStorage.setItem("SelectedOrgID", orgId);
  let data = JSON.parse(localStorage.getItem("Orgs"));
  let newWorkspaceName = data.find((x) => x.id === orgId).name;
  setWorkspaceName(newWorkspaceName);
  switchTeamId(orgId);
  dispatch(redirect(PROJECTS, props));
  window.location.reload(false);
};

export const switchTeamNow = (orgId, key) => (dispatch) => {
  localStorage.setItem("SelectedOrgID", orgId);
  setAuthToken(key, orgId);
  dispatch({
    type: SWITCH_ORG,
    payload: orgId,
  });
};

export const resetPassword = (userData, props) => (dispatch) => {
  axios
    .post(RESET_PASSWORD, userData)
    .then((res) => {
      if (res.status === 200) {
        props.history.push(
          PASSWORD_RESET_EMAIL_SENT +
            "?email=" +
            encodeURIComponent(userData.email)
        );
      }
    })
    .catch(function (error) {})
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const setNonce = (nonce) => (dispatch) => {
  dispatch({
    type: SET_NONCE,
    payload: nonce,
  });
};

export const setWorkspaceName = (payload) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_WORKSPACE,
    payload: payload,
  });
};

/**
 * Sync all workspaces
 * @returns Promise
 */
export const syncWorkSpaces = (callback) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(WORKSPACE)
      .then((res) => {
        localStorage.setItem("Orgs", JSON.stringify(res.data.results));
        dispatch({
          type: SYNC_WORKSPACES,
          payload: res.data.results,
        });
        resolve(callback(res.data.results));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
