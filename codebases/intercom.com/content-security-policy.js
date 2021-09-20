const SELF = "'self'"
const NONE = "'none'"
const UNSAFE_EVAL = "'unsafe-eval'"
const UNSAFE_INLINE = "'unsafe-inline'"
const STRICT_DYNAMIC = "'strict-dynamic'"

const HTTP_IN_DEV = process.env.NODE_ENV === 'production' ? '' : 'http:'
const INTERCOM_TEST_IN_DEV = process.env.NODE_ENV === 'production' ? '' : 'intercom.test'
const INTERCOM_STAGING_IF_ALLOWED =
  process.env.STAGING === 'true' || process.env.CONTENTFUL_PREVIEW === 'true'
    ? 'funky-staging.intercom.io'
    : ''

function getPolicy(path, nonce) {
  const POLICIES = {
    default: {
      'default-src': [SELF],
      'child-src': [
        SELF,
        'connect.facebook.net',
        'fast.wistia.com',
        'fast.wistia.net',
        'googleads.g.doubleclick.net',
        '*.hotjar.com',
        'bid.g.doubleclick.net',
        '10317493.fls.doubleclick.net',
        '10366747.fls.doubleclick.net',
        'youtube.com',
        'www.youtube.com',
        'js.stripe.com',
        'www.facebook.com',
        'staticxx.facebook.com',
        '*.soundcloud.com',
        'ti.to',
        '*.tito.io',
        '*.cdn.optimizely.com',
        'tpc.googlesyndication.com',
        'www.google.com',
        'ethn.io',
        '*.quora.com',
        'intercom-sheets.com',
        'app-ab27.marketo.com',
        'www.intercom-reporting.com',
        'd2c7xlmseob604.cloudfront.net',
        'js.intercomcdn.com',
        'insight.adsrvr.org',
      ],

      'connect-src': [
        SELF,
        INTERCOM_TEST_IN_DEV,
        INTERCOM_STAGING_IF_ALLOWED,
        'www.intercom.com',
        'app.intercom.io',
        'app.intercom.com',
        'api.intercom.io',
        'api-visitor-analytics.intercom.com',
        'api-iam.intercom.io',
        'api-ping.intercom.io',
        'api.smartling.com',
        'js.intercomcdn.com',
        'nexus-websocket-a.intercom.io',
        'nexus-websocket-test.intercom.io',
        'nexus-long-poller-a.intercom.io',
        'nexus-long-poller-test.intercom.io',
        'store.intercomassets.com',
        'widget.intercom.io',
        'wss://nexus-websocket-a.intercom.io',
        'wss://nexus-websocket-test.intercom.io',
        'uploads.intercomcdn.com',
        'uploads.intercomusercontent.com',
        'abrtp1.marketo.com',
        'abrtp1-cdn.marketo.com',
        'app.getsentry.com',
        'stats.g.doubleclick.net',
        'www.google-analytics.com',
        'http://*.hotjar.com:*',
        'https://*.hotjar.com:*',
        'https://vc.hotjar.io:*',
        'wss://*.hotjar.com',
        'sentry.io',
        'www.facebook.com',
        '*.akamaihd.net',
        '*.optimizely.com',
        '*.wistia.com',
        '*.wistia.net',
        '*.quora.com',
        '*.soundcloud.com',
        '*.sndcdn.com',
        '*.clearbit.com',
        '258-clw-344.mktoresp.com',
        'bat.bing.com',
        'cdn.bizible.com',
        'd2c7xlmseob604.cloudfront.net',
        'rum-collector-2.pingdom.net',
        'rum-http-intake.logs.datadoghq.com',
        'public-trace-http-intake.logs.datadoghq.com',
        'heapanalytics.com',
        'api.company-target.com',
        'https://assets.ctfassets.net',
      ],

      'font-src': ['data:', 'https:', HTTP_IN_DEV],
      'img-src': ['data:', 'blob:', 'https:', HTTP_IN_DEV],
      'media-src': ['data:', 'blob:', 'https:', HTTP_IN_DEV],

      'object-src': [NONE],

      'script-src': [
        SELF,
        UNSAFE_EVAL,
        'app.intercom.io',
        'app.intercom.com',
        'js.intercomcdn.com',
        'store.intercomassets.com',
        'marketing.intercomassets.com',
        'widget.intercom.io',
        'ajax.googleapis.com',
        'analytics.twitter.com',
        'abrtp1.marketo.com',
        'abrtp1-cdn.marketo.com',
        'app-sjqe.marketo.com',
        'app-sjst.marketo.com',
        'app-ab27.marketo.com',
        'bat.bing.com',
        'cdn-assets-prod.s3.amazonaws.com',
        'cdn.optimizely.com',
        'cdn3.optimizely.com',
        'cdn.ravenjs.com',
        'browser.sentry-cdn.com',
        'connect.facebook.net',
        'distillery.wistia.com',
        'distillery-main.wistia.com',
        'ethn.io',
        'fast.wistia.com',
        'fast.wistia.net',
        'ga.clearbit.com',
        'googleads.g.doubleclick.net',
        'sjs.bizographics.com',
        'js.stripe.com',
        'munchkin.marketo.net',
        'platform.twitter.com',
        'reveal.clearbit.com',
        'rtp-static.marketo.com',
        'script.hotjar.com',
        'secure.adnxs.com',
        'snap.licdn.com',
        'static.hotjar.com',
        'stats.g.doubleclick.net',
        'store.intercom.io',
        'ti.to',
        'tpc.googlesyndication.com',
        'www.datadoghq-browser-agent.com',
        'www.google.com',
        'www.google-analytics.com',
        'www.googleadservices.com',
        'www.googletagmanager.com',
        'tagmanager.google.com',
        '*.jquery.com',
        '*.tito.io',
        '*.linkedin.com',
        '*.quora.com',
        '*.soundcloud.com',
        '*.sndcdn.com',
        '*.widerfunnel.com',
        STRICT_DYNAMIC,
        `'nonce-${nonce}'`,
      ],

      'style-src': [
        SELF,
        UNSAFE_INLINE,
        '*.tito.io',
        'app-ab27.marketo.com',
        'marketing.intercomassets.com',
        'maxcdn.bootstrapcdn.com',
        'rtp-static.marketo.com',
        'fonts.googleapis.com',
        'tagmanager.google.com',
        'heapanalytics.com',
      ],

      'worker-src': ['data:', 'blob:'],
    },
  }
  return POLICIES[path] || POLICIES['default']
}

function generatePolicyString(path = 'default', nonce) {
  const policyString = Object.entries(getPolicy(path, nonce))
    .map(([directiveName, origins]) => `${directiveName} ${origins.join(' ')}`)
    .join('; ')

  return policyString
}

module.exports = generatePolicyString
