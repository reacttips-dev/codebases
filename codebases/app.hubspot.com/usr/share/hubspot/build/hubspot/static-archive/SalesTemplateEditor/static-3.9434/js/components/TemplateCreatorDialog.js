'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import TemplateEditorContainer from '../containers/TemplateEditorContainer';
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;
export default createReactClass({
  displayName: "TemplateCreatorDialog",
  propTypes: {
    ErrorMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    open: PropTypes.bool,
    template: PropTypes.object,
    headerText: PropTypes.node.isRequired,
    saveAs: PropTypes.bool.isRequired,
    modalPlugins: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    gates: PropTypes.object,
    scopes: PropTypes.object,
    userProfile: PropTypes.object,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  },
  childContextTypes: {
    userProfile: PropTypes.object,
    scopes: PropTypes.object,
    gates: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      ErrorMarker: function ErrorMarker() {
        return null;
      },
      SuccessMarker: function SuccessMarker() {
        return null;
      },
      modalPlugins: true,
      saveAs: false,
      readOnly: false,
      gates: {}
    };
  },
  getChildContext: function getChildContext() {
    var _this$props = this.props,
        scopes = _this$props.scopes,
        gates = _this$props.gates,
        userProfile = _this$props.userProfile;
    return {
      userProfile: userProfile,
      scopes: scopes,
      gates: gates
    };
  },
  render: function render() {
    var _this = this;

    var _this$props2 = this.props,
        open = _this$props2.open,
        editorProps = _objectWithoutProperties(_this$props2, ["open"]);

    return /*#__PURE__*/_jsxs(UIModal, {
      open: open,
      width: 900,
      style: {
        width: 900
      },
      onEsc: function onEsc() {
        return null;
      },
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: function onClick() {
          return _this.props.onReject();
        }
      }), /*#__PURE__*/_jsx(TemplateEditorContainer, Object.assign({}, editorProps))]
    });
  }
});