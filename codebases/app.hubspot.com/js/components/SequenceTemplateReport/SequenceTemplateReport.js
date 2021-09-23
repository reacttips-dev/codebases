'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UISortTH from 'UIComponents/table/UISortTH';
import UITable from 'UIComponents/table/UITable';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIButton from 'UIComponents/button/UIButton';
import { COUNTS, RATES, METRIC_COLUMNS } from './helpers';
import useReportData from './useReportData';
import TemplateName from './TemplateName';
import ValueCell from './ValueCell';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';

function SequenceTemplateReport(_ref) {
  var query = _ref.query,
      sequenceId = _ref.sequenceId;

  var _useState = useState(RATES),
      _useState2 = _slicedToArray(_useState, 2),
      display = _useState2[0],
      setDisplay = _useState2[1];

  var _useReportData = useReportData(sequenceId, query),
      rows = _useReportData.rows,
      loading = _useReportData.loading,
      error = _useReportData.error,
      sort = _useReportData.sort,
      setSort = _useReportData.setSort;

  if (loading) {
    return /*#__PURE__*/_jsx(UICardWrapper, {
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 150
      })
    });
  } else if (error) {
    return /*#__PURE__*/_jsx(UICardWrapper, {
      compact: true,
      children: /*#__PURE__*/_jsx(UIErrorMessage, {
        type: "badRequest"
      })
    });
  } else if (rows.length === 0) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UICardWrapper, {
    compact: true,
    flush: true,
    children: [/*#__PURE__*/_jsx(UICardHeader, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.emailPerformanceReport.title"
      }),
      titleSize: "small",
      toolbar: /*#__PURE__*/_jsxs(UIButtonGroup, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          active: display === RATES,
          onClick: function onClick() {
            return setDisplay(RATES);
          },
          size: "extra-small",
          use: "tertiary-light",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.emailPerformanceReport.displayOptions.rates"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          active: display === COUNTS,
          onClick: function onClick() {
            return setDisplay(COUNTS);
          },
          size: "extra-small",
          use: "tertiary-light",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.emailPerformanceReport.displayOptions.counts"
          })
        })]
      })
    }), /*#__PURE__*/_jsxs(UITable, {
      condensed: true,
      children: [/*#__PURE__*/_jsx("thead", {
        children: /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx("th", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequences.emailPerformanceReport.columns.template"
            })
          }), /*#__PURE__*/_jsx(UISortTH, {
            align: "right",
            sort: sort.property === 'stepOrder' ? sort.direction : 'none',
            onSortChange: function onSortChange(_ref2) {
              var value = _ref2.target.value;
              return setSort({
                property: 'stepOrder',
                direction: value
              });
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequences.emailPerformanceReport.columns.stepOrder"
            })
          }), METRIC_COLUMNS.map(function (column) {
            return /*#__PURE__*/_jsx(UISortTH, {
              align: "right",
              sort: sort.property === column ? sort.direction : 'none',
              onSortChange: function onSortChange(_ref3) {
                var value = _ref3.target.value;
                return setSort({
                  property: column,
                  direction: value
                });
              },
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sequences.emailPerformanceReport.columns." + column + "." + display
              })
            }, column);
          })]
        })
      }), /*#__PURE__*/_jsx("tbody", {
        children: rows.map(function (_ref4) {
          var templateId = _ref4.templateId,
              stepOrder = _ref4.stepOrder,
              sends = _ref4.sends,
              opens = _ref4.opens,
              clicks = _ref4.clicks,
              replies = _ref4.replies,
              meetings = _ref4.meetings;
          return /*#__PURE__*/_jsxs("tr", {
            children: [/*#__PURE__*/_jsx("td", {
              children: /*#__PURE__*/_jsx(TemplateName, {
                templateId: templateId
              })
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: stepOrder + 1
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: sends
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: opens,
              display: display,
              rate: opens / sends
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: clicks,
              display: display,
              rate: clicks / sends
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: replies,
              display: display,
              rate: replies / sends
            }), /*#__PURE__*/_jsx(ValueCell, {
              count: meetings,
              display: display,
              rate: meetings / sends
            })]
          }, templateId + "-" + stepOrder);
        })
      })]
    })]
  });
}

export default SequenceTemplateReport;