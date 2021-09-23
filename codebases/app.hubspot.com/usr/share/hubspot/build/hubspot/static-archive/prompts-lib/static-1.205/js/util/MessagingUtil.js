'use es6';

import { debug } from 'prompts-lib/util/DebugUtil';
import { ORIGIN } from 'prompts-lib/constants/Messages';
export function parseMessage(event) {
  if (!event || !event.data) {
    return null;
  }

  var data;

  try {
    data = JSON.parse(event.data);
  } catch (e) {
    // ignore
    return null;
  }

  if (typeof data !== 'object' && !data.origin || data.origin !== ORIGIN) {
    debug('Ignoring unknown message', event.data);
    return null;
  }

  return data;
}
export function makeMessage(type, payload) {
  var origin = ORIGIN;
  return JSON.stringify({
    origin: origin,
    type: type,
    payload: payload
  });
}