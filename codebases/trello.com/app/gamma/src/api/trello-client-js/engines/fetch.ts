/* eslint-disable import/no-default-export */
import BaseEngine from './base';
import type { ApiRawResponse } from '../trello-client-js.types';
import { Analytics } from '@trello/atlassian-analytics';

export default class FetchEngine extends BaseEngine {
  tryRequest: BaseEngine['tryRequest'] = async (
    request: Request,
  ): Promise<ApiRawResponse> => {
    let response: Response;

    try {
      response = await window.fetch(request);

      const traceId = request.headers.get('X-Trello-TraceId');
      const trelloServerVersion = response.headers.get('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      const contentType = response.headers.get('content-type');

      return {
        statusCode: response.status,
        contentType,
        body: await response.text(),
      };
    } catch (ex) {
      // Failed because of a network issue, so we try to retry
      return this.NETWORK_ERROR;
    }
  };
}
