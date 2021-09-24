'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

var FileDimensions = function FileDimensions(_ref) {
  var file = _ref.file;
  return file.get('width') && file.get('height') ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "FileManagerCore.fileDimensions.dimensions",
    options: {
      width: file.get('width'),
      height: file.get('height')
    }
  }) : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "FileManagerCore.fileDimensions.null"
  });
};

FileDimensions.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map)
};
export default FileDimensions;