'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Loadable from 'UIComponents/decorators/Loadable';
import { connect } from 'react-redux';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import { getBroadcastCore } from '../redux/selectors/broadcastCore';
import { fetchBroadcastCore } from '../redux/actions/broadcastCore';
import { reportingPostProp, logicalChannelsProp, broadcastProp } from '../lib/propTypes';
import { getPublishableChannels } from '../redux/selectors/channels';
import { getPostById } from '../posts/selectors';
import { trackAdsEvent, closeBoostPanel, closeBoostPanelOnAdCreated, showErrorOnAdCreationFailure } from '../redux/actions/boosting';
import Broadcast from '../data/model/Broadcast';
var AsyncSocialBoostPanel = Loadable({
  loader: function loader() {
    return import('ads-social-boost-panel/components/SocialBoostPanel'
    /* webpackChunkName: "social-boost-panel" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return /*#__PURE__*/_jsx(UILoadingOverlay, {});
  },
  delay: 250
});

var mapStateToProps = function mapStateToProps(state, _ref) {
  var broadcastGuid = _ref.broadcastGuid,
      postId = _ref.postId;
  return {
    broadcast: broadcastGuid ? getBroadcastCore(state, {
      broadcastGuid: broadcastGuid
    }) : null,
    post: getPostById(state, {
      postId: postId
    }),
    channels: getPublishableChannels(state),
    auth: state.auth
  };
};

var mapDispatchToProps = {
  fetchBroadcastCore: fetchBroadcastCore,
  closeBoostPanel: closeBoostPanel,
  closeBoostPanelOnAdCreated: closeBoostPanelOnAdCreated,
  showErrorOnAdCreationFailure: showErrorOnAdCreationFailure
};

var formatPost = function formatPost(post) {
  if (!post) return null;
  post = Broadcast.createFrom(Object.assign({}, post, {
    foreignId: post.get('foreignId'),
    content: {
      body: post.body,
      photoUrl: post.getIn(['metadata', 'mediaUrl'], '')
    }
  }));
  return post;
};

var BoostPanelContainer = /*#__PURE__*/function (_Component) {
  _inherits(BoostPanelContainer, _Component);

  function BoostPanelContainer() {
    _classCallCheck(this, BoostPanelContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoostPanelContainer).apply(this, arguments));
  }

  _createClass(BoostPanelContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var broadcastGuid = this.props.broadcastGuid;

      if (broadcastGuid) {
        this.props.fetchBroadcastCore(this.props.broadcastGuid);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          broadcast = _this$props.broadcast,
          auth = _this$props.auth,
          post = _this$props.post;

      if (!broadcast && !post) {
        return null;
      }

      var formattedPost = formatPost(post);
      var channel = post ? post.channel : this.props.channels.get(broadcast.channelKey);
      return /*#__PURE__*/_jsx(AsyncSocialBoostPanel, {
        broadcast: formattedPost || broadcast,
        channel: channel,
        auth: auth,
        trackAdsEvent: trackAdsEvent,
        onSuccess: this.props.closeBoostPanelOnAdCreated,
        onFailure: this.props.showErrorOnAdCreationFailure,
        onClose: this.props.closeBoostPanel
      });
    }
  }]);

  return BoostPanelContainer;
}(Component);

BoostPanelContainer.propTypes = {
  broadcast: broadcastProp,
  broadcastGuid: PropTypes.string,
  postId: PropTypes.string,
  post: reportingPostProp,
  channels: logicalChannelsProp,
  fetchBroadcastCore: PropTypes.func.isRequired,
  closeBoostPanel: PropTypes.func.isRequired,
  closeBoostPanelOnAdCreated: PropTypes.func.isRequired,
  showErrorOnAdCreationFailure: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(BoostPanelContainer);