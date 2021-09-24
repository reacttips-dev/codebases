'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import partial from 'transmute/partial';
import { List } from 'immutable';
import * as SequenceScheduleActions from '../actions/SequenceScheduleActions';
import SequencesPageContainer from './SequencesPageContainer';
import { SCHEDULED_TAB } from 'SequencesUI/constants/TabNames';
import SequenceOutbox from '../components/outbox/SequenceOutbox';
import { tracker } from 'SequencesUI/util/UsageTracker';

function SequencesScheduleContainer(props) {
  var requestStatus = props.requestStatus,
      page = props.page,
      results = props.results,
      fetchPage = props.fetchPage;
  useEffect(function () {
    tracker.track('pageView', {
      subscreen: 'outbox'
    });
  });
  useEffect(function () {
    fetchPage(page);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_jsx(SequencesPageContainer, Object.assign({}, props, {
    activeTab: SCHEDULED_TAB,
    children: /*#__PURE__*/_jsx(SequenceOutbox, Object.assign({}, props, {
      requestStatus: requestStatus,
      results: results,
      page: page,
      onPageChange: function onPageChange(_ref) {
        var value = _ref.target.value;
        return fetchPage(value);
      },
      onRefresh: partial(fetchPage, page)
    }))
  }));
}

SequencesScheduleContainer.propTypes = {
  requestStatus: PropTypes.string.isRequired,
  results: PropTypes.instanceOf(List),
  page: PropTypes.number.isRequired,
  fetchPage: PropTypes.func.isRequired
};
export default connect(function (_ref2) {
  var sequenceSchedule = _ref2.sequenceSchedule;
  return {
    requestStatus: sequenceSchedule.get('requestStatus'),
    results: sequenceSchedule.get('results'),
    page: sequenceSchedule.get('page'),
    paging: sequenceSchedule.get('paging')
  };
}, Object.assign({}, SequenceScheduleActions))(SequencesScheduleContainer);