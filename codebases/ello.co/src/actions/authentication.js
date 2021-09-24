import { AUTHENTICATION } from '../constants/action_types'
import {
  loginToken,
  logout as logoutEndpoint,
  emailConfirmation as emailConfirmationEndpoint,
  checkConfirmationCode as checkConfirmationCodeEndpoint,
  forgotPassword,
  resetPassword,
  refreshAuthToken,
  webappToken,
} from '../networking/api'
import * as ENV from '../../env'

export function clearAuthToken() {
  return {
    type: AUTHENTICATION.CLEAR_AUTH_TOKEN,
  }
}

export function getUserCredentials(email, password, meta) {
  return {
    type: AUTHENTICATION.USER,
    payload: {
      endpoint: loginToken(),
      method: 'POST',
      body: {
        email,
        password,
        grant_type: 'password',
        client_id: ENV.AUTH_CLIENT_ID,
      },
    },
    meta,
  }
}

export function logout() {
  return {
    type: AUTHENTICATION.LOGOUT,
    payload: {
      endpoint: logoutEndpoint(),
      method: 'DELETE',
    },
  }
}

export function refreshAuthenticationToken(refreshToken) {
  return {
    type: AUTHENTICATION.REFRESH,
    payload: {
      endpoint: refreshAuthToken(refreshToken),
      method: 'POST',
      body: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: ENV.AUTH_CLIENT_ID,
      },
    },
  }
}

export function sendForgotPasswordRequest(email) {
  return {
    type: AUTHENTICATION.FORGOT_PASSWORD,
    payload: {
      endpoint: forgotPassword(),
      method: 'POST',
      body: {
        email,
      },
    },
  }
}

export function sendResetPasswordRequest(password, resetPasswordToken) {
  return {
    type: AUTHENTICATION.RESET_PASSWORD,
    payload: {
      endpoint: resetPassword(),
      method: 'PUT',
      body: {
        password,
        reset_password_token: resetPasswordToken,
      },
    },
  }
}

export function sendEmailForConfirmation(email) {
  return {
    type: AUTHENTICATION.SEND_EMAIL_FOR_CONFIRMATION,
    payload: {
      body: { email },
      endpoint: emailConfirmationEndpoint(),
      method: 'POST',
    },
  }
}

export function checkConfirmationCode({ email, code }) {
  return {
    type: AUTHENTICATION.CHECK_CONFIRMATION_CODE,
    payload: {
      body: { email, code },
      endpoint: checkConfirmationCodeEndpoint(),
      method: 'POST',
    },
  }
}

export function signIn(email, password) {
  return {
    type: AUTHENTICATION.SIGN_IN,
    payload: {
      method: 'POST',
      email,
      password,
    },
  }
}

export function fetchPublicToken() {
  return {
    type: AUTHENTICATION.PUBLIC,
    payload: {
      endpoint: webappToken(),
      method: 'GET',
    },
  }
}

