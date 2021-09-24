'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { callIfPossible } from 'UIComponents/core/Functions';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import FormattedMessage from 'I18n/components/FormattedMessage';
import GoVideoDialog from './GoVideoDialog';
import GoVideoPopover from './GoVideoPopover';
import SmallToggleButton from './SmallToggleButton';
import { fetchUserSetting, saveUserSetting } from '../api/UserSettingsApi';
import createUnstyledPluginButton from '../utils/createUnstyledPluginButton';
import { VIDEO_CONSTANTS } from '../lib/constants';
var ACADEMY_RESOURCES_URL = 'https://academy.hubspot.com/lessons/personalized-video';
var HAS_VIEWED_VIDEO_INTEGRATION_SHEPHERD = VIDEO_CONSTANTS.HAS_VIEWED_VIDEO_INTEGRATION_SHEPHERD;
export var createInsertVideoButton = function createInsertVideoButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$useUnstyledButto = _ref.useUnstyledButton,
      useUnstyledButton = _ref$useUnstyledButto === void 0 ? false : _ref$useUnstyledButto,
      _ref$useInsertPopover = _ref.useInsertPopover,
      useInsertPopover = _ref$useInsertPopover === void 0 ? false : _ref$useInsertPopover,
      _ref$insertPopoverPla = _ref.insertPopoverPlacement,
      insertPopoverPlacement = _ref$insertPopoverPla === void 0 ? 'top left' : _ref$insertPopoverPla,
      _ref$usePopover = _ref.usePopover,
      usePopover = _ref$usePopover === void 0 ? false : _ref$usePopover,
      _ref$shepherdUserSett = _ref.shepherdUserSettingKey,
      shepherdUserSettingKey = _ref$shepherdUserSett === void 0 ? HAS_VIEWED_VIDEO_INTEGRATION_SHEPHERD : _ref$shepherdUserSett,
      _ref$handleVideoTrack = _ref.handleVideoTracking,
      handleVideoTracking = _ref$handleVideoTrack === void 0 ? {} : _ref$handleVideoTrack,
      _ref$isInlineVideo = _ref.isInlineVideo,
      isInlineVideo = _ref$isInlineVideo === void 0 ? false : _ref$isInlineVideo,
      _ref$showTitleCheckBo = _ref.showTitleCheckBox,
      showTitleCheckBox = _ref$showTitleCheckBo === void 0 ? false : _ref$showTitleCheckBo;

  var TICKET_OBJECT_TYPE = 'TICKET';

  var InsertVideoButton = /*#__PURE__*/function (_PureComponent) {
    _inherits(InsertVideoButton, _PureComponent);

    function InsertVideoButton(props) {
      var _this;

      _classCallCheck(this, InsertVideoButton);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(InsertVideoButton).call(this, props));
      _this.handleClose = _this.handleClose.bind(_assertThisInitialized(_this));
      _this.handleOpen = _this.handleOpen.bind(_assertThisInitialized(_this));
      _this.renderShepherdPopoverContent = _this.renderShepherdPopoverContent.bind(_assertThisInitialized(_this));
      _this.handleOpenFromShepherdPopover = _this.handleOpenFromShepherdPopover.bind(_assertThisInitialized(_this));
      _this.handleCloseShepherdPopover = _this.handleCloseShepherdPopover.bind(_assertThisInitialized(_this));
      _this.trackingTimeout = null;
      _this.state = {
        hasSeenVideoIntegrationShepherd: true,
        open: false
      };
      return _this;
    }

    _createClass(InsertVideoButton, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        fetchUserSetting(shepherdUserSettingKey).then(function (_ref2) {
          var hasSeenVideoShepherd = _ref2.hasSeenVideoShepherd;
          var hasSeenVideoIntegrationShepherd = hasSeenVideoShepherd == null ? false : hasSeenVideoShepherd;

          _this2.setState({
            hasSeenVideoIntegrationShepherd: hasSeenVideoIntegrationShepherd
          });
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.trackingTimeout) {
          window.clearTimeout(this.trackingTimeout);
        }
      }
    }, {
      key: "handleOpenFromShepherdPopover",
      value: function handleOpenFromShepherdPopover() {
        callIfPossible(handleVideoTracking.openVidyardModalFromShepherd);
        this.handleOpen();
        this.handleHasSeenVideoIntegrationShepherd();
      }
    }, {
      key: "handleCloseShepherdPopover",
      value: function handleCloseShepherdPopover() {
        callIfPossible(handleVideoTracking.closeShepherdPopover);
        this.handleHasSeenVideoIntegrationShepherd();
      }
    }, {
      key: "handleHasSeenVideoIntegrationShepherd",
      value: function handleHasSeenVideoIntegrationShepherd() {
        var _this3 = this;

        if (this.state.hasSeenVideoIntegrationShepherd) {
          return;
        }

        saveUserSetting(shepherdUserSettingKey, 'hasSeenVideoShepherd', true).then(function () {
          return _this3.setState({
            hasSeenVideoIntegrationShepherd: true
          });
        });
      }
    }, {
      key: "handleClose",
      value: function handleClose() {
        if (this.trackingTimeout) {
          window.clearTimeout(this.trackingTimeout);
        }

        this.setState({
          open: false
        });
      }
    }, {
      key: "handleOpen",
      value: function handleOpen() {
        if (!this.state.hasSeenVideoIntegrationShepherd) {
          this.trackingTimeout = setTimeout(function () {
            return callIfPossible(handleVideoTracking.vidyardModalOpen10Secs);
          }, 10000);
        }

        this.setState(function (_ref3) {
          var open = _ref3.open;
          return {
            open: !open
          };
        });
        callIfPossible(handleVideoTracking.openedVideo);
      }
    }, {
      key: "renderShepherdPopoverContent",
      value: function renderShepherdPopoverContent() {
        return {
          header: /*#__PURE__*/_jsx("h4", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.videoPlugin.popover.header"
            })
          }),
          body: /*#__PURE__*/_jsxs("span", {
            children: [/*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.videoPlugin.popover.body"
            }), ' ', /*#__PURE__*/_jsx(UILink, {
              href: ACADEMY_RESOURCES_URL,
              target: "_blank",
              onClick: function onClick() {
                return callIfPossible(handleVideoTracking.clickAcademyResources);
              },
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.videoPlugin.popover.bodyLink"
              })
            })]
          }),
          footer: /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(UIButton, {
              use: "primary",
              onClick: this.handleOpenFromShepherdPopover,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.videoPlugin.popover.acceptButton"
              })
            }), /*#__PURE__*/_jsx(UIButton, {
              onClick: this.handleCloseShepherdPopover,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.videoPlugin.popover.closeButton"
              })
            })]
          })
        };
      }
    }, {
      key: "renderButton",
      value: function renderButton() {
        var hideVideoShepherd = this.props.hideVideoShepherd;
        var hasSeenVideoIntegrationShepherd = this.state.hasSeenVideoIntegrationShepherd;

        if (useUnstyledButton) {
          var text = /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.videoPlugin.video"
          });

          var Button = createUnstyledPluginButton({
            text: text
          });
          return /*#__PURE__*/_jsx(Button, {
            onClick: this.handleOpen
          });
        }

        if (usePopover && !hasSeenVideoIntegrationShepherd && !hideVideoShepherd) {
          return /*#__PURE__*/_jsx(UIPopover, {
            use: "shepherd",
            width: 400,
            open: true,
            content: this.renderShepherdPopoverContent(),
            children: /*#__PURE__*/_jsx(UIButton, {
              use: "unstyled",
              children: /*#__PURE__*/_jsx(UIIcon, {
                name: "insertVideo"
              })
            })
          });
        }

        return /*#__PURE__*/_jsx(SmallToggleButton, {
          active: false,
          icon: "insertVideo",
          onClick: this.handleOpen,
          tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.videoPlugin.tooltip"
          }),
          tooltipPlacement: "bottom"
        });
      }
    }, {
      key: "renderModal",
      value: function renderModal() {
        var _this$props = this.props,
            editorState = _this$props.editorState,
            objectType = _this$props.objectType,
            onChange = _this$props.onChange,
            recipientEmail = _this$props.recipientEmail;

        if (!this.state.open) {
          return null;
        }

        return /*#__PURE__*/_jsx(GoVideoDialog, {
          editorState: editorState,
          isInServiceHub: objectType === TICKET_OBJECT_TYPE,
          onClose: this.handleClose,
          onChange: onChange,
          trackingHandlers: handleVideoTracking,
          recipientEmail: recipientEmail,
          isInlineVideo: isInlineVideo,
          showTitleCheckBox: showTitleCheckBox
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            editorState = _this$props2.editorState,
            onChange = _this$props2.onChange,
            recipientEmail = _this$props2.recipientEmail;
        var open = this.state.open;
        var className = useUnstyledButton ? 'video-plugin-button-wrapper' : '';

        if (useInsertPopover) {
          return /*#__PURE__*/_jsx("div", {
            className: className,
            children: /*#__PURE__*/_jsx(GoVideoPopover, {
              recipientEmail: recipientEmail,
              editorState: editorState,
              isInServiceHub: this.props.objectType === TICKET_OBJECT_TYPE,
              onChange: onChange,
              onClose: this.handleClose,
              open: open,
              placement: insertPopoverPlacement,
              trackingHandlers: handleVideoTracking,
              isInlineVideo: isInlineVideo,
              showTitleCheckBox: showTitleCheckBox,
              children: this.renderButton()
            })
          });
        }

        return /*#__PURE__*/_jsxs("div", {
          className: className,
          children: [this.renderButton(), this.renderModal()]
        });
      }
    }]);

    return InsertVideoButton;
  }(PureComponent);

  InsertVideoButton.defaultProps = {
    hideVideoShepherd: false
  };
  return InsertVideoButton;
};