'use es6';

import { getApiDomain } from '../util/UrlUtil';
var URL = getApiDomain() + "/usage-logging/v1/log/hublytics-multi/no-auth";
export function postEvent(event, clientSendTimestamp) {
  var requestParams = "clientSendTimestamp=" + clientSendTimestamp;
  return fetch(URL + "?" + requestParams, {
    body: JSON.stringify([event]),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  });
}