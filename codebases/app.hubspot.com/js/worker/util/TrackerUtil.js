'use es6';

import { postEvent } from '../api/ServiceWorkerApi';
import { APP, Events, HUBSPOT_ACCOUNT_ID, INTERACTION_TYPE } from '../constants/TrackingConstants';

function extractTrackingData(notification) {
  if (!notification) {
    return {};
  }

  var origin = notification.origin,
      template = notification.template,
      type = notification.type;
  return {
    origin: origin,
    template: template,
    type: type
  };
}

function getTrackingEvent(action, notification, timestamp, eventClass) {
  var json = JSON.stringify(Object.assign({
    action: action
  }, extractTrackingData(notification)));
  var trackingData = {
    hublytics_account_id: HUBSPOT_ACCOUNT_ID,
    what_event: Events.BROWSER_NOTIFICATIONS_INTERACTION,
    what_event_class: eventClass,
    what_extra_json: json,
    when_timestamp: timestamp,
    where_app: APP,
    where_screen: APP,
    who_team_identifier: HUBSPOT_ACCOUNT_ID
  };
  var portalId = notification.portalId,
      userId = notification.userId;

  if (userId && portalId) {
    trackingData.who_identifier_v2 = "USER_ID:::" + userId + ":::53";
  }

  return trackingData;
}

function trackEvent(eventClass, action, notification) {
  var now = Date.now();
  return postEvent(getTrackingEvent(action, notification, now, eventClass), now);
}

export function trackInteraction() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  trackEvent.apply(void 0, [INTERACTION_TYPE].concat(args));
}