import { ZOOM_HOST_ERROR, INVALID_URL_ERROR } from 'bundles/author-group-events/constants/eventConstants';

import _ from 'underscore';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS = ['events', 'eventSeriesById', 'handledError', 'handledError', 'defaultEventLink'];

const ZOOM_ERROR_CODES = ['1113', '1114', '1115'];

class GroupEventsStore extends BaseStore {
  static storeName = 'GroupEventsStore';

  static handlers = {
    RECEIVED_GROUP_EVENTS({ events }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events = events;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    RECEIVED_DEFAULT_EVENT_LINK({ defaultEventLink }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultEventLink' does not exist on type... Remove this comment to see the full error message
      this.defaultEventLink = defaultEventLink;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    CREATED_GROUP_EVENT({ event }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events.add(event);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    UPDATED_GROUP_EVENT({ event }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events.update(event);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    DELETED_GROUP_EVENT({ event }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events.remove(event);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    RECEIVED_GROUP_EVENT_SERIES({ eventSeries }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventSeriesById' does not exist on type ... Remove this comment to see the full error message
      this.eventSeriesById[eventSeries.id] = eventSeries;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events.updateEventSeries(eventSeries);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    CREATED_GROUP_EVENT_SERIES({ eventSeries, events }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventSeriesById' does not exist on type ... Remove this comment to see the full error message
      this.eventSeriesById[eventSeries.id] = eventSeries;
      events.forEach((event: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
        this.events.add(event);
      });
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type '{ RECEIV... Remove this comment to see the full error message
      this.events = this.events.sortByStartDate();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    DELETED_GROUP_EVENT_SERIES({ eventSeriesId }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventSeriesById' does not exist on type ... Remove this comment to see the full error message
      this.eventSeriesById[eventSeriesId] = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    GROUP_EVENT_FAIL({ error }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = false;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resetErrors' does not exist on type '{ R... Remove this comment to see the full error message
      this.resetErrors();
      const { message: zoomErrorMessage } = error;

      const errorString = JSON.stringify(error);
      if (
        // note: the first case should catch this error, but being extra cautious since it seems brittle
        errorString.indexOf('\\\\\\"code\\\\\\":1001,') > -1 ||
        errorString.indexOf('User does not exist') > -1 ||
        errorString.indexOf('User not exist') > -1 ||
        ZOOM_ERROR_CODES.includes(error.errorCode)
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handledError' does not exist on type '{ ... Remove this comment to see the full error message
        this.handledError = ZOOM_HOST_ERROR;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'zoomErrorMessage' does not exist on type... Remove this comment to see the full error message
        this.zoomErrorMessage = zoomErrorMessage;
      } else if (errorString.indexOf('Invalid URL:') > -1) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handledError' does not exist on type '{ ... Remove this comment to see the full error message
        this.handledError = INVALID_URL_ERROR;
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'unhandledError' does not exist on type '... Remove this comment to see the full error message
        this.unhandledError = error;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    GROUP_EVENT_CLEAR_ERROR() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'handledError' does not exist on type '{ ... Remove this comment to see the full error message
      this.handledError = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'zoomErrorMessage' does not exist on type... Remove this comment to see the full error message
      this.zoomErrorMessage = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'unhandledError' does not exist on type '... Remove this comment to see the full error message
      this.unhandledError = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    GROUP_EVENT_SAVING_IN_PROGRESS() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
      this.saveInProgress = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },
  };

  constructor(dispatcher: $TSFixMe) {
    super(dispatcher);
    this.reset();
  }

  dehydrate() {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state: $TSFixMe) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));
  }

  reset() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'GroupEve... Remove this comment to see the full error message
    this.events = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventSeriesById' does not exist on type ... Remove this comment to see the full error message
    this.eventSeriesById = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultEventLink' does not exist on type... Remove this comment to see the full error message
    this.defaultEventLink = null;
    this.resetErrors();
  }

  resetErrors() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'handledError' does not exist on type 'Gr... Remove this comment to see the full error message
    this.handledError = null;
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'unhandledError' does not exist on type '... Remove this comment to see the full error message
    this.unhandledError = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'zoomErrorMessage' does not exist on type... Remove this comment to see the full error message
    this.zoomErrorMessage = null;
  }

  hasLoaded() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'GroupEve... Remove this comment to see the full error message
    return !!this.events;
  }

  getEvents() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'GroupEve... Remove this comment to see the full error message
    return this.events;
  }

  getEventSeries(eventSeriesId: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventSeriesById' does not exist on type ... Remove this comment to see the full error message
    return this.eventSeriesById[eventSeriesId];
  }

  getDefaultEventLink() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultEventLink' does not exist on type... Remove this comment to see the full error message
    return this.defaultEventLink;
  }

  getUnhandledError() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'unhandledError' does not exist on type '... Remove this comment to see the full error message
    return this.unhandledError;
  }

  getHandledError() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'handledError' does not exist on type 'Gr... Remove this comment to see the full error message
    return this.handledError;
  }

  getZoomErrorMessage() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'zoomErrorMessage' does not exist on type... Remove this comment to see the full error message
    return this.zoomErrorMessage;
  }

  getSaveInProgress() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveInProgress' does not exist on type '... Remove this comment to see the full error message
    return this.saveInProgress;
  }
}

export default GroupEventsStore;
