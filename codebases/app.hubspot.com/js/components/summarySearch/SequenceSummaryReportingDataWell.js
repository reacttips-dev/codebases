'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { ALLEnrollmentEngagementEventTypes } from 'SequencesUI/constants/EnrollmentEngagementEventTypes';
import { useReportingData } from 'SequencesUI/hooks/useReportingData';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UIWell from 'UIComponents/well/UIWell';
import UIWellBigNumber from 'UIComponents/well/UIWellBigNumber';
import UIWellItem from 'UIComponents/well/UIWellItem';
import UIWellLabel from 'UIComponents/well/UIWellLabel';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedPercentage from 'I18n/components/FormattedPercentage';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import isValidI18nKey from 'I18n/utils/isValidI18nKey';

var SequenceSummaryReportingDataWell = function SequenceSummaryReportingDataWell(_ref) {
  var filterGroups = _ref.filterGroups;
  var reportingData = useReportingData(filterGroups);
  if (!reportingData) return null;

  var getRate = function getRate(event) {
    return (reportingData[event] / reportingData[ALLEnrollmentEngagementEventTypes.ENROLLED] || 0) * 100;
  };

  var renderUIWellItem = function renderUIWellItem(event) {
    var tooltipKey = "summary.sequenceSummarySearchAnalytics." + event + ".help";
    return /*#__PURE__*/_jsxs(UIWellItem, {
      children: [/*#__PURE__*/_jsxs(UIWellLabel, {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummarySearchAnalytics." + event + ".title"
        }), isValidI18nKey(tooltipKey) && /*#__PURE__*/_jsx(UIHelpIcon, {
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: tooltipKey
          }),
          className: "m-left-1"
        })]
      }), /*#__PURE__*/_jsx(UIWellBigNumber, {
        children: event === ALLEnrollmentEngagementEventTypes.ENROLLED ? reportingData[event] : /*#__PURE__*/_jsx(FormattedPercentage, {
          value: getRate(event)
        })
      })]
    }, event);
  };

  return /*#__PURE__*/_jsx(Fragment, {
    children: /*#__PURE__*/_jsx(UICardWrapper, {
      children: /*#__PURE__*/_jsx(UIWell, {
        children: Object.keys(ALLEnrollmentEngagementEventTypes).map(renderUIWellItem)
      })
    })
  });
};

export default SequenceSummaryReportingDataWell;