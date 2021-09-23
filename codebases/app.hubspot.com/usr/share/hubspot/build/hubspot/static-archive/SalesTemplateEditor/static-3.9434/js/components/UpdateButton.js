'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import formatName from 'I18n/utils/formatName';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import CreateEditTemplateTooltip from './CreateEditTemplateTooltip';
import { MARIGOLD } from 'HubStyleTokens/colors';
import UIBreakString from 'UIComponents/text/UIBreakString';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIButton from 'UIComponents/button/UIButton';
import H5 from 'UIComponents/elements/headings/H5';
export default createReactClass({
  displayName: "UpdateButton",
  propTypes: {
    template: PropTypes.instanceOf(ImmutableMap).isRequired,
    onUpdate: PropTypes.func.isRequired,
    use: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    className: PropTypes.string,
    userOwnsTemplate: PropTypes.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  togglePopover: function togglePopover() {
    this.setState(function (_ref) {
      var open = _ref.open;
      return {
        open: !open
      };
    });
  },
  handleOnClick: function handleOnClick() {
    if (this.props.userOwnsTemplate) {
      this.props.onUpdate();
    } else {
      this.togglePopover();
    }
  },
  renderButtonText: function renderButtonText() {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "templateEditor.saveToOriginal"
    });
  },
  render: function render() {
    var open = this.state.open;
    var formattedName = formatName(this.props.template.get('userView').toObject());
    return /*#__PURE__*/_jsx(UIPopover, {
      open: open,
      className: "template-footer-popover update-button",
      placement: "top",
      content: {
        header: /*#__PURE__*/_jsxs(H5, {
          children: [/*#__PURE__*/_jsx(UIIcon, {
            name: "warning",
            color: MARIGOLD,
            className: "p-right-2"
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.saveToOriginalWarning.header"
          })]
        }),
        body: /*#__PURE__*/_jsx(UIBreakString, {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "templateEditor.saveToOriginalWarning.body",
            options: {
              formattedName: formattedName
            }
          })
        }),
        footer: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(UIButton, {
            size: "small",
            use: "tertiary",
            onClick: this.props.onUpdate,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.saveToOriginalWarning.update"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "update-template-popover-cancel",
            size: "small",
            use: "tertiary-light",
            onClick: this.togglePopover,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.saveToOriginalWarning.cancel"
            })
          })]
        })
      },
      children: /*#__PURE__*/_jsx(CreateEditTemplateTooltip, {
        buttonCreatesNewTemplate: false,
        children: /*#__PURE__*/_jsx(UIButton, {
          className: this.props.className,
          "data-selenium-test": "sales-template-editor-update-button",
          disabled: this.props.disabled,
          use: this.props.use,
          onClick: this.handleOnClick,
          children: this.renderButtonText()
        })
      })
    });
  }
});