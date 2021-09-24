'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIImage from 'UIComponents/image/UIImage';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIList from 'UIComponents/list/UIList';
import UISection from 'UIComponents/section/UISection';
import Small from 'UIComponents/elements/Small';
import { ShutterstockFolderName, RequestStatus } from 'FileManagerCore/Constants';
import { resize } from 'FileManagerCore/utils/resize';
import { scaleToFit } from 'FileManagerCore/utils/image';
import { acceptShutterstockTos, setShutterstockFolderId } from 'FileManagerCore/actions/PortalMeta';
import ShutterstockPreviewModal from 'FileManagerCore/components/ShutterstockPreviewModal';
import InternalShutterstockLicenseAgreement from 'FileManagerCore/components/InternalShutterstockLicenseAgreement';
import { getShutterstockFolder, getAcquireStatus } from 'FileManagerCore/selectors/Shutterstock';
import { getShutterstockTosAccepted } from 'FileManagerCore/selectors/UserSettings';
import { trackInteraction } from '../../actions/Actions';
import { acquireImage } from '../../actions/Shutterstock';
var WIDTH = 380;
var ARROW_WIDTH = 16;

var ShutterstockDetail = /*#__PURE__*/function (_Component) {
  _inherits(ShutterstockDetail, _Component);

  function ShutterstockDetail(props) {
    var _this;

    _classCallCheck(this, ShutterstockDetail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShutterstockDetail).call(this, props));
    _this.state = {};
    _this.handleCloseButtonClick = _this.handleCloseButtonClick.bind(_assertThisInitialized(_this));
    _this.handleInsert = _this.handleInsert.bind(_assertThisInitialized(_this));
    _this.handlePreview = _this.handlePreview.bind(_assertThisInitialized(_this));
    _this.handleAcquire = _this.handleAcquire.bind(_assertThisInitialized(_this));
    _this.handleChangeFolder = _this.handleChangeFolder.bind(_assertThisInitialized(_this));
    _this.handleClose = _this.handleClose.bind(_assertThisInitialized(_this));
    _this.handleAgree = _this.handleAgree.bind(_assertThisInitialized(_this));
    _this.closePreview = _this.closePreview.bind(_assertThisInitialized(_this));
    _this.insert = _this.insert.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ShutterstockDetail, [{
    key: "closePreview",
    value: function closePreview() {
      this.setState({
        showAgreement: false,
        showPreview: false
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose() {
      this.closePreview();
    }
  }, {
    key: "handlePreview",
    value: function handlePreview() {
      this.setState({
        showPreview: true
      });
    }
  }, {
    key: "handleChangeFolder",
    value: function handleChangeFolder(folder) {
      var onSetShutterstockFolderId = this.props.onSetShutterstockFolderId;
      onSetShutterstockFolderId(folder.get('id'));
    }
  }, {
    key: "handleAgree",
    value: function handleAgree() {
      var onAcceptShutterstockTos = this.props.onAcceptShutterstockTos;
      this.closePreview();
      onAcceptShutterstockTos();
      this.insert();
    }
  }, {
    key: "handleAcquire",
    value: function handleAcquire() {
      this.closePreview();
      this.handleInsert();
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      var tile = this.props.tile;
      var image = tile.get('image');

      if (!image.get('width') || !image.get('height')) {
        return null;
      }

      return image.get('width') + " x " + image.get('height') + " px";
    }
  }, {
    key: "getImageSrc",
    value: function getImageSrc(image) {
      var url = image.get('largePreviewUrl');
      return resize(url, {
        width: WIDTH * 2
      });
    }
  }, {
    key: "handleCloseButtonClick",
    value: function handleCloseButtonClick() {
      var onClose = this.props.onClose;
      onClose({
        target: 'close-button'
      });
    }
  }, {
    key: "handleInsert",
    value: function handleInsert() {
      var shutterstockTosAccepted = this.props.shutterstockTosAccepted;

      if (!shutterstockTosAccepted) {
        this.setState({
          showAgreement: true
        });
      } else {
        this.insert();
      }
    }
  }, {
    key: "insert",
    value: function insert() {
      var _this2 = this;

      var _this$props = this.props,
          tile = _this$props.tile,
          onAcquire = _this$props.onAcquire,
          onTrackInteraction = _this$props.onTrackInteraction,
          onClose = _this$props.onClose,
          onInsert = _this$props.onInsert,
          shutterstockFolder = _this$props.shutterstockFolder;
      var image = tile.get('image');
      var title = image.get('title');
      var shutterstockId = image.get('id');
      this.setState({
        saving: true
      });
      var folderId;

      if (shutterstockFolder) {
        folderId = shutterstockFolder.get('id');
      }

      onTrackInteraction('Browse Shutterstock', 'clicked-save-to-files');
      onAcquire(shutterstockId, title, folderId).then(function (file) {
        _this2.setState({
          saving: false
        });

        onClose();
        onInsert(file);
      }).catch(function () {
        _this2.setState({
          saving: false,
          failed: true
        });
      });
    }
  }, {
    key: "renderArrow",
    value: function renderArrow(tile) {
      var arrowX = tile.get('arrowX');
      return /*#__PURE__*/_jsx("div", {
        className: "file-detail__arrow",
        style: {
          left: arrowX - ARROW_WIDTH * 0.5
        }
      });
    }
  }, {
    key: "renderTitle",
    value: function renderTitle(image) {
      return /*#__PURE__*/_jsx("p", {
        className: "m-right-4",
        children: image.get('title')
      });
    }
  }, {
    key: "renderImage",
    value: function renderImage(image) {
      var dimensions = scaleToFit(image, WIDTH);
      return /*#__PURE__*/_jsx("div", {
        className: "file-detail__image-wrapper m-bottom-4",
        children: /*#__PURE__*/_jsx(UIImage, Object.assign({
          className: "file-detail__image",
          src: this.getImageSrc(image),
          responsive: false,
          draggable: false
        }, dimensions))
      });
    }
  }, {
    key: "renderInsertButton",
    value: function renderInsertButton() {
      return /*#__PURE__*/_jsx(UILoadingButton, {
        use: "primary",
        preventClicksOnLoading: true,
        loading: this.state.saving || false,
        failed: this.state.failed || false,
        onClick: this.handleInsert,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.actions.insert"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          tile = _this$props2.tile,
          shutterstockFolder = _this$props2.shutterstockFolder,
          onTrackInteraction = _this$props2.onTrackInteraction,
          shutterstockTosAccepted = _this$props2.shutterstockTosAccepted,
          acquireStatus = _this$props2.acquireStatus;
      var _this$state = this.state,
          showPreview = _this$state.showPreview,
          showAgreement = _this$state.showAgreement;
      var image = tile.get('image');
      var dimensions = this.getDimensions();
      return /*#__PURE__*/_jsx("div", {
        ref: function ref(c) {
          _this3.wrapper = c;
        },
        className: "file-detail with-panel-navigator",
        children: /*#__PURE__*/_jsxs("div", {
          className: "file-detail__wrapper",
          children: [this.renderTitle(image), this.renderImage(image), /*#__PURE__*/_jsx(UIList, {
            className: "file-detail__meta m-bottom-4",
            children: dimensions && /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.fileDetail.dimensions",
                options: {
                  dimensions: dimensions
                }
              })
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "flex-wrap justify-start",
            children: /*#__PURE__*/_jsx(UIButton, {
              use: "link",
              onClick: this.handlePreview,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.panels.tabs.shutterstock.actions.previewLink"
              })
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [showAgreement && /*#__PURE__*/_jsx(InternalShutterstockLicenseAgreement, {
              onCancel: this.handleClose,
              onClose: this.handleClose,
              onAgreeCallback: this.handleAcquire
            }), showPreview && /*#__PURE__*/_jsx(ShutterstockPreviewModal, {
              image: image,
              shutterstockFolder: shutterstockFolder,
              onChangeFolder: this.handleChangeFolder,
              onAcquire: this.insert,
              onAgree: this.handleAgree,
              onClose: this.handleClose,
              onTrackInteraction: onTrackInteraction,
              shutterstockTosAccepted: shutterstockTosAccepted,
              acquireRequestStatus: acquireStatus
            })]
          }), /*#__PURE__*/_jsx(UISection, {
            className: "m-y-3",
            children: /*#__PURE__*/_jsx(Small, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "FileManagerLib.panels.tabs.shutterstock.copyInformation",
                options: {
                  stockFolder: shutterstockFolder ? shutterstockFolder.get('name') : ShutterstockFolderName
                }
              })
            })
          })]
        })
      });
    }
  }]);

  return ShutterstockDetail;
}(Component);

ShutterstockDetail.propTypes = {
  tile: PropTypes.instanceOf(Immutable.Map).isRequired,
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onAcquire: PropTypes.func.isRequired,
  onAcceptShutterstockTos: PropTypes.func.isRequired,
  onSetShutterstockFolderId: PropTypes.func.isRequired,
  shutterstockFolder: PropTypes.instanceOf(Immutable.Map),
  shutterstockTosAccepted: PropTypes.bool.isRequired,
  onTrackInteraction: PropTypes.func.isRequired,
  acquireStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    shutterstockTosAccepted: getShutterstockTosAccepted(state),
    shutterstockFolder: getShutterstockFolder(state),
    acquireStatus: getAcquireStatus(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onAcquire: function onAcquire(shutterstockId, filename, folderId, onSuccess, onError) {
      return dispatch(acquireImage(shutterstockId, filename, folderId, onSuccess, onError));
    },
    onAcceptShutterstockTos: function onAcceptShutterstockTos() {
      dispatch(acceptShutterstockTos());
    },
    onSetShutterstockFolderId: function onSetShutterstockFolderId(folderId) {
      dispatch(setShutterstockFolderId(folderId));
    },
    onTrackInteraction: function onTrackInteraction(name, action, meta) {
      dispatch(trackInteraction(name, action, meta));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShutterstockDetail);