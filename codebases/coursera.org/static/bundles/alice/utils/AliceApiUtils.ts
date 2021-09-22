import AliceMessageData from 'bundles/alice/models/AliceMessageData';
import URI from 'jsuri';
import API from 'js/lib/api';

const aliceMessagesApi = API('/api/aliceMessages.v1', { type: 'rest' });

/* eslint-disable import/prefer-default-export */
export const getMessages = (event: $TSFixMe) => {
  const { type, courseBranchId, contextType } = event;

  let uri;
  if (courseBranchId) {
    uri = new URI()
      .addQueryParam('q', 'byBranchAndEventType')
      .addQueryParam('eventType', type)
      .addQueryParam('branchId', courseBranchId);
  } else if (contextType) {
    uri = new URI()
      .addQueryParam('q', 'byContextAndEventType')
      .addQueryParam('eventType', type)
      .addQueryParam('contextType', contextType);
  }

  // @ts-ignore ts-migrate(2532) FIXME: Object is possibly 'undefined'.
  return aliceMessagesApi.get(uri.toString()).then((response) => {
    const aliceMessages = response.elements.map((message: $TSFixMe) => {
      return new AliceMessageData(
        message.id,
        message.definition && message.definition.itemId,
        message.definition && message.definition.moduleId,
        message.definition && message.definition.weekNumber,
        message.definition && message.definition.title,
        message.definition && message.definition.message,
        message.definition && message.definition.dataSourceDescription,
        message.definition && message.definition.action,
        message.definition && message.definition.epicToShowNamespace,
        message.definition && message.definition.epicToShowParameter,
        event.type
      );
    });
    return aliceMessages;
  });
};
