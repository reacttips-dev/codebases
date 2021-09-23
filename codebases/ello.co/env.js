const envEl = document.querySelector('meta[name="webappEnv"]')
if (envEl) {
  const webappEnv = JSON.parse(decodeURI(envEl.getAttribute('content')))
  module.exports = {
    API_DOMAIN: webappEnv.API_DOMAIN || webappEnv.AUTH_DOMAIN,
    APP_DEBUG: webappEnv.APP_DEBUG,
    AUTH_CLIENT_ID: webappEnv.AUTH_CLIENT_ID,
    AUTH_DOMAIN: webappEnv.AUTH_DOMAIN,
    LOGO_MARK: webappEnv.LOGO_MARK,
    NODE_ENV: process.env.NODE_ENV,
    PROMO_HOST: webappEnv.PROMO_HOST,
    SEGMENT_WRITE_KEY: webappEnv.SEGMENT_WRITE_KEY,
    USE_LOCAL_EMOJI: (process.env.USE_LOCAL_EMOJI === 'true'),
  }
} else if (typeof window !== 'undefined' && typeof window.webappEnv !== 'undefined') {
  module.exports = {
    API_DOMAIN: window.webappEnv.API_DOMAIN || window.webappEnv.AUTH_DOMAIN,
    APP_DEBUG: window.webappEnv.APP_DEBUG,
    AUTH_CLIENT_ID: window.webappEnv.AUTH_CLIENT_ID,
    AUTH_DOMAIN: window.webappEnv.AUTH_DOMAIN,
    LOGO_MARK: window.webappEnv.LOGO_MARK,
    NODE_ENV: process.env.NODE_ENV,
    PROMO_HOST: window.webappEnv.PROMO_HOST,
    SEGMENT_WRITE_KEY: window.webappEnv.SEGMENT_WRITE_KEY,
    USE_LOCAL_EMOJI: (process.env.USE_LOCAL_EMOJI === 'true'),
  }
} else {
  module.exports = {
    API_DOMAIN: process.env.API_DOMAIN || process.env.AUTH_DOMAIN,
    APP_DEBUG: (process.env.APP_DEBUG === 'true'),
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    LOGO_MARK: process.env.LOGO_MARK,
    NODE_ENV: process.env.NODE_ENV,
    PROMO_HOST: process.env.PROMO_HOST,
    SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
    USE_LOCAL_EMOJI: (process.env.USE_LOCAL_EMOJI === 'true'),
  }
}

