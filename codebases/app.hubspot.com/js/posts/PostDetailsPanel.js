'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import BaseBroadcastDetailsPanel from '../components/broadcast/BaseBroadcastDetailsPanel';
import PostInteractionStats from '../components/interaction/PostInteractionStats';
import H4 from 'UIComponents/elements/headings/H4';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import PostCampaign from './PostCampaign';
import PostDetails from './PostDetails';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsMeta from './PostDetailsMeta';
import SocialContext from '../components/app/SocialContext';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UISection from 'UIComponents/section/UISection';
import { reportingPostProp } from '../lib/propTypes';
import { supportedStatsForPost } from '../lib/utils';

var PostDetailsPanel = /*#__PURE__*/function (_BaseBroadcastDetails) {
  _inherits(PostDetailsPanel, _BaseBroadcastDetails);

  function PostDetailsPanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PostDetailsPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PostDetailsPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleHoverStatHelp = function (stat) {
      _this.context.trackInteraction("hover stat help " + stat);
    };

    return _this;
  }

  _createClass(PostDetailsPanel, [{
    key: "renderBody",
    value: function renderBody() {
      var _this$props = this.props,
          reportingPost = _this$props.reportingPost,
          updatePostsCampaign = _this$props.updatePostsCampaign,
          location = _this$props.location;

      if (!reportingPost) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIPanelSection, {
        "data-test-id": "details-panel-body",
        className: "reporting-post-details-panel",
        children: [/*#__PURE__*/_jsx(UISection, {
          children: /*#__PURE__*/_jsx(PostDetailsHeader, {
            channel: reportingPost.channel,
            reportingPost: reportingPost,
            location: location
          })
        }), /*#__PURE__*/_jsx(PostDetails, {
          reportingPost: reportingPost,
          channel: reportingPost.channel,
          portalId: reportingPost.portalId
        }), /*#__PURE__*/_jsx(PostDetailsMeta, {
          reportingPost: reportingPost,
          userIsHubspotter: this.props.userIsHubspotter
        }), /*#__PURE__*/_jsx(PostCampaign, {
          reportingPost: reportingPost,
          updatePostsCampaign: updatePostsCampaign
        }), /*#__PURE__*/_jsx(PostInteractionStats, {
          allowDrilldown: false,
          contactsCount: 0,
          network: reportingPost.accountSlug,
          supportedStats: supportedStatsForPost(reportingPost),
          stats: reportingPost.stats,
          likes: reportingPost.stats.get('likes'),
          replies: reportingPost.stats.get('comments'),
          onHoverStatHelp: this.handleHoverStatHelp,
          lastFetchedAt: reportingPost.lastFetchedAt
        })]
      });
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return /*#__PURE__*/_jsx(H4, {
        children: I18n.text('sui.broadcastDetails.header')
      });
    }
  }]);

  return PostDetailsPanel;
}(BaseBroadcastDetailsPanel);

PostDetailsPanel.propTypes = {
  reportingPost: reportingPostProp,
  updatePostsCampaign: PropTypes.func,
  userIsHubspotter: PropTypes.bool.isRequired,
  track: PropTypes.func,
  trackInteraction: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};
PostDetailsPanel.contextType = SocialContext;
export { PostDetailsPanel as default };