'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { FILE_VISIBILITY_HELP_LINK } from '../constants/ExternalLinks';
export var getAnimatedGifVideoThumbnailFailureNotification = function getAnimatedGifVideoThumbnailFailureNotification() {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.animatedGifVideoThumbnail.error.title'),
    message: I18n.text('FileManagerCore.notifications.animatedGifVideoThumbnail.error.message')
  };
};
export var getVideoThumbnailNetworkRequestFailedNotification = function getVideoThumbnailNetworkRequestFailedNotification() {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.videoThumbnail.error.title'),
    message: I18n.text('FileManagerCore.notifications.videoThumbnail.error.message')
  };
};
export var getThumbnailFolderNetworkRequestFailedNotification = function getThumbnailFolderNetworkRequestFailedNotification() {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.videoThumbnailFolder.error.title'),
    message: I18n.text('FileManagerCore.notifications.videoThumbnailFolder.error.message')
  };
};
export var getFetchSignedURLFailedNotification = function getFetchSignedURLFailedNotification() {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.fetchSignedURL.error.title'),
    message: I18n.text('FileManagerCore.notifications.fetchSignedURL.error.message')
  };
};
export var getFetchHubUsersFailedNotification = function getFetchHubUsersFailedNotification() {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.fetchHubUsers.error.title'),
    message: I18n.text('FileManagerCore.notifications.fetchHubUsers.error.message')
  };
};
export var getCanvaDownloadFailedNotification = function getCanvaDownloadFailedNotification(fileName) {
  return {
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.downloadFromCanva.error.title'),
    message: I18n.text('FileManagerCore.notifications.downloadFromCanva.error.message', {
      fileName: fileName
    })
  };
};
export var getSuccessNotification = function getSuccessNotification(notificationKey) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'success' : _ref$type;

  return {
    type: type,
    titleText: I18n.text("FileManagerCore.notifications." + notificationKey + "." + type + ".title"),
    message: I18n.text("FileManagerCore.notifications." + notificationKey + "." + type + ".message")
  };
};

var getReadOnlyReasonKey = function getReadOnlyReasonKey(reason) {
  return "FileManagerCore.permissions.readOnlyReason." + reason;
};

export var getReadOnlyPermissionCopy = function getReadOnlyPermissionCopy(readOnlyReason) {
  return I18n.lookup(getReadOnlyReasonKey(readOnlyReason));
};
export var getReadOnlyPermissionMessaging = function getReadOnlyPermissionMessaging(readOnlyReason) {
  var copyInfo = getReadOnlyPermissionCopy(readOnlyReason);

  if (!copyInfo) {
    return copyInfo;
  }

  var messaging = {};
  Object.keys(copyInfo).forEach(function (key) {
    messaging[key] = /*#__PURE__*/_jsx(FormattedMessage, {
      message: getReadOnlyReasonKey(readOnlyReason) + "." + key
    });
  });
  return messaging;
};
export var getFileUploadSuccessAlert = function getFileUploadSuccessAlert(fileVisibility, count, onClick) {
  return {
    'data-test-id': 'file-upload-success-alert',
    type: 'success',
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.upload.success.title",
      options: {
        visibility: I18n.text("FileManagerCore.alerts.fileAccess." + fileVisibility),
        count: count
      }
    }),
    message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "FileManagerCore.alerts.upload.success.text_jsx",
      elements: {
        UILink: UILink
      },
      options: {
        fileVisibilityLink: FILE_VISIBILITY_HELP_LINK,
        onClick: onClick
      }
    })
  };
};
export var getHublVideoUploadSuccessAlert = function getHublVideoUploadSuccessAlert(count) {
  return {
    type: 'success',
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.upload.success.hublVideo.title",
      options: {
        count: count
      }
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.upload.success.hublVideo.message"
    })
  };
};
export var partitioningAlerts = {
  success: {
    type: 'success',
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.folderPartitioning.success.title"
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.folderPartitioning.success.message"
    })
  },
  error: {
    type: 'danger',
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerCore.alerts.folderPartitioning.error.title"
    })
  }
};
export var FetchEmbedCodeFailedNotification = {
  type: 'danger',
  titleText: /*#__PURE__*/_jsx(FormattedMessage, {
    message: 'FileManagerDashboard.notifications.fetchEmbedCode.error.title'
  }),
  message: /*#__PURE__*/_jsx(FormattedMessage, {
    message: 'FileManagerDashboard.notifications.fetchEmbedCode.error.message'
  })
};