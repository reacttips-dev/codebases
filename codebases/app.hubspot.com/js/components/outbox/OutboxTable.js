'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import memoize from 'transmute/memoize';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
import UITable from 'UIComponents/table/UITable';
import UIAbstractProgress from 'UIComponents/progress/UIAbstractProgress';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
import OutboxTableRow from './OutboxTableRow';
import OutboxTableNoMoreResultsState from './OutboxTableNoMoreResultsState';
var LIMIT = 20;
var generateScheduledKey = memoize(function (scheduledEmail) {
  switch (scheduledEmail.get('emailSource')) {
    case 'SEQUENCES':
      {
        var sequenceMeta = scheduledEmail.getIn(['emailSourceMeta', 'sequenceMeta']);
        return "sequences-" + sequenceMeta.get('enrollmentId') + "-" + sequenceMeta.get('stepOrder');
      }

    default:
      return scheduledEmail.get('scheduledTime');
  }
});
export default createReactClass({
  displayName: "OutboxTable",
  propTypes: {
    requestStatus: PropTypes.string.isRequired,
    results: PropTypes.instanceOf(List),
    page: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired
  },
  renderProgressBar: function renderProgressBar() {
    var requestStatus = this.props.requestStatus;

    if (requestStatus !== RequestStatusTypes.LOADING) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIAbstractProgress, {
      incrementFactor: 0.15,
      autoStart: true,
      render: function render(_ref) {
        var value = _ref.value;
        return /*#__PURE__*/_jsx(UINanoProgress, {
          value: value,
          animateOnComplete: true
        });
      }
    });
  },
  renderRows: function renderRows() {
    var _this$props = this.props,
        requestStatus = _this$props.requestStatus,
        results = _this$props.results,
        onRefresh = _this$props.onRefresh;
    var shouldShowNoMoreResults = requestStatus !== RequestStatusTypes.FAILED && results.size === 0;

    if (shouldShowNoMoreResults) {
      return /*#__PURE__*/_jsx(OutboxTableNoMoreResultsState, {});
    }

    return results.map(function (scheduledEmail) {
      return /*#__PURE__*/_jsx(OutboxTableRow, {
        scheduledEmail: scheduledEmail,
        onUnenroll: onRefresh,
        onEnrollmentEdit: onRefresh
      }, generateScheduledKey(scheduledEmail));
    });
  },
  renderPaginator: function renderPaginator() {
    var _this$props2 = this.props,
        page = _this$props2.page,
        results = _this$props2.results;
    var pageCount = results.size < LIMIT ? page : Infinity;
    return /*#__PURE__*/_jsx(UIPaginator, {
      maxVisiblePageButtons: 1,
      page: page,
      pageCount: pageCount,
      onPageChange: this.props.onPageChange
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("div", {
      className: "outbox-table",
      children: [this.renderProgressBar(), /*#__PURE__*/_jsxs(UITable, {
        children: [/*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            children: [/*#__PURE__*/_jsx("th", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "outbox.table.headers.recipient"
              })
            }), /*#__PURE__*/_jsx("th", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "outbox.table.headers.email"
              })
            }), /*#__PURE__*/_jsx("th", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "outbox.table.headers.source"
              })
            }), /*#__PURE__*/_jsx("th", {
              className: "text-right",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "outbox.table.headers.scheduledTime"
              })
            })]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          children: this.renderRows()
        })]
      }), this.renderPaginator()]
    });
  }
});