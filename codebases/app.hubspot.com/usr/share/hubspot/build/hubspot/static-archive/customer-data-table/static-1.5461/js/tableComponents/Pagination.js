'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { NumberIsNaN } from '../utils/polyfills';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UIPaginator from 'UIComponents/paginator/UIPaginator'; // We can't do an offset of more than 10,000
// Pagination should be disabled for any page that would have an offset of over 10,000

export var getMaxPages = function getMaxPages(pageSize) {
  return 10000 / pageSize;
};

var Pagination = /*#__PURE__*/function (_PureComponent) {
  _inherits(Pagination, _PureComponent);

  function Pagination(props) {
    var _this;

    _classCallCheck(this, Pagination);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Pagination).call(this, props));
    _this.getSafePage = _this.getSafePage.bind(_assertThisInitialized(_this));
    _this.changePage = _this.changePage.bind(_assertThisInitialized(_this));
    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(Pagination, [{
    key: "getSafePage",
    value: function getSafePage(page) {
      var safePage = NumberIsNaN(page) ? this.props.page : page;
      return Math.min(Math.max(safePage, 0), this.props.pages - 1);
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      var safePage = this.getSafePage(page);
      this.setState({
        page: safePage
      });

      if (this.props.page !== safePage) {
        this.props.onPageChange(safePage);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _pages = _this$props.pages,
          maxVisiblePageButtons = _this$props.maxVisiblePageButtons,
          showPageSizeOptions = _this$props.showPageSizeOptions,
          manual = _this$props.manual,
          pageSizeOptions = _this$props.pageSizeOptions,
          pageSize = _this$props.pageSize,
          onPageSizeChange = _this$props.onPageSizeChange,
          _this$props$showFirst = _this$props.showFirstLastButtons,
          showFirstLastButtons = _this$props$showFirst === void 0 ? false : _this$props$showFirst,
          pagination = _this$props.pagination;
      var page = manual ? this.props.page : this.state.page;
      var pages = _pages < 1 ? 1 : _pages;

      if (pagination) {
        return /*#__PURE__*/_jsxs(UIFlex, {
          align: "baseline",
          justify: "center",
          children: [/*#__PURE__*/_jsx(UIPaginator, {
            maxVisiblePageButtons: maxVisiblePageButtons || pages ? 11 : 0,
            onPageChange: function onPageChange(_ref) {
              var value = _ref.target.value;

              _this2.changePage(value - 1);
            },
            page: page + 1,
            pageCount: pages < 101 ? pages : 100,
            showFirstLastButtons: showFirstLastButtons
          }), showPageSizeOptions && /*#__PURE__*/_jsx(UIDropdown, {
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
      }

      return null;
    }
  }]);

  return Pagination;
}(PureComponent);

Pagination.propTypes = {
  manual: PropTypes.bool,
  maxVisiblePageButtons: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  pages: PropTypes.number,
  pagination: PropTypes.bool,
  showFirstLastButtons: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool
};
Pagination.defaultProps = {
  pagination: true
};
export default Pagination;