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
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import VidyardTermsOfServiceModal from 'FileManagerCore/components/VidyardTermsOfServiceModal';
import UIImage from 'UIComponents/image/UIImage';
import emptyDashboardUrl from 'bender-url!FileManagerImages/images/empty-dashboard.svg';
import { trackInteraction } from '../../actions/Actions';
import { wrapTrackHubLVideoInteraction } from 'FileManagerCore/utils/hubLVideo';
import { VidyardTosStatus } from 'FileManagerCore/Constants';

function getI18nKey(suffix) {
  return "FileManagerLib.vidyardPickerBanner." + suffix;
}

var PickerVidyardBanner = /*#__PURE__*/function (_Component) {
  _inherits(PickerVidyardBanner, _Component);

  function PickerVidyardBanner(props) {
    var _this;

    _classCallCheck(this, PickerVidyardBanner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PickerVidyardBanner).call(this, props));
    _this.state = {
      isVidyardTermsOfServiceModalOpen: false
    };
    return _this;
  }

  _createClass(PickerVidyardBanner, [{
    key: "openVidyardTosModal",
    value: function openVidyardTosModal() {
      this.setState({
        isVidyardTermsOfServiceModalOpen: true
      });
    }
  }, {
    key: "closeVidyardTosModal",
    value: function closeVidyardTosModal() {
      this.setState({
        isVidyardTermsOfServiceModalOpen: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          isFileManagerPortalDataUpdatePending = _this$props.isFileManagerPortalDataUpdatePending,
          updateVidyardTosStatus = _this$props.updateVidyardTosStatus,
          inferredUserRole = _this$props.inferredUserRole,
          currentVidyardTosStatus = _this$props.currentVidyardTosStatus,
          dispatchTrackInteraction = _this$props.dispatchTrackInteraction,
          hubLVideosCount = _this$props.hubLVideosCount;
      var isVidyardTermsOfServiceModalOpen = this.state.isVidyardTermsOfServiceModalOpen;
      return /*#__PURE__*/_jsxs("div", {
        className: "text-center m-y-5",
        children: [/*#__PURE__*/_jsx(UIImage, {
          className: "m-y-10",
          width: 180,
          src: emptyDashboardUrl,
          responsive: false
        }), /*#__PURE__*/_jsx("h5", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('title')
          })
        }), /*#__PURE__*/_jsx("p", {
          children: currentVidyardTosStatus === VidyardTosStatus.ACCEPTED && hubLVideosCount === 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('message.noVideos')
          }) : /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('message.tosMessage')
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: function onClick() {
            return _this2.openVidyardTosModal();
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('enableVidyard')
          })
        }), isVidyardTermsOfServiceModalOpen && /*#__PURE__*/_jsx(VidyardTermsOfServiceModal, {
          inferredUserRole: inferredUserRole,
          updateVidyardTosStatus: updateVidyardTosStatus,
          isLoading: isFileManagerPortalDataUpdatePending,
          onClose: function onClose() {
            return _this2.closeVidyardTosModal();
          },
          trackInteraction: wrapTrackHubLVideoInteraction(dispatchTrackInteraction)
        })]
      });
    }
  }]);

  return PickerVidyardBanner;
}(Component);

PickerVidyardBanner.propTypes = {
  hubLVideosCount: PropTypes.number.isRequired,
  currentVidyardTosStatus: PropTypes.oneOf(Object.keys(VidyardTosStatus)).isRequired,
  isFileManagerPortalDataUpdatePending: PropTypes.bool.isRequired,
  updateVidyardTosStatus: PropTypes.func.isRequired,
  inferredUserRole: PropTypes.string.isRequired,
  dispatchTrackInteraction: PropTypes.func.isRequired
};
var mapDispatchToProps = {
  dispatchTrackInteraction: trackInteraction
};
export default connect(null, mapDispatchToProps)(PickerVidyardBanner);