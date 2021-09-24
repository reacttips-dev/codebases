'use es6';

import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import PropTypes from 'prop-types';
import { HUBSPOT_DEFINED, USER_DEFINED } from 'customer-data-objects/associations/AssociationCategoryTypes';
export var AssociationDefinitionType = PropTypes.shape({
  associationCategory: PropTypes.oneOf([HUBSPOT_DEFINED, USER_DEFINED]),
  associationTypeId: PropTypes.number.isRequired,
  toObjectTypeDefinition: PropTypes.shape({
    objectTypeId: ObjectTypeIdType,
    primaryDisplayLabelPropertyName: PropTypes.string
  })
});