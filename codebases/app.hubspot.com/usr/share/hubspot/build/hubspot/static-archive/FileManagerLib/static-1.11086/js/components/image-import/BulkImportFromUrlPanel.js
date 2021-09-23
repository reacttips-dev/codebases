'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import { PREVIEWS, LOADING, INPUT, IMPORTING } from '../../enums/BulkImageImportSteps';
import InputUrlSection from './InputUrlSection';
import LoadPreviews from './LoadPreviews';
import Previews from './Previews';
import ImportImages from './ImportImages';
import { getStep } from '../../selectors/BulkImageImport';

var StepFactory = function StepFactory(_ref) {
  var step = _ref.step;

  switch (step) {
    case PREVIEWS:
      {
        return /*#__PURE__*/_jsx(Previews, {});
      }

    case INPUT:
      {
        return /*#__PURE__*/_jsx(UIPanelSection, {
          children: /*#__PURE__*/_jsx(InputUrlSection, {})
        });
      }

    case LOADING:
      {
        return /*#__PURE__*/_jsx(LoadPreviews, {});
      }

    case IMPORTING:
      {
        return /*#__PURE__*/_jsx(ImportImages, {});
      }

    default:
      return /*#__PURE__*/_jsx(InputUrlSection, {});
  }
};

var BulkImportFromUrlPanel = function BulkImportFromUrlPanel() {
  var step = useSelector(getStep);
  return /*#__PURE__*/_jsx(StepFactory, {
    step: step
  });
};

export default BulkImportFromUrlPanel;