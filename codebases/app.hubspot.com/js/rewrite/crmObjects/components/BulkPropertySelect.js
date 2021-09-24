'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import { usePropertyGroupsWithProperties } from '../../propertyGroups/hooks/usePropertyGroupsWithProperties';
import { isReadOnly } from 'customer-data-objects/property/PropertyIdentifier';
import { DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getPropertyLabel } from '../../properties/utils/getPropertyLabel';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import UIFormControl from 'UIComponents/form/UIFormControl';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { BULK_EDIT_BLOCKLIST } from '../constants/BulkEditBlocklist';
import { getGroupLabel } from '../../propertyGroups/utils/getGroupLabel';
import { useGetPropertyPermission } from '../../fieldLevelPermissions/hooks/useGetPropertyPermission';
import { NOT_SPECIFIED } from '../../fieldLevelPermissions/constants/FieldLevelPermissionTypes';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var PropertyItem = function PropertyItem(_ref) {
  var children = _ref.children,
      option = _ref.option,
      rest = _objectWithoutProperties(_ref, ["children", "option"]);

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UITooltip, {
      placement: "left",
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.bulkActions.permissions.fieldLevelPermissions.edit"
      }),
      disabled: !option.disabled,
      children: children
    })
  }));
}; // Most of this logic is adapted from BulkEditDialog
// See https://git.hubteam.com/HubSpot/CRM/blob/ec4ea0a40eb00159e06edc1c2c13c66995f56ba7/crm_ui/static/js/dialog/grid/BulkEditDialog.js


var BulkPropertySelect = function BulkPropertySelect(_ref2) {
  var value = _ref2.value,
      onPropertyNameChange = _ref2.onPropertyNameChange;
  var objectTypeId = useSelectedObjectTypeId();
  var groupedProperties = usePropertyGroupsWithProperties();
  var getPropertyPermission = useGetPropertyPermission();
  var hasAllScopes = useHasAllScopes();
  var handleChange = useCallback(function (_ref3) {
    var newValue = _ref3.target.value;
    return onPropertyNameChange(newValue);
  }, [onPropertyNameChange]);
  var shouldRestrictDealstageForBET = hasAllScopes('bet-restrict-deal-stage-bulk-edit') && objectTypeId === DEAL_TYPE_ID;
  var getIsValidProperty = useCallback(function (property) {
    var blocklist = BULK_EDIT_BLOCKLIST[objectTypeId] || [];
    return property && !property.hidden && !isReadOnly(property) && !blocklist.includes(property.get('name')) && !(shouldRestrictDealstageForBET && property.name === 'dealstage');
  }, [objectTypeId, shouldRestrictDealstageForBET]);
  var groupOptions = useMemo(function () {
    return groupedProperties.map(function (group) {
      return {
        text: getGroupLabel(group),
        options: group.properties.filter(getIsValidProperty).map(function (property) {
          return {
            text: getPropertyLabel(property),
            value: property.name,
            disabled: getPropertyPermission(property.name) !== NOT_SPECIFIED
          };
        }).toArray()
      };
    }).filter(function (_ref4) {
      var options = _ref4.options;
      return options.length > 0;
    }).toArray();
  }, [getIsValidProperty, getPropertyPermission, groupedProperties]);
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.bulkActions.modals.edit.body.propertySelectLabel"
    }),
    children: /*#__PURE__*/_jsx(UISelect, {
      id: "bulk-edit-property-select",
      searchable: true,
      options: groupOptions,
      placeholder: I18n.text('index.bulkActions.modals.edit.body.propertySelectPlaceholder'),
      itemComponent: PropertyItem,
      value: value,
      onChange: handleChange
    })
  });
};

BulkPropertySelect.propTypes = {
  value: PropTypes.string.isRequired,
  onPropertyNameChange: PropTypes.func.isRequired
};
export default BulkPropertySelect;