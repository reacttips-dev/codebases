'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import UILink from 'UIComponents/link/UILink';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIFireAlarm from 'UIComponents/alert/UIFireAlarm';
import UIAlert from 'UIComponents/alert/UIAlert';
import Small from 'UIComponents/elements/Small';
import { RequestStatus, VidyardTosStatus } from 'FileManagerCore/Constants';
import { Panels, DrawerTypes, IMAGE_COLUMN_COUNT, DEFAULT_ROWS_TO_FETCH } from '../../Constants';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import { getTiles } from '../../selectors/Tiles';
import { getTotalFilteredTiles } from '../../utils/Tiles';
import { getFilterType } from '../../selectors/Filter';
import FileExtensionFilters from '../../enums/FileExtensionFilters';
import FilterHintMessage from './FilterHintMessage';
import { shouldVideoLimitBannerRender } from '../../utils/hubLVideo';
import * as Actions from '../../actions/Actions';
import FoldersAndFilesContainer from '../../containers/browser/FoldersAndFilesContainer';
import NoFiles from './NoFiles';
import SearchWithSuggestions from './SearchWithSuggestions';
import PickerVidyardBanner from './PickerVidyardBanner';
import { getUpdateVidyardTosStatus } from 'FileManagerCore/actions/PortalMeta';
import { trackInteraction as _trackInteraction } from 'FileManagerCore/actions/tracking';
import { getHasVideoIntegrationScope, getIsUngatedForPickerFireAlarm, getIsUngatedForHubSpotVideo2 } from 'FileManagerCore/selectors/Auth';
import VideoIsChangingAlert from '../VideoIsChangingAlert';
import { getCanAppeal } from 'FileManagerCore/selectors/Suspension';
import { getIsReadOnlySuspended } from 'FileManagerCore/selectors/Permissions';
import { getAccountVerificationUrl } from 'FileManagerCore/utils/urls';
import { reportError, getCurrentApp } from 'FileManagerCore/utils/logging';
import { getInferredUserRole } from 'FileManagerCore/selectors/IdentityRepository';
import { getVidyardTosStatus, getFileManagerPortalDataUpdateRequestStatus } from 'FileManagerCore/selectors/PortalMeta';
import { getFiles, getFilesTotal, getFetchFilesRequestStatus } from 'FileManagerCore/selectors/Files';
import { getHasUserExceededEmbeddableVideoLimit, getEmbeddableVideoLimit } from 'FileManagerCore/selectors/Limits';
import LoadingFailed from 'FileManagerCore/components/LoadingFailed';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import { getProviderParam, getRedirectToFilesLocation } from '../../utils/network';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FireAlarm from '../../records/FireAlarm';
import { getFireAlarm } from '../../selectors/FireAlarm';
import FireAlarmAlert from './FireAlarmAlert';

function getVideoLimitBannerI18nKey(suffix) {
  return "FileManagerLib.videoLimit.banner." + suffix;
}

var BrowsePanel = /*#__PURE__*/function (_Component) {
  _inherits(BrowsePanel, _Component);

  function BrowsePanel(props) {
    var _this;

    _classCallCheck(this, BrowsePanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowsePanel).call(this, props));
    _this.state = {
      isVideoLimitBannerDismissed: false
    };
    _this.handleCloseVideoLimitBanner = _this.handleCloseVideoLimitBanner.bind(_assertThisInitialized(_this));
    _this.getShouldEmbedVideoLimitBannerRender = _this.getShouldEmbedVideoLimitBannerRender.bind(_assertThisInitialized(_this));
    _this.handleLoadMoreRows = _this.handleLoadMoreRows.bind(_assertThisInitialized(_this));
    _this.fetch = _this.fetch.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BrowsePanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var maybeFetchFolders = this.props.maybeFetchFolders;
      maybeFetchFolders();
    }
  }, {
    key: "handleCloseVideoLimitBanner",
    value: function handleCloseVideoLimitBanner() {
      this.setState({
        isVideoLimitBannerDismissed: true
      });
    }
  }, {
    key: "shouldVidyardBannerRender",
    value: function shouldVidyardBannerRender() {
      var _this$props = this.props,
          type = _this$props.type,
          vidyardTosStatus = _this$props.vidyardTosStatus,
          hasVideoIntegrationScope = _this$props.hasVideoIntegrationScope,
          isUngatedForHubSpotVideo2 = _this$props.isUngatedForHubSpotVideo2;
      return type === DrawerTypes.HUBL_VIDEO && hasVideoIntegrationScope && (vidyardTosStatus !== VidyardTosStatus.ACCEPTED || isUngatedForHubSpotVideo2);
    }
  }, {
    key: "fetch",
    value: function fetch() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _this$props2 = this.props,
          fetchFiles = _this$props2.fetchFiles,
          type = _this$props2.type;
      fetchFiles(Object.assign({}, options, {
        type: type
      }));
    }
  }, {
    key: "getShouldEmbedVideoLimitBannerRender",
    value: function getShouldEmbedVideoLimitBannerRender() {
      var isVideoLimitBannerDismissed = this.state.isVideoLimitBannerDismissed;
      var _this$props3 = this.props,
          hasUserExceededVideoLimit = _this$props3.hasUserExceededVideoLimit,
          type = _this$props3.type;
      return shouldVideoLimitBannerRender({
        isVideoLimitBannerDismissed: isVideoLimitBannerDismissed,
        hasUserExceededVideoLimit: hasUserExceededVideoLimit,
        type: type
      });
    }
  }, {
    key: "getHeading",
    value: function getHeading() {
      var type = this.props.type;

      switch (type) {
        case DrawerTypes.IMAGE:
          return I18n.text('FileManagerLib.panels.recentImages');

        case DrawerTypes.VIDEO:
        case DrawerTypes.HUBL_VIDEO:
          return I18n.text('FileManagerLib.panels.recentVideos');

        case DrawerTypes.DOCUMENT:
          return I18n.text('FileManagerLib.panels.recentDocuments');

        default:
          return I18n.text('FileManagerLib.panels.recentFiles');
      }
    }
  }, {
    key: "handleLoadMoreRows",
    value: function handleLoadMoreRows() {
      var _this$props4 = this.props,
          filesRequestStatus = _this$props4.filesRequestStatus,
          files = _this$props4.files;

      if (filesRequestStatus === RequestStatus.PENDING) {
        return;
      }

      this.fetch({
        offset: files.count()
      });
    }
  }, {
    key: "renderVideoLimitBanner",
    value: function renderVideoLimitBanner(videoLimit) {
      return /*#__PURE__*/_jsx(UIFireAlarm, {
        closeable: true,
        onClose: this.handleCloseVideoLimitBanner,
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getVideoLimitBannerI18nKey('title')
        }),
        type: "warning",
        className: "m-bottom-6",
        children: /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: getVideoLimitBannerI18nKey('message'),
            options: {
              limit: videoLimit,
              nextLimit: 500,
              filesLink: /*#__PURE__*/_jsx(UILink, {
                href: getRedirectToFilesLocation(),
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: getVideoLimitBannerI18nKey('filesLink')
                })
              }, "link-to-files")
            }
          })
        })
      });
    }
  }, {
    key: "renderVidyardBanner",
    value: function renderVidyardBanner() {
      var _this$props5 = this.props,
          inferredUserRole = _this$props5.inferredUserRole,
          _updateVidyardTosStatus = _this$props5.updateVidyardTosStatus,
          isFileManagerPortalDataUpdatePending = _this$props5.isFileManagerPortalDataUpdatePending,
          vidyardTosStatus = _this$props5.vidyardTosStatus,
          total = _this$props5.total,
          isUngatedForHubSpotVideo2 = _this$props5.isUngatedForHubSpotVideo2;

      if (isUngatedForHubSpotVideo2) {
        reportError({
          message: 'HUBL Video picker currently in use still'
        }, {
          app: getCurrentApp()
        });
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerLib.emptyBrowser.video.errorWithPicker"
          }),
          type: "danger"
        });
      }

      return /*#__PURE__*/_jsx(PickerVidyardBanner, {
        hubLVideosCount: total,
        currentVidyardTosStatus: vidyardTosStatus,
        inferredUserRole: inferredUserRole,
        isFileManagerPortalDataUpdatePending: isFileManagerPortalDataUpdatePending,
        updateVidyardTosStatus: function updateVidyardTosStatus(vidyardTosSatus) {
          return _updateVidyardTosStatus(vidyardTosSatus);
        }
      });
    }
  }, {
    key: "renderFiles",
    value: function renderFiles() {
      var _this$props6 = this.props,
          tiles = _this$props6.tiles,
          total = _this$props6.total,
          onInsert = _this$props6.onInsert,
          filesRequestStatus = _this$props6.filesRequestStatus,
          type = _this$props6.type,
          disableUpload = _this$props6.disableUpload,
          previousSelectedFileId = _this$props6.previousSelectedFileId;

      if (filesRequestStatus === RequestStatus.PENDING) {
        return /*#__PURE__*/_jsx(UILoadingOverlay, {
          contextual: true
        });
      }

      if (filesRequestStatus === RequestStatus.FAILED) {
        return /*#__PURE__*/_jsx(LoadingFailed, {});
      }

      if (this.shouldVidyardBannerRender()) {
        return this.renderVidyardBanner(total);
      }

      if (filesRequestStatus === RequestStatus.SUCCEEDED && total === 0) {
        return /*#__PURE__*/_jsx(NoFiles, {
          type: type
        });
      }

      return /*#__PURE__*/_jsx(FoldersAndFilesContainer, {
        type: type,
        tiles: tiles,
        total: total,
        onInsert: onInsert,
        onLoadMoreFiles: this.handleLoadMoreRows,
        disableUpload: disableUpload,
        previousSelectedFileId: previousSelectedFileId
      });
    }
  }, {
    key: "renderSuspensionAlert",
    value: function renderSuspensionAlert() {
      var canAppeal = this.props.canAppeal;
      var accountVerificationUrl = getAccountVerificationUrl();
      return /*#__PURE__*/_jsxs(UIAlert, {
        type: "danger",
        "data-test-id": "picker-suspension-alert",
        className: "m-top-4",
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.suspension.banner.message"
        }), canAppeal && /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: "FileManagerLib.suspension.banner.appealLink_jsx",
          elements: {
            UILink: UILink
          },
          options: {
            accountVerificationUrl: accountVerificationUrl
          }
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          browseFolders = _this$props7.browseFolders,
          type = _this$props7.type,
          isPanelInactive = _this$props7.isPanelInactive,
          videoLimit = _this$props7.videoLimit,
          filterType = _this$props7.filterType,
          isPortalSuspended = _this$props7.isPortalSuspended,
          isUngatedForFireAlarm = _this$props7.isUngatedForFireAlarm,
          fireAlarm = _this$props7.fireAlarm;
      return /*#__PURE__*/_jsxs(UIFlex, {
        direction: "column",
        align: isUngatedForFireAlarm ? 'stretch' : 'start',
        children: [!isPanelInactive && filterType !== FileExtensionFilters.NONE && /*#__PURE__*/_jsx(FilterHintMessage, {
          drawerType: type
        }), fireAlarm && /*#__PURE__*/_jsx(FireAlarmAlert, {
          fireAlarm: fireAlarm,
          trackInteraction: this.props.trackInteraction
        }), type === DrawerTypes.HUBL_VIDEO && /*#__PURE__*/_jsx(VideoIsChangingAlert, {
          wrapperClassName: "m-y-2"
        }), !isPanelInactive && /*#__PURE__*/_jsx(SearchWithSuggestions, {
          type: type
        }), isPortalSuspended && this.renderSuspensionAlert(), /*#__PURE__*/_jsxs(UIBox, {
          className: "m-top-6 flex-column",
          grow: 1,
          alignSelf: "stretch",
          children: [!isPanelInactive && /*#__PURE__*/_jsxs(UIMedia, {
            align: "baseline",
            children: [/*#__PURE__*/_jsx(UIMediaBody, {
              children: /*#__PURE__*/_jsx("h5", {
                children: this.getHeading()
              })
            }), /*#__PURE__*/_jsx(UIMediaRight, {
              children: /*#__PURE__*/_jsx(UILink, {
                onClick: browseFolders,
                "data-test-id": "browse-folders",
                children: /*#__PURE__*/_jsx(Small, {
                  children: I18n.text('FileManagerLib.browseFolders')
                })
              })
            })]
          }), this.getShouldEmbedVideoLimitBannerRender() && this.renderVideoLimitBanner(videoLimit), this.renderFiles()]
        })]
      });
    }
  }]);

  return BrowsePanel;
}(Component);

BrowsePanel.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  files: PropTypes.instanceOf(Immutable.List),
  tiles: PropTypes.instanceOf(Immutable.List),
  filesRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus)),
  total: PropTypes.number.isRequired,
  onInsert: PropTypes.func.isRequired,
  fetchFiles: PropTypes.func.isRequired,
  maybeFetchFolders: PropTypes.func.isRequired,
  browseFolders: PropTypes.func.isRequired,
  hasVideoIntegrationScope: PropTypes.bool.isRequired,
  vidyardTosStatus: PropTypes.oneOf(Object.keys(VidyardTosStatus)).isRequired,
  isFileManagerPortalDataUpdatePending: PropTypes.bool.isRequired,
  inferredUserRole: PropTypes.string.isRequired,
  updateVidyardTosStatus: PropTypes.func.isRequired,
  isPanelInactive: PropTypes.bool.isRequired,
  hasUserExceededVideoLimit: PropTypes.bool.isRequired,
  videoLimit: PropTypes.number.isRequired,
  filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)).isRequired,
  isPortalSuspended: PropTypes.bool.isRequired,
  canAppeal: PropTypes.bool.isRequired,
  disableUpload: PropTypes.bool.isRequired,
  previousSelectedFileId: PropTypes.number,
  isUngatedForFireAlarm: PropTypes.bool.isRequired,
  fireAlarm: PropTypes.instanceOf(FireAlarm),
  trackInteraction: PropTypes.func.isRequired,
  isUngatedForHubSpotVideo2: PropTypes.bool.isRequired
};
BrowsePanel.defaultProps = {
  isPanelInactive: false
};

var mapStateToProps = function mapStateToProps(state, props) {
  var files = getFiles(state);
  var tiles = getTiles(state, props);
  return {
    files: files,
    tiles: tiles,
    total: getTotalFilteredTiles({
      savedFilesCount: getFilesTotal(state),
      files: files,
      tiles: tiles
    }),
    filterType: getFilterType(state),
    filesRequestStatus: getFetchFilesRequestStatus(state),
    hasVideoIntegrationScope: getHasVideoIntegrationScope(state),
    vidyardTosStatus: getVidyardTosStatus(state),
    isFileManagerPortalDataUpdatePending: getFileManagerPortalDataUpdateRequestStatus(state) === RequestStatus.PENDING,
    inferredUserRole: getInferredUserRole(state),
    hasUserExceededVideoLimit: getHasUserExceededEmbeddableVideoLimit(state),
    videoLimit: getEmbeddableVideoLimit(state),
    isPortalSuspended: getIsReadOnlySuspended(state),
    canAppeal: getCanAppeal(state),
    isUngatedForFireAlarm: getIsUngatedForPickerFireAlarm(state),
    fireAlarm: getFireAlarm(state),
    isUngatedForHubSpotVideo2: getIsUngatedForHubSpotVideo2(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    browseFolders: function browseFolders() {
      dispatch(Actions.setPanel({
        activePanel: Panels.FOLDER,
        selectedFolder: getHomeFolder()
      }));
    },
    maybeFetchFolders: function maybeFetchFolders() {
      dispatch(Actions.maybeFetchFolders());
    },
    fetchFiles: function fetchFiles(options) {
      var initial = options.initial,
          queryOpts = _objectWithoutProperties(options, ["initial"]);

      var query = Object.assign({
        limit: DEFAULT_ROWS_TO_FETCH * IMAGE_COLUMN_COUNT
      }, queryOpts, {}, getProviderParam(ownProps.type));

      if (initial) {
        dispatch(Actions.fetchInitialFiles(query, ownProps.type));
      } else {
        dispatch(Actions.fetchMoreFiles(query, ownProps.type));
      }
    },
    updateVidyardTosStatus: function updateVidyardTosStatus(status) {
      return dispatch(getUpdateVidyardTosStatus(status));
    },
    trackInteraction: function trackInteraction() {
      return dispatch(_trackInteraction.apply(void 0, arguments));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowsePanel);