'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import ErrorBoundary from './ErrorBoundary';
import CalleeNumbersSelectContainer from '../containers/CalleeNumbersSelectContainer';

var CalleeSelection = /*#__PURE__*/function (_PureComponent) {
  _inherits(CalleeSelection, _PureComponent);

  function CalleeSelection() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CalleeSelection);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CalleeSelection)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      ContactSearch: null
    };
    return _this;
  }

  _createClass(CalleeSelection, [{
    key: "renderContactCalleeSelection",
    value: function renderContactCalleeSelection() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          objectTypeId = _this$props.objectTypeId,
          toNumberIdentifier = _this$props.toNumberIdentifier,
          selectedFormattedToNumber = _this$props.selectedFormattedToNumber;
      return /*#__PURE__*/_jsx("div", {
        className: "p-x-0 m-bottom-1 m-top-3",
        children: /*#__PURE__*/_jsx(CalleeNumbersSelectContainer, {
          objectTypeId: objectTypeId,
          onChange: onChange,
          toNumberIdentifier: toNumberIdentifier,
          selectedFormattedToNumber: selectedFormattedToNumber
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var objectTypeId = this.props.objectTypeId;
      var bodyContent = null;

      if (!objectTypeId) {
        bodyContent = null;
      } else {
        bodyContent = this.renderContactCalleeSelection();
      }

      return /*#__PURE__*/_jsx(ErrorBoundary, {
        children: bodyContent
      });
    }
  }]);

  return CalleeSelection;
}(PureComponent);

CalleeSelection.propTypes = {
  objectTypeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  toNumberIdentifier: RecordPropType('PhoneNumberIdentifier'),
  selectedFormattedToNumber: PropTypes.string
};
export default CalleeSelection;