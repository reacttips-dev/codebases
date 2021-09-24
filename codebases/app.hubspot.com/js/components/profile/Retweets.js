'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import { CALYPSO, OZ } from 'HubStyleTokens/colors';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UIButton from 'UIComponents/button/UIButton';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UIIcon from 'UIComponents/icon/UIIcon';
import Small from 'UIComponents/elements/Small';
import StreamItem from '../../data/model/StreamItem';
import { feedUserProp, listProp, logicalChannelProp, logicalChannelsProp } from '../../lib/propTypes';
import { formatTweet } from '../../lib/utils';
import { ACCOUNT_TYPES } from '../../lib/constants';
import Timestamp from '../app/Timestamp';
import SocialContext from '../app/SocialContext';
import TwitterChannelSelect from '../channel/TwitterChannelSelect';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';

var Retweets = /*#__PURE__*/function (_Component) {
  _inherits(Retweets, _Component);

  function Retweets() {
    var _this;

    _classCallCheck(this, Retweets);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Retweets).call(this));

    _this.onClickFavorite = function () {
      var retweet = _this.props.retweets.get(_this.state.index);

      var streamItem = StreamItem.createFrom({
        resourceId: retweet.foreignId,
        userIdString: retweet.body.get('userIdString')
      }, _this.props.streamGuid);

      _this.props.favoriteStreamItem(_this.state.channel, streamItem).then(function () {
        _this.props.fetchSocialItemActionsAsInteractions(_this.props.profile.getUserId(), ACCOUNT_TYPES.twitter);
      });

      _this.context.trackInteraction('favorite retweet');
    };

    _this._navigate = function (delta) {
      _this.context.trackInteraction('navigate retweet');

      var index;

      if (_this.state.index === 0 && delta < 0) {
        index = _this.props.retweets.size + delta;
      } else {
        index = (_this.state.index + delta) % _this.props.retweets.size;
      }

      _this.setState({
        index: index
      });
    };

    _this.onPrevious = function () {
      var _this2;

      for (var _len = arguments.length, partialArgs = new Array(_len), _key = 0; _key < _len; _key++) {
        partialArgs[_key] = arguments[_key];
      }

      return (_this2 = _this)._navigate.apply(_this2, [-1, undefined].concat(partialArgs));
    };

    _this.onNext = function () {
      var _this3;

      for (var _len2 = arguments.length, partialArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        partialArgs[_key2] = arguments[_key2];
      }

      return (_this3 = _this)._navigate.apply(_this3, [1, undefined].concat(partialArgs));
    };

    _this.onChangeChannel = function (channel) {
      _this.setState({
        channel: channel
      });

      _this.context.trackInteraction('change like retweet channel');
    };

    _this.renderRetweet = function (interaction) {
      var bodyText = formatTweet(interaction.body.get('originalText'));
      var favoriteInteraction = interaction.renderContext.get('favoriteInteraction');

      var likeButtonEl = /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          onClick: _this.onClickFavorite,
          size: "small",
          children: I18n.text('sui.profile.retweets.like')
        }), /*#__PURE__*/_jsx("span", {
          children: " as "
        }), /*#__PURE__*/_jsx(TwitterChannelSelect, {
          twitterChannels: _this.props.twitterChannels,
          value: "Twitter:" + _this.state.channel.channelId,
          onChange: _this.onChangeChannel
        })]
      });

      var favoritedEl = favoriteInteraction && /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "success",
          color: OZ,
          className: "m-right-1"
        }), I18n.text('sui.profile.retweets.likedOn', {
          dateDisplay: I18n.moment(favoriteInteraction.interactionDate).portalTz().format('ll')
        })]
      });

      return /*#__PURE__*/_jsxs("div", {
        className: "retweet",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "socialRetweet",
          className: "retweeted icon"
        }), "\xA0", /*#__PURE__*/_jsx("span", {
          className: "retweeted",
          children: I18n.text('sui.profile.retweets.retweeted', {
            name: _this.props.profile.getName()
          })
        }), /*#__PURE__*/_jsxs(UIMedia, {
          className: "content",
          children: [/*#__PURE__*/_jsx(UIMediaLeft, {
            children: /*#__PURE__*/_jsx(UIAvatar, {
              className: "avatar",
              src: interaction.body.get('retweeter').avatarUrl
            })
          }), /*#__PURE__*/_jsxs(UIMediaBody, {
            children: [/*#__PURE__*/_jsx("span", {
              className: "name",
              children: interaction.body.get('retweeter').name
            }), /*#__PURE__*/_jsxs("span", {
              className: "username",
              children: ["@", interaction.body.get('retweeter').displayName]
            }), /*#__PURE__*/_jsx("p", {
              className: "text",
              dangerouslySetInnerHTML: {
                __html: bodyText
              }
            }), /*#__PURE__*/_jsx(Small, {
              children: /*#__PURE__*/_jsx(Timestamp, {
                value: interaction.interactionDate
              })
            })]
          })]
        }), /*#__PURE__*/_jsx("footer", {
          children: interaction.renderContext.get('favoriteInteraction') ? favoritedEl : likeButtonEl
        })]
      });
    };

    _this.state = {
      index: 0,
      channel: null
    };
    return _this;
  }

  _createClass(Retweets, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      if (this.props.retweets && !this.props.retweets.isEmpty()) {
        var channelId = this.props.retweets.first().getUserId();
        var channel = this.props.twitterChannels.get("Twitter:" + channelId);

        if (channel) {
          this.setState({
            channel: channel
          });
          return;
        }
      }

      this.setState({
        channel: this.props.interactingAsChannel
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.retweets || this.props.retweets.isEmpty()) {
        return null;
      }

      var interaction = this.props.retweets.get(this.state.index);

      var navEl = /*#__PURE__*/_jsxs("div", {
        className: "nav",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "unstyled",
          className: "prev",
          onClick: this.onPrevious,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "left",
            size: "xxs",
            color: CALYPSO
          })
        }), /*#__PURE__*/_jsxs("span", {
          children: [this.state.index + 1, " / ", this.props.retweets.size]
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "unstyled",
          className: "next",
          onClick: this.onNext,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "right",
            size: "xxs",
            color: CALYPSO
          })
        })]
      });

      return /*#__PURE__*/_jsxs(UICardWrapper, {
        className: "retweets",
        compact: true,
        children: [/*#__PURE__*/_jsx(UICardHeader, {
          title: I18n.text('sui.profile.retweets.header'),
          toolbar: navEl
        }), /*#__PURE__*/_jsx(UICardSection, {
          className: "card-body",
          children: this.renderRetweet(interaction)
        })]
      });
    }
  }]);

  return Retweets;
}(Component);

Retweets.propTypes = {
  profile: feedUserProp,
  streamGuid: PropTypes.string,
  twitterChannels: logicalChannelsProp,
  retweets: listProp,
  interactingAsChannel: logicalChannelProp,
  favoriteStreamItem: PropTypes.func.isRequired,
  fetchSocialItemActionsAsInteractions: PropTypes.func.isRequired
};
Retweets.contextType = SocialContext;
export { Retweets as default };