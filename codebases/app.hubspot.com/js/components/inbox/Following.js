'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import { abstractChannelProp, feedItemProp, logicalChannelsProp, relationshipProp } from '../../lib/propTypes';
import SocialContext from '../app/SocialContext';
import TwitterChannelSelect from '../channel/TwitterChannelSelect';

var Following = /*#__PURE__*/function (_PureComponent) {
  _inherits(Following, _PureComponent);

  function Following() {
    var _this;

    _classCallCheck(this, Following);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Following).call(this));

    _this.onClickFollow = function () {
      var channel = _this.props.twitterChannels.find(function (c) {
        return c.channelId === _this.state.channelId;
      });

      if (_this.channelIsFollowing()) {
        _this.props.requestUnfollow(channel.channelKey, _this.state.channelId, _this.props.userId);
      } else {
        _this.props.requestFollow(channel.channelKey, _this.state.channelId, _this.props.userId);
      }
    };

    _this.state = {
      channelId: null
    };
    return _this;
  }

  _createClass(Following, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.setState({
        channelId: this.props.channel.channelId
      });
    }
  }, {
    key: "isFollowingChannel",
    value: function isFollowingChannel() {
      var channelFollower = this.props.relationships.follower.get(this.state.channelId);
      return channelFollower && channelFollower.has(this.props.userId);
    }
  }, {
    key: "channelIsFollowing",
    value: function channelIsFollowing() {
      var channelFollowing = this.props.relationships.following.get(this.state.channelId);
      return channelFollowing && channelFollowing.has(this.props.userId);
    }
  }, {
    key: "renderFollowsYou",
    value: function renderFollowsYou() {
      var _this2 = this;

      var channel = this.props.twitterChannels.find(function (c) {
        return c.channelId === _this2.state.channelId;
      });

      if (this.isFollowingChannel()) {
        return /*#__PURE__*/_jsx("p", {
          className: "following-status",
          children: I18n.text('sui.profile.following.followsYou', {
            username: "@" + channel.username
          })
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (!this.props.relationships) {
        return null;
      }

      var hasAccessToChannel = this.props.twitterChannels.get("Twitter:" + this.state.channelId);
      return /*#__PURE__*/_jsx("div", {
        className: "following " + (this.channelIsFollowing() ? 'is-following' : 'not-following'),
        children: /*#__PURE__*/_jsx("div", {
          className: "bottom",
          children: /*#__PURE__*/_jsxs("div", {
            children: [this.renderFollowsYou(), /*#__PURE__*/_jsxs("div", {
              className: "follow",
              children: [/*#__PURE__*/_jsx(UIButton, {
                className: "submit",
                size: "small",
                use: this.channelIsFollowing() ? 'tertiary-light' : 'tertiary',
                disabled: !hasAccessToChannel || !this.props.followEnabled,
                onClick: this.onClickFollow,
                children: this.channelIsFollowing() ? I18n.text('sui.profile.following.unfollow') : I18n.text('sui.profile.following.follow')
              }), /*#__PURE__*/_jsx("span", {
                children: " as "
              }), /*#__PURE__*/_jsx(TwitterChannelSelect, {
                twitterChannels: this.props.twitterChannels,
                value: "Twitter:" + this.state.channelId,
                placement: "bottom left",
                onChange: function onChange(c) {
                  _this3.setState({
                    channelId: c.channelId
                  });

                  _this3.context.trackInteraction('change follow channel');
                }
              })]
            })]
          })
        })
      });
    }
  }]);

  return Following;
}(PureComponent);

Following.propTypes = {
  feedItem: feedItemProp,
  twitterChannels: logicalChannelsProp,
  relationships: relationshipProp,
  followEnabled: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  channel: abstractChannelProp,
  requestFollow: PropTypes.func,
  requestUnfollow: PropTypes.func
};
Following.defaultProps = {
  followEnabled: true
};
Following.contextType = SocialContext;
export { Following as default };