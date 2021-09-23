'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import Small from 'UIComponents/elements/Small';

var TemplateListZero = function TemplateListZero(_ref) {
  var searchTerm = _ref.searchTerm,
      folderEmpty = _ref.folderEmpty,
      noTemplates = _ref.noTemplates;

  var paragraph = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "edit.templateListZero.paragraphSearch"
  });

  if (noTemplates) {
    paragraph = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.templateListZero.paragraphNoTemplates"
    });
  }

  if (folderEmpty && searchTerm === '') {
    paragraph = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.templateListZero.paragraphFolder"
    });
  }

  return /*#__PURE__*/_jsx("div", {
    className: "text-center p-x-6 p-y-5",
    children: /*#__PURE__*/_jsx(Small, {
      className: "m-bottom-0",
      children: paragraph
    })
  });
};

TemplateListZero.propTypes = {
  searchTerm: PropTypes.string,
  folderEmpty: PropTypes.bool.isRequired,
  noTemplates: PropTypes.bool.isRequired
};
export default TemplateListZero;