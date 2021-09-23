'use es6';

import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PropTypes from 'prop-types';
import CrmObjectRecord from 'customer-data-objects/crmObject/CrmObjectRecord';
import SubjectType from 'customer-data-objects-ui-components/propTypes/SubjectType';
/**
 * @description Legacy, fixed value ObjectType validators
 */

var ObjectTypeName = ObjectTypesType;
/**
 * @description Validator based on the object type standard format
 * @todo make more opinionated ones to match metaTypeIds, if needed
 */

var ObjectTypeId = ObjectTypeIdType;
/**
 * @description any valid object type form
 */

var AnyCrmObjectTypePropType = PropTypes.oneOfType([ObjectTypeId, ObjectTypeName]);
var CrmObjectRecordType = PropTypes.instanceOf(CrmObjectRecord);
var AnyCrmObjectPropType = PropTypes.oneOfType([SubjectType, CrmObjectRecordType]);
export { AnyCrmObjectTypePropType, ObjectTypeId, ObjectTypeName, AnyCrmObjectPropType };