'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import get from 'transmute/get';
import { useDispatch } from 'react-redux';
import { NavMarker } from 'react-rhumb';
import EnrollmentManagementTablePaginator from './EnrollmentManagementTablePaginator';
import EnrollmentManagementTableRow from './EnrollmentManagementTableRow';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITable from 'UIComponents/table/UITable';
import UISortTH from 'UIComponents/table/UISortTH';
import { useQuery } from 'data-fetching-client';
import { GET_SEQUENCE_ENROLLMENTS } from '../../query/sequenceEnrollmentQuery';
import { GET_SEQUENCE_ENROLLMENT_PROPERTIES } from '../../query/sequencePropertyQuery';
import { GET_CONTACTS } from '../../query/contactsQuery';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import { SequenceSearchSort } from 'SequencesUI/records/SequenceSearchQuery';
import SelectAllBar from './SelectAllBar';
import { areAllEnrollmentsSelected, EnrollmentSelectionPropType } from '../../util/enrollmentSelection';
import { enrollmentPollingResolved } from '../../actions/SequenceEnrollmentTableActions';
var MAX_RETRY_TIME = 10000;
var POLL_INTERVAL = 1000;

var DefaultHeaderComponent = function DefaultHeaderComponent(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx("tr", {
    children: children
  });
};

var EnrollmentManagementTable = function EnrollmentManagementTable(_ref2) {
  var _ref2$bulkProcessingI = _ref2.bulkProcessingIds,
      bulkProcessingIds = _ref2$bulkProcessingI === void 0 ? [] : _ref2$bulkProcessingI,
      query = _ref2.query,
      EmptyStateComponent = _ref2.EmptyStateComponent,
      ErrorComponent = _ref2.ErrorComponent,
      columns = _ref2.columns,
      enrollmentSelection = _ref2.enrollmentSelection,
      onUpdateQuery = _ref2.onUpdateQuery,
      _ref2$HeaderComponent = _ref2.HeaderComponent,
      HeaderComponent = _ref2$HeaderComponent === void 0 ? DefaultHeaderComponent : _ref2$HeaderComponent,
      _ref2$showActions = _ref2.showActions,
      showActions = _ref2$showActions === void 0 ? true : _ref2$showActions,
      _ref2$showPageSizeOpt = _ref2.showPageSizeOptions,
      showPageSizeOptions = _ref2$showPageSizeOpt === void 0 ? false : _ref2$showPageSizeOpt,
      limit = _ref2.limit;
  var dispatch = useDispatch();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPolling = _useState2[0],
      setIsPolling = _useState2[1];

  var _useState3 = useState(undefined),
      _useState4 = _slicedToArray(_useState3, 2),
      previousData = _useState4[0],
      setPreviousData = _useState4[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      currentProcessingIds = _useState6[0],
      setCurrentProcessingIds = _useState6[1];

  var sort = useMemo(function () {
    var firstSort = query.sorts.first();
    return {
      property: firstSort.property,
      order: firstSort.order === 'DESC' ? 'descending' : 'ascending'
    };
  }, [query]);

  var _useQuery = useQuery(GET_SEQUENCE_ENROLLMENTS, {
    variables: {
      query: query
    },
    pollInterval: isPolling ? POLL_INTERVAL : 0
  }),
      sequenceEnrollmentsData = _useQuery.data,
      sequenceEnrollmentsLoading = _useQuery.loading,
      sequenceEnrollmentsError = _useQuery.error,
      previousSequenceEnrollments = _useQuery.previousData,
      refetch = _useQuery.refetch;

  var _useQuery2 = useQuery(GET_SEQUENCE_ENROLLMENT_PROPERTIES),
      sequencePropertiesData = _useQuery2.data,
      sequencePropertiesLoading = _useQuery2.loading,
      sequencePropertiesError = _useQuery2.error;

  var _useQuery3 = useQuery(GET_CONTACTS, {
    skip: !sequenceEnrollmentsData,
    variables: {
      vids: sequenceEnrollmentsData && sequenceEnrollmentsData.sequenceEnrollments.results.reduce(function (acc, sequenceEnrollment) {
        acc.push(getPropertyValue(sequenceEnrollment, 'hs_contact_id'));
        return acc;
      }, [])
    }
  }),
      contactsData = _useQuery3.data,
      contactsLoading = _useQuery3.loading,
      contactsError = _useQuery3.error,
      previousContacts = _useQuery3.previousData;

  var startPollingForChanges = useCallback(function (ids) {
    if (ids) {
      setCurrentProcessingIds(currentProcessingIds.concat(ids));
    }

    setPreviousData(sequenceEnrollmentsData);
    setIsPolling(true);

    if (enrollmentSelection) {
      enrollmentSelection.deselectAllEnrollments();
    }
  }, [sequenceEnrollmentsData, setCurrentProcessingIds, currentProcessingIds, enrollmentSelection]);
  useEffect(function () {
    if (isPolling) {
      var timer = setTimeout(function () {
        setIsPolling(false);
        setCurrentProcessingIds([]);
      }, MAX_RETRY_TIME);
      return function () {
        return clearTimeout(timer);
      };
    }

    return undefined;
  }, [isPolling, currentProcessingIds]);
  useEffect(function () {
    setIsPolling(false);
    setCurrentProcessingIds([]);
    refetch();
  }, [query, refetch]);
  useEffect(function () {
    if (!isPolling || !sequenceEnrollmentsData || !previousData || !currentProcessingIds.length) {
      return;
    }

    var changedResults = sequenceEnrollmentsData.sequenceEnrollments.results.filter(function (sequenceEnrollment) {
      var sequenceEnrollmentId = getPropertyValue(sequenceEnrollment, 'hs_enrollment_id');

      if (currentProcessingIds.includes(sequenceEnrollmentId)) {
        var oldEnrollment = previousData.sequenceEnrollments.results.find(function (enrollment) {
          return getPropertyValue(enrollment, 'hs_enrollment_id') === sequenceEnrollmentId;
        });
        return getPropertyValue(sequenceEnrollment, 'hs_enrollment_state') !== getPropertyValue(oldEnrollment, 'hs_enrollment_state');
      }

      return false;
    });
    var allResultsUpdated = changedResults.length === currentProcessingIds.length;

    if (allResultsUpdated) {
      setIsPolling(false);
      setCurrentProcessingIds([]);
      dispatch(enrollmentPollingResolved(currentProcessingIds));
    }
  }, [dispatch, isPolling, setIsPolling, sequenceEnrollmentsData, previousData, currentProcessingIds]);
  useEffect(function () {
    if (bulkProcessingIds && bulkProcessingIds.length && bulkProcessingIds.some(function (bulkProcessingId) {
      return currentProcessingIds.indexOf(bulkProcessingId) === -1;
    })) {
      setPreviousData(sequenceEnrollmentsData);
      setIsPolling(true);
      setCurrentProcessingIds(currentProcessingIds.concat(bulkProcessingIds));
    }
  }, [bulkProcessingIds, sequenceEnrollmentsData, setCurrentProcessingIds, currentProcessingIds]);
  if ((sequenceEnrollmentsLoading || sequencePropertiesLoading || contactsLoading) && (!previousSequenceEnrollments || !previousContacts)) return /*#__PURE__*/_jsx(UILoadingSpinner, {
    layout: "centered",
    minHeight: 180
  });
  if (sequenceEnrollmentsError || sequencePropertiesError || contactsError) return /*#__PURE__*/_jsx(ErrorComponent, {});

  var _ref3 = sequenceEnrollmentsData || previousSequenceEnrollments,
      sequenceEnrollments = _ref3.sequenceEnrollments;

  var _ref4 = contactsData || previousContacts,
      contacts = _ref4.contacts;

  if (!sequenceEnrollments.results.length) {
    return /*#__PURE__*/_jsx(NavMarker, {
      name: "ENROLLMENTS_TABLE_LOAD",
      children: /*#__PURE__*/_jsx(EmptyStateComponent, {})
    });
  }

  var renderTableRow = function renderTableRow(sequenceEnrollment) {
    var sequenceEnrollmentId = getPropertyValue(sequenceEnrollment, 'hs_enrollment_id');
    return /*#__PURE__*/_jsx(EnrollmentManagementTableRow, {
      columns: columns,
      contact: get(+getPropertyValue(sequenceEnrollment, 'hs_contact_id'), contacts),
      enrollmentSelection: enrollmentSelection,
      isProcessing: currentProcessingIds.includes(sequenceEnrollmentId),
      properties: sequencePropertiesData.sequenceProperties,
      query: query,
      sequenceEnrollment: sequenceEnrollment,
      showActions: showActions,
      startPolling: startPollingForChanges
    }, sequenceEnrollmentId);
  };

  var columnHeaders = columns.map(function (column) {
    return column.sortable ? /*#__PURE__*/_jsx(UISortTH, {
      sort: sort.property === column.propertyName ? sort.order : 'none',
      onSortChange: function onSortChange(_ref5) {
        var value = _ref5.target.value;
        var newSort = new SequenceSearchSort({
          property: column.propertyName,
          order: "" + (value === 'descending' ? 'DESC' : 'ASC')
        });
        onUpdateQuery(query.setIn(['sorts', 0], newSort).set('offset', 0));
      },
      children: column.label
    }, column.propertyName) : /*#__PURE__*/_jsx("th", {
      children: column.label
    }, column.propertyName);
  });
  var selectAllBar = enrollmentSelection && areAllEnrollmentsSelected(sequenceEnrollments.results, enrollmentSelection) ? /*#__PURE__*/_jsx(SelectAllBar, {
    enrollmentSelection: enrollmentSelection,
    sequenceEnrollments: sequenceEnrollments
  }) : null;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "ENROLLMENTS_TABLE_LOAD"
    }), /*#__PURE__*/_jsxs(UITable, {
      className: "summary-search-table",
      condensed: true,
      children: [/*#__PURE__*/_jsxs("thead", {
        children: [/*#__PURE__*/_jsx(HeaderComponent, {
          enrollmentSelection: enrollmentSelection,
          pageEnrollments: sequenceEnrollments.results,
          startPolling: startPollingForChanges,
          query: query,
          contacts: contacts,
          children: columnHeaders
        }), selectAllBar]
      }), /*#__PURE__*/_jsx("tbody", {
        children: sequenceEnrollments.results.map(renderTableRow)
      })]
    }), /*#__PURE__*/_jsx(EnrollmentManagementTablePaginator, {
      limit: limit,
      onUpdateQuery: onUpdateQuery,
      query: query,
      showPageSizeOptions: showPageSizeOptions,
      totalRecords: sequenceEnrollments.total
    })]
  });
};

EnrollmentManagementTable.propTypes = {
  bulkProcessingIds: PropTypes.array,
  ErrorComponent: PropTypes.func.isRequired,
  EmptyStateComponent: PropTypes.func,
  query: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    defaultSort: PropTypes.bool,
    sortable: PropTypes.bool
  })).isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  HeaderComponent: PropTypes.func,
  enrollmentSelection: EnrollmentSelectionPropType.isRequired,
  showActions: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool,
  limit: PropTypes.number
};
export default EnrollmentManagementTable;