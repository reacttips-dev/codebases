'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _validators;

import I18n from 'I18n';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isImage, getIsVideoSelectedForUpload, getIsDocumentSelectedForUpload } from 'FileManagerCore/utils/file';
import { DrawerTypes } from '../Constants';
export var validateImage = function validateImage(file) {
  if (!isImage(file)) {
    FloatingAlertStore.addAlert({
      type: 'danger',
      titleText: I18n.text('FileManagerLib.notifications.upload.expectedImage.title'),
      message: I18n.text('FileManagerLib.notifications.upload.expectedImage.message', {
        filename: file.name
      })
    });
    return false;
  }

  return true;
};
export var validateVideo = function validateVideo(file) {
  if (!getIsVideoSelectedForUpload(file)) {
    FloatingAlertStore.addAlert({
      type: 'danger',
      titleText: I18n.text('FileManagerLib.notifications.upload.expectedVideo.title'),
      message: I18n.text('FileManagerLib.notifications.upload.expectedVideo.message', {
        filename: file.name
      })
    });
    return false;
  }

  return true;
};
export var validateDocument = function validateDocument(file) {
  if (!getIsDocumentSelectedForUpload(file)) {
    FloatingAlertStore.addAlert({
      type: 'danger',
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerLib.notifications.upload.expectedDocument.title"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerLib.notifications.upload.expectedDocument.message",
        options: {
          filename: file.name
        }
      })
    });
    return false;
  }

  return true;
};
export var validators = (_validators = {}, _defineProperty(_validators, DrawerTypes.IMAGE, validateImage), _defineProperty(_validators, DrawerTypes.VIDEO, validateVideo), _defineProperty(_validators, DrawerTypes.HUBL_VIDEO, validateVideo), _defineProperty(_validators, DrawerTypes.DOCUMENT, validateDocument), _validators);
export var getValidator = function getValidator(type) {
  return validators[type] || null;
};