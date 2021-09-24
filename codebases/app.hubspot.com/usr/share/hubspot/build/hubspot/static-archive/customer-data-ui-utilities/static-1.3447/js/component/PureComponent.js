'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import * as React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

function makePureComponentClass() {
  if (React.PureComponent) {
    return React.PureComponent;
  }

  return /*#__PURE__*/function (_React$Component) {
    _inherits(PureComponent, _React$Component);

    function PureComponent() {
      _classCallCheck(this, PureComponent);

      return _possibleConstructorReturn(this, _getPrototypeOf(PureComponent).apply(this, arguments));
    }

    _createClass(PureComponent, [{
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }
    }]);

    return PureComponent;
  }(React.Component);
}

export default makePureComponentClass();