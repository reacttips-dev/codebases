'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import StaticListMembershipsModal from './StaticListMembershipsModal';

var StaticListMembershipsContainer = /*#__PURE__*/function (_Component) {
  _inherits(StaticListMembershipsContainer, _Component);

  function StaticListMembershipsContainer() {
    var _this;

    _classCallCheck(this, StaticListMembershipsContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StaticListMembershipsContainer).call(this));

    _this.handleSelectedListChange = function (listId) {
      _this.setState({
        selectedListId: listId
      });
    };

    _this.state = {
      selectedListId: null
    };
    return _this;
  }

  _createClass(StaticListMembershipsContainer, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(StaticListMembershipsModal, Object.assign({}, this.props, {
        selectedListId: this.state.selectedListId,
        onSelectedListChange: this.handleSelectedListChange
      }));
    }
  }]);

  return StaticListMembershipsContainer;
}(Component);

export default StaticListMembershipsContainer;