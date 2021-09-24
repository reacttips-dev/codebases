'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import Small from 'UIComponents/elements/Small';
export default function FilterEditorTimezoneWarning(props) {
  var className = props.className;
  var timezone = I18n.moment.portalTz().format('z');
  return /*#__PURE__*/_jsx(Small, {
    className: className,
    use: "help",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterEditorTimezoneWarning.message",
      options: {
        timezone: timezone
      }
    })
  });
}
FilterEditorTimezoneWarning.propTypes = {
  className: PropTypes.string
};