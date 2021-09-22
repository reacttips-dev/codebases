import * as React from "react"
import * as qs from "query-string"
import { findOrCreateSessionId, getUserId } from "../utils"
import {
  SegmentEvent,
  GAEvent,
  BigQueryEvent,
  BigQueryEventType,
  SegmentPageEvent,
  SegmentTrackEvent,
  SegmentEventType,
  SegmentIdentifyEvent,
  GatsbyAnalytcisEvent,
} from "../types"

const isProduction = process.env.NODE_ENV === `production`

export default function useTracker() {
  return {
    trackSegment,
    trackGoogleAnalytics,
    trackBigQuery,
    // The following three methods shoould be considered deprecated,
    // their usages should be replaced with trackBigQuery
    track: trackBigQuery,
    trackPageViewed: React.useCallback((name: string) => {
      trackBigQuery({
        eventType: BigQueryEventType.PageViewed,
        uiSource: name,
      })
    }, []),
    trackAction: React.useCallback(
      (params: { eventType: string } & GatsbyAnalytcisEvent) =>
        trackBigQuery({
          ...params,
          eventType: params.eventType || BigQueryEventType.ButtonClicked,
        }),
      []
    ),
    trackButtonClicked: React.useCallback(
      (buttonName: string, params: GatsbyAnalytcisEvent) =>
        trackBigQuery({
          eventType: BigQueryEventType.ButtonClicked,
          buttonName,
          ...params,
        }),
      []
    ),
  }
}

/**
 * Segment
 */

function trackSegment(eventPayload: SegmentEvent) {
  const userId = getUserId()

  const { type, properties } = eventPayload

  if (!type || !properties) {
    if (isSegmentTrackEvent(eventPayload) && !eventPayload.event) {
      return console.error(`Missing "event" from Segment "track" event payload`)
    }
    if (isSegmentPageEvent(eventPayload) && !eventPayload.name) {
      return console.error(`Missing "name" from Segment "page" event payload`)
    }
    if (isSegmentIdentifyEvent(eventPayload) && !eventPayload.traits) {
      return console.error(
        `Missing "traits" from Segment "identify" event payload`
      )
    }
  }

  if (
    process.env.GATSBY_DEBUG_SEGMENT_EVENTS ||
    process.env.NODE_ENV === `test`
  ) {
    return logEvent(`Segment`, {
      ...eventPayload,
      userId,
    })
  }

  // guard to check segment analytics is loaded on the page
  if (!window.analytics) {
    return console.error(
      `window.analytics wasn't found on this page, event not sent`
    )
  }

  if (isSegmentPageEvent(eventPayload)) {
    window.analytics.page(eventPayload.name, { ...properties, userId })
    trackBigQuery({
      eventType: `SEGMENT_PAGE_EVENT`,
      name: JSON.stringify(properties),
      userId: userId ? userId : undefined,
    })
  } else if (isSegmentTrackEvent(eventPayload)) {
    // TODO
    window.analytics.track(eventPayload.event, { ...properties, userId })
    trackBigQuery({
      eventType: `SEGMENT_TRACK_EVENT`,
      name: JSON.stringify(properties),
      userId: userId ? userId : undefined,
    })
  } else if (isSegmentIdentifyEvent(eventPayload)) {
    window.analytics.identify(userId, {
      traits: eventPayload.traits,
      ...properties,
      userId,
    })
  }
}

function isSegmentPageEvent(
  eventPayload: SegmentEvent
): eventPayload is SegmentPageEvent {
  return eventPayload.type === SegmentEventType.Page
}

function isSegmentTrackEvent(
  eventPayload: SegmentEvent
): eventPayload is SegmentTrackEvent {
  return eventPayload.type === SegmentEventType.Track
}

function isSegmentIdentifyEvent(
  eventPayload: SegmentEvent
): eventPayload is SegmentIdentifyEvent {
  return eventPayload.type === SegmentEventType.Identify
}

/**
 * Google Analytics
 */

export function trackGoogleAnalytics(eventPayload: GAEvent) {
  const userId = getUserId()

  const { eventType: action, category, label, value } = eventPayload

  // make sure there is a category, action, and label
  // so there's useful information for analysis
  if (!category || !label || !action) {
    return console.error(`Missing category, action, or label from event`)
  }

  // guard for local development
  if (process.env.GATSBY_DEBUG_GA_EVENTS || process.env.NODE_ENV === `test`) {
    return logEvent(`Google Analytics`, {
      category,
      action: action,
      label,
      value,
      userId,
    })
  }

  // guard to check ga is on the page
  if (!window.ga) {
    return console.error(`window.ga wasn't found on this page, event not sent`)
  }

  window.ga(`send`, `event`, category, action, stringifyGALabel(label), value)
}

function stringifyGALabel(label: object): string {
  const keyValuePairs: string[] = []
  Object.entries(label).forEach(([key, value]) => {
    keyValuePairs.push(`${key}:${value}`)
  })
  return keyValuePairs.join(`; `).toLowerCase()
}

/**
 * BigQuery
 */
function trackBigQuery<T>(eventPayload: BigQueryEvent & T) {
  const userId = getUserId()

  if (process.env.GATSBY_MOCK_MODE || process.env.GATSBY_LOCAL) {
    return console.info(
      `Tracking events`,
      eventPayload,
      userId ? `for user ${userId}` : ``
    )
  }
  const analyticsEndpoint = process.env.GATSBY_ANALYTICS_ENDPOINT
  if (!analyticsEndpoint) {
    if (!isProduction) {
      console.error(`process.env.GATSBY_ANALYTICS_ENDPOINT is not specified`)
    }
    return
  }

  fetch(analyticsEndpoint, {
    method: `POST`,
    headers: composeEventHeaders(userId),
    body: JSON.stringify(composeEventBody(eventPayload)),
  }).catch(e => {
    console.error(e)
  })
}

function composeEventHeaders(userId?: string | null) {
  const headers: {
    [k: string]: string
  } = {
    "content-type": `application/json`,
  }
  if (userId) {
    headers[`x-cloud-user-id`] = userId
  }

  return headers
}

function composeEventBody(event: object) {
  const hostname =
    typeof window !== `undefined` ? window.location.hostname : undefined

  const query = qs.parse(window.location.search)

  return {
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
  }
}

function logEvent(destination: string, eventPayload: { [k: string]: unknown }) {
  return console.info(
    `Detected ${destination} event: (you are in ${
      process.env.NODE_ENV === `test` ? `test environment` : `debug mode`
    })`,
    `\n`,
    eventPayload
  )
}
