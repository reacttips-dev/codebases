'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { recommendedSendTimeLearnMore } from 'sales-modal/lib/links';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITimePicker from 'UIComponents/input/UITimePicker';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { EnrollTypePropType, EnrollTypes } from '../../../constants/EnrollTypes';

var FollowUpEmailTimePickerWithRecommendedTimes = function FollowUpEmailTimePickerWithRecommendedTimes(_ref) {
  var onChange = _ref.onChange,
      value = _ref.value,
      recommendedValue = _ref.recommendedValue,
      enrollType = _ref.enrollType;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var handleRecommendedTimeClick = function handleRecommendedTimeClick() {
    onChange(SyntheticEvent(recommendedValue));
    setIsOpen(false);
  };

  return /*#__PURE__*/_jsx(UITimePicker, {
    open: isOpen,
    onOpenChange: function onOpenChange(e) {
      return setIsOpen(e.target.value);
    },
    interval: 1,
    onChange: onChange,
    value: value,
    readOnly: enrollType === EnrollTypes.VIEW,
    dropdownFooter: recommendedValue && /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "enrollModal.sendTimes.timePicker.recommendedTooltip_jsx",
        options: {
          external: true,
          href: recommendedSendTimeLearnMore()
        },
        elements: {
          Link: UILink
        }
      }),
      placement: "left",
      children: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIIcon, {
          className: "m-right-1",
          name: "dynamicFilter"
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "link",
          onClick: handleRecommendedTimeClick,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollModal.sendTimes.timePicker.recommendedTime",
            options: {
              time: I18n.moment.utc(0).minutes(recommendedValue).format('LT')
            }
          })
        })]
      })
    })
  });
};

FollowUpEmailTimePickerWithRecommendedTimes.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  recommendedValue: PropTypes.number,
  enrollType: EnrollTypePropType
};
export default FollowUpEmailTimePickerWithRecommendedTimes;