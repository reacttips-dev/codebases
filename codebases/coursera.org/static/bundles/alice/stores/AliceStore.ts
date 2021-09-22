import AliceLocalStorage from 'bundles/alice/utils/AliceLocalStorage';

import epic from 'bundles/epic/client';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import translateEventToMessage from 'bundles/alice/utils/translateEventToMessage';

import { CONTEXTUAL } from 'bundles/alice/constants/AliceMessageIdPrefix';

class AliceStore extends BaseStore {
  static storeName = 'AliceStore';

  event = null;

  messages = {};

  static handlers = {
    REQUESTING_ALICE_MESSAGES({ eventType }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'messages' does not exist on type '{ REQU... Remove this comment to see the full error message
      this.messages[eventType] = [];
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    CACHE_ALICE_MESSAGES({ eventType, messages }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'messages' does not exist on type '{ REQU... Remove this comment to see the full error message
      this.messages[eventType] = messages;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    PUBLISH_ALICE_NOTIFICATION({ event }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
      if (this.event) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
        if (!event || event.id !== this.event.id) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
          this.event = event;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
          this.emitChange();
        }
      } else if (event) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
        this.event = event;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
        this.emitChange();
      }
    },

    CLEAR_ALICE_NOTIFICATION() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
      this.event = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },

    DISMISS_ALICE_NOTIFICATION({ id }: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type '{ REQUEST... Remove this comment to see the full error message
      this.event = null;
      AliceLocalStorage.setIsDismissed(id);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ RE... Remove this comment to see the full error message
      this.emitChange();
    },
  };

  getMessagesForEventType(eventType: $TSFixMe) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return this.messages[eventType];
  }

  shouldDisplayMessage(message: $TSFixMe) {
    // Contextual messages (i.e. messages that are not courses specific) are EPIC filtered on the BE.
    const isContexualMessage = message.id.startsWith(CONTEXTUAL);

    if (!message.epicToShowNamespace || !message.epicToShowParameter || isContexualMessage) {
      return true; // No experiment specified means we always show.
    } else {
      const tags = {
        alice_message_id: message.id,
      };
      // @ts-expect-error ts-migrate(2559) FIXME: Type '{ alice_message_id: any; }' has no propertie... Remove this comment to see the full error message
      return epic.get(message.epicToShowNamespace, message.epicToShowParameter, tags);
    }
  }

  getPublishedMessage() {
    if (!this.event) {
      return null;
    }

    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const messages = this.getMessagesForEventType(this.event.type);
    const message = translateEventToMessage(this.event, messages);

    if (!message || !this.shouldDisplayMessage(message) || AliceLocalStorage.getIsDismissed(message.id)) {
      return null;
    }

    return message;
  }
}

export default AliceStore;
