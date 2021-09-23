'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import PostDetailsPanel from './PostDetailsPanel';
import { connect } from 'react-redux';
import { fetchSinglePostByParams } from '../redux/actions/posts';
import { getUserIsHubspotter } from '../redux/selectors/user';
import { passPropsFor } from '../lib/utils';
import { push, replace } from 'react-router-redux';
import { updateComposerHostContext } from '../redux/actions/ui';
import { removeEventKeyOverride, trackInteraction, trackNetwork } from '../redux/actions/usage';

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    reportingPost: props.getPostForDisplay(state, props),
    userIsHubspotter: getUserIsHubspotter(state)
  };
};

var mapDispatchToProps = {
  fetchSinglePostByParams: fetchSinglePostByParams,
  push: push,
  removeEventKeyOverride: removeEventKeyOverride,
  replace: replace,
  trackInteraction: trackInteraction,
  trackNetwork: trackNetwork,
  updateComposerHostContext: updateComposerHostContext
};

var PostDetailsPanelContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(PostDetailsPanelContainer, _PureComponent);

  function PostDetailsPanelContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PostDetailsPanelContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PostDetailsPanelContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClose = function () {
      var location = _this.props.location;

      _this.props.trackInteraction('close post panel');

      _this.props.trackNetwork(null);

      _this.props.removeEventKeyOverride();

      delete location.query.post;

      _this.props.push(location);
    };

    _this.onComposerOpenForYouTube = function (video) {
      _this.props.updateComposerHostContext({
        embedOpen: true,
        body: video.url,
        remoteContentId: video.foreignId,
        remoteContentType: 'youtube'
      });
    };

    return _this;
  }

  _createClass(PostDetailsPanelContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          postKeyString = _this$props.postKeyString,
          reportingPost = _this$props.reportingPost;

      if (postKeyString && !reportingPost) {
        var matches = postKeyString.match(/(\w.*?):(\w.*?):(.*)/);

        if (matches) {
          var _matches = _slicedToArray(matches, 4),
              __ = _matches[0],
              channelSlug = _matches[1],
              channelId = _matches[2],
              foreignId = _matches[3];

          this.props.fetchSinglePostByParams(channelSlug, channelId, foreignId);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var reportingPost = this.props.reportingPost;

      if (!reportingPost) {
        return null;
      }

      return /*#__PURE__*/_jsx(PostDetailsPanel, Object.assign({}, passPropsFor(this.props, PostDetailsPanel), {
        updatePostsCampaign: this.props.updatePostsCampaign,
        onClose: this.onClose
      }));
    }
  }]);

  return PostDetailsPanelContainer;
}(PureComponent);

PostDetailsPanelContainer.propTypes = {
  fetchSinglePostByParams: PropTypes.func,
  getPostForDisplay: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  postKeyString: PropTypes.string,
  push: PropTypes.func.isRequired,
  removeEventKeyOverride: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  reportingPost: PropTypes.object,
  trackInteraction: PropTypes.func.isRequired,
  trackNetwork: PropTypes.func.isRequired,
  updateComposerHostContext: PropTypes.func,
  updatePostsCampaign: PropTypes.func,
  userIsHubspotter: PropTypes.bool.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(PostDetailsPanelContainer);