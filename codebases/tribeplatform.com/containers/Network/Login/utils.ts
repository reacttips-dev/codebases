import { logger } from 'lib/logger'

export const clientLoginPageRedirect = (redirectUrl?: string): void => {
  if (typeof window === 'undefined') {
    logger.error('clientLoginPageRedirect is being called on the server side')
  } else {
    window.location.href = redirectUrl
      ? `/auth/login?from=${redirectUrl}`
      : '/auth/login'
  }
}
