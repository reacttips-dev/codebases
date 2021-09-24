'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';
import UIImage from 'UIComponents/image/UIImage';
export default (function (Child) {
  return createReactClass({
    propTypes: {
      title: PropTypes.string.isRequired,
      bodyText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      image: PropTypes.string.isRequired,
      confirmText: PropTypes.string.isRequired,
      cancelText: PropTypes.string.isRequired,
      togglePopover: PropTypes.func,
      onConfirm: PropTypes.func,
      onCancel: PropTypes.func
    },
    getInitialState: function getInitialState() {
      return {
        open: false
      };
    },
    handleConfirm: function handleConfirm() {
      var onConfirm = this.props.onConfirm;

      if (onConfirm !== undefined) {
        onConfirm();
      }

      this.setState({
        open: false
      });
    },
    handleCancel: function handleCancel() {
      var onCancel = this.props.onCancel;

      if (onCancel !== undefined) {
        onCancel();
      }

      this.setState({
        open: false
      });
    },
    handleTogglePopover: function handleTogglePopover() {
      var open = this.state.open;
      var togglePopover = this.props.togglePopover;

      if (togglePopover !== undefined) {
        togglePopover();
      }

      this.setState({
        open: !open
      });
    },
    renderContent: function renderContent() {
      var _this$props = this.props,
          title = _this$props.title,
          bodyText = _this$props.bodyText,
          image = _this$props.image,
          confirmText = _this$props.confirmText,
          cancelText = _this$props.cancelText;
      return /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx(UIPopoverHeader, {
          children: /*#__PURE__*/_jsx("h5", {
            children: title
          })
        }, "header"), /*#__PURE__*/_jsx(UIPopoverBody, {
          children: /*#__PURE__*/_jsxs(UIFlex, {
            direction: "column",
            align: "center",
            children: [/*#__PURE__*/_jsx(UIImage, {
              src: image
            }), /*#__PURE__*/_jsx("p", {
              className: "m-all-0",
              children: bodyText
            })]
          })
        }, "body"), /*#__PURE__*/_jsx(UIPopoverFooter, {
          children: /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(UIButton, {
              use: "tertiary",
              size: "small",
              onClick: this.handleConfirm,
              children: confirmText
            }), /*#__PURE__*/_jsx(UIButton, {
              use: "tertiary-light",
              size: "small",
              onClick: this.handleCancel,
              children: cancelText
            })]
          })
        }, "footer")]
      });
    },
    render: function render() {
      var open = this.state.open;

      if (!Child) {
        return this.renderContent();
      }

      return /*#__PURE__*/_jsx(UIPopover, {
        open: open,
        placement: "top",
        width: 400,
        content: this.renderContent(),
        children: /*#__PURE__*/_jsx(Child, Object.assign({}, this.props, {
          togglePopover: this.handleTogglePopover
        }))
      });
    }
  });
});