'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import classNames from 'classnames';

var FilterEditorOperatorCreateButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorOperatorCreateButton, _PureComponent);

  function FilterEditorOperatorCreateButton(props) {
    var _this;

    _classCallCheck(this, FilterEditorOperatorCreateButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperatorCreateButton).call(this, props));
    _this.renderTooltipContent = _this.renderTooltipContent.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FilterEditorOperatorCreateButton, [{
    key: "renderTooltipContent",
    value: function renderTooltipContent() {
      var addConditionDisabledTooltip = this.props.addConditionDisabledTooltip;
      return /*#__PURE__*/_jsx(UITooltipContent, {
        children: addConditionDisabledTooltip
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          addConditionDisabledTooltip = _this$props.addConditionDisabledTooltip,
          className = _this$props.className,
          disabled = _this$props.disabled,
          filterFamilyAndButtonTooltip = _this$props.filterFamilyAndButtonTooltip,
          isXoEnabled = _this$props.isXoEnabled,
          type = _this$props.type,
          rest = _objectWithoutProperties(_this$props, ["addConditionDisabledTooltip", "className", "disabled", "filterFamilyAndButtonTooltip", "isXoEnabled", "type"]);

      if (!isXoEnabled) {
        return /*#__PURE__*/_jsxs(UIButton, Object.assign({
          block: true,
          className: classNames(className, 'p-bottom-3'),
          "data-onboarding": "filter-editor-create-button",
          "data-selenium-test": "FilterEditorOperatorCreateButton-filters2",
          disabled: disabled,
          use: "link"
        }, rest, {
          children: [/*#__PURE__*/_jsx(UIIcon, {
            name: "add"
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterEditor.add"
          }, "text")]
        }));
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UITooltip, {
          Content: this.renderTooltipContent,
          disabled: !disabled || !addConditionDisabledTooltip,
          placement: "right",
          children: /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest, {
            block: !isXoEnabled,
            className: className,
            "data-selenium-test": "FilterEditorOperatorCreateButton-xofilters",
            disabled: disabled,
            size: "extra-small",
            use: "tertiary-light",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterEditorOperatorDisplayList." + type
            })
          }))
        }), filterFamilyAndButtonTooltip && !disabled && /*#__PURE__*/_jsx(UIHelpIcon, {
          className: "display-flex-inline p-x-2",
          title: filterFamilyAndButtonTooltip,
          tooltipPlacement: "right"
        })]
      });
    }
  }]);

  return FilterEditorOperatorCreateButton;
}(PureComponent);

FilterEditorOperatorCreateButton.propTypes = {
  addConditionDisabledTooltip: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  filterFamilyAndButtonTooltip: PropTypes.node,
  isXoEnabled: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['and', 'or'])
};
export default FilterEditorOperatorCreateButton;