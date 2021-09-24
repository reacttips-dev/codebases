'use es6';

import { REPLY_CLASSLIST, OFFICE_365_REPLY_ID } from 'sanitize-text/transformers/removeReply';
import { secureDocument } from '../sanitizers/SanitizeConfiguration';

var isReply = function isReply(classList, id) {
  return id === OFFICE_365_REPLY_ID || classList && classList.contains && REPLY_CLASSLIST.some(function (className) {
    return classList.contains(className);
  });
};

export var removeGmailLineBreakBeforeReply = function removeGmailLineBreakBeforeReply(_ref) {
  var node = _ref.node;

  if (!node || !node.tagName || node.tagName.toLowerCase() !== 'br') {
    return null;
  }

  if (!node.nextElementSibling || !node.nextElementSibling.tagName) {
    return null;
  } // check to see if the next sibling is a reply


  var _node$nextElementSibl = node.nextElementSibling,
      classList = _node$nextElementSibl.classList,
      id = _node$nextElementSibl.id;

  if (!isReply(classList, id)) {
    return null;
  } // replace <br /> with <span> so it doesn't take up any veritcal space


  var span = secureDocument.createElement('span');
  span.innerHTML = '';
  return {
    node: span
  };
};