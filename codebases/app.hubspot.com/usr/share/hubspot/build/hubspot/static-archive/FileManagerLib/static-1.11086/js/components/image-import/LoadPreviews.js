'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { getCrawlId, getIsValidatingImages } from '../../selectors/BulkImageImport';
import { pollCrawlUriForImages } from '../../actions/BulkImageImport';

var PollingMessage = function PollingMessage() {
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "FileManagerLib.panels.bulkImageImport.preview.pollingMessage"
  });
};

var ValidationMessage = function ValidationMessage() {
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "FileManagerLib.panels.bulkImageImport.preview.validationMessage"
  });
};

var Polling = function Polling() {
  var dispatch = useDispatch();
  var crawlId = useSelector(getCrawlId);
  useEffect(function () {
    var timer = setInterval(function () {
      dispatch(pollCrawlUriForImages(crawlId));
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, [crawlId, dispatch]);
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    size: "small",
    grow: true,
    label: /*#__PURE__*/_jsx(PollingMessage, {}),
    showLabel: true
  });
};

var Validating = function Validating() {
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    size: "small",
    grow: true,
    label: /*#__PURE__*/_jsx(ValidationMessage, {}),
    showLabel: true
  });
};

var LoadPreviews = function LoadPreviews() {
  var isValidatingImages = useSelector(getIsValidatingImages);
  return /*#__PURE__*/_jsx(_Fragment, {
    children: isValidatingImages ? /*#__PURE__*/_jsx(Validating, {}) : /*#__PURE__*/_jsx(Polling, {})
  });
};

export default LoadPreviews;