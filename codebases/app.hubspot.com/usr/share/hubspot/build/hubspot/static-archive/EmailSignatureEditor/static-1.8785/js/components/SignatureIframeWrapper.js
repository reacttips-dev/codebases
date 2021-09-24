'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import emptyFunction from 'react-utils/emptyFunction';
import UIIcon from 'UIComponents/icon/UIIcon';
import SignatureIframe from './SignatureIframe';
var SignatureIframeWrapper = createReactClass({
  displayName: "SignatureIframeWrapper",
  propTypes: {
    signature: PropTypes.string.isRequired,
    allowEditing: PropTypes.bool,
    onClick: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      allowEditing: false,
      onClick: emptyFunction
    };
  },
  createIframeContent: function createIframeContent(signature) {
    var cursor = this.props.allowEditing ? 'pointer' : '';
    var emailResetStyles = "<style>\n        html body {\n          margin: 0;\n          width: 100%;\n          padding: 0;\n          word-wrap: break-word;\n          font-family:\n            -apple-system,\n            BlinkMacSystemFont,\n            'Segoe UI',\n            Roboto,\n            Oxygen-Sans,\n            Ubuntu,\n            Cantarell,\n            'Helvetica Neue',\n            sans-serif;\n            color: black;\n            font-size: 14px;\n            user-select: none;\n            cursor: " + cursor + ";\n        }\n      </style>";
    var emailContents = "<div>" + (emailResetStyles + signature) + "</div>";
    return emailContents;
  },
  renderEditableOverlay: function renderEditableOverlay() {
    if (!this.props.allowEditing) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIIcon, {
      onClick: this.props.onClick,
      className: "signature-iframe-edit",
      name: "edit"
    });
  },
  render: function render() {
    var _this$props = this.props,
        allowEditing = _this$props.allowEditing,
        onClick = _this$props.onClick;
    var classes = allowEditing ? "signature-iframe-wrapper signature-iframe-wrapper-edit signature-iframe-pointer" : "";
    return /*#__PURE__*/_jsxs("div", {
      className: classes,
      children: [/*#__PURE__*/_jsx(SignatureIframe, {
        className: "width-100",
        content: this.createIframeContent(this.props.signature),
        onClick: onClick
      }), this.renderEditableOverlay()]
    });
  }
});
export default SignatureIframeWrapper;