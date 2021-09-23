'use es6';

import { getWidgetShellUUID } from '../query-params/getWidgetShellUUID';
export var postMessageToParent = function postMessageToParent(type, data) {
  return new Promise(function (resolve, reject) {
    try {
      var uuid = getWidgetShellUUID();
      window.parent.postMessage(JSON.stringify({
        type: type,
        data: data,
        uuid: uuid
      }), '*');
      resolve({
        type: type,
        data: data
      });
    } catch (e) {
      reject(e);
    }
  });
};