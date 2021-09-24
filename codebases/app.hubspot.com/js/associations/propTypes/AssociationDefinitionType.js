'use es6';

import { HUBSPOT_DEFINED, USER_DEFINED } from 'customer-data-objects/associations/AssociationCategoryTypes';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import PropTypes from 'prop-types'; // BE Enum File that this is representing:
// https://git.hubteam.com/HubSpot/InboundDbAssociations/blob/7e9ddfe2e82832abbd7235c84147070d663548ae/InboundDbAssociationsBase/src/main/java/com/hubspot/inbounddb/associations/base/Cardinality.java

export var AssociationCardinalityType = PropTypes.oneOf(['ONE_TO_ONE', 'ONE_TO_MANY']);
var AssociationDefinitionObjectTypeDefinitionType = PropTypes.shape({
  metaTypeId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  objectTypeId: ObjectTypeIdType.isRequired,
  pluralForm: PropTypes.string,
  primaryDisplayLabelPropertyName: PropTypes.string,
  singularForm: PropTypes.string
});
export var AssociationDefinitionType = PropTypes.shape({
  associationCategory: PropTypes.oneOf([HUBSPOT_DEFINED, USER_DEFINED]),
  associationTypeId: PropTypes.number.isRequired,
  inverseAssociationTypeId: PropTypes.number.isRequired,
  fromObjectTypeDefinition: AssociationDefinitionObjectTypeDefinitionType.isRequired,
  fromObjectTypeId: ObjectTypeIdType.isRequired,
  toObjectTypeDefinition: AssociationDefinitionObjectTypeDefinitionType.isRequired,
  toObjectTypeId: ObjectTypeIdType.isRequired,
  cardinality: AssociationCardinalityType.isRequired,
  inverseCardinality: AssociationCardinalityType.isRequired,
  name: PropTypes.string.isRequired,
  inverseName: PropTypes.string.isRequired,
  label: PropTypes.string,
  inverseLabel: PropTypes.string,
  hasAllAssociatedObjects: PropTypes.bool.isRequired,
  inverseHasAllAssociatedObjects: PropTypes.bool.isRequired,
  maxToObjectIds: PropTypes.number.isRequired,
  maxFromObjectIds: PropTypes.number.isRequired,
  hasCascadingDeletes: PropTypes.bool.isRequired,
  fromObjectType: PropTypes.string,
  toObjectType: PropTypes.string
});