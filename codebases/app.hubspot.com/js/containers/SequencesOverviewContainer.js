'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { NavMarker } from 'react-rhumb';
import { GYPSUM } from 'HubStyleTokens/colors';
import { OVERVIEW_TAB } from 'SequencesUI/constants/TabNames';
import { useState, useCallback } from 'react';
import getDefaultQueryFromQueryParams, { getEnrolledByValueFromQueryParam } from 'SequencesUI/util/overview/getDefaultQueryFromQueryParams';
import dateRangeFromType from 'SequencesUI/util/summary/dateRangeFromType';
import SequencesPageContainer from './SequencesPageContainer';
import OverviewDataWell from '../components/overview/OverviewDataWell';
import OverviewFilterBar from '../components/overview/OverviewFilterBar';
import TopEnrollmentsTable from 'SequencesUI/components/overview/TopEnrollmentsTable';

function SequencesOverviewContainer(props) {
  var _props$location$query = props.location.query,
      enrolledBy = _props$location$query.enrolledBy,
      enrolledAt = _props$location$query.enrolledAt,
      sequenceId = _props$location$query.sequenceId,
      companyId = _props$location$query.companyId,
      status = _props$location$query.status;

  var _useState = useState(getDefaultQueryFromQueryParams({
    sequenceId: sequenceId,
    enrolledBy: getEnrolledByValueFromQueryParam(enrolledBy),
    enrolledAtRange: dateRangeFromType(enrolledAt),
    companyId: companyId,
    status: status
  })),
      _useState2 = _slicedToArray(_useState, 2),
      query = _useState2[0],
      setQuery = _useState2[1];

  var handleChange = useCallback(function (filterGroups) {
    setQuery(query.merge({
      offset: 0,
      filterGroups: filterGroups
    }));
  }, [query]);
  return /*#__PURE__*/_jsxs(SequencesPageContainer, Object.assign({}, props, {
    activeTab: OVERVIEW_TAB,
    backgroundColor: GYPSUM,
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "OVERVIEW_LOAD"
    }), /*#__PURE__*/_jsx(OverviewFilterBar, {
      onChange: handleChange,
      filterGroups: query.filterGroups
    }), /*#__PURE__*/_jsx(OverviewDataWell, {
      filterGroups: query.filterGroups
    }), /*#__PURE__*/_jsx(TopEnrollmentsTable, {
      filterGroups: query.filterGroups,
      location: props.location
    })]
  }));
}

export default SequencesOverviewContainer;