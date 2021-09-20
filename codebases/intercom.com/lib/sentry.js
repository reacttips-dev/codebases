const React = require('react')
const SentryBrowser = require('@sentry/browser')

function initSentry(Sentry = SentryBrowser, tags = []) {
  if (process.env.SENTRY_ENABLED !== 'true') return

  const dev = process.env.NODE_ENV !== 'production'
  const preview = process.env.CONTENTFUL_PREVIEW === 'true'
  const staging = process.env.STAGING === 'true'
  const production = !dev && !preview && !staging
  const environment = production ? 'production' : staging ? 'staging' : dev ? 'dev' : 'preview'

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.MUSTER_SHA,
    environment,
    debug: dev,
    allowUrls: [
      /https:\/\/www\.intercom\.com/,
      /https:\/\/marketing-site-static-staging\.internal\.intercom\.io/,
    ],
    ignoreErrors: [/Loading chunk (\d+) failed/i],
  })

  Sentry.configureScope((scope) => {
    scope.setTag('react.version', React.version)
    scope.setTag('next.env', process.browser ? 'browser' : 'server')
    Object.keys(tags).forEach((tag) => scope.setTag(tag, tags[tag]))
  })
}

function captureException(...args) {
  if (process.env.SENTRY_ENABLED !== 'true') return
  SentryBrowser.captureException(...args)
}

module.exports = {
  initSentry,
  captureException,
}
