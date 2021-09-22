import Q from 'q';
import _ from 'underscore';
import URI from 'jsuri';
import API from 'js/lib/api';
import type { CourseraConnectMessage } from 'bundles/widget/types/Request';

const rpcActionsResourceApi = API('/api/widgetRpcActions.v1', {
  type: 'rest',
});
const widgetSessionsResourceApi = API('/api/widgetSessions.v1', {
  type: 'rest',
});

const fields = ['src', 'sandbox', 'iframeTitle', 'dimensions', 'rpcActionTypes', 'configuration', 'expiresAt'];

/**
 * Generates a random 10-character id.
 */
const generateId = (): string => {
  return Array(11)
    .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
    .slice(0, 10);
};

/**
 * Handles remote procedure calls (RPCs) for a given request and sessionId
 */
const handleWidgetRpcAction = (request: CourseraConnectMessage, sessionId: string) => {
  // convert RPC action names of the form 'DO_MY_ACTION' to the API form 'doMyAction'
  const actionName = request.type
    .split('')
    .map(function (x, i, arr) {
      if (x === '_') {
        return '';
      } else if (i !== 0 && arr[i - 1] === '_') {
        return x;
      } else {
        return x.toLowerCase();
      }
    })
    .join('');

  // including this check until the API layer can properly handle this.
  const { body } = request;
  const keys = body && Object.keys(body);
  let data = body;

  if (actionName === 'getStoredValues' && !_(keys).contains('names')) {
    data = {
      // @ts-expect-error TSMIGRATION
      names: request.body,
    };
  }

  if (actionName) {
    const uri = new URI().addQueryParam('sessionId', sessionId).addQueryParam('action', actionName);
    return Q(rpcActionsResourceApi.post(uri.toString(), { data }));
  } else {
    return Q.reject('Unexpected RPC action!');
  }
};

/**
 * Gets the widget session
 */
const retrieveWidgetSession = (sessionId: string) => {
  const uri = new URI(sessionId).addQueryParam('fields', fields.join());
  return Q(widgetSessionsResourceApi.get(uri.toString())).then((response) => response.elements[0]);
};

/**
 * Shamelessly pilfered from js/vendor/ZeroClipboard.v2-1-6
 */
const _hasOwn = Object.prototype.hasOwnProperty;
// @ts-ignore ts-migrate(7024) FIXME: Function implicitly has return type 'any' because ... Remove this comment to see the full error message
const deepCopy = (source: any) => {
  let copy;
  let i;
  let len;
  let prop;
  if (typeof source !== 'object' || source == null) {
    copy = source;
  } else if (typeof source.length === 'number') {
    copy = [];
    for (i = 0, len = source.length; i < len; i += 1) {
      if (_hasOwn.call(source, i)) {
        copy[i] = deepCopy(source[i]);
      }
    }
  } else {
    copy = {};
    for (prop in source) {
      if (_hasOwn.call(source, prop)) {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        copy[prop] = deepCopy(source[prop]);
      }
    }
  }
  return copy;
};

export default {
  generateId,
  handleWidgetRpcAction,
  retrieveWidgetSession,
  deepCopy,
};

export { generateId, handleWidgetRpcAction, retrieveWidgetSession, deepCopy };
