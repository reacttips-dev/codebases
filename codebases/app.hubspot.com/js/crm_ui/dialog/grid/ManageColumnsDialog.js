'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropertyListEditorDialog from 'crm_components/dialog/propertyListEditor/PropertyListEditorDialog';
import * as LoadingStatus from 'crm_data/flux/LoadingStatus';
import { isVisibleGridProperty } from 'crm_data/properties/GridProperties';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import ScopesContainer from '../../../containers/ScopesContainer';
import PropertyGroupsDependency from '../../dependencies/PropertyGroupsDependency';
import Options from './Options';
import ViewsStore from '../../flux/views/ViewsStore';
import ColumnUtils from '../../utils/ColumnUtils';
import CustomPropertyHelper from '../../utils/CustomPropertyHelper';
import { COLUMN_SETTINGS } from 'customer-data-objects/property/PropertyListTypes';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import { connect } from 'general-store';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import filter from 'transmute/filter';
import identity from 'transmute/identity';
import map from 'transmute/map';
import partial from 'transmute/partial';
import pipe from 'transmute/pipe';
import toJS from 'transmute/toJS';
import toSeq from 'transmute/toSeq';
import updateIn from 'transmute/updateIn';
import Promptable from 'UIComponents/decorators/Promptable';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
var createColumnFromProperty = ColumnUtils.createColumnFromProperty,
    reorderColumns = ColumnUtils.reorderColumns;

var groupsToOptions = function groupsToOptions(filterFunc) {
  return pipe(toSeq, map(updateIn(['properties'], filter(filterFunc))), Options.fromPropertyGroups, toJS);
};

var dependencies = {
  groups: PropertyGroupsDependency,
  properties: {
    stores: [PropertiesStore],
    deref: function deref(_ref) {
      var objectType = _ref.objectType;
      return PropertiesStore.get(objectType);
    }
  },
  columns: {
    stores: [PropertiesStore, ViewsStore],
    deref: function deref(props) {
      var objectType = props.objectType;
      var viewKey = ViewsStore.getViewKey(props);
      var view = ViewsStore.get(viewKey);
      var properties = PropertiesStore.get(objectType);

      if (LoadingStatus.isLoading(view, properties)) {
        return LoadingStatus.LOADING;
      }

      return view.get('columns').map(function (column) {
        var name = column.get('name');
        var property = properties.get(name);
        var columnAttributes = CustomPropertyHelper.get(objectType, name);
        var propertyLabel = property ? getPropertyLabel(property) : propertyLabelTranslator(name); // if property doesn't exist, it must be a built-in HubSpot-defined default column

        var label = columnAttributes.get('label') ? columnAttributes.get('label') : propertyLabel;
        var parsedColumn = Object.assign({}, column.toJS(), {}, columnAttributes.toJS(), {
          label: label
        });
        return parsedColumn;
      }).toArray();
    }
  }
};
export var ManageColumnsDialog = createReactClass({
  displayName: 'ManageColumnsDialog',
  mixins: [ImmutableRenderMixin],
  propTypes: Object.assign({
    confirmLabel: PropTypes.node,
    confirmOnNoChanges: PropTypes.bool,
    objectType: AnyCrmObjectTypePropType.isRequired
  }, PromptablePropInterface),
  handleConfirm: function handleConfirm(selection) {
    var _this$props = this.props,
        columns = _this$props.columns,
        properties = _this$props.properties;
    var columnMap = columns.reduce(function (acc, col) {
      acc[String(col.name)] = col;
      return acc;
    }, {});
    var updatedColumns = selection.map(function (_ref2) {
      var value = _ref2.value;
      var columnValue = columnMap[value];

      if (columnValue) {
        return columnValue;
      }

      var property = properties.get(value);

      if (property) {
        return createColumnFromProperty(property.toJS());
      }

      return undefined;
    }).filter(identity);
    this.props.onConfirm(reorderColumns(updatedColumns));
  },
  render: function render() {
    var _this$props2 = this.props,
        confirmLabel = _this$props2.confirmLabel,
        confirmOnNoChanges = _this$props2.confirmOnNoChanges,
        objectType = _this$props2.objectType,
        onReject = _this$props2.onReject,
        columns = _this$props2.columns,
        groups = _this$props2.groups;

    if (!columns || !groups) {
      return /*#__PURE__*/_jsx("div", {});
    }

    var scopes = ScopesContainer.get();
    var isCreateDisabled = scopes['crm-secondary-permissions'] && !scopes['crm-property-settings'];
    var selectedColumns = columns.filter(function (_ref3) {
      var label = _ref3.label;
      return !!label;
    }).map(function (_ref4) {
      var canDelete = _ref4.canDelete,
          label = _ref4.label,
          name = _ref4.name,
          order = _ref4.order;
      return {
        disabled: order === -Infinity,
        readOnly: canDelete === false,
        text: label,
        value: name
      };
    });
    var getGroups = groupsToOptions(partial(isVisibleGridProperty, ScopesContainer.get()));
    return /*#__PURE__*/_jsx(PropertyListEditorDialog, {
      confirmLabel: confirmLabel,
      confirmOnNoChanges: confirmOnNoChanges,
      groups: getGroups(groups),
      objectType: objectType,
      onConfirm: this.handleConfirm,
      onReject: onReject,
      properties: selectedColumns,
      title: this.props.title,
      use: COLUMN_SETTINGS,
      isCreateDisabled: isCreateDisabled
    });
  }
});
export default Promptable(connect(dependencies)(ManageColumnsDialog));