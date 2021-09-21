import { useCallback } from "react"
import qs from "query-string"

const isProduction = process.env.NODE_ENV === `production`
const uuid = require(`uuid/v4`)

function setSessionId(id) {
  return window.localStorage.setItem(`gatsby:sessionId`, id)
}

function findOrCreateSessionId() {
  const sessionId = window.localStorage.getItem(`gatsby:sessionId`)

  if (!sessionId) {
    const id = uuid()
    setSessionId(id)
    return id
  }

  return sessionId
}

function getTracker() {
  const userId =
    typeof window !== `undefined`
      ? window.localStorage.getItem(`gatsby:userid`)
      : undefined

  const hostname =
    typeof window !== `undefined` ? window.location.hostname : undefined

  function track(event) {
    if (process.env.GATSBY_MOCK_MODE || process.env.GATSBY_LOCAL) {
      return console.info(
        `Tracking events`,
        event,
        userId ? `for user ${userId}` : ``
      )
    }

    const headers = {
      "content-type": `application/json`,
    }
    if (userId) {
      headers[`x-cloud-user-id`] = userId
    }

    const query = qs.parse(window.location.search)

    fetch(process.env.GATSBY_ANALYTICS_ENDPOINT, {
      method: `POST`,
      headers,
      body: JSON.stringify({
        ...event,
        componentId: hostname,
        sessionId: findOrCreateSessionId(),
        pathname:
          typeof window !== `undefined` ? window.location.pathname : undefined,
        referer:
          typeof window !== `undefined` ? window.document.referrer : undefined,
        utmSource: query.utm_source,
        utmMedium: query.utm_medium,
        utmCampaign: query.utm_campaign,
        utmTerm: query.utm_term,
        utmContent: query.utm_content,
      }),
    }).catch(e => {
      console.error(e)
    })
  }

  return { track, userId }
}
export function useTracker() {
  const { track, userId } = getTracker()

  if (!isProduction) {
    console.warn(`
useTracker from @dashboard/analytics is deprecated and should be replaced with its successor from "src/utils/analytics":

import { useTracker } from "src/utils/analytics"
`)
  }

  return {
    track: useCallback(track, [userId]),
    trackPageViewed: useCallback(
      name => {
        track({
          eventType: `PAGE_VIEWED`,
          uiSource: name,
        })
      },
      [userId]
    ),
    trackButtonClicked: useCallback(
      (buttonName, params) =>
        track({
          eventType: `BUTTON_CLICKED`,
          buttonName,
          ...params,
        }),
      [userId]
    ),
  }
}

export function trackAutomaticPageViewed(path) {
  const { track } = getTracker()
  track({
    eventType: `AUTOMATIC_PAGE_VIEW`,
    uiSource: path,
  })
}
