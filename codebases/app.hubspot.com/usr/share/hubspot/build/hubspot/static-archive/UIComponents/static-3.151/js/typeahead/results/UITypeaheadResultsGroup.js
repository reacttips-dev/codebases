'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import { uniqueId } from '../../utils/underscore';
import UIIcon from '../../icon/UIIcon';
import { OptionGroupType } from '../../types/OptionTypes';

var UITypeaheadResultsGroup = /*#__PURE__*/function (_Component) {
  _inherits(UITypeaheadResultsGroup, _Component);

  function UITypeaheadResultsGroup() {
    _classCallCheck(this, UITypeaheadResultsGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITypeaheadResultsGroup).apply(this, arguments));
  }

  _createClass(UITypeaheadResultsGroup, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          group = _this$props.group;
      this._id = this._id || uniqueId('typeahead-results-group-');
      var computedClassName = classNames("small-caps truncate-text private-typeahead-results-group__label", group.dropdownClassName);
      var computedLabel = group.text || String(group.value);
      return /*#__PURE__*/_jsxs("li", {
        className: "private-typeahead-results-group",
        role: "presentation",
        children: [/*#__PURE__*/_jsxs("div", {
          "aria-hidden": true,
          className: computedClassName,
          id: this._id,
          title: group.title || computedLabel,
          children: [group.icon ? /*#__PURE__*/_jsx(UIIcon, {
            name: group.icon
          }) : null, " ", computedLabel]
        }), /*#__PURE__*/_jsx("ul", {
          "aria-labelledby": this._id,
          className: "private-typeahead-results-group__list list-unstyled",
          role: "listbox",
          children: children
        })]
      });
    }
  }]);

  return UITypeaheadResultsGroup;
}(Component);

export { UITypeaheadResultsGroup as default };
UITypeaheadResultsGroup.propTypes = {
  children: PropTypes.node,
  group: OptionGroupType.isRequired
};
UITypeaheadResultsGroup.displayName = 'UITypeaheadResultsGroup';