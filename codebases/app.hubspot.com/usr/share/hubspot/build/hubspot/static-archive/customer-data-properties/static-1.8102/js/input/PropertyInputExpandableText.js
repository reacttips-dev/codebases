'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { createRef, Component } from 'react';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIExpandingTextArea from 'UIComponents/input/UIExpandingTextArea';
import { isTextarea } from 'customer-data-objects/property/PropertyIdentifier';
var propTypes = UIExpandingTextArea.propTypes;

var PropertyInputExpandableText = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputExpandableText, _Component);

  function PropertyInputExpandableText(props) {
    var _this;

    _classCallCheck(this, PropertyInputExpandableText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputExpandableText).call(this, props));
    _this.inputRef = /*#__PURE__*/createRef();
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PropertyInputExpandableText, [{
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      if (!isTextarea(this.props.property)) {
        var value = event.target.value;

        if (event.target.value.includes('\n')) {
          // prevent newlines if not a textarea, for why we're doing this see https://git.hubteam.com/HubSpot/CRM-Issues/issues/4221
          return this.props.onChange(Object.assign({}, event, {
            target: Object.assign({}, event.target, {
              value: value.replace(/\n/g, '')
            })
          }));
        }
      }

      return this.props.onChange(event);
    }
  }, {
    key: "getTransferrableProps",
    value: function getTransferrableProps() {
      var _this$props = this.props,
          __baseUrl = _this$props.baseUrl,
          __caretRenderer = _this$props.caretRenderer,
          __isInline = _this$props.isInline,
          __multiCurrencyCurrencyCode = _this$props.multiCurrencyCurrencyCode,
          __objectType = _this$props.objectType,
          __onCancel = _this$props.onCancel,
          __onInvalidProperty = _this$props.onInvalidProperty,
          __onPipelineChange = _this$props.onPipelineChange,
          __propertyIndex = _this$props.propertyIndex,
          __readOnlySourceData = _this$props.readOnlySourceData,
          __resolver = _this$props.resolver,
          __showError = _this$props.showError,
          __showPlaceholder = _this$props.showPlaceholder,
          __subject = _this$props.subject,
          __subjectId = _this$props.subjectId,
          __secondaryChanges = _this$props.secondaryChanges,
          __onSecondaryChange = _this$props.onSecondaryChange,
          __wrappers = _this$props.wrappers,
          __onTracking = _this$props.onTracking,
          __isRequired = _this$props.isRequired,
          __property = _this$props.property,
          transferrableProps = _objectWithoutProperties(_this$props, ["baseUrl", "caretRenderer", "isInline", "multiCurrencyCurrencyCode", "objectType", "onCancel", "onInvalidProperty", "onPipelineChange", "propertyIndex", "readOnlySourceData", "resolver", "showError", "showPlaceholder", "subject", "subjectId", "secondaryChanges", "onSecondaryChange", "wrappers", "onTracking", "isRequired", "property"]);

      return transferrableProps;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIExpandableText, {
        buttonAlign: "left",
        hideButtonCaret: true,
        children: /*#__PURE__*/_jsx(UIExpandingTextArea, Object.assign({}, this.getTransferrableProps(), {
          inputRef: this.props.inputRef || this.inputRef,
          onChange: this.handleChange,
          shrink: true
        }))
      });
    }
  }]);

  return PropertyInputExpandableText;
}(Component);

export { PropertyInputExpandableText as default };
PropertyInputExpandableText.propTypes = propTypes;
PropertyInputExpandableText.defaultProps = UIExpandingTextArea.defaultProps;