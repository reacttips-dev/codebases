/* eslint-disable @typescript-eslint/ban-types */
import { isDesktop, isMac, isWindows, isLinux } from '@trello/browser';
import {
  analyticsWebClientEnv,
  analyticsWebClientApiHost,
  clientVersion,
  locale,
} from '@trello/config';
import AnalyticsWebClient, {
  ApdexStartEvent,
  ApdexStopEvent,
  TaskSessionManager,
  ScreenEvent,
  UIEvent,
  TrackEvent,
  OperationalEvent,
  envType,
  originType,
  platformType,
  AnalyticsWebClientConfig,
  AnalyticsWebClientSettings,
  EventContainer,
  EventContainerType,
  ContextType,
  DefaultAnalyticsContext,
  TaskSessions,
} from '@atlassiansox/analytics-web-client';
import { getScreenFromUrl } from './getScreenFromUrl';

// Helper validators, functions, and interfaces
import {
  checkForHelper,
  checkForScreenHelper,
  sendClickedButtonEvent,
  sendClickedLinkEvent,
  sendPressedShortcutEvent,
  sendClosedComponentEvent,
  sendDismissedComponentEvent,
  sendViewedComponentEvent,
  sendViewedBannerEvent,
  sendCreatedBoardEvent,
  sendCopiedBoardEvent,
  sendUpdatedBoardFieldEvent,
  sendUpdatedCardFieldEvent,
  startTask,
  taskSucceeded,
  taskFailed,
  taskAborted,
  SendClickedButtonEventInterface,
  SendClickedLinkEventInterface,
  SendPressedShortcutEventInterface,
  SendClosedComponentEventInterface,
  SendDismissedComponentEventInterface,
  SendViewedComponentEventInterface,
  SendViewedBannerEventInterface,
  SendCreatedBoardEventInterface,
  SendCopiedBoardEventInterface,
  SendUpdatedBoardFieldEventInterface,
  SendUpdatedCardFieldEventInterface,
  StartEventTaskInterface,
  EndEventTaskInterface,
  FailEventTaskInterface,
  AbortEventTaskInterface,
} from './helpers';

type EnvironmentVariableType = 'DEV' | 'STAGING' | 'PROD';

const config = {
  env: envType[analyticsWebClientEnv as EnvironmentVariableType],
  product: 'trello',
  version: clientVersion,
  // eslint-disable-next-line @trello/no-module-logic
  origin: isDesktop() ? originType.DESKTOP : originType.WEB,
  platform: null,
  locale,
} as AnalyticsWebClientConfig;

const settings = {
  apiHost: analyticsWebClientApiHost,
} as AnalyticsWebClientSettings;

// eslint-disable-next-line @trello/no-module-logic
if (isDesktop()) {
  switch (true) {
    // eslint-disable-next-line @trello/no-module-logic
    case isMac():
      config.platform = platformType.MAC;
      break;
    // eslint-disable-next-line @trello/no-module-logic
    case isWindows():
      config.platform = platformType.WINDOWS;
      break;
    // eslint-disable-next-line @trello/no-module-logic
    case isLinux():
      config.platform = platformType.LINUX;
      break;
    default:
  }
}

interface SendValidationFailureEvent {
  event: ScreenEvent | UIEvent | TrackEvent | OperationalEvent;
  failedEventType: string;
  sentEvent: boolean;
  hasHelper?: string | undefined;
}
interface ValidateEvent {
  e: UIEvent | TrackEvent | OperationalEvent;
  eventType: string;
  fromHelper?: boolean;
}

class AnalyticsWrapper implements AnalyticsWebClient {
  analytics: AnalyticsWebClient;
  defaultContext: DefaultAnalyticsContext;
  trelloServerVersionMap: Map<string, string>;
  traceIdTimestampMap: Map<string, number>;
  FIVE_MINUTES: number;
  constructor(
    clientConfig: AnalyticsWebClientConfig,
    clientSettings?: AnalyticsWebClientSettings,
  ) {
    this.analytics = new AnalyticsWebClient(clientConfig, clientSettings);
    this.task = this.analytics.task;
    this.defaultContext = {};
    this.trelloServerVersionMap = new Map();
    this.traceIdTimestampMap = new Map();
    this.FIVE_MINUTES = 300 * 1000;
  }

  // Validate events against helpers and glossaries
  sendValidationFailureEvent(attributes: SendValidationFailureEvent) {
    this.analytics.sendOperationalEvent({
      action: 'failed',
      actionSubject: 'eventValidation',
      source: '@trello/atlassian-analytics',
      attributes,
    });
  }
  private validateEvent(properties: ValidateEvent) {
    const { e, eventType, fromHelper } = properties;

    let helperMatch;
    if (!fromHelper) {
      helperMatch = checkForHelper(e);
    }
    if (helperMatch) {
      this.sendValidationFailureEvent({
        event: e,
        failedEventType: eventType,
        sentEvent: true,
        hasHelper: helperMatch,
      });
    }
  }

  // Only send valid containers
  private normalizeContainers(
    e: ScreenEvent | UIEvent | TrackEvent | OperationalEvent,
  ) {
    if (!e.containers) {
      return;
    }
    const normalizedContainers: EventContainer = {};
    (Object.keys(e.containers) as EventContainerType[]).forEach((container) => {
      if (
        e.containers?.[container]?.id // ? only to keep TypeScript happy
      ) {
        normalizedContainers[container] = { id: e.containers[container]?.id };
        if (normalizedContainers?.organization) {
          //double publish organization container with workspace
          normalizedContainers.workspace = { id: e.containers[container]?.id };
        }
      }
    });
    if (Object.keys(normalizedContainers).length > 0) {
      e.containers = normalizedContainers;
    } else {
      // Remove containers key if no valid containers to send
      delete e.containers;
    }
  }

  // Main events
  sendScreenEvent(e: ScreenEvent) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);

    const helperMatch = checkForScreenHelper(e);
    if (helperMatch) {
      // If the event should be `viewedComponent` instead of a screen event,
      // prompt the dev to change and prevent invalid screen event from firing
      this.sendValidationFailureEvent({
        event: e,
        hasHelper: helperMatch,
        sentEvent: false,
        failedEventType: 'screen',
      });
      return;
    }

    this.analytics.sendScreenEvent(e);
  }

  sendUIEvent(e: UIEvent) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);
    this.validateEvent({ e, eventType: 'ui' });
    this.analytics.sendUIEvent(e);
  }

  sendTrackEvent(e: TrackEvent) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);
    this.validateEvent({ e, eventType: 'track' });
    this.analytics.sendTrackEvent(e);
  }

  sendOperationalEvent(e: OperationalEvent) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);
    this.validateEvent({ e, eventType: 'operational' });
    this.analytics.sendOperationalEvent(e);
  }

  // Helpers
  sendClickedButtonEvent = (e: SendClickedButtonEventInterface) => {
    sendClickedButtonEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendClickedLinkEvent = (e: SendClickedLinkEventInterface) => {
    sendClickedLinkEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendPressedShortcutEvent = (e: SendPressedShortcutEventInterface) => {
    sendPressedShortcutEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendClosedComponentEvent = (e: SendClosedComponentEventInterface) => {
    sendClosedComponentEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendDismissedComponentEvent = (e: SendDismissedComponentEventInterface) => {
    sendDismissedComponentEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendViewedComponentEvent = (e: SendViewedComponentEventInterface) => {
    sendViewedComponentEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendViewedBannerEvent = (e: SendViewedBannerEventInterface) => {
    sendViewedBannerEvent(e, this.sendHelperUIEvent.bind(this));
  };
  sendCreatedBoardEvent = (e: SendCreatedBoardEventInterface) => {
    sendCreatedBoardEvent(e, this.sendHelperTrackEvent.bind(this));
  };
  sendCopiedBoardEvent = (e: SendCopiedBoardEventInterface) => {
    sendCopiedBoardEvent(e, this.sendHelperTrackEvent.bind(this));
  };
  sendUpdatedBoardFieldEvent = (e: SendUpdatedBoardFieldEventInterface) => {
    sendUpdatedBoardFieldEvent(e, this.sendHelperTrackEvent.bind(this));
  };
  sendUpdatedCardFieldEvent = (e: SendUpdatedCardFieldEventInterface) => {
    sendUpdatedCardFieldEvent(e, this.sendHelperTrackEvent.bind(this));
  };

  // Helper utility functions
  // Skipping the helper validation check for calls derived from helpers,
  // while leaving the main function signature of wrapper UI and track untouched
  private sendHelperUIEvent(e: UIEvent, helperName: string) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);
    this.validateEvent({ e, eventType: helperName, fromHelper: true });
    this.analytics.sendUIEvent(e);
  }
  private sendHelperTrackEvent(e: TrackEvent, helperName: string) {
    this.normalizeContainers(e);
    this.addDefaultAttributes(e);
    this.validateEvent({ e, eventType: helperName, fromHelper: true });
    this.analytics.sendTrackEvent(e);
  }

  // Pageview event
  /**
   * Send a GAS pageview event when navigating to a new route via the controller.
   * Source corresponds to screen derived from the current route (`window.location`).
   * **NOT** to be used in place of screen events.
   */
  sendPageviewEvent() {
    this.analytics.sendUIEvent({
      action: 'displayed',
      actionSubject: 'page',
      source: getScreenFromUrl(),
    });
  }

  // Initialization events
  setTenantInfo(
    tenantType: 'cloudId' | 'orgId' | 'none' | 'opsgenieCustomerId',
    tenantId?: string,
  ) {
    this.analytics.setTenantInfo(tenantType, tenantId);
  }

  setOrgInfo(orgId: string) {
    this.analytics.setOrgInfo(orgId);
  }

  setUserInfo(
    userType: 'atlassianAccount' | 'hashedEmail' | 'trello' | 'opsgenie',
    userId: string,
  ) {
    this.analytics.setUserInfo(userType, userId);
  }

  sendIdentifyEvent(
    userType: 'atlassianAccount' | 'hashedEmail' | 'trello' | 'opsgenie',
    userId: string,
  ) {
    this.analytics.sendIdentifyEvent(userType, userId);
  }

  startUIViewedEvent() {
    this.analytics.startUIViewedEvent();
  }

  stopUIViewedEvent() {
    this.analytics.stopUIViewedEvent();
  }

  // Apdex
  startApdexEvent(e: ApdexStartEvent) {
    this.analytics.startApdexEvent(e);
  }

  stopApdexEvent(e: ApdexStopEvent) {
    this.analytics.stopApdexEvent(e);
  }

  getApdexStart(e: ApdexStartEvent) {
    this.analytics.getApdexStart(e);
  }

  /**
   * Some child components (e.g. @atlaskit/atlassian-switcher) require consumers
   * to fire their events. In these cases, we don't want to do any validation.
   *
   * This function is appropriate inspired by React's dangerouslySetInnerHTML as it
   * bypasses in-built allow-lists. Use with care!
   */
  dangerouslyGetAnalyticsWebClient(): AnalyticsWebClient {
    return this.analytics;
  }

  // Task Sessions
  readonly task: TaskSessionManager;

  // Tracing
  getTraceId(): string {
    // Return 128 bit trace ids (32 hexadecimal digits)
    // https://github.com/openzipkin/zipkin-js/blob/98f7796d54199ccb2a81dea04c466a40814ccb24/packages/zipkin/src/tracer/index.js#L77
    // but support B3 single format with fist 32 bits (8 digits) as epoch seconds
    // https://github.com/openzipkin/b3-propagation/blob/master/STATUS.md#epoch128

    const epochSeconds = Math.floor(Date.now() / 1000).toString(16);
    const remainingBits =
      this.getRandomTraceId().slice(8) + this.getRandomTraceId();

    return epochSeconds + remainingBits;
  }
  private getRandomTraceId() {
    // Generates 64 bit string
    // Taken from openzipkin/zipkin-js
    // https://github.com/openzipkin/zipkin-js/blob/50d9c3afb662c2d18d688ecef66883d6c5326f4b/packages/zipkin/src/tracer/randomTraceId.js
    const digits = '0123456789abcdef';
    let n = '';
    for (let i = 0; i < 16; i += 1) {
      const rand = Math.floor(Math.random() * 16);
      n += digits[rand];
    }
    return n;
  }

  startTask = (e: StartEventTaskInterface): string => {
    const traceId = this.getTraceId();
    startTask(e, traceId, this.sendOperationalEvent.bind(this), this.task);
    return traceId;
  };

  getTaskSessions = (): TaskSessions => {
    return this.task.getAllTaskSessions();
  };

  taskSucceeded = (e: EndEventTaskInterface) => {
    taskSucceeded(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e.traceId),
    );
  };

  taskFailed = (e: FailEventTaskInterface) => {
    return taskFailed(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e.traceId),
    );
  };

  taskAborted = (e: AbortEventTaskInterface) => {
    return taskAborted(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e.traceId),
    );
  };

  removeTraceIdFromMaps = (traceId: string) => {
    this.trelloServerVersionMap.delete(traceId);
    this.traceIdTimestampMap.delete(traceId);
  };

  expireTraceIds = () => {
    const now = Date.now();
    this.traceIdTimestampMap.forEach((timestamp, traceId) => {
      if (timestamp && now - timestamp > this.FIVE_MINUTES) {
        this.removeTraceIdFromMaps(traceId);
      }
    });
  };

  setTrelloServerVersion = (
    traceId: string | undefined | null,
    trelloServerVersion: string | undefined | null,
  ) => {
    if (traceId && trelloServerVersion) {
      this.trelloServerVersionMap.set(traceId, trelloServerVersion);
      this.traceIdTimestampMap.set(traceId, Date.now());
    }

    this.expireTraceIds();
  };

  getTrelloServerVersion = (traceId: string) => {
    const trelloServerVersion = this.trelloServerVersionMap.get(traceId);
    this.removeTraceIdFromMaps(traceId);
    return trelloServerVersion;
  };

  // Default Attributes

  private addDefaultAttributes = (
    e: ScreenEvent | TrackEvent | UIEvent | OperationalEvent,
  ) => {
    // Next line prevents unnecessarily adding an empty attributes object to an event with no attributes
    if (!Object.entries(this.defaultContext).length) return;

    if (!e.attributes) e.attributes = {};
    e.attributes.context = this.defaultContext;
  };

  setContext = (attributes: DefaultAnalyticsContext) => {
    this.defaultContext = attributes;
  };

  /** Restores the entire `defaultAttributes` object to an empty state,
   * unless a specific context type to clear is passed in, in which
   * case only that field is cleared from the `context` object
   * */
  clearContext = (type?: ContextType) => {
    if (type) delete this.defaultContext[type];
    else {
      this.defaultContext = {};
    }
  };
}

// eslint-disable-next-line @trello/no-module-logic
export const Analytics = new AnalyticsWrapper(config, settings);
