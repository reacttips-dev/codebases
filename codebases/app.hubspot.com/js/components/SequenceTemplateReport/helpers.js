'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var METRIC_COLUMNS = ['sends', 'opens', 'clicks', 'replies', 'meetings'];
export var COUNTS = 'COUNTS';
export var RATES = 'RATES';

function buildRow(_ref) {
  var templateId = _ref.templateId,
      stepOrder = _ref.stepOrder,
      _ref$sends = _ref.sends,
      sends = _ref$sends === void 0 ? 0 : _ref$sends,
      _ref$opens = _ref.opens,
      opens = _ref$opens === void 0 ? 0 : _ref$opens,
      _ref$clicks = _ref.clicks,
      clicks = _ref$clicks === void 0 ? 0 : _ref$clicks,
      _ref$replies = _ref.replies,
      replies = _ref$replies === void 0 ? 0 : _ref$replies,
      _ref$meetings = _ref.meetings,
      meetings = _ref$meetings === void 0 ? 0 : _ref$meetings;
  return {
    templateId: templateId,
    stepOrder: stepOrder,
    sends: sends,
    opens: opens,
    clicks: clicks,
    replies: replies,
    meetings: meetings
  };
}

export function processReport(report) {
  var data = report.getIn(['primary', 'data', 'data']).toJS();
  return data.map(function (templateData) {
    return buildRow({
      templateId: templateData['hs_template_id'],
      stepOrder: templateData['hs_step_order'],
      sends: templateData['SUM|hs_email_sent_count'],
      opens: templateData['COUNT|hs_email_open_count'],
      clicks: templateData['COUNT|hs_email_click_count'],
      replies: templateData['COUNT|hs_email_reply_count'],
      meetings: templateData['COUNT|hs_meeting_booked_count']
    });
  });
}
export function sortData(rowData, sort) {
  var sorted = _toConsumableArray(rowData);

  sorted.sort(function (rowA, rowB) {
    var result;

    if (rowA[sort.property] === rowB[sort.property]) {
      result = rowB.sends - rowA.sends;
    } else {
      result = rowA[sort.property] - rowB[sort.property];
    }

    if (sort.direction === 'ascending') {
      return result;
    } else {
      return -result;
    }
  });
  return sorted;
}