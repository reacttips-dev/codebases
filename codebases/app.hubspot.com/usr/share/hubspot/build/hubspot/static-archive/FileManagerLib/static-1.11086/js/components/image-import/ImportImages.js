'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { getImportId } from '../../selectors/BulkImageImport';
import { pollImageImport } from '../../actions/BulkImageImport';

var ImportImages = function ImportImages() {
  var dispatch = useDispatch();
  var importId = useSelector(getImportId);
  useEffect(function () {
    var timer = setInterval(function () {
      return dispatch(pollImageImport(importId));
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, [importId, dispatch]);
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    size: "small",
    grow: true
  });
};

export default ImportImages;