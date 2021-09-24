'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import H2 from 'UIComponents/elements/headings/H2';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import styled from 'styled-components';
var StyledModal = styled(UIModal).withConfig({
  displayName: "RemovePropertyModal__StyledModal",
  componentId: "sc-1jrepp7-0"
})(["padding-top:16px;"]);

var RemovePropertyModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(RemovePropertyModal, _PureComponent);

  function RemovePropertyModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RemovePropertyModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RemovePropertyModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      hideModal: false
    };

    _this.onSubmit = function () {
      var hideModal = _this.state.hideModal;

      _this.props.onConfirm({
        hideModal: hideModal
      });
    };

    return _this;
  }

  _createClass(RemovePropertyModal, [{
    key: "render",
    value: function render() {
      var propertyToRemove = this.props.propertyToRemove;
      return /*#__PURE__*/_jsxs(StyledModal, {
        use: "danger",
        children: [/*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "callee-selection.phoneNumbers.confirmRemoveProperty.title"
            })
          })
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "callee-selection.phoneNumbers.confirmRemoveProperty.message",
            options: {
              propertyToRemove: propertyToRemove
            }
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "danger",
            onClick: this.onSubmit,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "callee-selection.phoneNumbers.confirmRemoveProperty.confirmLabel",
              options: {
                propertyToRemove: propertyToRemove
              }
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            onClick: this.props.onReject,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "callee-selection.phoneNumbers.confirmRemoveProperty.cancelLabel"
            })
          })]
        })]
      });
    }
  }]);

  return RemovePropertyModal;
}(PureComponent);

RemovePropertyModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  propertyToRemove: PropTypes.string.isRequired
};
export default RemovePropertyModal;