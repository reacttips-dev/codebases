'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import I18n from 'I18n';
import { omit } from 'underscore';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UIDescriptionList from 'UIComponents/list/UIDescriptionList';
import UILink from 'UIComponents/link/UILink';
import { feedUserProp, logicalChannelProp, logicalChannelsProp, relationshipProp } from '../../lib/propTypes';
import { ACCOUNT_TYPES } from '../../lib/constants';
import Following from '../inbox/Following';
import { formatTweet, passPropsFor } from '../../lib/utils';
import UIWell from 'UIComponents/well/UIWell';
import UIWellItem from 'UIComponents/well/UIWellItem';
import UIWellLabel from 'UIComponents/well/UIWellLabel';
import UIWellBigNumber from 'UIComponents/well/UIWellBigNumber';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import SocialContext from '../app/SocialContext';
var TWITTER_TO_PROPERTY_TRANSLATOR_KEY = {
  followersCount: 'Follower count',
  friendsCount: 'Friends count',
  statusesCount: 'Status count'
};
var TWITTER_PROPERTY_TO_TRANSLATOR_KEY = {
  header: 'Twitter Profile',
  viewOnNetwork: 'View on Twitter',
  screenname: 'Twitter Handle',
  screenName: 'Twitter Handle',
  description: 'Twitter bio',
  url: 'Website',
  expandedURL: 'Website',
  location: 'Location',
  followersCount: 'Followers',
  follower_count: 'Followers',
  friendsCount: 'Following',
  friends_count: 'Following',
  statusesCount: 'Tweets',
  statuses_count: 'Tweets'
};

var TwitterDetails = /*#__PURE__*/function (_Component) {
  _inherits(TwitterDetails, _Component);

  function TwitterDetails() {
    _classCallCheck(this, TwitterDetails);

    return _possibleConstructorReturn(this, _getPrototypeOf(TwitterDetails).apply(this, arguments));
  }

  _createClass(TwitterDetails, [{
    key: "renderIfPresent",
    value: function renderIfPresent(details, propertyName) {
      var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var formatNumber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var asLink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (details.get(propertyName)) {
        var propertyValue = formatNumber ? I18n.formatNumber(details.get(propertyName)) : details.get(propertyName);

        if (asLink) {
          propertyValue = /*#__PURE__*/_jsx(UILink, {
            href: propertyValue,
            target: "_blank",
            external: true,
            children: propertyValue
          });
        }

        return [/*#__PURE__*/_jsx("dt", {
          children: propertyLabelTranslator(TWITTER_PROPERTY_TO_TRANSLATOR_KEY[propertyName] || propertyName)
        }, "key-" + propertyName), /*#__PURE__*/_jsxs("dd", {
          children: [prepend, propertyValue]
        }, "value-" + propertyName)];
      }

      return null;
    }
  }, {
    key: "renderDescription",
    value: function renderDescription() {
      var details = this.props.profile.twitterProfile;

      if (!details.get('description')) {
        return null;
      }

      return [/*#__PURE__*/_jsx("dt", {
        children: propertyLabelTranslator(TWITTER_PROPERTY_TO_TRANSLATOR_KEY.description)
      }, "key"), /*#__PURE__*/_jsx("dd", {
        dangerouslySetInnerHTML: {
          __html: formatTweet(details.get('description'))
        }
      }, "val")];
    }
  }, {
    key: "renderFollowing",
    value: function renderFollowing() {
      return /*#__PURE__*/_jsx(Following, Object.assign({}, passPropsFor(this.props, Following), {
        userId: this.props.profile.getUserId(),
        channel: this.props.interactingAsChannel
      }));
    }
  }, {
    key: "renderViewOnNetwork",
    value: function renderViewOnNetwork() {
      var _this = this;

      return /*#__PURE__*/_jsx(UILink, {
        href: this.props.profile.getProfileLink(ACCOUNT_TYPES.twitter),
        external: true,
        target: "_blank",
        onClick: function onClick() {
          return _this.context.trackInteraction('view on twitter');
        },
        children: I18n.text('sui.profile.twitter.viewOnNetwork')
      });
    }
  }, {
    key: "renderBigNumberCombo",
    value: function renderBigNumberCombo(propertyName, details) {
      return /*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: propertyLabelTranslator(TWITTER_TO_PROPERTY_TRANSLATOR_KEY[propertyName] || propertyName)
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: I18n.formatNumber(details.get(propertyName))
        })]
      }, propertyName);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var details = this.props.profile.twitterProfile;

      if (!details || details.isEmpty()) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UICardWrapper, {
        className: "twitter-details",
        compact: true,
        children: [/*#__PURE__*/_jsx(UICardHeader, {
          title: I18n.text('sui.profile.twitter.header'),
          toolbar: this.renderViewOnNetwork()
        }), /*#__PURE__*/_jsxs(UICardSection, {
          className: "network-details",
          children: [/*#__PURE__*/_jsxs(UIDescriptionList, {
            children: [this.renderIfPresent(details, 'screenName', '@'), this.renderDescription(), this.renderIfPresent(details, 'location'), this.renderIfPresent(details.get('urlentity'), 'expandedURL', undefined, undefined, true), /*#__PURE__*/_jsx(UIWell, {
              children: Object.keys(TWITTER_TO_PROPERTY_TRANSLATOR_KEY).map(function (propertyName) {
                return _this2.renderBigNumberCombo(propertyName, details);
              })
            })]
          }), this.renderFollowing()]
        })]
      });
    }
  }]);

  return TwitterDetails;
}(Component);

TwitterDetails.propTypes = Object.assign({}, omit(Following.propTypes, 'followEnabled'), {
  profile: feedUserProp,
  relationships: relationshipProp,
  twitterChannels: logicalChannelsProp,
  interactingAsChannel: logicalChannelProp
});
TwitterDetails.contextType = SocialContext;
export { TwitterDetails as default };