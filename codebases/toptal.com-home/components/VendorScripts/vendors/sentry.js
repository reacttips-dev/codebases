import {
    appEnv,
    version
} from '@toptal/frontier'
import React from 'react'
import Helmet from 'react-helmet'

import {
    sentryPublicKey
} from '~/lib/config'

const loadSentryCode = `
Sentry.onLoad(function() {
  Sentry.init({
    release: "${version.codeVersion}",
    environment: "${appEnv}",
    attachStacktrace: true,
    denyUrls: [
      // reCAPTCHA flakiness
      /gstatic\\.com\\/recaptcha\\/releases/i,
      // Bing UET tracking flakiness
      /bat\\.bing\\.com\\/bat\\.js/i,
    ],
    beforeSend(event, hint) {
      const error = hint.originalException

      // silence Google reCAPTCHA timeout exceptions
      if (/^Timeout(?: \\(\\w\\))?$/.test(error)) {
        return null
      }

      // silence Twitter GTM tag errors
      if (
        error &&
        error.message &&
        error.message.match(/twttr is not defined/)
      ) {
        return null
      }

      return event
    }
  });
});
`

const SentryScripts = () => ( <
    Helmet >
    <
    script src = {
        `https://js.sentry-cdn.com/${sentryPublicKey}.min.js`
    }
    crossOrigin = "anonymous"
    data - lazy = "no"
    onLoad = {
        loadSentryCode
    }
    /> <
    /Helmet>
)

export default SentryScripts