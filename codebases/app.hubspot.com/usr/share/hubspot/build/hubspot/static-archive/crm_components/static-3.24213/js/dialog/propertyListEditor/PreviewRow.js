'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _TYPE_PRO_PQL_KEY;

import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import partial from 'transmute/partial';
import { COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES } from 'customer-data-objects/property/PropertyListTypes';
import DnDPreviewItem from 'crm_components/dialog/propertyListEditor/DnDPreviewItem';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIColumnWrapper from 'UIComponents/column/UIColumnWrapper';
import UIColumn from 'UIComponents/column/UIColumn';
import UIColumnSpreads from 'UIComponents/column/UIColumnSpreads';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { OptionType } from 'UIComponents/types/OptionTypes';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
var TYPE_PRO_PQL_KEY = (_TYPE_PRO_PQL_KEY = {}, _defineProperty(_TYPE_PRO_PQL_KEY, DEAL, 'SalesProPQL'), _defineProperty(_TYPE_PRO_PQL_KEY, TICKET, 'ServiceProPQL'), _TYPE_PRO_PQL_KEY);
var PreviewRow = createReactClass({
  displayName: 'PreviewRow',
  mixins: [ComponentWithPartials],
  propTypes: {
    disabled: PropTypes.bool,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onReorderOption: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onRequiredChange: PropTypes.func,
    requirable: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    use: PropTypes.oneOf([COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES]).isRequired,
    value: OptionType.isRequired,
    index: PropTypes.number.isRequired
  },
  renderCheckbox: function renderCheckbox() {
    var _this$props = this.props,
        value = _this$props.value,
        type = _this$props.type,
        handleRequiredChange = _this$props.onRequiredChange,
        requirable = _this$props.requirable;
    var pqlKey = TYPE_PRO_PQL_KEY[type] || 'SalesProPQL';
    var tooltip = value.requiredDisabled ? I18n.text("crm_components.PropertyListEditor.disabledReason." + type) : I18n.text("crm_components." + pqlKey + ".requiredFields.tooltip");
    return /*#__PURE__*/_jsx(UIColumn, {
      className: "m-left-4 m-right-10",
      children: /*#__PURE__*/_jsx(UITooltip, {
        disabled: !value.requiredDisabled && requirable,
        title: tooltip,
        children: /*#__PURE__*/_jsx(UICheckbox, {
          checked: value.required,
          className: "m-right-2",
          disabled: value.requiredDisabled || !requirable,
          innerPadding: "none",
          onChange: partial(handleRequiredChange, value)
        })
      })
    });
  },
  renderRow: function renderRow() {
    var checkBoxElement = null;

    if ([CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES].includes(this.props.use)) {
      checkBoxElement = this.renderCheckbox();
    }

    return /*#__PURE__*/_jsxs(UIColumnWrapper, {
      align: "center",
      className: "m-bottom-3",
      children: [/*#__PURE__*/_jsx(UIColumnSpreads, {
        className: "overflow-hidden",
        children: /*#__PURE__*/_jsx(DnDPreviewItem, {
          index: this.props.index,
          onAddOption: this.props.onAddOption,
          onDrop: this.props.onSave,
          onMove: this.props.onReorderOption,
          onRemove: partial(this.props.onRemoveOption, this.props.value),
          onReset: this.props.onReset,
          onInvalidDrop: this.props.onReset,
          option: this.props.value
        })
      }), checkBoxElement]
    }, this.props.value);
  },
  renderLockedRow: function renderLockedRow() {
    var checkBoxElement = null;

    if ([CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES].includes(this.props.use)) {
      checkBoxElement = this.renderCheckbox();
    }

    return /*#__PURE__*/_jsxs(UIColumnWrapper, {
      align: "center",
      className: "m-bottom-3",
      children: [/*#__PURE__*/_jsx(UIColumnSpreads, {
        children: /*#__PURE__*/_jsx(DnDPreviewItem, {
          index: this.props.index,
          option: this.props.value
        })
      }), checkBoxElement]
    }, this.props.value);
  },
  render: function render() {
    if (this.props.disabled) {
      return this.renderLockedRow();
    }

    return this.renderRow();
  }
});
export default PreviewRow;