'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import UIButton from 'UIComponents/button/UIButton';
export default createReactClass({
  displayName: "MergeTagGroupButton",
  propTypes: {
    className: PropTypes.string,
    togglePopover: PropTypes.func,
    showButtonIcon: PropTypes.bool.isRequired
  },
  mixins: [PureRenderMixin],
  renderIcon: function renderIcon() {
    var showButtonIcon = this.props.showButtonIcon;

    if (!showButtonIcon) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIIcon, {
      name: "contacts",
      className: "m-right-1"
    });
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        togglePopover = _this$props.togglePopover;
    return /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      "data-test-id": "merge-tag-group",
      onClick: togglePopover,
      className: className,
      "data-selenium-test": "insert-token-button",
      children: [this.renderIcon(), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.mergeTagGroupPlugin.buttonText"
      }), /*#__PURE__*/_jsx(UIDropdownCaret, {
        className: "m-left-2"
      })]
    });
  }
});