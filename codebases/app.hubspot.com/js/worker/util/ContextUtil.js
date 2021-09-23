'use es6';

import { stripHtmlFromString } from './HTMLUtil';
import { getTypeNameFromId } from '../../util/NotificationTypeUtil';
var TYPE_TO_CONTEXT = {
  mention: 'mention'
};

function getContextObject(context, contextKey) {
  return context && context.find(function (contextObject) {
    return contextObject.key === contextKey;
  });
}

function getContextKey(typeId) {
  var typeName = getTypeNameFromId(typeId);
  return TYPE_TO_CONTEXT[typeName];
}

export function getContextText(context, typeId) {
  var contextKey = getContextKey(typeId);
  var contextObject = getContextObject(context, contextKey);

  if (!contextObject || !contextObject.value) {
    return null;
  }

  return stripHtmlFromString(contextObject.value);
}