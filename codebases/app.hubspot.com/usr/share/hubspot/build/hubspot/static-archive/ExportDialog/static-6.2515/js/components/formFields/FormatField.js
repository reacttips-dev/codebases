'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import { FormatValues } from 'ExportDialog/Constants';

function createValueExtractor(onChangeCallback) {
  return function (event) {
    onChangeCallback(event.target.value);
  };
}

var FormatField = function FormatField(_ref) {
  var onChange = _ref.onChange,
      value = _ref.value;
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "exportDialog.fields.formatLabel"
    }),
    className: "m-bottom-6",
    children: /*#__PURE__*/_jsx(UISelect, {
      value: value,
      onChange: createValueExtractor(onChange),
      options: FormatValues.map(function (format) {
        return {
          text: I18n.text("exportDialog.formats." + format),
          value: format
        };
      })
    })
  });
};

FormatField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
export default FormatField;