'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { connect } from 'general-store';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import { isVisibleGridProperty } from 'crm_data/properties/GridProperties';
import { normalizeTypeId } from '../utils/normalizeTypeId';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import CustomPropertyHelper from '../crm_ui/utils/CustomPropertyHelper';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Options, { getOptionLabelOverride } from '../utils/Options';
import propertyGroupsDep from '../properties/deps/propertyGroupsDep';
import PropertyListEditor from 'crm_components/dialog/propertyListEditor/PropertyListEditor';
import { COLUMN_SETTINGS } from 'customer-data-objects/property/PropertyListTypes';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import PropTypes from 'prop-types';
import get from 'transmute/get';
import { Component } from 'react';
import ScopesContainer from '../containers/ScopesContainer';
import Small from 'UIComponents/elements/Small';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import set from 'transmute/set';
import toJS from 'transmute/toJS';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { getAssociationOptionsByObjectType } from '../rewrite/associations/utils/getAssociationOptionsByObjectType';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import withGateOverride from 'crm_data/gates/withGateOverride';
import CrmObjectTypeStore from 'crm_data/crmObjectTypes/CrmObjectTypeStore';
import AssociationDefinitionStore from '../associations/stores/AssociationDefinitionStore';
import { isAssociationColumn, parseAssociationIdFromColumnName } from '../rewrite/associations/utils/associationIdUtils';
import { getAssociationColumnLabel } from '../rewrite/associations/utils/getAssociationColumnLabel';
import { AssociationDefinitionType } from '../associations/propTypes/AssociationDefinitionType';
import memoizeOne from 'react-utils/memoizeOne';
import { encodeSettingsValue } from '../rewrite/userSettings/utils/encodeSettingsValue';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { isSettingsValueTooLong } from '../rewrite/userSettings/utils/isSettingsValueTooLong';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { ASSOCIATED_COMPANY_ID_PROPERTY } from '../rewrite/associations/constants/AssociationTypeIds'; // HACK: This is only intended to support the first milestone of flexible
// associations, we're moving to a new edit columns modal that will provide
// more robust support.

var createAssociationsGroup = function createAssociationsGroup(objectType, associationDefinitions, isUngatedForFlexibleAssociations) {
  return {
    text: I18n.text('index.associations.columnGroupTitle'),
    value: 'hs_associations_column_group',
    options: getAssociationOptionsByObjectType(normalizeTypeId(objectType), associationDefinitions, isUngatedForFlexibleAssociations)
  };
};

var isAssociatedCompanyIdProperty = function isAssociatedCompanyIdProperty(objectType, property) {
  return objectType === CONTACT && get('name', property) === ASSOCIATED_COMPANY_ID_PROPERTY;
};

var getPropertyGroupsAsOptions = memoizeOne(function (propertyGroups, scopes, objectType, associationDefinitions, isUngatedForFlexibleAssociations, isUngatedForNewAssociations) {
  var propertyGroupsWithFilteredProperties = propertyGroups.map(function (propertyGroup) {
    var visibleProperties = propertyGroup.properties.filter(function (property) {
      // HACK: Primary company is a regular property for contacts so we have to
      // manually remove it here. It's added back into the properties list with
      // the rest of the associations in getAssociationOptionsByObjectType
      // so it will only appear once.
      if (isUngatedForNewAssociations && isAssociatedCompanyIdProperty(objectType, property)) {
        return false;
      }

      return isVisibleGridProperty(scopes, property);
    });
    return set('properties', visibleProperties, propertyGroup);
  });
  var propertyGroupOptions = toJS(Options.fromPropertyGroups(propertyGroupsWithFilteredProperties));

  if (isUngatedForNewAssociations) {
    var associationsGroup = createAssociationsGroup(objectType, associationDefinitions, isUngatedForFlexibleAssociations);

    if (associationsGroup.options.length > 0) {
      return [associationsGroup].concat(_toConsumableArray(propertyGroupOptions));
    }
  }

  return propertyGroupOptions;
});

var getSelectedColumns = function getSelectedColumns(columns, properties, objectType, associationDefinitions, isUngatedForFlexibleAssociations) {
  return columns.map(function (column) {
    var columnName = column.get('name');

    if (isAssociationColumn(column)) {
      var associationId = parseAssociationIdFromColumnName(columnName);
      var associationDefinition = get(associationId, associationDefinitions);
      return {
        text: getAssociationColumnLabel(associationDefinition, isUngatedForFlexibleAssociations),
        value: columnName
      };
    }

    var property = properties.get(columnName); // HACK: Since this property is modified with flexible associations we
    // have to re-label it here.

    if (isUngatedForFlexibleAssociations && isAssociatedCompanyIdProperty(objectType, property)) {
      return {
        text: I18n.text('index.associations.specialProperties.primaryCompany'),
        value: ASSOCIATED_COMPANY_ID_PROPERTY
      };
    }

    var columnAttributes = CustomPropertyHelper.get(objectType, columnName);
    var propertyLabel = property ? getOptionLabelOverride(property) || getPropertyLabel(property) : propertyLabelTranslator(columnName); // if property doesn't exist, it must be a built-in HubSpot-defined default column

    var label = columnAttributes.get('label') || propertyLabel;
    var allColumnAttributes = Object.assign({}, column.toJS(), {}, columnAttributes.toJS());
    return {
      disabled: allColumnAttributes.order === -Infinity,
      readOnly: allColumnAttributes.canDelete === false,
      text: label,
      value: allColumnAttributes.name
    };
  }).filter(function (_ref) {
    var text = _ref.text;
    return !!text;
  }).toArray();
};

export var EditColumnsModal = /*#__PURE__*/function (_Component) {
  _inherits(EditColumnsModal, _Component);

  function EditColumnsModal() {
    var _this;

    _classCallCheck(this, EditColumnsModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditColumnsModal).call(this));

    _this.getObjectType = function () {
      return _this.props.objectTypeDef.name;
    };

    _this.getSelectedColumns = function () {
      var _this$props = _this.props,
          associationDefinitions = _this$props.associationDefinitions,
          columns = _this$props.columns,
          isUngatedForFlexibleAssociations = _this$props.isUngatedForFlexibleAssociations,
          properties = _this$props.properties;

      var objectType = _this.getObjectType();

      return _this.state.selectedColumns || getSelectedColumns(columns, properties, objectType, associationDefinitions, isUngatedForFlexibleAssociations);
    };

    _this.getAreStringifiedColumnsTooLong = function () {
      var isDefaultView = _this.props.isDefaultView;

      var columns = _this.getSelectedColumns().map(function (_ref2) {
        var value = _ref2.value;
        return value;
      });

      return isDefaultView && isSettingsValueTooLong(encodeSettingsValue(columns));
    };

    _this.handleUpdateSelectedColumns = function (newSelectedColumns) {
      _this.setState({
        selectedColumns: newSelectedColumns
      });
    };

    _this.handleRemoveAllSelectedColumns = function () {
      var oldSelectedColumns = _this.getSelectedColumns();

      var newSelectedColumns = oldSelectedColumns.filter(function (_ref3) {
        var readOnly = _ref3.readOnly,
            disabled = _ref3.disabled;
        return readOnly || disabled;
      });

      _this.setState({
        selectedColumns: newSelectedColumns
      });
    };

    _this.handleApplySelectedColumns = function () {
      var _this$props2 = _this.props,
          onClose = _this$props2.onClose,
          onUpdateColumns = _this$props2.onUpdateColumns,
          objectTypeDef = _this$props2.objectTypeDef;
      var selectedColumns = _this.state.selectedColumns;
      var objectTypeId = objectTypeDef.objectTypeId,
          objectTypeName = objectTypeDef.name;

      if (selectedColumns) {
        var selectedColumnIds = selectedColumns.map(function (selectedColumn) {
          return selectedColumn.value;
        });
        onUpdateColumns(selectedColumnIds);
        CrmLogger.log('editColumns', {
          subscreen2: 'edit-columns-modal',
          objectTypeId: objectTypeId,
          objectTypeName: objectTypeName
        });
      }

      onClose();
    };

    _this.state = {
      selectedColumns: null
    };
    return _this;
  }

  _createClass(EditColumnsModal, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          associationDefinitions = _this$props3.associationDefinitions,
          columns = _this$props3.columns,
          isUngatedForFlexibleAssociations = _this$props3.isUngatedForFlexibleAssociations,
          isUngatedForNewAssociations = _this$props3.isUngatedForNewAssociations,
          properties = _this$props3.properties,
          propertyGroups = _this$props3.propertyGroups,
          onClose = _this$props3.onClose;
      var objectType = this.getObjectType();

      if (!properties || !propertyGroups || !columns) {
        return null;
      }

      var isColumnsValueTooLong = this.getAreStringifiedColumnsTooLong();
      var selectedColumns = this.getSelectedColumns();
      var scopes = ScopesContainer.get();
      var isCreateDisabled = scopes['crm-secondary-permissions'] && !scopes['crm-property-settings'];
      var propertyCategories = getPropertyGroupsAsOptions(propertyGroups, scopes, objectType, associationDefinitions, isUngatedForFlexibleAssociations, isUngatedForNewAssociations);
      return /*#__PURE__*/_jsxs(UIModal, {
        width: 1000,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.editColumnsModal.title"
            })
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(PropertyListEditor, {
            propertyCategories: propertyCategories,
            type: objectType,
            use: COLUMN_SETTINGS,
            value: selectedColumns,
            isCreateDisabled: isCreateDisabled,
            onChange: this.handleUpdateSelectedColumns,
            onRequiredChange: this.handleUpdateSelectedColumns
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UITooltip, {
            disabled: !isColumnsValueTooLong,
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "table.editColumns.valueTooLong"
            }),
            children: /*#__PURE__*/_jsx(UIButton, {
              disabled: isColumnsValueTooLong,
              "data-selenium-test": "edit-columns-apply-btn",
              use: "primary",
              onClick: this.handleApplySelectedColumns,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "indexPage.editColumnsModal.actions.apply"
              })
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "edit-columns-cancel-btn",
            onClick: onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.editColumnsModal.actions.cancel"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: this.handleRemoveAllSelectedColumns,
            use: "link",
            children: /*#__PURE__*/_jsx(Small, {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "indexPage.editColumnsModal.actions.removeAllColumns"
              })
            })
          })]
        })]
      });
    }
  }]);

  return EditColumnsModal;
}(Component);
EditColumnsModal.propTypes = {
  associationDefinitions: PropTypes.objectOf(AssociationDefinitionType),
  columns: ImmutablePropTypes.list.isRequired,
  isUngatedForFlexibleAssociations: PropTypes.bool.isRequired,
  isUngatedForNewAssociations: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  objectType: AnyCrmObjectTypePropType.isRequired,
  objectTypeDef: PropTypes.shape({
    objectTypeId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  isDefaultView: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateColumns: PropTypes.func.isRequired,
  properties: ImmutablePropTypes.mapOf(PropertyType).isRequired,
  propertyGroups: ImmutablePropTypes.orderedMap.isRequired
};
export var dependencies = {
  associationDefinitions: {
    stores: [AssociationDefinitionStore, CrmObjectTypeStore],
    deref: function deref(_ref4) {
      var objectType = _ref4.objectType;
      var objectTypeDefinitions = CrmObjectTypeStore.get();
      var objectTypeId = normalizeTypeId(objectType);
      var associationDefinitions = AssociationDefinitionStore.get(objectTypeId);
      return Object.keys(associationDefinitions).reduce(function (acc, associationId) {
        var associationDefinition = associationDefinitions[associationId];
        acc[associationId] = Object.assign({}, associationDefinition, {
          fromObjectTypeDefinition: get(associationDefinition.fromObjectTypeId, objectTypeDefinitions),
          toObjectTypeDefinition: get(associationDefinition.toObjectTypeId, objectTypeDefinitions)
        });
        return acc;
      }, {});
    }
  },
  isUngatedForFlexibleAssociations: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return withGateOverride('flexible-associations', IsUngatedStore.get('flexible-associations'));
    }
  },
  isUngatedForNewAssociations: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return withGateOverride('CRM:Datasets:NewAssociations', IsUngatedStore.get('CRM:Datasets:NewAssociations'));
    }
  },
  propertyGroups: propertyGroupsDep,
  properties: {
    stores: [PropertiesStore],
    deref: function deref(_ref5) {
      var objectType = _ref5.objectType;
      return PropertiesStore.get(objectType);
    }
  }
};
export default connect(dependencies)(EditColumnsModal);