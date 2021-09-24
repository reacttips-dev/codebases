// Note: this file is included in the production bundle, so please do not include any sensitive information in here
const optimizely = require('@optimizely/optimizely-sdk');

const ENVIRONMENT_CONFIGS = {
    // See you on glitch dot com
    production: {
        ENVIRONMENT: 'production',
        BASE_URL: 'glitch.com',
        API_URL: 'https://api.glitch.com',
        CDN_URL: 'https://cdn.glitch.com',
        PROJECT_URL: 'https://%s.glitch.me',

        GITHUB_CLIENT_ID: 'b4cb743ed07e20abf0b2',
        FACEBOOK_CLIENT_ID: '660180164153542',
        SEGMENT_WRITE_KEY: 'N8NetCAuTbHYGqtQtb44FFBSPUXwsAu2',
        FIREBASE_AUTH_CLIENT_ID: '713678572461-k1aepj16cvnbcaiaif34mgavgpj10gjg.apps.googleusercontent.com',
        SENTRY_DSN: 'https://029cb06346934232bbc4ea4f4c16f1b7@sentry.io/1247156',
        GRECAPTCHA_SITE_KEY: '6LcqF6gZAAAAAHE-lzA_9GAux7eX9OHaQ5VdEo0C',
        OPTIMIZELY_KEY: 'GZMqH7Aou8QmcPV2hm16wj',
        OPTIMIZELY_LOG_LEVEL: optimizely.enums.LOG_LEVEL.ERROR,
    },

    // Staging environment used for testing backend deploys.
    staging: {
        ENVIRONMENT: 'staging',
        BASE_URL: 'staging.glitch.com',
        API_URL: 'https://api.staging.glitch.com',
        CDN_URL: 'https://cdn.staging.glitch.com',
        PROJECT_URL: 'https://%s.staging.glitch.me',

        GITHUB_CLIENT_ID: '65efbd87382354ca25e7',
        FACEBOOK_CLIENT_ID: '1858825521057112',
        SEGMENT_WRITE_KEY: 'K88LAtKLCZzZw7SgC76KnGuWjMOhGwLL',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: 'https://029cb06346934232bbc4ea4f4c16f1b7@sentry.io/1247156',
        GRECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        OPTIMIZELY_KEY: 'E93QJ2WwhcfKwSLR9Bi3ow',
    },

    // Local development environment running against prod backend. Used for most
    // editor development.
    development: {
        ENVIRONMENT: 'development',
        BASE_URL: 'glitch.com',
        API_URL: 'https://api.glitch.com',
        CDN_URL: 'https://cdn.glitch.com',
        PROJECT_URL: 'https://%s.glitch.me',

        GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
        FACEBOOK_CLIENT_ID: '1121393391305429',
        SEGMENT_WRITE_KEY: 'Oa74eP053IozA1ouL7my4svHW36qGGmM',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: null, // Disabled for local dev
        GRECAPTCHA_SITE_KEY: '6LcqF6gZAAAAAHE-lzA_9GAux7eX9OHaQ5VdEo0C',
        OPTIMIZELY_KEY: 'BnMXF26DExxBgum3wFLmc1',
    },

    // Local development environment running against a development backend. Used
    // by backend developers testing their changes against the editor frontend.
    backend_development: {
        ENVIRONMENT: 'development',
        BASE_URL: 'glitch.development',
        API_URL: 'https://api.glitch.development',
        CDN_URL: 'https://s3.amazonaws.com/hyperdev-development',
        PROJECT_URL: 'https://%s.glitch.development',

        GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
        FACEBOOK_CLIENT_ID: '1121393391305429',
        SEGMENT_WRITE_KEY: 'Oa74eP053IozA1ouL7my4svHW36qGGmM',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: null, // Disabled for local dev
        GRECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        OPTIMIZELY_KEY: 'BnMXF26DExxBgum3wFLmc1',
    },

    // Local development environment running against a local proxy the uses a local
    // instance of glitchdotcom/Glitch-ProjectHost for containers and the prod backend for
    // other API requests (see /local-proxy in glitchdotcom/Glitch-ProjectHost for details)
    local_projecthost_development: {
        ENVIRONMENT: 'development',
        BASE_URL: 'glitch.localprojecthost:3031',
        API_URL: 'http://api.glitch.localprojecthost:3031',
        CDN_URL: 'https://s3.amazonaws.com/hyperdev-development',
        PROJECT_URL: 'http://%s.glitch.localprojecthost:3031',

        GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
        FACEBOOK_CLIENT_ID: '1121393391305429',
        SEGMENT_WRITE_KEY: 'Oa74eP053IozA1ouL7my4svHW36qGGmM',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: null, // Disabled for local dev
        GRECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        OPTIMIZELY_KEY: 'BnMXF26DExxBgum3wFLmc1',
    },

    // Environment used when running unit tests
    test: {
        ENVIRONMENT: 'test',
        BASE_URL: 'glitch.com',
        API_URL: 'https://api.glitch.com',
        CDN_URL: 'https://cdn.glitch.com',
        PROJECT_URL: 'https://%s.glitch.me',

        GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
        FACEBOOK_CLIENT_ID: '1121393391305429',
        SEGMENT_WRITE_KEY: 'Oa74eP053IozA1ouL7my4svHW36qGGmM',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: null, // Disabled for tests
        GRECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        OPTIMIZELY_KEY: null, // Disabled for tests
    },

    // Environment used when running integration tests
    integration: {
        ENVIRONMENT: 'test',
        BASE_URL: 'testing.staging.glitch.com',
        API_URL: 'https://api.testing.staging.glitch.com',
        CDN_URL: 'https://s3.amazonaws.com/hyperdev-development',
        PROJECT_URL: 'https://%s.testing.staging.glitch.com',

        GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
        FACEBOOK_CLIENT_ID: '1121393391305429',
        SEGMENT_WRITE_KEY: 'Oa74eP053IozA1ouL7my4svHW36qGGmM',
        FIREBASE_AUTH_CLIENT_ID: '292092233942-jl40ieeai1kksd1e363suup8o72hu7u0.apps.googleusercontent.com',
        SENTRY_DSN: null, // Disabled for tests
        GRECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        OPTIMIZELY_KEY: 'kGzmyXiGAJTsrui83yBRz1lDLHU7ROY9',
    },
};

// If the frontend is being proxied through the backend dev server or staging,
// use the matching environment config. Otherwise, choose based on the
// ENVIRONMENT environment variable.
let currentEnv = process.env.ENVIRONMENT || 'production';
if (typeof window !== 'undefined') {
    if (window.location.origin === 'https://staging.glitch.com') {
        currentEnv = 'staging';
    } else if (window.location.origin === 'https://glitch.development') {
        currentEnv = 'backend_development';
    }
}

let environmentConfig = ENVIRONMENT_CONFIGS[currentEnv];

// Additionally allow the backend hostname to be customized. This is used by the
// backend when it needs to run integration tests against a CI server with an
// unpredictable hostname.
if (process.env.BACKEND_HOSTNAME) {
    environmentConfig = {
        ...environmentConfig,
        API_URL: `https://api.${process.env.BACKEND_HOSTNAME}`,
        PROJECT_URL: `https://%s.${process.env.BACKEND_HOSTNAME}`,
    };
}

module.exports = environmentConfig;