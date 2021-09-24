import JsCookies from 'js-cookie'

import { AuthToken } from 'tribe-api'

export const ACCESS_TOKEN = 'accessToken'
export const REFRESH_TOKEN = 'refreshToken'
export const AccessTokenMaxAge = 30 * 24 * 60 * 60 * 1000 // one month
export const RefreshTokenMaxAge = 12 * 30 * 24 * 60 * 60 * 1000 // one year

export const setAuthCookies = ({
  accessToken,
  refreshToken,
}: {
  accessToken?: AuthToken['accessToken']
  refreshToken?: AuthToken['refreshToken']
}) => {
  if (accessToken) {
    JsCookies.set(ACCESS_TOKEN, accessToken, {
      httpOnly: false,
    })
  }
  if (refreshToken) {
    JsCookies.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: false,
    })
  }
}

export const resetAuthCookies = () => {
  /*
      IMPORTANT! When deleting a cookie and you're not relying on the default attributes,
      you must pass the exact same path and domain attributes that were used to set the cookie
    */
  JsCookies.remove(ACCESS_TOKEN)
  JsCookies.remove(REFRESH_TOKEN)
}
