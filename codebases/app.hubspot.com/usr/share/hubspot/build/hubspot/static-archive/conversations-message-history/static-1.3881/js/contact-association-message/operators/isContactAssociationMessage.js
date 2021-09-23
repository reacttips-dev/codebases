'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CONTACT_ASSOCIATION } from '../constants/messageTypes';
export var isContactAssociationMessage = function isContactAssociationMessage(message) {
  return getTopLevelType(message) === CONTACT_ASSOCIATION;
};