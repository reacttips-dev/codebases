'use es6';

import { SUBSCRIPTION_TYPE_ID as subscriptionObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import AllObjectPropertiesReferenceResolver from 'reference-resolvers/resolvers/AllObjectPropertiesReferenceResolver';
import ObjectDefinitionRecord from '../ObjectDefinitionRecord';
var Subscription = ObjectDefinitionRecord({
  enableAsAssociatedType: true,
  gates: ['Payments:Beta', 'Payments:Subscriptions'],
  objectType: 'SUBSCRIPTION',
  objectTypeId: subscriptionObjectTypeId,
  propertyResolver: AllObjectPropertiesReferenceResolver(subscriptionObjectTypeId, {}),
  referenceObjectType: 'SUBSCRIPTION_PROPERTIES'
});
export default Subscription;