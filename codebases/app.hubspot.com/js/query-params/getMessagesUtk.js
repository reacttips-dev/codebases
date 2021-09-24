'use es6';

import { getWindowLocation } from './getWindowLocation';
export function getMessagesUtk() {
  var url = getWindowLocation();
  var path = url.pathname;
  var utkIndex = path.indexOf('/utk/');
  var messagesUtkPathValue = path.slice(utkIndex).split('/').pop();
  var shouldUsePathValue = messagesUtkPathValue !== 'null' && utkIndex !== -1;
  return shouldUsePathValue ? messagesUtkPathValue : url.paramValue('messagesUtk');
}