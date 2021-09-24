'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { DRAGDROP_TYPE } from 'crm_components/dialog/propertyListEditor/PropertyListEditorConstants';
import { ENTER } from 'UIComponents/constants/KeyCodes';
import { OptionType } from 'UIComponents/types/OptionTypes';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DnDListDragSourceWrapper from 'customer-data-ui-utilities/dnd/DnDListDragSourceWrapper';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UITruncateString from 'UIComponents/text/UITruncateString';
var DnDSearchResultsItem = createReactClass({
  displayName: 'DnDSearchResultsItem',
  propTypes: {
    className: PropTypes.string,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUnselect: PropTypes.func.isRequired,
    property: OptionType.isRequired,
    selected: PropTypes.object,
    truncate: PropTypes.bool,
    disabled: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      selected: undefined
    };
  },
  getClassName: function getClassName() {
    var _this$props = this.props,
        property = _this$props.property,
        selected = _this$props.selected,
        isDragging = _this$props.isDragging,
        className = _this$props.className;
    return classNames('propertyCategoryItem', className, property.readOnly && 'not-allowed', selected != null && "selected", isDragging && "dragging");
  },
  handleSelect: function handleSelect(evt) {
    var _this$props2 = this.props,
        property = _this$props2.property,
        disabled = _this$props2.disabled;
    evt.preventDefault();

    if (disabled || property.readOnly || Math.abs(property.order) === Infinity) {
      return;
    }

    if (this.props.selected) {
      this.props.onUnselect(property);
    } else {
      this.props.onSelect(property);
    }
  },
  handleEnter: function handleEnter(e) {
    if (e.keyCode !== ENTER) {
      return;
    }

    this.handleSelect();
  },
  renderContent: function renderContent() {
    var _this$props3 = this.props,
        property = _this$props3.property,
        selected = _this$props3.selected,
        truncate = _this$props3.truncate;
    var display = truncate ? /*#__PURE__*/_jsx(UITruncateString, {
      children: property.text || property.value
    }) : property.text || property.value;
    return /*#__PURE__*/_jsx("div", {
      className: this.getClassName(),
      onClick: this.handleSelect,
      "data-selenium-test": "DnDSearchResultsItem__" + property.value,
      children: /*#__PURE__*/_jsx(UICheckbox, {
        "aria-label": property.text || property.value,
        checked: selected != null,
        className: "m-right-3",
        disabled: this.props.disabled,
        inline: true,
        onChange: this.handleSelect,
        children: display
      })
    });
  },
  render: function render() {
    if (this.props.selected != null) {
      return this.renderContent();
    }

    return this.props.connectDragSource(this.renderContent());
  }
});
export default DnDListDragSourceWrapper(DRAGDROP_TYPE, function (props) {
  return {
    option: props.property
  };
}, {
  isDragging: function isDragging(item, monitor) {
    return item.option === monitor.getItem().data.option;
  }
})(DnDSearchResultsItem);