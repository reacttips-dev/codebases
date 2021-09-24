'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getType } from '../utils/file';
import { FileTypes } from '../Constants';
import Audio from './icons/Audio';
import Document from './icons/Document';
import ExcelFile from './icons/ExcelFile';
import PDF from './icons/PDF';
import Video from './icons/Video';
import Image from './icons/Image';
import WordFile from './icons/WordFile';
import { WordExtensions, ExcelExtensions, UIComponentIcons, ICON_SHIRT_SIZES } from '../constants/FileTypeIcon';
import overrideIconDimensionsForCustomIcon from '../utils/overrideIconDimensionsForCustomIcon';
export default function FileTypeIcon(props) {
  var file = props.file,
      other = _objectWithoutProperties(props, ["file"]);

  var extension = file.get('extension');
  var type = file.get('type') ? file.get('type') : getType(extension);
  var Icon;

  switch (type) {
    case FileTypes.AUDIO:
      Icon = Audio;
      break;

    case FileTypes.MOVIE:
      Icon = Video;
      break;

    case FileTypes.DOCUMENT:
      if (extension === 'pdf') {
        Icon = PDF;
      } else if (WordExtensions.includes(extension)) {
        Icon = WordFile;
      } else if (ExcelExtensions.includes(extension)) {
        Icon = ExcelFile;
      } else {
        Icon = Document;
      }

      break;

    case FileTypes.IMG:
      Icon = Image;
      break;

    default:
      Icon = Document;
  }

  var iconProps = UIComponentIcons.includes(Icon) ? other : overrideIconDimensionsForCustomIcon(other, props.size);
  return /*#__PURE__*/_jsx(Icon, Object.assign({
    className: "file-type-icon m-right-0"
  }, iconProps));
}
FileTypeIcon.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map).isRequired,
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(ICON_SHIRT_SIZES)), PropTypes.number])
};