'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { NavMarker } from 'react-rhumb';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import OutboxTable from './OutboxTable';
import OutboxEmptyState from './OutboxEmptyState';
import OutboxErrorState from './OutboxErrorState';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
export default function SequenceOutbox(props) {
  var requestStatus = props.requestStatus,
      results = props.results,
      page = props.page;

  if (requestStatus === RequestStatusTypes.FAILED) {
    return /*#__PURE__*/_jsx(OutboxErrorState, {});
  }

  if (results === null) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      style: {
        minHeight: 200
      }
    });
  }

  var shouldShowEmptyState = page === 1 && results.size === 0;

  if (shouldShowEmptyState) {
    return /*#__PURE__*/_jsx(OutboxEmptyState, {});
  }

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "OUTBOX_LOAD"
    }), /*#__PURE__*/_jsx(OutboxTable, Object.assign({}, props))]
  });
}
SequenceOutbox.propTypes = {
  requestStatus: PropTypes.string.isRequired,
  results: PropTypes.instanceOf(List),
  page: PropTypes.number.isRequired,
  noLayout: PropTypes.bool
};