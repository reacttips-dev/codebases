'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { identity } from 'underscore';
import { Set as ImmutableSet } from 'immutable';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';
import BAPPopoverBody from './BAPPopoverBody';
import { listProp, setProp, logicalChannelProp } from '../../lib/propTypes';

var BAPPopover = /*#__PURE__*/function (_Component) {
  _inherits(BAPPopover, _Component);

  function BAPPopover() {
    var _this;

    _classCallCheck(this, BAPPopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BAPPopover).call(this));

    _this.onToggleSelect = function (e) {
      // ignore an attempt to open if all blogs are already chosen, to not block the submit button
      if (e.target.value && _this.state.enabledBlogIds.size === _this.props.blogs.size) {
        return;
      }

      _this.setState({
        selectOpen: e.target.value
      });
    };

    _this.updateSelectedBlogs = function (value) {
      _this.setState({
        enabledBlogIds: value,
        selectOpen: _this.props.blogs.size !== value.size
      });
    };

    _this.onSubmit = function (e) {
      e.preventDefault();

      _this.props.onSubmit(_this.state.enabledBlogIds);
    };

    _this.renderContent = function () {
      var blogs = _this.props.blogs;
      var enabledBlogIds = _this.state.enabledBlogIds;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIPopoverHeader, {
          children: /*#__PURE__*/_jsx("h4", {
            children: I18n.text('sui.accounts.table.autoPublish.popover.header')
          })
        }), /*#__PURE__*/_jsx(BAPPopoverBody, {
          channel: _this.props.channel,
          blogs: blogs,
          blogsForChannel: enabledBlogIds,
          otherBlogsEnabledForNetwork: _this.props.otherBlogsEnabledForNetwork,
          updateSelectedBlogs: _this.updateSelectedBlogs,
          selectOpen: _this.state.selectOpen,
          onToggleSelect: _this.onToggleSelect
        }), /*#__PURE__*/_jsxs(UIPopoverFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "primary",
            onClick: _this.onSubmit,
            children: I18n.text('sui.accounts.table.autoPublish.popover.buttons.submit')
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "secondary",
            onClick: _this.props.onTogglePopover,
            children: I18n.text('sui.accounts.table.autoPublish.popover.buttons.cancel')
          })]
        })]
      });
    };

    _this.state = {
      enabledBlogIds: ImmutableSet(),
      selectOpen: false,
      canUpdateSelect: true
    };
    return _this;
  }

  _createClass(BAPPopover, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.blogsForChannel) {
        this.setState({
          enabledBlogIds: nextProps.blogsForChannel
        });
      }
    }
  }, {
    key: "getDisabledReason",
    value: function getDisabledReason() {
      var channel = this.props.channel;

      if (!this.props.userCanConfigure) {
        return 'notAllowed';
      }

      if (channel.accountExpired) {
        return 'channelExpired';
      }

      if (!channel.shared) {
        return 'channelNotShared';
      }

      return null;
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      return Boolean(this.getDisabledReason());
    }
  }, {
    key: "renderPopoverLaunchButton",
    value: function renderPopoverLaunchButton() {
      var button;
      var _this$props = this.props,
          blogsForChannel = _this$props.blogsForChannel,
          blogs = _this$props.blogs;
      var enabledBlogsList = I18n.formatList(blogsForChannel.toArray().map(function (blogId) {
        return blogs.find(function (b) {
          return blogId === b.id;
        });
      }).filter(identity).map(function (b) {
        return b.name;
      }));
      var disabledReason = this.getDisabledReason();
      var disableButton = this.isDisabled();

      if (blogsForChannel.isEmpty()) {
        button = /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "tertiary",
          onClick: this.props.onTogglePopover,
          disabled: disableButton,
          children: I18n.text('sui.accounts.table.autoPublish.popoverButtonNone')
        });
      } else {
        button = /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "tertiary-light",
          onClick: this.props.onTogglePopover,
          disabled: disableButton,
          children: I18n.text('sui.accounts.table.autoPublish.popoverButton', {
            numSelectedBlogs: this.props.blogsForChannel.size
          })
        });
      }

      if (disableButton) {
        var tooltipKey = "sui.accounts.table.autoPublish.tooltip." + disabledReason;
        return /*#__PURE__*/_jsx(UITooltip, {
          Content: function Content() {
            return /*#__PURE__*/_jsxs(UITooltipContent, {
              children: [I18n.text(tooltipKey, {
                enabledBlogsList: enabledBlogsList
              }), !blogsForChannel.isEmpty() && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "sui.accounts.table.autoPublish.tooltip.disabledListOfBlogs",
                options: {
                  enabledBlogsList: enabledBlogsList,
                  count: blogsForChannel.size
                }
              })]
            });
          },
          children: button
        });
      }

      return button;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIPopover, {
        open: this.props.isEditingThisChannel,
        closeOnOutsideClick: true,
        onOpenChange: this.props.onTogglePopover,
        arrowSize: "none",
        animateOnToggle: false,
        width: 400,
        Content: this.renderContent,
        children: this.renderPopoverLaunchButton()
      });
    }
  }]);

  return BAPPopover;
}(Component);

BAPPopover.propTypes = {
  channel: logicalChannelProp,
  onSubmit: PropTypes.func.isRequired,
  onTogglePopover: PropTypes.func,
  blogsForChannel: setProp,
  blogs: listProp,
  otherBlogsEnabledForNetwork: listProp,
  userCanConfigure: PropTypes.bool,
  isEditingThisChannel: PropTypes.bool
};
export { BAPPopover as default };