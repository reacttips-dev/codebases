'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
import isNumber from 'transmute/isNumber';
var RESULTSET_LIMIT = 10000; // max records to allow pagination through

var getSafePage = function getSafePage(pageCount, prevPage, nextPage) {
  var safePage = isNumber(nextPage) ? nextPage : prevPage;
  return Math.min(Math.max(safePage, 0), pageCount - 1);
};

var changePage = function changePage(onPageChange, pageCount, prevPage, nextPage) {
  var safePage = getSafePage(pageCount, prevPage, nextPage);

  if (prevPage !== safePage) {
    onPageChange(safePage);
  }
};

var DataTablePaginator = function DataTablePaginator(props) {
  var page = props.page,
      pages = props.pages,
      pageSizeOptions = props.pageSizeOptions,
      pageSize = props.pageSize,
      _onPageChange = props.onPageChange,
      onPageSizeChange = props.onPageSizeChange,
      pagination = props.pagination;

  if (!pagination) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "baseline",
    justify: "center",
    children: [/*#__PURE__*/_jsx(UIPaginator, {
      disabledPageTooltipTitle: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "GenericGrid.pagination.disabledLimitTooltip"
      }),
      enabledPageLimit: RESULTSET_LIMIT / pageSize,
      onPageChange: function onPageChange(_ref) {
        var value = _ref.target.value;
        changePage(_onPageChange, pages, page, value - 1);
      },
      page: page + 1,
      pageCount: pages < 1 ? 1 : pages
    }), /*#__PURE__*/_jsx(UIDropdown, {
      buttonClassName: "m-left-4",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataTable.pagination.perPage",
        options: {
          count: pageSize
        }
      }),
      buttonUse: "transparent",
      children: /*#__PURE__*/_jsx(UIList, {
        children: pageSizeOptions.map(function (option, i) {
          return /*#__PURE__*/_jsx(UIButton, {
            onClick: function onClick() {
              return onPageSizeChange(Number(option));
            },
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataTable.pagination.perPage",
              options: {
                count: option
              }
            })
          }, i);
        })
      })
    })]
  });
};

DataTablePaginator.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  pages: PropTypes.number.isRequired,
  pagination: PropTypes.bool
};
DataTablePaginator.defaultProps = {
  pagination: true
};
export default DataTablePaginator;