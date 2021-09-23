'use es6';

import curry from 'transmute/curry';
import { getSenderType } from './commonMessageFormatGetters';
import { AGENT, BOT, SYSTEM, VISITOR } from '../constants/legacySenderTypes';
export var isSenderType = curry(function (senderType, message) {
  return getSenderType(message) === senderType;
});
export var isFromAgent = isSenderType(AGENT);
export var isFromBot = isSenderType(BOT);
export var isFromSystem = isSenderType(SYSTEM);
export var isFromVisitor = isSenderType(VISITOR);