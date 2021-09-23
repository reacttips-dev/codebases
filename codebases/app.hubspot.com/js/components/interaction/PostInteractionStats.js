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
import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import HR from 'UIComponents/elements/HR';
import UISection from 'UIComponents/section/UISection';
import UIWell from 'UIComponents/well/UIWell';
import UIWellBigNumber from 'UIComponents/well/UIWellBigNumber';
import UIWellItem from 'UIComponents/well/UIWellItem';
import UIWellLabel from 'UIComponents/well/UIWellLabel';
import Small from 'UIComponents/elements/Small';
import { ACCOUNT_TYPES, CLICK_TRACKING_NETWORKS, POST_STAT_TYPES } from '../../lib/constants';
import { getDurationDisplay, passPropsFor } from '../../lib/utils';
import { accountTypeProp, fileProp } from '../../lib/propTypes';
import WellItem from '../reports/WellItem';
import ReactionWell from '../reports/ReactionWell';
var ACCOUNTS_WITH_INSIGHTS_STATS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.youtube];
var DRILLDOWN_LIKES = [ACCOUNT_TYPES.linkedin];

var PostInteractionStats = /*#__PURE__*/function (_PureComponent) {
  _inherits(PostInteractionStats, _PureComponent);

  function PostInteractionStats() {
    _classCallCheck(this, PostInteractionStats);

    return _possibleConstructorReturn(this, _getPrototypeOf(PostInteractionStats).apply(this, arguments));
  }

  _createClass(PostInteractionStats, [{
    key: "supportsInsightsStats",
    value: function supportsInsightsStats() {
      var network = this.props.network;
      return ACCOUNTS_WITH_INSIGHTS_STATS.includes(network);
    }
  }, {
    key: "supportsBasicVideoStats",
    value: function supportsBasicVideoStats() {
      // facebook has special videoInsights we fetch, but these other network support basic stats store on the post
      var network = this.props.network;
      return [ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.instagram].includes(network);
    }
  }, {
    key: "supportsStat",
    value: function supportsStat(stat) {
      var supportedStats = this.props.supportedStats;
      return supportedStats && supportedStats.includes(stat);
    }
  }, {
    key: "renderClickStats",
    value: function renderClickStats() {
      var _this$props = this.props,
          clicks = _this$props.clicks,
          contactsCount = _this$props.contactsCount,
          hasLink = _this$props.hasLink,
          network = _this$props.network,
          onHoverStatHelp = _this$props.onHoverStatHelp;

      if (!CLICK_TRACKING_NETWORKS.includes(network) || !hasLink) {
        return null;
      }

      var clickEls = [/*#__PURE__*/_jsx(WellItem, {
        label: "click",
        tooltip: I18n.text('sui.interactions.types.click.tooltip'),
        value: clicks,
        onHover: function onHover() {
          return onHoverStatHelp('clicks');
        }
      }, "stat-click")];

      if (contactsCount > 0) {
        clickEls.push( /*#__PURE__*/_jsx(WellItem, {
          label: "assists",
          value: contactsCount,
          tooltip: I18n.text("sui.interactions.types.contact.tooltip"),
          onClick: this.props.allowDrilldown ? this.props.onDrillDownInteraction : undefined,
          onHover: function onHover() {
            return onHoverStatHelp('assists');
          }
        }, "stat-assists"));
      }

      return clickEls;
    }
  }, {
    key: "renderNetworkClicks",
    value: function renderNetworkClicks() {
      var _this$props2 = this.props,
          stats = _this$props2.stats,
          network = _this$props2.network,
          onHoverStatHelp = _this$props2.onHoverStatHelp;

      if (!this.supportsStat(POST_STAT_TYPES.clicksNetwork)) {
        return [];
      }

      return [/*#__PURE__*/_jsx(WellItem, {
        label: "clicksNetwork",
        tooltip: I18n.text("sui.interactions.types.clicksNetwork.tooltip." + network),
        value: stats.get('clicksNetwork'),
        onHover: function onHover() {
          return onHoverStatHelp('clicksNetwork');
        }
      }, "stat-clicksNetwork")];
    }
  }, {
    key: "renderPerformanceStat",
    value: function renderPerformanceStat(stat) {
      var stats = this.props.stats;
      return /*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: I18n.text("srui.postsDetail.performance." + stat)
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: stat === 'videoAverageViewPercentage' ? I18n.formatPercentage(stats.get(stat) * 100) : I18n.formatNumber(stats.get(stat))
        })]
      }, stat);
    }
  }, {
    key: "renderVideoPerformance",
    value: function renderVideoPerformance() {
      var _this = this;

      return /*#__PURE__*/_jsxs("div", {
        className: "video-details-performance",
        children: [/*#__PURE__*/_jsx("h4", {
          children: I18n.text('srui.postsDetail.performance.header')
        }), /*#__PURE__*/_jsx(UIWell, {
          className: "p-all-0",
          children: ['videoViews', 'videoAverageViewPercentage', 'shares'].map(function (stat) {
            return _this.renderPerformanceStat(stat);
          })
        }), /*#__PURE__*/_jsx(UIWell, {
          className: "p-all-0",
          children: ['likes', 'dislikes', 'comments'].map(function (stat) {
            return _this.renderPerformanceStat(stat);
          })
        })]
      });
    }
  }, {
    key: "renderInteractionStats",
    value: function renderInteractionStats() {
      var _this2 = this;

      var _this$props3 = this.props,
          likes = _this$props3.likes,
          network = _this$props3.network,
          replies = _this$props3.replies,
          stats = _this$props3.stats;
      var wells = [];

      if (network === ACCOUNT_TYPES.youtube) {
        wells.push(this.renderVideoPerformance());
      } else {
        if (network !== ACCOUNT_TYPES.facebook) {
          wells.push( /*#__PURE__*/_jsx(WellItem, {
            label: "like",
            value: stats.get('likes') || likes,
            onClick: this.props.allowDrilldown && DRILLDOWN_LIKES.includes(network) ? this.props.onDrillDownInteraction : undefined
          }, "stat-like"));
        }

        wells.push( /*#__PURE__*/_jsx(WellItem, {
          label: [ACCOUNT_TYPES.twitter].includes(network) ? 'reply' : 'comment',
          onClick: this.props.allowDrilldown ? function () {
            return _this2.props.onDrillDownInteraction('comment');
          } : undefined,
          value: replies
        }, "stat-reply"));

        if (network === ACCOUNT_TYPES.twitter) {
          wells.push( /*#__PURE__*/_jsx(WellItem, {
            label: "retweet",
            onClick: this.props.allowDrilldown ? this.props.onDrillDownInteraction : undefined,
            value: stats.get('shares')
          }, "stat-retweet"));
        } else if (stats.get('shares') > 0) {
          // at some point we may be confident enough to show 0 here, but need to establish exactly which mediaType/channelType support
          // right now still working to get these for LI videos at least
          wells.push( /*#__PURE__*/_jsx(WellItem, {
            label: "share",
            value: stats.get('shares')
          }, "stat-share"));
        }
      }

      return wells;
    }
  }, {
    key: "renderFacebookVideoInsightStats",
    value: function renderFacebookVideoInsightStats() {
      // FB is special cased, we live-fetch /video-insights edge and pass in. want to move toward storing that on the post,
      // preventing need to fetch and making it like the other video networks
      var _this$props4 = this.props,
          file = _this$props4.file,
          hasVideo = _this$props4.hasVideo,
          network = _this$props4.network,
          videoInsights = _this$props4.videoInsights;

      if (!(hasVideo && network === ACCOUNT_TYPES.facebook)) {
        return null;
      }

      return [/*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: I18n.text('sui.details.video.tenSecondViews')
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: I18n.formatNumber(videoInsights.get('tenSecondViews', 0))
        })]
      }, "stat-vid-ten"), /*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: I18n.text('sui.details.video.completeViews')
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: I18n.formatNumber(videoInsights.get('completeViews', 0))
        })]
      }, "stat-vid-complete"), /*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: I18n.text('sui.details.video.averageTimeWatched')
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: getDurationDisplay(videoInsights.get('averageTimeWatched', 0))
        })]
      }, "stat-vid-avg"), /*#__PURE__*/_jsxs(UIWellItem, {
        children: [/*#__PURE__*/_jsx(UIWellLabel, {
          children: I18n.text('sui.details.video.duration')
        }), /*#__PURE__*/_jsx(UIWellBigNumber, {
          children: file ? file.getDurationDisplay() : 0
        })]
      }, "stat-vid-duration")];
    }
  }, {
    key: "renderInsightsStats",
    value: function renderInsightsStats() {
      var _this$props5 = this.props,
          hasVideo = _this$props5.hasVideo,
          stats = _this$props5.stats,
          network = _this$props5.network;
      var reportEls = [];

      if (hasVideo && this.supportsBasicVideoStats()) {
        if (stats.get('videoViews') > 0) {
          reportEls.push([/*#__PURE__*/_jsx(WellItem, {
            label: "videoView",
            value: stats.get('videoViews')
          }, "stat-videoView")]);
        }

        if (stats.get('videoMinutesWatched') > 0) {
          var formatted = I18n.formatDuration(I18n.moment.duration(stats.get('videoMinutesWatched'), 'minutes'));
          reportEls.push([/*#__PURE__*/_jsx(WellItem, {
            label: "videoMinutesWatched",
            numberNode: formatted
          }, "stat-videoMinutesWatched")]);
        }
      }

      if (stats.get('saves') > 0) {
        // only IG
        reportEls.push( /*#__PURE__*/_jsx(WellItem, {
          label: "save",
          value: stats.get('saves')
        }, "stat-saves"));
      }

      if (stats.get('impressions') > 0) {
        // todo - make sure networks that cannot get impressions do not show 0, if we decided to show 0
        reportEls.push( /*#__PURE__*/_jsx(WellItem, {
          label: "impression",
          value: stats.get('impressions')
        }, "stat-impression"));
      }

      if (network === ACCOUNT_TYPES.facebook && stats.get('impressionsPaid') > 0) {
        reportEls.push( /*#__PURE__*/_jsx(WellItem, {
          label: "impressionPaid",
          value: stats.get('impressionsPaid')
        }, "stat-impression-paid"));
      }

      return reportEls;
    }
  }, {
    key: "renderNumericStats",
    value: function renderNumericStats() {
      return this.renderInteractionStats().concat(this.renderClickStats()).concat(this.renderNetworkClicks()).concat(this.renderFacebookVideoInsightStats());
    }
  }, {
    key: "renderExtraStats",
    value: function renderExtraStats() {
      var wellItemEls = [];

      if (this.supportsInsightsStats()) {
        wellItemEls = wellItemEls.concat(this.renderInsightsStats());
      }

      return wellItemEls;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          stats = _this$props6.stats,
          lastFetchedAt = _this$props6.lastFetchedAt;
      return /*#__PURE__*/_jsxs(UISection, {
        className: "broadcast-details-interaction-stats",
        children: [/*#__PURE__*/_jsx(HR, {}), /*#__PURE__*/_jsxs(UIWell, {
          className: "stats-well broadcast-details-interaction-stats__well--small",
          children: [/*#__PURE__*/_jsx(ReactionWell, Object.assign({}, passPropsFor(this.props, ReactionWell), {
            reactionsTotal: stats ? stats.get('reactions') : 0,
            reactionsByType: stats ? stats.get('reactionsByType') : undefined
          })), this.renderNumericStats(), this.renderExtraStats()]
        }), lastFetchedAt && /*#__PURE__*/_jsx(Small, {
          children: I18n.text("sui.details.lastFetchedAt", {
            timeDisplay: I18n.moment(lastFetchedAt).portalTz().format('lll')
          })
        })]
      });
    }
  }]);

  return PostInteractionStats;
}(PureComponent);

PostInteractionStats.propTypes = {
  allowDrilldown: PropTypes.bool,
  clicks: PropTypes.number,
  contactsCount: PropTypes.number,
  file: fileProp,
  hasLink: PropTypes.bool,
  hasVideo: PropTypes.bool,
  likes: PropTypes.number,
  network: accountTypeProp,
  onDrillDownInteraction: PropTypes.func,
  onHoverStatHelp: PropTypes.func,
  replies: PropTypes.number,
  lastFetchedAt: PropTypes.number,
  stats: PropTypes.shape({
    get: PropTypes.func,
    likes: PropTypes.number,
    shares: PropTypes.number,
    impressions: PropTypes.number,
    impressionsPaid: PropTypes.number,
    reactionsByType: PropTypes.object
  }),
  supportedStats: PropTypes.array,
  videoInsights: PropTypes.shape({
    get: PropTypes.func,
    tenSecondViews: PropTypes.number,
    completeViews: PropTypes.number,
    averageTimeWatched: PropTypes.number
  })
};
PostInteractionStats.defaultProps = {
  allowDrilldown: true,
  hasLink: false,
  hasVideo: false,
  stats: ImmutableMap(),
  videoInsights: ImmutableMap(),
  onHoverStatHelp: function onHoverStatHelp() {}
};
export { PostInteractionStats as default };