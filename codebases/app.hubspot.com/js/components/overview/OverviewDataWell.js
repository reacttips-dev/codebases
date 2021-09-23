'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { useState, useCallback, Fragment } from 'react';
import partial from 'transmute/partial';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { eventTypeToQuery } from '../../query/enrollmentEngagementEventQueries';
import { EnrollmentEngagementEventTypes } from '../../constants/EnrollmentEngagementEventTypes';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { useReportingData } from 'SequencesUI/hooks/useReportingData';
import EnrollmentEngagementEventTable from './EnrollmentEngagementEventTable';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UIWell from 'UIComponents/well/UIWell';
import UIWellBigNumber from 'UIComponents/well/UIWellBigNumber';
import UIWellHelpText from 'UIComponents/well/UIWellHelpText';
import UIWellItem from 'UIComponents/well/UIWellItem';
import UIWellLabel from 'UIComponents/well/UIWellLabel';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
var CONTACTS = 'CONTACTS';

var OverviewDataWell = function OverviewDataWell(_ref) {
  var filterGroups = _ref.filterGroups;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showEventModal = _useState2[0],
      setShowEventModal = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      query = _useState4[0],
      setQuery = _useState4[1];

  var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      eventType = _useState6[0],
      setEventType = _useState6[1];

  var reportingData = useReportingData(filterGroups);
  var handleClick = useCallback(function (event) {
    var eventQuery = eventTypeToQuery[event];
    var updatedQuery = eventQuery(filterGroups);
    setQuery(updatedQuery);
    setEventType(event);
    setShowEventModal(true);
    tracker.track('sequencesUsage', {
      action: "Clicked " + event + " data well",
      subscreen: 'sequences-overview'
    });
  }, [filterGroups]);
  if (!reportingData) return null;

  var getRate = function getRate(event) {
    var rate = reportingData[event] / reportingData[EnrollmentEngagementEventTypes.ENROLLED] || 0;
    return I18n.formatPercentage(rate * 100, {
      precision: 2
    });
  };

  var renderUIWellItem = function renderUIWellItem(event) {
    return /*#__PURE__*/_jsxs(UIWellItem, {
      children: [/*#__PURE__*/_jsx(UIWellLabel, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.dataWell." + event + ".label"
        })
      }), /*#__PURE__*/_jsx(UIWellBigNumber, {
        "data-test-id": "overview-well-item-" + event,
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "link",
          onClick: partial(handleClick, event),
          children: reportingData[event]
        })
      }), /*#__PURE__*/_jsx(UIWellHelpText, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.dataWell." + event + ".detail",
          options: {
            count: event === EnrollmentEngagementEventTypes.ENROLLED ? reportingData[CONTACTS] : getRate(event)
          }
        })
      })]
    }, event);
  };

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UICardWrapper, {
      "data-test-id": "overview-data-well",
      children: /*#__PURE__*/_jsx(UIWell, {
        children: Object.keys(EnrollmentEngagementEventTypes).map(renderUIWellItem)
      })
    }), showEventModal && /*#__PURE__*/_jsx(EnrollmentEngagementEventTable, {
      onReject: function onReject() {
        return setShowEventModal(false);
      },
      onUpdateQuery: function onUpdateQuery(newQuery) {
        return setQuery(newQuery);
      },
      query: query,
      eventType: eventType,
      totalEnrollments: reportingData[eventType]
    })]
  });
};

OverviewDataWell.propTypes = {
  filterGroups: PropTypes.instanceOf(List).isRequired
};
export default OverviewDataWell;