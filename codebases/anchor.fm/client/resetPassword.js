import { AnchorAPI } from './modules/AnchorAPI';

// constants

const RECEIVE_REQUEST_TOKEN_VALIDITY =
  '@@resetPassword/RECEIVE_REQUEST_TOKEN_VALIDITY';
const RECEIVE_SUCCESSFUL_RESET = '@@resetPassword/RECEIVE_SUCCESSFUL_RESET';

const initialState = {
  resetToken: null,
  resetTokenIsValid: null,
  resetWasSuccessful: false,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_REQUEST_TOKEN_VALIDITY: {
      const { resetTokenIsValid, resetToken } = action;
      return {
        ...state,
        resetTokenIsValid,
        resetToken,
      };
    }
    case RECEIVE_SUCCESSFUL_RESET: {
      return {
        ...state,
        resetWasSuccessful: true,
      };
    }
    default:
      return state;
  }
}

// action creators

export function receiveResetTokenValidity(
  resetToken,
  resetTokenIsValid = false
) {
  return {
    type: RECEIVE_REQUEST_TOKEN_VALIDITY,
    resetTokenIsValid,
    resetToken,
  };
}

function submitResetPasswordForm() {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-account-submit',
        payload: {
          target: 'Reset Password Form',
        },
      },
    },
  };
}

function receiveSuccessfulReset() {
  return {
    type: RECEIVE_SUCCESSFUL_RESET,
  };
}

// thunks

export function getResetPasswordTokenValidity(baseUrl = '', code) {
  return (dispatch, getState) =>
    fetch(`${baseUrl}/api/resetpassword/${code}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response;
      })
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          console.log('Error');
          dispatch(receiveResetTokenValidity(null));
        }
        dispatch(
          receiveResetTokenValidity(
            responseJson.code,
            responseJson.requestTokenIsValid
          )
        );
      });
}

export function requestToSubmitResetPasswordForm(data) {
  return (dispatch, getState) => {
    const {
      resetPassword: { resetToken },
    } = getState();
    dispatch(submitResetPasswordForm());
    return AnchorAPI.submitPasswordReset({
      resetToken,
      ...data,
    }).then(response => {
      const { status } = response;
      if (status !== 200) {
        // generic response for a 401 unauthorized
        throw new Error('There was an error. Please try again later.');
      }
      dispatch(receiveSuccessfulReset());
    });
  };
}
