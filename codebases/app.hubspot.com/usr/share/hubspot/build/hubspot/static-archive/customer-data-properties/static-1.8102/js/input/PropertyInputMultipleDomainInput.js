'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIList from 'UIComponents/list/UIList';
import UITag from 'UIComponents/tag/UITag';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import PropertyInputDomain from 'customer-data-properties/input/PropertyInputDomain';
var propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  isPrimaryDomain: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  promoteToPrimary: PropTypes.func,
  'data-selenium-test': PropTypes.string
};

var PropertyInputMultipleDomainInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputMultipleDomainInput, _PureComponent);

  function PropertyInputMultipleDomainInput(props) {
    var _this;

    _classCallCheck(this, PropertyInputMultipleDomainInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputMultipleDomainInput).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    _this.state = {
      isInputFocused: false,
      initialValue: props.value,
      duplicateValue: false
    };
    return _this;
  }

  _createClass(PropertyInputMultipleDomainInput, [{
    key: "renderBadge",
    value: function renderBadge() {
      return /*#__PURE__*/_jsx(UITag, {
        className: "m-left-5",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInputMultipleDomain.primaryDomainTag"
        })
      });
    }
  }, {
    key: "renderDropdownContent",
    value: function renderDropdownContent() {
      var _this$props = this.props,
          value = _this$props.value,
          readOnly = _this$props.readOnly,
          disabled = _this$props.disabled,
          onDelete = _this$props.onDelete,
          promoteToPrimary = _this$props.promoteToPrimary;

      if (readOnly || disabled) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIDropdown, {
        buttonUse: "transparent",
        buttonText: "Actions",
        children: /*#__PURE__*/_jsxs(UIList, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "transparent",
            size: "extra-small",
            onClick: this.partial(promoteToPrimary, value),
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "customerDataProperties.PropertyInputMultipleDomain.makePrimary"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "transparent",
            size: "extra-small",
            onClick: this.partial(onDelete, value),
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "customerDataProperties.PropertyInputMultipleDomain.delete"
            })
          })]
        })
      });
    }
  }, {
    key: "renderDropdown",
    value: function renderDropdown() {
      var isInputFocused = this.state.isInputFocused;

      if (isInputFocused) {
        return null;
      }

      return this.renderDropdownContent();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          readOnly = _this$props2.readOnly,
          isPrimaryDomain = _this$props2.isPrimaryDomain,
          __onDelete = _this$props2.onDelete,
          __promoteToPrimary = _this$props2.promoteToPrimary,
          props = _objectWithoutProperties(_this$props2, ["readOnly", "isPrimaryDomain", "onDelete", "promoteToPrimary"]);

      var classes = 'p-left-0' + (isPrimaryDomain ? " p-top-2" : "");

      var control = /*#__PURE__*/_jsx(PropertyInputDomain, Object.assign({
        className: "p-x-2",
        readOnly: readOnly
      }, props));

      return /*#__PURE__*/_jsxs(UIGrid, {
        children: [/*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 8
          },
          children: readOnly ? /*#__PURE__*/_jsx("div", {
            className: "m-top-3 m-bottom-1",
            children: control
          }) : control
        }), /*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 4
          },
          className: classes,
          children: isPrimaryDomain ? this.renderBadge() : this.renderDropdown()
        })]
      });
    }
  }]);

  return PropertyInputMultipleDomainInput;
}(PureComponent);

export { PropertyInputMultipleDomainInput as default };
PropertyInputMultipleDomainInput.propTypes = propTypes;