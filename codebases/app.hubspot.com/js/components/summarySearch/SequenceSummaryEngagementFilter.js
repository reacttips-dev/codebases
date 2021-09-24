'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import partial from 'transmute/partial';
import { OrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UICheckbox from 'UIComponents/input/UICheckbox';
import HR from 'UIComponents/elements/HR';
import { withRouter } from 'react-router';
import { getFilterTypes, FILTER_NONE } from '../../util/enrollmentEngagementFilters';
import SequenceSummaryEngagementFilterAdapter from './SequenceSummaryEngagementFilterAdapter';
import { tracker } from 'SequencesUI/util/UsageTracker';
import FilterWithClearButton from 'SequencesUI/components/filters/FilterWithClearButton';

var trackSortStatus = function trackSortStatus() {
  return tracker.track('sequencesUsage', {
    action: 'Sorted by sequence status',
    subscreen: 'sequences-overview'
  });
};

var SequenceSummaryEngagementFilter = function SequenceSummaryEngagementFilter(_ref) {
  var onChange = _ref.onChange,
      selection = _ref.selection,
      location = _ref.location,
      router = _ref.router;
  var resetQueryParams = useCallback(function (status) {
    return router.push(Object.assign({}, location, {
      query: Object.assign({}, location.query, {
        status: status
      })
    }));
  }, [router, location]);
  var handleAllClick = useCallback(function () {
    trackSortStatus();
    var isTogglingAllOff = selection.size > 0;

    if (isTogglingAllOff) {
      onChange(FILTER_NONE);
      resetQueryParams(FILTER_NONE.toArray());
    } else {
      // When every status is turned on, empty out query
      onChange(getFilterTypes());
      resetQueryParams();
    }
  }, [onChange, selection, resetQueryParams]);
  var handleClear = useCallback(function () {
    trackSortStatus();
    onChange(FILTER_NONE);
    resetQueryParams(FILTER_NONE.toArray());
  }, [onChange, resetQueryParams]);
  var toggleFilter = useCallback(function (type) {
    var filterWasRemoved = selection.has(type);
    var updatedSelection = filterWasRemoved ? selection.delete(type) : selection.add(type);
    var newSelection = updatedSelection.size > 0 ? updatedSelection : FILTER_NONE;
    router.push(Object.assign({}, location, {
      query: Object.assign({}, location.query, {
        status: newSelection.equals(getFilterTypes()) ? undefined : newSelection.toArray()
      })
    }));
    trackSortStatus();
    onChange(newSelection);
  }, [onChange, selection, location, router]);

  var renderButtonText = function renderButtonText() {
    var label = I18n.text('sequencesui.analyze.filters.status');
    return /*#__PURE__*/_jsx("div", {
      children: selection.size > 0 ? I18n.text('sequencesui.analyze.filters.activeDisplayWithCount', {
        label: label,
        value: selection.size
      }) : label
    });
  };

  var renderFilters = function renderFilters() {
    return getFilterTypes().map(function (type) {
      return /*#__PURE__*/_jsx(UICheckbox, {
        checked: selection.has(type),
        onChange: partial(toggleFilter, type),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummarySearchEngagement." + type
        })
      }, type);
    });
  };

  var allSelected = selection === getFilterTypes();
  var noneSelected = selection.size === 0;
  var allText = noneSelected ? 'summary.sequenceSummarySearchEngagementFilter.selectAll' : 'summary.sequenceSummarySearchEngagementFilter.unselectAll';
  return /*#__PURE__*/_jsx(FilterWithClearButton, {
    isActive: !noneSelected,
    onRemoveClick: handleClear,
    children: /*#__PURE__*/_jsxs(UIDropdown, {
      className: "p-left-0",
      buttonUse: "transparent",
      buttonText: renderButtonText(),
      children: [/*#__PURE__*/_jsx(UICheckbox, {
        checked: allSelected,
        indeterminate: !noneSelected,
        onChange: handleAllClick,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: allText
        })
      }), /*#__PURE__*/_jsx(HR, {
        className: "m-y-1"
      }), renderFilters()]
    })
  });
};

SequenceSummaryEngagementFilter.propTypes = {
  selection: PropTypes.instanceOf(OrderedSet).isRequired,
  onChange: PropTypes.func.isRequired,
  location: PropTypes.object,
  router: PropTypes.object
};
export default SequenceSummaryEngagementFilterAdapter(withRouter(SequenceSummaryEngagementFilter));