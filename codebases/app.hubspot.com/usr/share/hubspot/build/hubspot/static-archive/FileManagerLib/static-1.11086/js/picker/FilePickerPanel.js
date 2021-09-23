'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { DrawerTypes, PickerTypes } from '../Constants';
import FileExtensionFilters from '../enums/FileExtensionFilters';
import WithFileExtensionFilter from '../components/hocs/WithFileExtensionFilter';
import PanelNavigator from './internal/PanelNavigator';
var FilePickerPanelWithFileExtensionFilter = WithFileExtensionFilter(PanelNavigator);

var FilePickerPanel = function FilePickerPanel(props) {
  var extensionFilteringEnabled = props.filterType && props.filterType !== FileExtensionFilters.NONE;

  if (extensionFilteringEnabled) {
    return /*#__PURE__*/_jsx(FilePickerPanelWithFileExtensionFilter, Object.assign({}, props));
  }

  return /*#__PURE__*/_jsx(PanelNavigator, Object.assign({}, props));
};

FilePickerPanel.displayName = 'FilePickerPanel';
FilePickerPanel.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  pickerType: PropTypes.oneOf(Object.keys(PickerTypes)).isRequired,
  disableUpload: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCloseComplete: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)),
  withBulkImageImport: PropTypes.bool,
  parentComponentName: PropTypes.string
};
FilePickerPanel.defaultProps = {
  type: DrawerTypes.IMAGE,
  pickerType: PickerTypes.PANEL,
  disableUpload: false
};
export default FilePickerPanel;