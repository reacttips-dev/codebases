'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import * as senderTypes from '../constants/cmfSenderTypes';
import { getSenderKeyFromType } from './getSenderKeyFromType';
var senderTypeValues = Object.keys(senderTypes).map(function (key) {
  return senderTypes[key];
});
export var buildSender = function buildSender(_ref) {
  var senderType = _ref.senderType,
      senderId = _ref.senderId;
  invariant(senderTypeValues.includes(senderType), "Invalid sender type. Should be one of " + senderTypeValues.join(' | ') + ". Received %s", senderType);
  var senderIdKey = getSenderKeyFromType(senderType);
  return ImmutableMap(_defineProperty({
    '@type': senderType
  }, senderIdKey, senderId));
};