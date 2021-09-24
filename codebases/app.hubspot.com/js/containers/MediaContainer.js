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
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { connect } from 'react-redux';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIImage from 'UIComponents/image/UIImage';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIAlert from 'UIComponents/alert/UIAlert';
import { closeMedia } from '../redux/actions/ui';
import { downloadFromUrl } from '../redux/actions/content';
import { trackInteraction } from '../redux/actions/usage';
import { mediaProp } from '../lib/propTypes';
import { MEDIA_PROVIDER } from '../lib/constants';

var mapStateToProps = function mapStateToProps(state) {
  return {
    media: state.media,
    portalId: state.portal.portal_id
  };
};

var mapDispatchToProps = {
  closeMedia: closeMedia,
  downloadFromUrl: downloadFromUrl,
  trackInteraction: trackInteraction
};

var MediaContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(MediaContainer, _PureComponent);

  function MediaContainer() {
    var _this;

    _classCallCheck(this, MediaContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaContainer).call(this));

    _this.onClose = function () {
      _this.props.closeMedia();
    };

    _this.onClickDownload = function () {
      var opts = {
        folderPath: 'social media saved',
        name: _this.props.media.name
      };

      _this.props.downloadFromUrl(_this.props.media.fullUrl, opts).then(function (downloadedFile) {
        _this.setState({
          downloading: false,
          downloadedFile: downloadedFile
        });
      });

      _this.setState({
        downloading: true
      });

      _this.props.trackInteraction('save to file manager');
    };

    _this.state = {
      downloading: false
    };
    return _this;
  }

  _createClass(MediaContainer, [{
    key: "renderMedia",
    value: function renderMedia() {
      var _this2 = this;

      var media = this.props.media;

      if (media.provider && media.providerId) {
        var embedSrc;

        if (media.provider === MEDIA_PROVIDER.youtube) {
          embedSrc = "https://www.youtube.com/embed/" + media.providerId;
        } else if (media.provider === MEDIA_PROVIDER.vimeo) {
          embedSrc = "https://player.vimeo.com/video/" + media.providerId;
        }

        if (embedSrc) {
          return /*#__PURE__*/_jsx("iframe", {
            frameBorder: "0",
            src: embedSrc
          });
        }
      }

      if (!media.fullUrl) {
        return null;
      }

      if (media.isVideo()) {
        return /*#__PURE__*/_jsx("video", {
          onPlay: function onPlay() {
            return _this2.props.trackInteraction('play video');
          },
          src: media.fullUrl,
          controls: true
        });
      }

      return /*#__PURE__*/_jsx(UIImage, {
        src: media.fullUrl
      });
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      if (this.props.media.provider) {
        return null;
      }

      if (this.state.downloading) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        });
      }

      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          onClick: this.onClickDownload,
          children: I18n.text('sui.mediaPanel.footer.saveToFileManager')
        })
      });
    }
  }, {
    key: "renderPanel",
    value: function renderPanel() {
      var _this3 = this;

      if (!this.props.media) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIPanel, {
        className: "media-panel",
        width: 800,
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: this.onClose
        }), /*#__PURE__*/_jsx(UIPanelHeader, {
          children: /*#__PURE__*/_jsx("h4", {
            children: I18n.text('sui.mediaPanel.header')
          })
        }), /*#__PURE__*/_jsx(UIPanelBody, {
          className: "body",
          children: /*#__PURE__*/_jsxs(UIPanelSection, {
            children: [this.state.downloadedFile && /*#__PURE__*/_jsx(UIAlert, {
              className: "alert-success",
              use: "success",
              closeable: true,
              onClose: function onClose() {
                return _this3.setState({
                  downloadedFile: null
                });
              },
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "sui.mediaPanel.downloaded",
                options: {
                  fileName: this.state.downloadedFile.name,
                  url: "/file-manager-beta/" + this.props.portalId + "/folder/social%20media%20saved"
                }
              })
            }), this.renderMedia()]
          })
        }), /*#__PURE__*/_jsx(UIPanelFooter, {
          children: this.renderFooter()
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("div", {
        className: "media-container",
        children: this.renderPanel()
      });
    }
  }]);

  return MediaContainer;
}(PureComponent);

MediaContainer.propTypes = {
  media: mediaProp,
  portalId: PropTypes.number,
  closeMedia: PropTypes.func,
  initBroadcastGroup: PropTypes.func,
  downloadFromUrl: PropTypes.func,
  trackInteraction: PropTypes.func.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(MediaContainer);