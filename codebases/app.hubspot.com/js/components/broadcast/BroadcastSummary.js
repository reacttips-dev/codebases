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
import { findDOMNode } from 'react-dom';
import I18n from 'I18n';
import { Set as ImmutableSet } from 'immutable';
import Small from 'UIComponents/elements/Small';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import { processMessageContent } from '../../lib/utils';
import SocialContext from '../app/SocialContext';
import { abstractChannelProp, broadcastProp, userProp } from '../../lib/propTypes';
import BroadcastRowErrors from './BroadcastRowErrors';
import BroadcastPostTargetOverview from './BroadcastPostTargetOverview';

var BroadcastSummary = /*#__PURE__*/function (_Component) {
  _inherits(BroadcastSummary, _Component);

  function BroadcastSummary() {
    _classCallCheck(this, BroadcastSummary);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastSummary).apply(this, arguments));
  }

  _createClass(BroadcastSummary, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var anchors = findDOMNode(this).querySelectorAll('a');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = anchors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var anchor = _step.value;

          anchor.onclick = function (e) {
            e.stopPropagation();
          };
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "renderChannel",
    value: function renderChannel() {
      var channel = this.props.channel;

      if (!channel) {
        return /*#__PURE__*/_jsx("span", {
          className: "channel unknown"
        });
      }

      return /*#__PURE__*/_jsx("span", {
        className: "channel",
        title: channel.name,
        children: /*#__PURE__*/_jsx(UIAvatar, {
          socialNetwork: channel.accountSlug,
          src: channel.getAvatarUrl()
        })
      });
    }
  }, {
    key: "renderUpdatedBy",
    value: function renderUpdatedBy() {
      var _this$props = this.props,
          broadcast = _this$props.broadcast,
          createdBy = _this$props.createdBy,
          updatedBy = _this$props.updatedBy;

      if (broadcast.isUploaded() && broadcast.userUpdatedAt) {
        return /*#__PURE__*/_jsxs(Small, {
          className: "last-updated",
          children: [I18n.text('sui.broadcasts.row.updatedAt'), I18n.moment(broadcast.userUpdatedAt).portalTz().format('lll'), updatedBy && I18n.text('sui.broadcasts.row.by', {
            userName: updatedBy.getFullName()
          })]
        });
      }

      if (!broadcast.isPublished() && createdBy) {
        return /*#__PURE__*/_jsx(Small, {
          className: "last-updated",
          children: I18n.text('sui.broadcasts.row.draftUpdatedBy', {
            userName: createdBy.getFullName()
          })
        });
      }

      return null;
    }
  }, {
    key: "renderBroadcastErrors",
    value: function renderBroadcastErrors() {
      var broadcast = this.props.broadcast;
      return /*#__PURE__*/_jsx(BroadcastRowErrors, {
        errors: broadcast.errors,
        portalId: broadcast.portalId,
        trackInteraction: this.context.trackInteraction
      });
    }
  }, {
    key: "render",
    value: function render() {
      var broadcast = this.props.broadcast;
      var messageBody = processMessageContent(broadcast.content.get('body'), undefined, 140, broadcast.getNetwork());
      var link = broadcast.content.get('originalLink');
      return /*#__PURE__*/_jsxs("div", {
        className: "broadcast-summary",
        children: [this.renderChannel(), /*#__PURE__*/_jsxs("div", {
          className: "body",
          children: [/*#__PURE__*/_jsx("p", {
            className: "emoji-font",
            dangerouslySetInnerHTML: {
              __html: messageBody
            }
          }), broadcast.campaignGuid && broadcast.campaignName && /*#__PURE__*/_jsxs(Small, {
            className: "campaign",
            children: [I18n.text('sui.broadcasts.row.campaign'), ': ', broadcast.campaignName]
          }), link && /*#__PURE__*/_jsx(Small, {
            className: "link",
            children: /*#__PURE__*/_jsxs(UITruncateString, {
              children: [/*#__PURE__*/_jsx("span", {
                children: I18n.text('sui.broadcasts.row.link')
              }), link]
            })
          }), this.renderUpdatedBy(), this.props.hasBoostedPost && /*#__PURE__*/_jsx(Small, {
            className: "boosted",
            children: I18n.text('sui.broadcasts.row.boosted')
          }), /*#__PURE__*/_jsx(BroadcastPostTargetOverview, {
            targetLocations: broadcast.targetLocations,
            targetLanguages: broadcast.targetLanguages
          }), this.renderBroadcastErrors()]
        })]
      });
    }
  }]);

  return BroadcastSummary;
}(Component);

BroadcastSummary.propTypes = {
  broadcast: broadcastProp,
  createdBy: userProp,
  updatedBy: userProp,
  channel: abstractChannelProp,
  hasBoostedPost: PropTypes.bool.isRequired
};
BroadcastSummary.defaultProps = {
  errors: ImmutableSet()
};
BroadcastSummary.contextType = SocialContext;
export { BroadcastSummary as default };