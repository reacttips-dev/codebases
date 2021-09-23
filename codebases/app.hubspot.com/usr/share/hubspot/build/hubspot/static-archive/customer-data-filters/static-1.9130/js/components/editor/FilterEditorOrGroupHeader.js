'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';

var FilterEditorOrGroupHeader = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorOrGroupHeader, _PureComponent);

  function FilterEditorOrGroupHeader() {
    _classCallCheck(this, FilterEditorOrGroupHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOrGroupHeader).apply(this, arguments));
  }

  _createClass(FilterEditorOrGroupHeader, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          handleClone = _this$props.handleClone,
          handleRemove = _this$props.handleRemove,
          isReadOnly = _this$props.isReadOnly,
          isTitleVisible = _this$props.isTitleVisible,
          rest = _objectWithoutProperties(_this$props, ["handleClone", "handleRemove", "isReadOnly", "isTitleVisible"]);

      if (isReadOnly && !isTitleVisible) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIFlex, Object.assign({
        align: "baseline",
        className: "p-top-3 p-bottom-1",
        direction: "row",
        justify: "between"
      }, rest, {
        children: [isTitleVisible && /*#__PURE__*/_jsx("h6", {
          className: "m-all-0 p-all-0",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterEditorOperatorDisplayList.separatorOr"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-grow-1"
        }), !isReadOnly && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(UIButton, {
            onClick: handleClone,
            size: "small",
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterEditorOperatorDisplayList.actionClone"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "delete-filter-group",
            onClick: handleRemove,
            size: "small",
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterEditorOperatorDisplayList.actionDelete"
            })
          })]
        })]
      }));
    }
  }]);

  return FilterEditorOrGroupHeader;
}(PureComponent);

FilterEditorOrGroupHeader.propTypes = {
  handleClone: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  isTitleVisible: PropTypes.bool
};
export default FilterEditorOrGroupHeader;