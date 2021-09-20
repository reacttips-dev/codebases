/* eslint-disable import/no-default-export */
import BaseEngine, { EngineEvents } from './base';
import type { ApiRawResponse } from '../trello-client-js.types';
import { Analytics } from '@trello/atlassian-analytics';

export default class AjaxEngine extends BaseEngine {
  tryRequest: BaseEngine['tryRequest'] = (
    request: Request,
    events: EngineEvents,
  ): Promise<ApiRawResponse> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const traceId = request.headers.get('X-Trello-TraceId');

      // We want to treat the response like text, since that's what the base
      // engine expects
      xhr.responseType = 'text';

      xhr.onload = async () => {
        const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');

        Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

        return resolve({
          statusCode: xhr.status,
          contentType: xhr.getResponseHeader('content-type'),
          body: xhr.response,
        });
      };

      xhr.onerror = async () => {
        const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
        Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

        resolve(this.NETWORK_ERROR);
      };

      if (events && events.onprogress) {
        xhr.onprogress = events.onprogress;
      }

      xhr.open(request.method, request.url, true);

      if (request.headers) {
        Object.entries(request.headers).forEach(([key, value]) =>
          xhr.setRequestHeader(key, value),
        );
      }

      xhr.send();
    });
  };
}
