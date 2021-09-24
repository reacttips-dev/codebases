'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { EditorState } from 'draft-js';
import enviro from 'enviro';
import { Map as ImmutableMap } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { INSERT_HUBSPOT_VIDEO } from 'rich-text-lib/constants/usageTracking';
import { callIfPossible } from 'UIComponents/core/Functions';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITile from 'UIComponents/tile/UITile';
import UICheckbox from 'UIComponents/input/UICheckbox';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { notifyOfVideoCreation } from '../api/FileManagerApi';
import { fetchUserSetting, saveUserSetting } from '../api/UserSettingsApi';
import { VIDEO_CONSTANTS, INLINE_VIDEO_CONSTANTS } from '../lib/constants';
import { encodeUrl } from '../lib/utils';
import { createTracker } from '../tracking/usageTracker';
import insertAtomicBlockWithData from '../utils/insertAtomicBlockWithData';
var Tracker;
var DEFAULT_VIDEO_WIDTH = VIDEO_CONSTANTS.DEFAULT_VIDEO_WIDTH,
    DRAFT_ATOMIC_TYPE_VIDEO = VIDEO_CONSTANTS.DRAFT_ATOMIC_TYPE_VIDEO,
    EMBED_SCRIPT_URL = VIDEO_CONSTANTS.EMBED_SCRIPT_URL,
    SALES_PROD_CLIENT_ID = VIDEO_CONSTANTS.SALES_PROD_CLIENT_ID,
    SALES_QA_CLIENT_ID = VIDEO_CONSTANTS.SALES_QA_CLIENT_ID,
    SERVICE_HUB_PROD_CLIENT_ID = VIDEO_CONSTANTS.SERVICE_HUB_PROD_CLIENT_ID,
    SERVICE_HUB_QA_CLIENT_ID = VIDEO_CONSTANTS.SERVICE_HUB_QA_CLIENT_ID,
    VIDEO_INTEGRATION_HAS_CREATED_VIDEO = VIDEO_CONSTANTS.VIDEO_INTEGRATION_HAS_CREATED_VIDEO;
var DRAFT_ATOMIC_TYPE_INLINE_VIDEO = INLINE_VIDEO_CONSTANTS.DRAFT_ATOMIC_TYPE_INLINE_VIDEO;

function getClientId(isInServiceHub) {
  var isProd = enviro.isProd();

  if (isInServiceHub) {
    return isProd ? SERVICE_HUB_PROD_CLIENT_ID : SERVICE_HUB_QA_CLIENT_ID;
  }

  return isProd ? SALES_PROD_CLIENT_ID : SALES_QA_CLIENT_ID;
}

var GoVideoContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(GoVideoContainer, _PureComponent);

  function GoVideoContainer(props) {
    var _this;

    _classCallCheck(this, GoVideoContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GoVideoContainer).call(this, props));

    _this.handleInitiateVidyardComponent = function () {
      // eslint-disable-next-line no-undef
      var recipientEmail = _this.props.recipientEmail;
      var vidyardInstance = window.Vidyard;

      if (vidyardInstance) {
        if (_this.initiateComponentTimeout) {
          clearTimeout(_this.initiateComponentTimeout);
        }

        _this.setState({
          isLoading: false
        });

        var clientId = getClientId(_this.props.isInServiceHub);
        var library = vidyardInstance.goVideo.createLibrary(document.getElementById('GoVideo'), {
          clientId: clientId,
          recipientEmail: recipientEmail
        });
        library.on('player:created', _this.handleConfirm);
      } else {
        _this.initiateComponentTimeout = setTimeout(_this.handleInitiateVidyardComponent, 100);
      }
    };

    _this.handleVideoCreated = function () {
      if (_this.state.hasCreatedVideoOnce) {
        return;
      }

      saveUserSetting(VIDEO_INTEGRATION_HAS_CREATED_VIDEO, 'hasCreatedOnce', true).then(function () {
        return _this.setState({
          hasCreatedVideoOnce: true
        });
      });
      notifyOfVideoCreation();
    };

    _this.handleConfirm = function (_ref) {
      var _ref$player = _ref.player,
          custom_id = _ref$player.custom_id,
          name = _ref$player.name,
          uuid = _ref$player.uuid,
          _ref$embed_codes = _ref.embed_codes,
          sharing_page = _ref$embed_codes.sharing_page,
          thumbnail = _ref$embed_codes.thumbnail,
          base_url = _ref$embed_codes.base_url,
          videos = _ref.videos;
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange,
          onClose = _this$props.onClose,
          onConfirm = _this$props.onConfirm,
          trackingHandlers = _this$props.trackingHandlers,
          isInlineVideo = _this$props.isInlineVideo;

      if (onConfirm) {
        onConfirm({
          player: {
            custom_id: custom_id,
            sharing_page: sharing_page
          },
          videos: videos
        });
        return;
      }

      var url = sharing_page + "portalId=" + PortalIdParser.get();
      var videoBlockMetadata = ImmutableMap({
        atomicType: isInlineVideo ? DRAFT_ATOMIC_TYPE_INLINE_VIDEO : DRAFT_ATOMIC_TYPE_VIDEO,
        videoTitle: name,
        url: url,
        thumbnailSrc: encodeUrl(thumbnail),
        uuid: uuid,
        customId: custom_id,
        width: DEFAULT_VIDEO_WIDTH,
        base_url: base_url
      });
      onChange(insertAtomicBlockWithData(editorState, videoBlockMetadata));
      Tracker.track('draftVideo', {
        action: INSERT_HUBSPOT_VIDEO,
        method: 'toolbar'
      });
      callIfPossible(trackingHandlers.onInsertVideo);

      _this.handleVideoCreated();

      onClose();
    };

    if (!Tracker) {
      Tracker = createTracker();
    }

    _this.state = {
      hasCreatedVideoOnce: false,
      isLoading: true
    };
    return _this;
  }

  _createClass(GoVideoContainer, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.fetchVidyardEmbedScript();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.handleInitiateVidyardComponent();
      fetchUserSetting(VIDEO_INTEGRATION_HAS_CREATED_VIDEO).then(function (_ref2) {
        var hasCreatedOnce = _ref2.hasCreatedOnce;
        var hasCreatedVideoOnce = hasCreatedOnce == null ? false : hasCreatedOnce;

        _this2.setState({
          hasCreatedVideoOnce: hasCreatedVideoOnce
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.initiateComponentTimeout) {
        clearTimeout(this.initiateComponentTimeout);
      }
    }
  }, {
    key: "fetchVidyardEmbedScript",
    value: function fetchVidyardEmbedScript() {
      if (!window.Vidyard) {
        var vidyardEmbedScript = document.createElement('script');
        vidyardEmbedScript.src = EMBED_SCRIPT_URL;

        if (document && document.body) {
          document.body.appendChild(vidyardEmbedScript);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var isLoading = this.state.isLoading;
      return /*#__PURE__*/_jsxs("div", {
        className: "p-top-4 p-bottom-10",
        style: {
          width: '100%'
        },
        children: [this.props.showTitleCheckBox && /*#__PURE__*/_jsx(UICheckbox, {
          className: "m-bottom-3",
          defaultChecked: true,
          checked: this.state.shouldInsertTitle,
          onChange: function onChange(_ref3) {
            var checked = _ref3.target.checked;

            _this3.setState({
              shouldInsertTitle: checked
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.goVideoModal.showVideoTitle"
          })
        }), /*#__PURE__*/_jsx(UITile, {
          className: isLoading ? 'hidden' : null,
          distance: "flush",
          closeable: false,
          children: /*#__PURE__*/_jsx("div", {
            id: "GoVideo"
          })
        }), isLoading && /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })]
      });
    }
  }]);

  return GoVideoContainer;
}(PureComponent);

GoVideoContainer.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  isInServiceHub: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  trackingHandlers: PropTypes.object.isRequired,
  recipientEmail: PropTypes.string,
  isInlineVideo: PropTypes.bool,
  showTitleCheckBox: PropTypes.bool
};
GoVideoContainer.defaultProps = {
  trackingHandlers: {},
  isInlineVideo: false,
  showTitleCheckBox: false
};
export default GoVideoContainer;