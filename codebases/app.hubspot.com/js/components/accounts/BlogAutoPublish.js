'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { listProp, logicalChannelProp } from '../../lib/propTypes';
import BAPPopover from './BAPPopover';
import SocialContext from '../app/SocialContext';

var BlogAutoPublish = /*#__PURE__*/function (_Component) {
  _inherits(BlogAutoPublish, _Component);

  function BlogAutoPublish() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BlogAutoPublish);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BlogAutoPublish)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.submitPopover = function (blogIds) {
      var channel = _this.props.channel;

      _this.context.trackInteraction('bap update', {
        network: channel.accountSlug,
        channelType: channel.channelSlug,
        blogsQuantity: blogIds.size
      });

      _this.props.saveBlogAutoPublish(channel.channelKey, blogIds);
    };

    return _this;
  }

  _createClass(BlogAutoPublish, [{
    key: "showAutoPublish",
    value: function showAutoPublish() {
      return this.props.channel.supportsAutoPublish();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          blogs = _this$props.blogs,
          channel = _this$props.channel,
          blogsEnabledForNetwork = _this$props.blogsEnabledForNetwork;

      if (!this.showAutoPublish() || !blogs || blogs.isEmpty()) {
        return null;
      }

      var otherBlogsEnabledForNetwork = blogsEnabledForNetwork.filterNot(function (b) {
        return channel.autoPublishBlogIds.includes(b.id);
      });
      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(BAPPopover, {
          channel: channel,
          userCanConfigure: channel.userCanConfigure,
          blogs: blogs,
          otherBlogsEnabledForNetwork: otherBlogsEnabledForNetwork,
          isEditingThisChannel: this.props.editingBapForChannel === channel.channelKey,
          blogsForChannel: channel.autoPublishBlogIds,
          onTogglePopover: this.props.toggleEditingBapForChannel,
          onSubmit: this.submitPopover
        })
      });
    }
  }]);

  return BlogAutoPublish;
}(Component);

BlogAutoPublish.propTypes = {
  channel: logicalChannelProp,
  blogs: listProp,
  isExpired: PropTypes.bool,
  saveBlogAutoPublish: PropTypes.func,
  editingBapForChannel: PropTypes.string,
  blogsEnabledForNetwork: listProp,
  toggleEditingBapForChannel: PropTypes.func
};
BlogAutoPublish.contextType = SocialContext;
export { BlogAutoPublish as default };