'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIBreakString from 'UIComponents/text/UIBreakString';
import { getFilterType, getFilteredExtensions } from '../../selectors/Filter';
import { DrawerTypes } from '../../Constants';
import FileExtensionFilters from '../../enums/FileExtensionFilters';

var FilterHintMessage = /*#__PURE__*/function (_Component) {
  _inherits(FilterHintMessage, _Component);

  function FilterHintMessage() {
    _classCallCheck(this, FilterHintMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterHintMessage).apply(this, arguments));
  }

  _createClass(FilterHintMessage, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          filterType = _this$props.filterType,
          filteredExtensions = _this$props.filteredExtensions,
          drawerType = _this$props.drawerType;
      return /*#__PURE__*/_jsx("div", {
        className: "m-y-2",
        children: /*#__PURE__*/_jsxs(UIBreakString, {
          hyphenate: false,
          children: [/*#__PURE__*/_jsx("span", {
            className: "m-right-1",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "FileManagerLib.filterHint.action." + drawerType
            })
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerLib.filterHint.message." + filterType,
            options: {
              extensions: I18n.formatList(filteredExtensions.toArray()),
              count: filteredExtensions.count()
            }
          })]
        })
      });
    }
  }]);

  return FilterHintMessage;
}(Component);

FilterHintMessage.propTypes = {
  drawerType: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  filteredExtensions: PropTypes.instanceOf(Immutable.Set).isRequired,
  filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)).isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    filterType: getFilterType(state),
    filteredExtensions: getFilteredExtensions(state)
  };
};

export default connect(mapStateToProps)(FilterHintMessage);