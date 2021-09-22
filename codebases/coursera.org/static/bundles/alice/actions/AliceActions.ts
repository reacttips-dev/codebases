import AliceEvent from 'bundles/alice/models/AliceEvent';
import { getMessages } from 'bundles/alice/utils/AliceApiUtils';

export const publishAliceNotification = (actionContext: $TSFixMe, { event }: $TSFixMe) => {
  const { type: eventType } = event;

  const AliceStore = actionContext.getStore('AliceStore');
  const messagesForEventType = AliceStore.getMessagesForEventType(eventType);

  if (!messagesForEventType) {
    actionContext.dispatch('REQUESTING_ALICE_MESSAGES', { eventType });

    getMessages(event).then((messages) => {
      actionContext.dispatch('CACHE_ALICE_MESSAGES', { eventType, messages });
    });
  }

  return actionContext.dispatch('PUBLISH_ALICE_NOTIFICATION', { event });
};

export const clearAliceNotification = (actionContext: $TSFixMe) => {
  actionContext.dispatch('CLEAR_ALICE_NOTIFICATION');
};

export const dismissAliceNotification = (actionContext: $TSFixMe, { id }: $TSFixMe) => {
  actionContext.dispatch('DISMISS_ALICE_NOTIFICATION', { id });
};
