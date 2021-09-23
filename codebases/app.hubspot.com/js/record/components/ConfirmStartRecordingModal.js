'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { PureComponent } from 'react';
import styled from 'styled-components';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import emptyFunction from 'react-utils/emptyFunction';
import H4 from 'UIComponents/elements/headings/H4';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import PropTypes from 'prop-types';
import { GRID_BREAKPOINT_SMALL } from 'HubStyleTokens/sizes';
var StyledHeader = styled(UIDialogHeader).withConfig({
  displayName: "ConfirmStartRecordingModal__StyledHeader",
  componentId: "sc-10emrt5-0"
})(["@media only screen and (max-width:", "){margin-top:16px;}"], GRID_BREAKPOINT_SMALL);
var StyledFooter = styled(UIDialogFooter).withConfig({
  displayName: "ConfirmStartRecordingModal__StyledFooter",
  componentId: "sc-10emrt5-1"
})(["@media only screen and (max-width:", "){margin-top:35px !important;}margin-top:24px;"], GRID_BREAKPOINT_SMALL);
var defaultProps = {
  onCloseComplete: emptyFunction
};
var i18nKey = 'calling-communicator-ui.activeCallBar.startRecordingModal';

var ConfirmStartRecordingModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(ConfirmStartRecordingModal, _PureComponent);

  function ConfirmStartRecordingModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ConfirmStartRecordingModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ConfirmStartRecordingModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
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

  _createClass(ConfirmStartRecordingModal, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIModal, {
        use: "conversational",
        onCloseComplete: this.props.onCloseComplete,
        children: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(StyledHeader, {
            children: /*#__PURE__*/_jsx(H4, {
              style: {
                textAlign: 'left'
              },
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: i18nKey + ".header"
              })
            })
          }), /*#__PURE__*/_jsx(UIDialogBody, {
            className: "p-bottom-0",
            children: /*#__PURE__*/_jsx("div", {
              style: {
                textAlign: 'left',
                marginTop: '8px'
              },
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: i18nKey + ".body"
              })
            })
          }), /*#__PURE__*/_jsxs(StyledFooter, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              style: {
                width: 'auto'
              },
              use: "primary",
              onClick: this.onSubmit,
              "data-selenium-test": "confirm-recording",
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: i18nKey + ".confirm"
              })
            }), /*#__PURE__*/_jsx(UIButton, {
              style: {
                width: 'auto'
              },
              onClick: this.props.onReject,
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: i18nKey + ".cancel"
              })
            })]
          })]
        })
      });
    }
  }]);

  return ConfirmStartRecordingModal;
}(PureComponent);

ConfirmStartRecordingModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onCloseComplete: PropTypes.func
};
ConfirmStartRecordingModal.defaultProps = defaultProps;
export default ConfirmStartRecordingModal;