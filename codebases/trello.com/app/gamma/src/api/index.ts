/* eslint-disable import/no-default-export */
import { token, memberId } from '@trello/session-cookie';
import { clientVersion } from '@trello/config';
import PromiseQueue from './promise-queue';
import TrelloClient from './trello-client-js';
import { Task } from '@trello/atlassian-analytics';

function getDefaultHeaders() {
  return {
    'X-Trello-Client-Version': clientVersion,
    'X-Trello-ReqId': `${memberId}-${Math.random()}`,
    //X-Trello-PreferMember: will be necessary for "One Account", please check https://extranet.atlassian.com/display/TRELLO/One+Account%3A+Technical+Implementation+Specification+v2.0
  };
}

class API {
  client = new TrelloClient({
    getHeaders: () => getDefaultHeaders(),
    getToken: () => token || '',
  });
  queue = new PromiseQueue();

  withTracing = (traceId: string, options?: { task?: Task }) => {
    let taskHeader = '';
    if (options?.task) {
      taskHeader = options.task;
    }

    return new TrelloClient({
      getHeaders: () => ({
        ...getDefaultHeaders(),
        'X-Trello-TraceId': traceId,
        'X-Trello-Task': taskHeader,
      }),
      getToken: () => token || '',
    });
  };
}

// eslint-disable-next-line @trello/no-module-logic
export default new API();
