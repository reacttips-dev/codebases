'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import classNames from 'classnames';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UIModal from 'UIComponents/dialog/UIModal';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIButton from 'UIComponents/button/UIButton';
import UIList from 'UIComponents/list/UIList';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogHeaderImage from 'UIComponents/dialog/UIDialogHeaderImage';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIImage from 'UIComponents/image/UIImage';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
var propTypes = Object.assign({
  allowHeader: PropTypes.bool.isRequired,
  bodyClassName: PropTypes.string,
  cancelHref: PropTypes.string,
  cancelTarget: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  confirmDisabled: PropTypes.bool,
  confirmDisabledTooltip: PropTypes.node,
  confirmHref: PropTypes.string,
  confirmLabel: PropTypes.node,
  confirmTarget: PropTypes.string.isRequired,
  confirmUse: UIButton.propTypes.use,
  dialogClassName: PropTypes.string,
  extraFooter: PropTypes.node,
  extraRightAlignedFooter: PropTypes.node,
  footerAlign: UIDialogFooter.propTypes.align,
  headerImage: PropTypes.string,
  headerImageOffsetBottom: PropTypes.number,
  headerImageOffsetTop: PropTypes.number,
  includeFooter: PropTypes.bool,
  isConfirmButtonLoading: PropTypes.bool,
  confirmProps: PropTypes.object,
  moreButtons: PropTypes.node,
  offsetTop: PropTypes.number,
  onCloseComplete: PropTypes.func,
  onConfirm: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onReject: PropTypes.func.isRequired,
  onScroll: PropTypes.func,
  panelClassName: PropTypes.string,
  rejectLabel: PropTypes.node,
  showCancelButton: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool.isRequired,
  showConfirmButton: PropTypes.bool.isRequired,
  showExtraFooterFirst: PropTypes.bool,
  size: PropTypes.oneOf(['auto', 'medium', 'short', 'tall']),
  title: PropTypes.node,
  use: PropTypes.oneOfType([UIModal.propTypes.use, PropTypes.oneOf(['embedded', 'panel', 'sidebar'])]),
  width: PropTypes.number.isRequired
}, PromptablePropInterface);
var defaultProps = {
  allowHeader: true,
  cancelTarget: '_self',
  confirmTarget: '_self',
  confirmUse: 'primary',
  footerAlign: 'left',
  includeFooter: true,
  isConfirmButtonLoading: false,
  onConfirm: emptyFunction,
  onReject: emptyFunction,
  onCloseComplete: emptyFunction,
  showCancelButton: true,
  showCloseButton: true,
  showConfirmButton: true,
  showExtraFooterFirst: false,
  size: 'auto',
  use: 'default',
  width: 500
};
var SIDEBAR_BUTTON_STYLE = {
  float: 'right'
};

var EmbeddedComponent = function EmbeddedComponent(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    children: children
  });
};

EmbeddedComponent.propTypes = {
  children: PropTypes.node
};

var BaseDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(BaseDialog, _PureComponent);

  function BaseDialog() {
    _classCallCheck(this, BaseDialog);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseDialog).apply(this, arguments));
  }

  _createClass(BaseDialog, [{
    key: "getTitleNode",
    value: function getTitleNode() {
      var titleNode = this.props.title;

      if (typeof titleNode === 'string') {
        titleNode = /*#__PURE__*/_jsx("h3", {
          className: "m-all-0",
          children: titleNode
        }, "title-node");
      }

      return titleNode;
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var closeButton;
      var _this$props = this.props,
          showCloseButton = _this$props.showCloseButton,
          onReject = _this$props.onReject,
          allowHeader = _this$props.allowHeader,
          use = _this$props.use;
      var titleNode = this.getTitleNode();
      var headerClasses = use === 'embedded' ? 'flex-shrink-0' : "";

      if (!showCloseButton && !titleNode) {
        return null;
      } // Most modals should have UIDialogCloseButton,
      // but we'll still include an escape hatch
      // for certain situations


      if (showCloseButton) {
        closeButton = /*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: onReject,
          "data-selenium-test": "base-dialog-close-btn"
        }, "close-button");
      }

      if (!allowHeader) {
        return [titleNode, closeButton];
      }

      var Component = UIDialogHeader;

      if (use === 'panel') {
        Component = UIPanelHeader;
      }

      return /*#__PURE__*/_jsxs(Component, {
        className: headerClasses,
        children: [titleNode, closeButton]
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          bodyClassName = _this$props2.bodyClassName,
          use = _this$props2.use;
      var isEmbedded = use === 'embedded';
      var bodyClasses = classNames(bodyClassName, isEmbedded && "overflow-x-hidden overflow-y-auto p-bottom-0");

      if (!children) {
        return null;
      }

      if (use === 'panel') {
        return /*#__PURE__*/_jsx(UIPanelBody, {
          children: /*#__PURE__*/_jsx(UIPanelSection, {
            children: children
          })
        });
      }

      return /*#__PURE__*/_jsxs(UIDialogBody, {
        className: bodyClasses,
        children: [this.renderHeaderImage(), children]
      });
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this$props3 = this.props,
          includeFooter = _this$props3.includeFooter,
          moreButtons = _this$props3.moreButtons,
          extraFooter = _this$props3.extraFooter,
          extraRightAlignedFooter = _this$props3.extraRightAlignedFooter,
          footerAlign = _this$props3.footerAlign,
          showExtraFooterFirst = _this$props3.showExtraFooterFirst,
          use = _this$props3.use;
      var confirmButton = this.renderConfirmButton();
      var cancelButton = this.renderCancelButton();
      var footerClasses = classNames(showExtraFooterFirst && 'p-top-4', use === 'embedded' && 'flex-shrink-0');

      if (!includeFooter) {
        return null;
      }

      if (!(confirmButton || cancelButton || moreButtons || extraFooter)) {
        return null;
      }

      var Component = UIDialogFooter;

      if (use === 'panel') {
        Component = UIPanelFooter;
      }

      return /*#__PURE__*/_jsx(Component, {
        align: footerAlign,
        className: footerClasses,
        children: /*#__PURE__*/_jsxs(UIMedia, {
          align: "center",
          children: [/*#__PURE__*/_jsxs(UIMediaBody, {
            children: [showExtraFooterFirst && /*#__PURE__*/_jsx("div", {
              className: "p-left-1",
              children: extraFooter
            }), /*#__PURE__*/_jsxs(UIList, {
              inline: true,
              className: "display-flex flex-wrap",
              childClassName: "p-bottom-1",
              children: [confirmButton, moreButtons, cancelButton, !showExtraFooterFirst && extraFooter]
            })]
          }), extraRightAlignedFooter && /*#__PURE__*/_jsx(UIMediaRight, {
            children: extraRightAlignedFooter
          })]
        })
      });
    }
  }, {
    key: "renderConfirmButton",
    value: function renderConfirmButton() {
      var style;
      var component;
      var _this$props4 = this.props,
          onConfirm = _this$props4.onConfirm,
          confirmHref = _this$props4.confirmHref,
          use = _this$props4.use,
          confirmUse = _this$props4.confirmUse,
          confirmDisabled = _this$props4.confirmDisabled,
          confirmLabel = _this$props4.confirmLabel,
          confirmDisabledTooltip = _this$props4.confirmDisabledTooltip,
          confirmTarget = _this$props4.confirmTarget,
          showConfirmButton = _this$props4.showConfirmButton,
          isConfirmButtonLoading = _this$props4.isConfirmButtonLoading,
          confirmProps = _this$props4.confirmProps;

      if (!showConfirmButton) {
        return null;
      }

      if (use === 'sidebar') {
        style = SIDEBAR_BUTTON_STYLE;
      }

      var ButtonComponent = isConfirmButtonLoading ? UILoadingButton : UIButton;

      var button = /*#__PURE__*/_jsx(ButtonComponent, Object.assign({
        onClick: onConfirm,
        style: style,
        href: confirmHref,
        target: confirmTarget,
        use: confirmUse,
        disabled: confirmDisabled,
        "data-selenium-test": "base-dialog-confirm-btn",
        "data-confirm-button": "accept"
      }, confirmProps, {
        children: confirmLabel || I18n.text('customerDataUiUtilities.BaseDialog.save')
      }));

      if (confirmDisabledTooltip && confirmDisabled) {
        component = /*#__PURE__*/_jsx(UITooltip, {
          title: confirmDisabledTooltip,
          children: button
        });
      } else {
        component = button;
      }

      return component;
    }
  }, {
    key: "renderCancelButton",
    value: function renderCancelButton() {
      var style;
      var _this$props5 = this.props,
          onReject = _this$props5.onReject,
          cancelHref = _this$props5.cancelHref,
          use = _this$props5.use,
          rejectLabel = _this$props5.rejectLabel,
          cancelTarget = _this$props5.cancelTarget;

      if (!this.props.showCancelButton) {
        return null;
      }

      var clickHandler = {
        onClick: onReject
      };

      if (cancelHref) {
        clickHandler = {};
      }

      if (use === 'sidebar') {
        style = SIDEBAR_BUTTON_STYLE;
      }

      return /*#__PURE__*/_jsx(UIButton, Object.assign({}, clickHandler, {
        "data-selenium-test": "base-dialog-cancel-button",
        use: "secondary",
        style: style,
        href: cancelHref,
        target: cancelTarget,
        onClick: onReject,
        children: rejectLabel || I18n.text('customerDataUiUtilities.BaseDialog.cancel')
      }));
    }
  }, {
    key: "renderHeaderImage",
    value: function renderHeaderImage() {
      var _this$props6 = this.props,
          headerImage = _this$props6.headerImage,
          headerImageOffsetTop = _this$props6.headerImageOffsetTop,
          headerImageOffsetBottom = _this$props6.headerImageOffsetBottom;

      if (!headerImage) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIDialogHeaderImage, {
        offsetTop: headerImageOffsetTop,
        offsetBottom: headerImageOffsetBottom,
        children: /*#__PURE__*/_jsx(UIImage, {
          src: headerImage,
          responsive: false
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style;
      var _this$props7 = this.props,
          width = _this$props7.width,
          className = _this$props7.className,
          showCloseButton = _this$props7.showCloseButton,
          onReject = _this$props7.onReject,
          use = _this$props7.use,
          dialogClassName = _this$props7.dialogClassName,
          offsetTop = _this$props7.offsetTop,
          size = _this$props7.size,
          onOpenComplete = _this$props7.onOpenComplete,
          onScroll = _this$props7.onScroll,
          panelClassName = _this$props7.panelClassName,
          onCloseComplete = _this$props7.onCloseComplete;
      var extraProps;
      var Component;

      if (use === 'sidebar') {
        Component = UIModalPanel;
        extraProps = {
          onEsc: showCloseButton ? onReject : undefined,
          onOpenComplete: onOpenComplete,
          onCloseComplete: onCloseComplete
        };
      } else if (use === 'panel') {
        Component = UIPanel;
        extraProps = {
          panelClassName: panelClassName
        };
      } else if (use === 'embedded') {
        Component = EmbeddedComponent;
      } else {
        Component = UIModal;
        extraProps = {
          onEsc: showCloseButton ? onReject : undefined,
          onOpenComplete: onOpenComplete,
          onCloseComplete: onCloseComplete
        };
      }

      if (offsetTop) {
        style = {
          marginTop: offsetTop + "px"
        };
      }

      return /*#__PURE__*/_jsxs(Component, Object.assign({
        className: classNames('base-dialog', className),
        width: width,
        use: use,
        size: size,
        style: style,
        dialogClassName: dialogClassName,
        onScroll: onScroll
      }, extraProps, {
        children: [this.renderHeader(), this.renderBody(), this.renderFooter()]
      }));
    }
  }]);

  return BaseDialog;
}(PureComponent);

BaseDialog.propTypes = propTypes;
BaseDialog.defaultProps = defaultProps;
export default BaseDialog;