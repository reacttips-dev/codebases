'use es6'; // copied from https://git.hubteam.com/HubSpot/object-builder-ui/blob/master/object-builder-ui-kitchen-sink/static/js/components/ObjectSelect.js
// but made to be used only with standard objects

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import ReferenceInputEnumSearch from 'customer-data-reference-ui-components/enum/ReferenceInputEnumSearch';
import { CONTACT, COMPANY, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import partial from 'transmute/partial';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { OBJECT_TYPE_TO_REFERENCE_TYPE } from './StandardObjectReferenceResolversProvider';
import formatName from 'I18n/utils/formatName'; // Copied from https://git.hubteam.com/HubSpot/CRM/blob/840c50a2bebd0dd02cb9fc80dd6aff5d4071b7f7/crm_ui/static/js/merge/MergeObjectSelect.js

var associationOptionFormatter = function associationOptionFormatter(objectType, option) {
  var primary = option.get('label');
  var secondary;
  var text;
  var object = option.referencedObject; // Attempting to match logic with ObjectRecord.toStringExtended

  switch (objectType) {
    case CONTACT:
      primary = formatName({
        firstName: getProperty(object, 'firstname'),
        lastName: getProperty(object, 'lastname')
      });
      secondary = getProperty(object, 'email');
      break;

    case COMPANY:
      secondary = getProperty(object, 'domain');
      break;

    case TICKET:
      secondary = getProperty(object, 'content');
      break;

    default:
      break;
  }

  if (primary && secondary) {
    text = primary + " (" + secondary + ")";
  } else if (primary) {
    text = "" + primary;
  } else if (secondary) {
    text = "" + secondary;
  } else {
    text = '-';
  }

  if (objectType === CONTACT) {
    return {
      text: text,
      value: option.get('id'),
      help: option.get('description')
    };
  }

  return {
    text: text,
    value: option.get('id')
  };
};

var DraftAssociationObjectSelect = function DraftAssociationObjectSelect(_ref) {
  var objectType = _ref.objectType,
      value = _ref.value,
      onChange = _ref.onChange,
      resolver = _ref.resolver,
      props = _objectWithoutProperties(_ref, ["objectType", "value", "onChange", "resolver"]);

  return /*#__PURE__*/_jsx(ReferenceInputEnumSearch, Object.assign({
    onChange: onChange,
    resolver: resolver,
    value: value,
    optionFormatter: partial(associationOptionFormatter, objectType),
    filterOptions: false,
    "data-selenium-test": "object-association-panel-select"
  }, props));
};

DraftAssociationObjectSelect.propTypes = {
  objectType: ObjectTypesType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]), PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]))]),
  resolver: PropTypes.object.isRequired
};
export var mapResolversToProps = function mapResolversToProps(resolvers, _ref2) {
  var objectType = _ref2.objectType;
  var referenceObjectType = OBJECT_TYPE_TO_REFERENCE_TYPE[objectType];
  return {
    resolver: resolvers[referenceObjectType]
  };
};
export default ConnectReferenceResolvers(mapResolversToProps, DraftAssociationObjectSelect);