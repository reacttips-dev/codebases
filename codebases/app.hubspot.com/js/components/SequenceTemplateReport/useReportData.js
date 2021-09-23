'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { resolve } from 'reporting-data/main';
import { processReport, sortData } from './helpers';
import buildReportConfig from './buildReportConfig';

function getApplicableFilters(query) {
  // TODO hs_company_id hs_unenrolled_source hs_enrollment_state
  return query.getIn(['filterGroups', 0, 'filters']).filter(function (f) {
    return f.get('property') === 'hs_sequence_id' || f.get('property') === 'hs_enrolled_at' || f.get('property') === 'hs_enrolled_by';
  });
}

export default function useReportData(sequenceId, query) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      error = _useState4[0],
      setError = _useState4[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      data = _useState6[0],
      setData = _useState6[1];

  var _useState7 = useState({
    property: 'stepOrder',
    direction: 'ascending'
  }),
      _useState8 = _slicedToArray(_useState7, 2),
      sort = _useState8[0],
      setSort = _useState8[1];

  useEffect(function () {
    resolve(buildReportConfig(sequenceId, getApplicableFilters(query))).then(processReport).then(function (rowData) {
      setData(rowData);
      setLoading(false);
      setError(null);
    }).catch(function (err) {
      return setError(err);
    });
  }, [sequenceId, query]);
  var rows = sortData(data, sort);
  return {
    rows: rows,
    loading: loading,
    error: error,
    sort: sort,
    setSort: setSort
  };
}