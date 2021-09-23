'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, memo, Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIconRating from 'UIComponents/input/UIIconRating';
import PropTypes from 'prop-types';
import SectionLabel from '../../active-call-settings/components/SectionLabel';

function CSaTFeedbackStarRating(_ref) {
  var onChange = _ref.onChange,
      disabled = _ref.disabled;
  var handleChange = useCallback(function (_ref2) {
    var target = _ref2.target;
    onChange(target.value);
  }, [onChange]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(SectionLabel, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "csat-feedback.star-rating.label"
      })
    }), /*#__PURE__*/_jsx(UIIconRating, {
      className: "m-left-3 m-top-1",
      "data-test-id": "calling-csat-feedback-star-rating",
      size: "xxs",
      onChange: handleChange,
      disabled: disabled
    })]
  });
}

CSaTFeedbackStarRating.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(CSaTFeedbackStarRating);