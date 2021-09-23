'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { withRouter } from 'react-router';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIMicroDateRange from 'UIComponents/dates/UIMicroDateRange';
import dateRangeToSequenceFilter from 'SequencesUI/util/summary/dateRangeToSequenceFilter';
import dateRangeFromType from 'SequencesUI/util/summary/dateRangeFromType';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
var SequenceSummarySearchTimeFilter = createReactClass({
  displayName: "SequenceSummarySearchTimeFilter",
  propTypes: {
    filterGroups: PropTypes.instanceOf(List).isRequired,
    onChange: PropTypes.func.isRequired,
    location: PropTypes.object,
    router: PropTypes.object
  },
  getInitialState: function getInitialState() {
    var enrolledAt = this.props.location.query.enrolledAt;
    var initialPresetId = enrolledAt;
    return {
      value: dateRangeFromType(initialPresetId)
    };
  },
  handleChange: function handleChange(e) {
    var _this$props = this.props,
        filterGroups = _this$props.filterGroups,
        onChange = _this$props.onChange,
        router = _this$props.router,
        location = _this$props.location;
    var dateRange = e.target.value;
    router.push(Object.assign({}, location, {
      query: Object.assign({}, location.query, {
        enrolledAt: dateRange.presetId
      })
    })); // Sequences search currently requires BOTH start and end

    if (!dateRange.startDate && dateRange.endDate) {
      dateRange.startDate = dateRange.endDate;
    }

    if (dateRange.startDate && !dateRange.endDate) {
      dateRange.endDate = dateRange.startDate;
    }

    var updatedFilterGroups = filterGroups.map(function (filterGroup) {
      return filterGroup.update('filters', function (filters) {
        var otherFilters = filters.filterNot(function (filter) {
          return filter.property === 'hs_enrolled_at';
        });
        var enrolledAtFilter = dateRangeToSequenceFilter(dateRange);
        return enrolledAtFilter ? otherFilters.push(enrolledAtFilter) : otherFilters;
      });
    });
    this.setState({
      value: dateRange
    });
    onChange(updatedFilterGroups);
  },
  render: function render() {
    var value = this.state.value;
    return /*#__PURE__*/_jsx(UIInlineLabel, {
      "data-test-id": "sequences-enroll-date-filter",
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.sequenceSummarySearchTimeFilter.filterLabel"
      }),
      children: /*#__PURE__*/_jsx(UIMicroDateRange, {
        use: "on-dark",
        tz: "portalTz",
        onChange: this.handleChange,
        value: value
      })
    });
  }
});
export default withRouter(SequenceSummarySearchTimeFilter);