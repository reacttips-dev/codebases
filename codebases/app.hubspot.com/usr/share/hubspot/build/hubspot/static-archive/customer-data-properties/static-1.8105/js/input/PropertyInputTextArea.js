// if you're updating this please also update PropertyInputExpandableText which is going to replace this soon
// see https://git.hubteam.com/HubSpot/CRM-Issues/issues/4221 for more context
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { createRef, Component } from 'react';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIExpandingTextArea from 'UIComponents/input/UIExpandingTextArea';
import omit from 'transmute/omit';
import { Seq } from 'immutable';
var propTypes = UIExpandingTextArea.propTypes;

var PropertyInputTextArea = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputTextArea, _Component);

  function PropertyInputTextArea() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputTextArea);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputTextArea)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputTextArea, [{
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omit(['baseUrl', 'caretRenderer', 'isInline', 'multiCurrencyCurrencyCode', 'objectType', 'onCancel', 'onInvalidProperty', 'onPipelineChange', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'wrappers', 'onTracking', 'isRequired', 'property'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsx(UIExpandableText, {
        buttonAlign: "left",
        hideButtonCaret: true,
        children: /*#__PURE__*/_jsx(UIExpandingTextArea, Object.assign({}, transferableProps, {
          inputRef: this.props.inputRef || this.inputRef,
          shrink: true
        }))
      });
    }
  }]);

  return PropertyInputTextArea;
}(Component);

export { PropertyInputTextArea as default };
PropertyInputTextArea.propTypes = propTypes;
PropertyInputTextArea.defaultProps = UIExpandingTextArea.defaultProps;