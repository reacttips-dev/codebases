'use es6';

import Conversation from './objectDefinitions/Conversation';
import SequenceEnrollment from './objectDefinitions/SequenceEnrollment';
import Subscription from './objectDefinitions/Subscription';
var ObjectDefinitions = [Conversation, SequenceEnrollment, Subscription];

var getObjectDefinitions = function getObjectDefinitions() {
  return ObjectDefinitions;
};

export default getObjectDefinitions;