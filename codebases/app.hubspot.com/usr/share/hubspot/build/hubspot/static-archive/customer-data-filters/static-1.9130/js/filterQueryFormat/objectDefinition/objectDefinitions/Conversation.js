'use es6';

import { CONVERSATION as conversationObjectType } from 'customer-data-objects/constants/ObjectTypes';
import { CONVERSATION_TYPE_ID as conversationObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import ConversationPropertyReferenceResolver from 'reference-resolvers/resolvers/ConversationPropertyReferenceResolver';
import ObjectDefinitionRecord from '../ObjectDefinitionRecord';
var Conversation = ObjectDefinitionRecord({
  enableAsAssociatedType: false,
  gates: [],
  objectType: conversationObjectType,
  objectTypeId: conversationObjectTypeId,
  propertyResolver: ConversationPropertyReferenceResolver,
  referenceObjectType: conversationObjectType + "_PROPERTIES"
});
export default Conversation;