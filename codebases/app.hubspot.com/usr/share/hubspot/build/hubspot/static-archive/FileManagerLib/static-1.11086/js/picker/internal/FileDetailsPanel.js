'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import { mapProp } from 'FileManagerCore/constants/propTypes';
import { isAcquirePending } from 'FileManagerCore/selectors/Shutterstock';
import { deselectFile } from '../../actions/Actions';
import { acquireStockImage } from '../../actions/Shutterstock';
import FileDetailContainer from '../../containers/browser/FileDetailContainer';
import ShutterstockDetail from '../../components/browser/ShutterstockDetails';
import InsertFromDetailsButton from '../../components/controls/InsertFromDetailsButton';
var TRACKING_TARGET = 'panel-navigator-insert-button';

var FileDetailsPanel = function FileDetailsPanel(_ref) {
  var selectedFile = _ref.selectedFile,
      selectedStockFile = _ref.selectedStockFile,
      isSingleFileFetched = _ref.isSingleFileFetched,
      onInsert = _ref.onInsert,
      returnToPrevious = _ref.returnToPrevious,
      rest = _objectWithoutProperties(_ref, ["selectedFile", "selectedStockFile", "isSingleFileFetched", "onInsert", "returnToPrevious"]);

  var dispatch = useDispatch();
  var isAcquiringStockFile = useSelector(isAcquirePending);

  var onInsertFromDetails = function onInsertFromDetails() {
    onInsert(selectedFile, {
      target: TRACKING_TARGET
    });
    dispatch(deselectFile({
      target: TRACKING_TARGET
    }));
  };

  var onInsertStockImage = function onInsertStockImage() {
    dispatch(acquireStockImage(selectedStockFile)).then(function (acquiredFile) {
      onInsert(acquiredFile, {
        target: TRACKING_TARGET
      });
      dispatch(deselectFile({
        target: TRACKING_TARGET
      }));
    }).done();
  };

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIPanelBody, {
      children: /*#__PURE__*/_jsxs(UIPanelSection, {
        children: [selectedFile && /*#__PURE__*/_jsx(FileDetailContainer, Object.assign({}, rest, {
          tile: ImmutableMap({
            file: selectedFile
          }),
          onInsert: onInsertFromDetails,
          onClose: returnToPrevious
        })), selectedStockFile && /*#__PURE__*/_jsx(ShutterstockDetail, Object.assign({}, rest, {
          tile: ImmutableMap({
            image: selectedStockFile
          }),
          onClose: returnToPrevious,
          onInsert: onInsert
        }))]
      })
    }), /*#__PURE__*/_jsx(UIPanelFooter, {
      children: /*#__PURE__*/_jsx(InsertFromDetailsButton, {
        selectedFile: selectedFile,
        forShutterstock: Boolean(selectedStockFile),
        isAcquiringStockFile: isAcquiringStockFile,
        isSingleFileFetched: isSingleFileFetched,
        onInsert: selectedStockFile ? onInsertStockImage : onInsertFromDetails
      })
    })]
  });
};

FileDetailsPanel.propTypes = {
  selectedFile: mapProp,
  selectedStockFile: mapProp,
  isSingleFileFetched: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  returnToPrevious: PropTypes.func.isRequired
};
export default FileDetailsPanel;