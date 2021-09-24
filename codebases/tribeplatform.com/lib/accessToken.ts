import cookies from 'js-cookie'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

import { logger } from './logger'

interface AccessToken {
  id: string
  networkId: string
  networkDomain: string
  role: string
  roleId: string
  roleType: string
  iat: number
  exp: number
}

export const getAccessToken = (): string | undefined =>
  cookies.get('accessToken')

export const parseToken = (accessToken: string): AccessToken | undefined => {
  if (!accessToken) {
    return
  }
  try {
    return jwt_decode(accessToken) as AccessToken
  } catch (e) {
    logger.error('error - parsing accessToken', accessToken, e)
  }
}

export const isExpired = (jwtToken: AccessToken) => {
  return Date.now() >= jwtToken.exp * 1000
}
