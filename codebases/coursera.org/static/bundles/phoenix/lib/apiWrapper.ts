import Multitracker from 'js/app/multitrackerSingleton';
import API from 'js/lib/api';
import _ from 'lodash';
import Cookie from 'js/lib/cookie';
import allocate from 'js/lib/allocate';

import type { ApiOptions } from 'js/lib/api';

// Needed because `apiWrapper` is also used on the server which doesn't have js/lib/cookie

const EVENT_SAMPLING_TO_SELECT_PROBABILITY = 0.1;

/**
 * Returns true with probability `toSelectProbability` for any individual session id.
 * When session id is not populated, returns true with probability `toSelectProbability`.
 */
const shouldSelectForSampling = (toSelectProbability: number) => {
  const sessionId = Cookie && Cookie.get('__204u');
  if (sessionId) {
    // allocate returns a value in [0, 1)
    return allocate(sessionId) < toSelectProbability;
  } else {
    return Math.random() < toSelectProbability;
  }
};

const apiWrapper = function (endpoint: string, options?: ApiOptions) {
  const api = API(endpoint, options);

  // @ts-expect-error API is missing types from LucidJS
  api.on('always', function (req: $TSFixMe) {
    let { params } = req;

    if (typeof params === 'string') {
      const pairs = params.split('&');
      if (pairs.length) {
        params = _.map(pairs, function (pair) {
          const keyValue = pair.split('=');
          return { key: keyValue[0], value: [keyValue[1]] };
        });
      }
    } else {
      params = _.map(params, (v, k) => ({
        key: k,
        value: Array.isArray(v) ? v.map((_v) => _v.toString()) : [v.toString()],
      }));
    }

    if (shouldSelectForSampling(EVENT_SAMPLING_TO_SELECT_PROBABILITY)) {
      Multitracker.pushV2([
        'system.api.emit.response',
        {
          params,
          timing: req.timing,
          url: req.url,
          method: req.method,
          status: req.xhr.status,
          // response: req.xhr.responseText // this might be too large, exclude for now
        },
      ]);
    }
  });

  return api;
};

export default apiWrapper;
