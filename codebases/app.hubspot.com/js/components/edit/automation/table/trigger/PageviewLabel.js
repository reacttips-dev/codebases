'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getPageviewOperator, getPropertyValue } from '../../lib/Triggers';
import { PAGEVIEW_OPERATORS_CELL_LABELS } from '../../lib/Operators';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';

var PageviewLabel = function PageviewLabel(_ref) {
  var trigger = _ref.trigger;
  var operator = getPageviewOperator(trigger);
  var value = getPropertyValue(trigger);

  var valueComponent = /*#__PURE__*/_jsx("b", {
    children: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: PAGEVIEW_OPERATORS_CELL_LABELS[operator],
      options: {
        value: value
      }
    })
  });

  return /*#__PURE__*/_jsx(FormattedReactMessage, {
    message: "sequencesAutomation.trigger.pageView.cellLabel.prefix",
    options: {
      value: valueComponent
    }
  });
};

PageviewLabel.propTypes = {
  trigger: PropTypes.object.isRequired
};
export default PageviewLabel;