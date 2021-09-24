'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import emptyFunction from 'react-utils/emptyFunction';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import H4 from 'UIComponents/elements/headings/H4';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import PropTypes from 'prop-types';
var defaultProps = {
  onCloseComplete: emptyFunction
};
var i18nKey = 'calling-communicator-ui.activeCallBar.endRecordingModal';

var ConfirmEndRecordingModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(ConfirmEndRecordingModal, _PureComponent);

  function ConfirmEndRecordingModal() {
    _classCallCheck(this, ConfirmEndRecordingModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConfirmEndRecordingModal).apply(this, arguments));
  }

  _createClass(ConfirmEndRecordingModal, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(UIModal, {
        use: "conversational",
        onCloseComplete: this.props.onCloseComplete,
        children: [/*#__PURE__*/_jsx(UIDialogHeader, {
          className: "p-top-3",
          children: /*#__PURE__*/_jsx(H4, {
            style: {
              textAlign: 'left'
            },
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: i18nKey + ".title"
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
              message: i18nKey + ".description"
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            style: {
              width: 'auto'
            },
            use: "primary",
            onClick: this.props.onConfirm,
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: i18nKey + ".confirmButton"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            style: {
              width: 'auto'
            },
            use: "secondary",
            onClick: this.props.onReject,
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: i18nKey + ".rejectButton"
            })
          })]
        })]
      });
    }
  }]);

  return ConfirmEndRecordingModal;
}(PureComponent);

ConfirmEndRecordingModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onCloseComplete: PropTypes.func
};
ConfirmEndRecordingModal.defaultProps = defaultProps;
export default ConfirmEndRecordingModal;