/**
 * Segment
 */

// Aligning with the Segment API Spec: https://segment.com/docs/connections/spec/
// Add more as we have occasion
export enum SegmentEventType {
  Track = `track`,
  Page = `page`,
  Identify = `identify`,
}

export type SegmentTrackEvent = {
  type: SegmentEventType.Track
  event: string
  properties?: { [k: string]: string }
}

export type SegmentPageEvent = {
  type: SegmentEventType.Page
  name: string
  properties?: { [k: string]: string }
}

export type SegmentIdentifyEvent = {
  type: SegmentEventType.Identify
  traits: {
    name: string
    email: string
  }
  properties?: { [k: string]: string }
}

export type SegmentEvent =
  | SegmentTrackEvent
  | SegmentPageEvent
  | SegmentIdentifyEvent

/**
 * Google Analytics
 */

// enforce some conventions around naming Google Analytics events
// read them at: https://app.getguru.com/card/TApgE8Mc/Google-Analytics-Tracking-Conventions
export enum GAEventType {
  Click = `click`,
  View = `view`,
  Input = `input`,
}

type BaseGAEventPayload = {
  category: string
  value?: number
}

export type GAClickEvent = BaseGAEventPayload & {
  eventType: GAEventType.Click
  label: {
    text?: string
    loc?: string
  }
}

export type GAViewEvent = BaseGAEventPayload & {
  eventType: GAEventType.View
  label: {
    text?: string
    loc?: string
  }
}

export type GAInputEvent = BaseGAEventPayload & {
  eventType: GAEventType.Input
  label: {
    text?: string
    loc?: string
  }
}

export type GAEvent = GAClickEvent | GAViewEvent | GAInputEvent

/**
 * BigQuery
 */
export enum BigQueryEventType {
  PageViewed = `PAGE_VIEWED`,
  ButtonClicked = `BUTTON_CLICKED`,
}

type BigQueryEventPayload = {
  eventType: BigQueryEventType
  uiSource?: string
}

export type GatsbyAnalytcisEvent = {
  time?: Date
  pathname?: string
  eventType?: string
  name?: string
  version?: number // by default 1.
  buttonName?: string
  uiSource?: string
  fieldName?: string
  // componentId: "www.gatsbyjs.com"
  // componentVersion: string
  duration?: number // integer
  valueString?: string
  valueInteger?: number // integer
  valueBoolean?: boolean
  valueFloat?: number
  userId?: string
  sessionId?: string
  organizationId?: string
  siteId?: string
  buildId?: string
}

export type BigQueryClickEvent = BigQueryEventPayload & {
  eventType: BigQueryEventType.ButtonClicked
  buttonName: string
}

export type BigQueryPageViewedEvent = BigQueryEventPayload & {
  eventType: BigQueryEventType.PageViewed
  uiSource: string
}

export type BigQueryEvent =
  | BigQueryClickEvent
  | BigQueryPageViewedEvent
  | GatsbyAnalytcisEvent
