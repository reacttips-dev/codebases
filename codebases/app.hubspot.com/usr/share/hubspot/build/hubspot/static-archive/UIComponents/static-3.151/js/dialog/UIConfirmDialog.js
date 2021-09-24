'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import H2 from '../elements/headings/H2';
import H4 from '../elements/headings/H4';
import UIButton from '../button/UIButton';
import UIForm from '../form/UIForm';
import UIFormControl from '../form/UIFormControl';
import UIModalDialog from './UIModalDialog';
import UIDialogBody from './UIDialogBody';
import UIDialogFooter from './UIDialogFooter';
import UIDialogHeader from './UIDialogHeader';
import UIMatchTextArea from '../input/UIMatchTextArea';
import PromptablePropInterface from '../decorators/PromptablePropInterface';
import lazyEval from '../utils/lazyEval';
import omit from '../utils/underscore/omit';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
var CONFIRM = 'confirm';
var REJECT = 'reject';

var canSubmit = function canSubmit(confirmButtonProps, disableConfirm, match, isMatched) {
  if (confirmButtonProps && confirmButtonProps.disabled) return false;
  if (typeof disableConfirm === 'boolean') return !disableConfirm;
  if (match) return isMatched;
  return true;
};

var UIConfirmDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIConfirmDialog, _PureComponent);

  function UIConfirmDialog() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIConfirmDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIConfirmDialog)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      isMatched: false
    };

    _this.handleMatchedChange = function (_ref) {
      var value = _ref.target.value;

      _this.setState({
        isMatched: value
      });
    };

    _this.handleConfirm = function () {
      _this.props.onConfirm(true);
    };

    _this.handleConfirmClick = function (evt) {
      evt.stopPropagation(); // Prevent click event from bubbling to window
      // Submit event triggers `this.handleConfirm`, we don't need to invoke it manually.
    };

    _this.handleReject = function () {
      _this.props.onReject(false);
    };

    _this.handleRejectClick = function (evt) {
      evt.stopPropagation();

      _this.handleReject();
    };

    _this.handleSubmit = function (evt) {
      evt.preventDefault();

      if (canSubmit(_this.props.confirmButtonProps, _this.props.disableConfirm, _this.props.match, _this.state.isMatched)) {
        _this.handleConfirm();
      }
    };

    return _this;
  }

  _createClass(UIConfirmDialog, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          ConfirmButton = _this$props.ConfirmButton,
          confirmButtonProps = _this$props.confirmButtonProps,
          confirmLabel = _this$props.confirmLabel,
          confirmUse = _this$props.confirmUse,
          defaultAction = _this$props.defaultAction,
          description = _this$props.description,
          disableConfirm = _this$props.disableConfirm,
          match = _this$props.match,
          matcherLabel = _this$props.matcherLabel,
          message = _this$props.message,
          __onConfirm = _this$props.onConfirm,
          __onReject = _this$props.onReject,
          RejectButton = _this$props.RejectButton,
          rejectButtonProps = _this$props.rejectButtonProps,
          rejectLabel = _this$props.rejectLabel,
          rejectUse = _this$props.rejectUse,
          use = _this$props.use,
          rest = _objectWithoutProperties(_this$props, ["ConfirmButton", "confirmButtonProps", "confirmLabel", "confirmUse", "defaultAction", "description", "disableConfirm", "match", "matcherLabel", "message", "onConfirm", "onReject", "RejectButton", "rejectButtonProps", "rejectLabel", "rejectUse", "use"]);

      var isMatched = this.state.isMatched;
      return /*#__PURE__*/_jsx(UIModalDialog, Object.assign({}, rest, {
        use: use,
        onEsc: this.handleReject,
        children: /*#__PURE__*/_jsxs(UIForm, {
          onSubmit: this.handleSubmit,
          children: [message && use !== 'default' ? /*#__PURE__*/_jsx(UIDialogHeader, {
            children: /*#__PURE__*/_jsx(H2, {
              children: message
            })
          }) : null, /*#__PURE__*/_jsxs(UIDialogBody, {
            children: [use === 'default' ? /*#__PURE__*/_jsx(H4, {
              children: message
            }) : null, typeof description === 'string' ? /*#__PURE__*/_jsx("p", {
              children: description
            }) : description, match ? /*#__PURE__*/_jsx("div", {
              className: "private-modal__matcher-outer",
              children: /*#__PURE__*/_jsx(UIFormControl, {
                label: matcherLabel,
                children: /*#__PURE__*/_jsx(UIMatchTextArea, {
                  match: match,
                  onMatchedChange: this.handleMatchedChange,
                  size: "xxl"
                })
              })
            }) : null]
          }), /*#__PURE__*/_jsxs(UIDialogFooter, {
            children: [/*#__PURE__*/_jsx(ConfirmButton, Object.assign({
              type: "submit",
              autoFocus: defaultAction === CONFIRM && !match,
              "data-confirm-button": "accept",
              disabled: !canSubmit(confirmButtonProps, disableConfirm, match, isMatched),
              use: confirmUse,
              onClick: this.handleConfirmClick
            }, confirmButtonProps, {
              children: lazyEval(confirmLabel)
            })), /*#__PURE__*/_jsx(RejectButton, Object.assign({
              autoFocus: defaultAction === REJECT && !match,
              "data-confirm-button": "reject",
              onClick: this.handleRejectClick,
              use: rejectUse
            }, rejectButtonProps, {
              children: lazyEval(rejectLabel)
            }))]
          })]
        })
      }));
    }
  }]);

  return UIConfirmDialog;
}(PureComponent);

UIConfirmDialog.propTypes = Object.assign({}, omit(UIModalDialog.propTypes, 'onEsc'), {
  ConfirmButton: PropTypes.elementType,
  confirmButtonProps: PropTypes.object,
  confirmLabel: createLazyPropType(PropTypes.node).isRequired,
  confirmUse: UIButton.propTypes.use,
  defaultAction: PropTypes.oneOf([CONFIRM, REJECT]),
  description: PropTypes.node,
  disableConfirm: PropTypes.bool,
  match: PropTypes.string,
  matcherLabel: PropTypes.node,
  message: PropTypes.node.isRequired,
  onConfirm: PromptablePropInterface.onConfirm,
  onReject: PromptablePropInterface.onReject,
  RejectButton: PropTypes.elementType,
  rejectButtonProps: PropTypes.object,
  rejectLabel: createLazyPropType(PropTypes.node).isRequired,
  rejectUse: UIButton.propTypes.use
});
UIConfirmDialog.defaultProps = Object.assign({}, UIModalDialog.defaultProps, {
  ConfirmButton: UIButton,
  confirmLabel: function confirmLabel() {
    return I18n.text('salesUI.UIConfirm.defaultConfirm');
  },
  confirmUse: 'primary',
  defaultAction: REJECT,
  RejectButton: UIButton,
  rejectLabel: function rejectLabel() {
    return I18n.text('salesUI.UIConfirm.defaultReject');
  },
  rejectUse: 'tertiary-light',
  role: 'alertdialog'
});
UIConfirmDialog.displayName = 'UIConfirmDialog';
export default UIConfirmDialog;