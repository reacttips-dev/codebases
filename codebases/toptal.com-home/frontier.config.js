const isStorybook = require('./lib/is-storybook')

/**
 * Returns the same object as "options" with replacing values from process.env whenever possible
 * @param {object} options
 */
const withDefault = options => {
    const config = {}

    for (const [key, value] of Object.entries(options)) {
        config[key] = process.env[key] || value
    }

    return config
}

const DEV_HOST = 'localhost'
const DEV_BASE = `http://${DEV_HOST}`
const WEBPACK_DEV_PORT = 3333
const WEBPACK_DEV_ORIGIN = `${DEV_BASE}:${WEBPACK_DEV_PORT}`
const DEV_STARTUP_URL = '/dev/page/dev-index'
const DATA_SERVER_URL = `http://localhost:3001`
const SENTRY_AUTH_TOKEN = ''

const CSS_CLASS_NAME_PATTERN = defaultPattern => {
    if (process.env.STORYBOOK_ENV === 'production') {
        return '[name]__[local]___[hash:base64:5]'
    }

    return defaultPattern
}

const LIVE_DATA = {
    requestUri: route => `${DATA_SERVER_URL}${route}.json?phoenix=enabled`,
    parseResponse: ({
        data
    }) => {
        const {
            pageName: page
        } = data.requestMetadata

        return {
            page,
            data
        }
    }
}

const appConfig = {
    CSS_CLASS_NAME_PATTERN,
    // Variables used by replace-env-vars.js
    replaceVars: withDefault({
        APP_ENV: 'semi-production',
        ASSETS_URI: WEBPACK_DEV_ORIGIN,
        BS_UPLOADS_URI: DATA_SERVER_URL,
        GIORGIO_URI: `${DEV_BASE}:3007/hire`,
        PAGE_INFO_URI: `${DATA_SERVER_URL}/_info.json`,
        SENTRY_DSN: 'https://j9beeXQfyC8vKs8Gs5luIDDr5SP72a2J@o66666.ingest.sentry.io/6660666',
        SENTRY_PUBLIC_KEY: 'j9beeXQfyC8vKs8Gs5luIDDr5SP72a2J',
        SHORTENER_URI: `${DEV_BASE}:3000/shorten_url`
    }),
    shouldHydrateComponent: () => !isStorybook()
}

const defaultConfig = {
    // Port on which frontier server listens
    PORT: 3004,
    // Host on which frontier & webpack dev server run
    DEV_HOST,
    DEV_BASE,
    DEV_STARTUP_URL,
    // Port on which webpack dev server listens
    WEBPACK_DEV_PORT,
    WEBPACK_DEV_ORIGIN,
    SENTRY_AUTH_TOKEN,
    LIVE_DATA,
    DATA_SERVER_URL,
    // TODO: exclude from process.env
    defaultPageConfig: {
        fullHydration: false,
        enabled: true
    }
}

module.exports = {
    ...withDefault(defaultConfig),
    ...appConfig
}