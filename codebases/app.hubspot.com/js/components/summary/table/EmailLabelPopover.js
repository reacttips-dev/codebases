'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { cloneElement } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import H6 from 'UIComponents/elements/headings/H6';
var EmailLabelPopover = createReactClass({
  displayName: "EmailLabelPopover",
  propTypes: {
    children: PropTypes.element.isRequired,
    errorMessage: PropTypes.string.isRequired,
    link: PropTypes.object
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  open: function open() {
    this.setState({
      open: true
    });
  },
  close: function close() {
    this.setState({
      open: false
    });
  },
  getErrorLink: function getErrorLink() {
    var link = this.props.link;

    if (!link) {
      return null;
    }

    return /*#__PURE__*/_jsx(UILink, {
      href: link.ref,
      external: true,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "util.sequenceEmailErrorType." + link.copy
      })
    });
  },
  renderDialog: function renderDialog() {
    var errorMessage = this.props.errorMessage;
    return /*#__PURE__*/_jsxs("div", {
      className: "email-label-popover-dialog",
      children: [/*#__PURE__*/_jsx("header", {
        className: "justify-start",
        children: /*#__PURE__*/_jsx(H6, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequenceEmailError.heading"
          })
        })
      }), /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "util.sequenceEmailErrorType." + errorMessage,
        options: {
          link: this.getErrorLink()
        }
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UITooltip, {
      open: this.state.open,
      use: "longform",
      placement: "bottom",
      onClose: this.close,
      title: this.renderDialog(),
      children: /*#__PURE__*/cloneElement(this.props.children, {
        onClick: this.open
      })
    });
  }
});
export default EmailLabelPopover;