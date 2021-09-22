import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

import { MessageId } from 'bundles/learning-assistant/types/RealtimeMessages';

const RESOURCE_NAME = 'learningAssistanceMessagesSent.v1';

/**
 * Should only be used to migrate Local Storage record of whether
 * an AliceMessage has been seen or not into learningAssistanceMessagesSent.v1
 */
export const markAsSentAndSeen = (aliceMessageIds: string[]): Q.Promise<{ auth: string }> => {
  const api = API(`/api/${RESOURCE_NAME}/`, { type: 'rest' });
  const uri = new URI().addQueryParam('action', 'markAsSentAndSeen');

  return Q(
    api.post(uri.toString(), {
      data: {
        aliceMessageIds,
      },
    })
  );
};

/**
 * Marks learningAssistanceMessage as seen before. Once marked as seen, the BE
 * will not send a message with the same id again.
 *
 * @messageIds: LearningAssistanceMessage.id, which is what is sent through Pusher
 * See https://github.com/webedx-spark/infra-services/blob/5592de122de0c896a3f26fcee68f9b2469eabb41/libs/models/src/main/pegasus/org/coursera/learningassistance/messages/LearningAssistanceMessage.courier#L6
 */
export const markAsSeen = (messageIds: MessageId[]): Q.Promise<{ auth: string }> => {
  const api = API(`/api/${RESOURCE_NAME}/`, { type: 'rest' });
  const uri = new URI().addQueryParam('action', 'markAsSeen');
  return Q(
    api.post(uri.toString(), {
      data: {
        ids: messageIds,
      },
    })
  );
};
