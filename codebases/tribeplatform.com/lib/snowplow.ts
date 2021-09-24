import {
  enableActivityTracking,
  newTracker,
  trackPageView,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker'

import { logger } from '@tribefrontend/logger'

import { getRuntimeConfigVariable } from '../utils/config'

/* Each event is occurred in specific context or about specific item.
 * by default all events are occurred in specific organization and network and they should be set.
 * other events can be triggered for specific space or post or topic
 * */
export type targetDataContext = {
  organizationId: string
  networkId?: string
  groupId?: string
  templateId?: string
  spaceId?: string
  postId?: string
  topicId?: string
  reactionId?: string
  memberId?: string
  appId?: string
}

/* An Event has an actor which is a user who triggered that.
 * for example a page view event is triggered by a user
 * we need to have the some information about the user.
 * Guest users also have id and role
 * */
export type actorDataContext = {
  id: string
  locale: string
  roleId: string
  roleType: string
  spaceRoleId?: string
  spaceRoleType?: string
}

class SnowplowTracker {
  actor: actorDataContext

  target: targetDataContext

  active: boolean

  enablePageView: boolean

  enablePagePing: boolean

  /* You can initialize the snowplowTracker userInfo as AuthUser and target info by Partial of targetDataContext
   * */
  constructor(
    authUser?: Partial<actorDataContext>,
    targetData?: Partial<targetDataContext>,
  ) {
    const snowplowCollectorAddress = getRuntimeConfigVariable(
      'SHARED_SNOWPLOW_COLLECTOR_ADDRESS',
    )

    /*
    Initialize snowplow tracker based on snowplow documentation
    https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/quick-start-guide/
    */
    this.active = !(snowplowCollectorAddress === undefined)

    if (snowplowCollectorAddress === undefined) {
      logger.warn('Snowplow variable, Collector Address, is not defined')
      return
    }

    this.enablePagePing =
      getRuntimeConfigVariable('SHARED_SNOWPLOW_ENABLE_PAGE_PING') === 'true'
    this.enablePageView =
      getRuntimeConfigVariable('SHARED_SNOWPLOW_ENABLE_PAGE_VIEW') === 'true'

    newTracker('tribe-front-web', snowplowCollectorAddress, {
      appId: 'tribe-snowplow',
      platform: 'web',
      cookieDomain: '',
      discoverRootDomain: true,
      cookieName: 'tribe_sp',
      cookieSameSite: 'None',
      cookieSecure: true,
      encodeBase64: false,
      respectDoNotTrack: false,
      eventMethod: 'post',
      bufferSize: 1,
      maxPostBytes: 40000,
    })
    if (authUser) this.setActor(authUser)
    if (targetData) this.setTarget(targetData)

    if (this.enablePagePing) {
      enableActivityTracking({
        minimumVisitLength: 10,
        heartbeatDelay: 10,
      })
    }
  }

  /**
   * Set the Actor of the Event
   * @param {actorDataContext} authUser
   * @returns void
   */
  setActor(authUser?: Partial<actorDataContext>) {
    this.actor = { ...this.actor, ...authUser }
  }

  /**
   * Set the Target of the Event
   * @param {targetDataContext} targetData
   * @returns void
   */
  setTarget(targetData: Partial<targetDataContext>) {
    this.target = { ...this.target, ...targetData }
  }

  track(
    noun: string,
    verb: string,
    eventBody: Record<string, unknown> = {},
    targetData?: Partial<targetDataContext>,
  ): void {
    if (!this.active) return
    if (targetData) this.setTarget(targetData)
    trackSelfDescribingEvent({
      event: {
        schema: 'iglu:so.tribe/self_described/jsonschema/1-0-0',
        data: {
          noun,
          verb,
          ...eventBody,
        },
      },
      context: [
        {
          schema: 'iglu:so.tribe/actor/jsonschema/1-0-0',
          data: this.actor,
        },
        {
          schema: 'iglu:so.tribe/target/jsonschema/1-0-0',
          data: this.target,
        },
      ],
    })
  }

  /**
   * Set the Target of the Event
   * @param {string} pageTitle : each page should have a title, if it is a space page or post page or admin dashboard
   *                 there is no need to set the specific name and event the uri parameter of "space" or "post" is enough
   * @param {targetDataContext} targetData : as user surfs among pages,...
   *                            the page view event target is changed so it can be updated by this parameter
   * @returns void
   */
  trackPageView(
    pageTitle: string,
    targetData?: Partial<targetDataContext>,
  ): void {
    if (!this.active || !this.enablePageView) return
    if (targetData) this.setTarget(targetData)

    // Todo: this condition should be deleted later as the organizationId set for all networks
    if (typeof this.target.organizationId === 'undefined') {
      this.setTarget({ organizationId: 'NA' })
    }

    trackPageView({
      title: pageTitle,
      context: [
        {
          schema: 'iglu:so.tribe/actor/jsonschema/1-0-0',
          data: this.actor,
        },
        {
          schema: 'iglu:so.tribe/target/jsonschema/1-0-0',
          data: this.target,
        },
      ],
    })
  }
}

const tracker = new SnowplowTracker()
export default tracker
