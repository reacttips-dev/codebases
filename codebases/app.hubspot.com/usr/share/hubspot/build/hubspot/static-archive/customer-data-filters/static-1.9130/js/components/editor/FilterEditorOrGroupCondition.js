'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FilterEditorOrGroupHeader from './FilterEditorOrGroupHeader';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';

var FilterEditorOrGroupCondition = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorOrGroupCondition, _PureComponent);

  function FilterEditorOrGroupCondition() {
    _classCallCheck(this, FilterEditorOrGroupCondition);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOrGroupCondition).apply(this, arguments));
  }

  _createClass(FilterEditorOrGroupCondition, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          conditionStyle = _this$props.conditionStyle,
          handleClone = _this$props.handleClone,
          handleRemove = _this$props.handleRemove,
          isReadOnly = _this$props.isReadOnly,
          isTitleVisible = _this$props.isTitleVisible,
          renderAndGroupConditions = _this$props.renderAndGroupConditions;
      return /*#__PURE__*/_jsxs("div", {
        "data-selenium-test": "FilterEditorOperator-orGroup",
        children: [/*#__PURE__*/_jsx(FilterEditorOrGroupHeader, {
          handleClone: handleClone,
          handleRemove: handleRemove,
          isReadOnly: isReadOnly,
          isTitleVisible: isTitleVisible
        }), /*#__PURE__*/_jsx(UITile, {
          closeable: false,
          compact: true,
          style: conditionStyle,
          children: /*#__PURE__*/_jsx(UITileSection, {
            className: "p-all-2",
            children: renderAndGroupConditions()
          })
        })]
      });
    }
  }]);

  return FilterEditorOrGroupCondition;
}(PureComponent);

export { FilterEditorOrGroupCondition as default };
FilterEditorOrGroupCondition.propTypes = {
  conditionStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string
  }),
  handleClone: PropTypes.func,
  handleRemove: PropTypes.func,
  isReadOnly: PropTypes.bool,
  isTitleVisible: PropTypes.bool,
  renderAndGroupConditions: PropTypes.func
};