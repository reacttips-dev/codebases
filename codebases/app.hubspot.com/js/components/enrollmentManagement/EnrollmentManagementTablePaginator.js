'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
import { PAGE_SIZES } from '../../records/SequenceSearchQuery';

var EnrollmentManagementTablePaginator = function EnrollmentManagementTablePaginator(_ref) {
  var limit = _ref.limit,
      onUpdateQuery = _ref.onUpdateQuery,
      query = _ref.query,
      showPageSizeOptions = _ref.showPageSizeOptions,
      totalRecords = _ref.totalRecords;
  var pageSize = query.get('count');
  var handlePageChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    var newOffset = (value - 1) * pageSize;
    var newQuery = query.set('offset', newOffset);
    onUpdateQuery(newQuery);
  }, [pageSize, query, onUpdateQuery]);

  var updatePageSize = function updatePageSize(newPageSize) {
    return onUpdateQuery(query.merge({
      offset: 0,
      count: newPageSize
    }));
  };

  if (!pageSize) {
    return null;
  }

  var total = limit && limit < totalRecords ? limit : totalRecords;
  var offset = query.offset;
  var numPages = Math.ceil(total / pageSize);
  var currentPage = offset / pageSize + 1;
  return /*#__PURE__*/_jsxs(UIFlex, {
    justify: "center",
    align: "baseline",
    children: [/*#__PURE__*/_jsx(UIPaginator, {
      className: "m-bottom-4",
      onPageChange: handlePageChange,
      page: currentPage,
      pageCount: numPages,
      showFirstLastButtons: numPages > 5
    }), showPageSizeOptions && /*#__PURE__*/_jsx(UIDropdown, {
      buttonUse: "transparent",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.enrollmentTable.pageSizeOption",
        options: {
          count: pageSize
        }
      }),
      buttonClassName: "m-left-4",
      children: /*#__PURE__*/_jsx(UIList, {
        children: PAGE_SIZES.map(function (pageSizeOption) {
          return /*#__PURE__*/_jsx(UIButton, {
            onClick: function onClick() {
              return updatePageSize(pageSizeOption);
            },
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequences.enrollmentTable.pageSizeOption",
              options: {
                count: pageSizeOption
              }
            })
          }, pageSizeOption + "-page-size");
        })
      })
    })]
  });
};

EnrollmentManagementTablePaginator.propTypes = {
  limit: PropTypes.number,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  showPageSizeOptions: PropTypes.bool,
  totalRecords: PropTypes.number.isRequired
};
export default EnrollmentManagementTablePaginator;