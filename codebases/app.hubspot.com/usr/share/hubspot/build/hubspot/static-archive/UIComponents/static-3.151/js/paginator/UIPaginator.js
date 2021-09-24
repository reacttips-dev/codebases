'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import partial from 'react-utils/partial';
import classNames from 'classnames';
import SyntheticEvent from '../core/SyntheticEvent';
import UITooltip from '../tooltip/UITooltip';
import UIButton from '../button/UIButton';
import UIIcon from '../icon/UIIcon';
import Controllable from '../decorators/Controllable';

var getMinAndMaxPageNumbers = function getMinAndMaxPageNumbers(maxVisiblePageButtons, page, pageCount) {
  var buffer = (maxVisiblePageButtons - 1) / 2;
  var min = page - buffer;
  var max = page + buffer;
  var numPagesToShow = Math.min(maxVisiblePageButtons, pageCount);

  if (min < 1) {
    min = 1;
    max = min + maxVisiblePageButtons - 1;
  }

  if (max > pageCount) {
    max = Math.max(pageCount, 1);
    min = max - numPagesToShow + 1;
  }

  return [Math.floor(min), Math.floor(max)];
};

var UIPaginator = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIPaginator, _PureComponent);

  function UIPaginator() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIPaginator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIPaginator)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.goToPage = function (page) {
      if (page === _this.props.page) return;

      _this.props.onPageChange(SyntheticEvent(page));
    };

    return _this;
  }

  _createClass(UIPaginator, [{
    key: "renderPageNumber",
    value: function renderPageNumber(_ref) {
      var disabledPageTooltipTitle = _ref.disabledPageTooltipTitle,
          enabledPageLimit = _ref.enabledPageLimit,
          isActive = _ref.isActive,
          key = _ref.key,
          pageNumber = _ref.pageNumber,
          rest = _objectWithoutProperties(_ref, ["disabledPageTooltipTitle", "enabledPageLimit", "isActive", "key", "pageNumber"]);

      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: enabledPageLimit == null || enabledPageLimit != null && pageNumber <= enabledPageLimit,
        title: disabledPageTooltipTitle,
        children: /*#__PURE__*/_jsxs(UIButton, Object.assign({}, rest, {
          className: "private-paginator__button private-paginator__button--numeric" + (isActive ? " private-paginator__button--active" : ""),
          "data-page-number": pageNumber,
          disabled: enabledPageLimit != null && pageNumber > enabledPageLimit,
          onClick: partial(this.goToPage, pageNumber),
          responsive: false,
          size: "xs",
          use: "transparent",
          children: [/*#__PURE__*/_jsxs("span", {
            className: "sr-only",
            children: [isActive ? I18n.text('salesUI.UIPaginator.pageNumber.currentIndicator') : null, I18n.text('salesUI.UIPaginator.pageNumber.description')]
          }), pageNumber]
        }))
      }, key);
    }
  }, {
    key: "renderNumberedPages",
    value: function renderNumberedPages(maxVisiblePageButtons, page, pageCount, enabledPageLimit, disabledPageTooltipTitle) {
      var _getMinAndMaxPageNumb = getMinAndMaxPageNumbers(maxVisiblePageButtons, page, pageCount),
          _getMinAndMaxPageNumb2 = _slicedToArray(_getMinAndMaxPageNumb, 2),
          min = _getMinAndMaxPageNumb2[0],
          max = _getMinAndMaxPageNumb2[1];

      var links = [];

      for (var currentPage = min; currentPage <= max; currentPage++) {
        var isActive = currentPage === page;
        links.push(this.renderPageNumber({
          'aria-current': isActive ? 'true' : null,
          disabledPageTooltipTitle: disabledPageTooltipTitle,
          enabledPageLimit: enabledPageLimit,
          isActive: isActive,
          key: currentPage - min,
          pageNumber: currentPage
        }));
      }

      return links;
    }
  }, {
    key: "renderLastPageNumber",
    value: function renderLastPageNumber(maxVisiblePageButtons, page, pageCount, enabledPageLimit, disabledPageTooltipTitle) {
      var _getMinAndMaxPageNumb3 = getMinAndMaxPageNumbers(maxVisiblePageButtons, page, pageCount),
          _getMinAndMaxPageNumb4 = _slicedToArray(_getMinAndMaxPageNumb3, 2),
          min = _getMinAndMaxPageNumb4[0],
          max = _getMinAndMaxPageNumb4[1];

      if (maxVisiblePageButtons < 1 || pageCount < 1 || pageCount === Infinity || pageCount >= min && pageCount <= max) {
        return null;
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [pageCount !== max + 1 && /*#__PURE__*/_jsx(UIIcon, {
          name: "ellipses",
          size: 22,
          className: "p-all-0 m-y-0 m-x-4 align-self-end"
        }), this.renderPageNumber({
          disabledPageTooltipTitle: disabledPageTooltipTitle,
          enabledPageLimit: enabledPageLimit,
          pageNumber: pageCount
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          disabledPageTooltipTitle = _this$props.disabledPageTooltipTitle,
          enabledPageLimit = _this$props.enabledPageLimit,
          maxVisiblePageButtons = _this$props.maxVisiblePageButtons,
          __onPageChange = _this$props.onPageChange,
          page = _this$props.page,
          pageCount = _this$props.pageCount,
          showFirstLastButtons = _this$props.showFirstLastButtons,
          showLastPageNumber = _this$props.showLastPageNumber,
          showButtonLabels = _this$props.showButtonLabels,
          rest = _objectWithoutProperties(_this$props, ["className", "disabledPageTooltipTitle", "enabledPageLimit", "maxVisiblePageButtons", "onPageChange", "page", "pageCount", "showFirstLastButtons", "showLastPageNumber", "showButtonLabels"]);

      var arrowButtonClassName = showButtonLabels ? '' : 'sr-only';
      return /*#__PURE__*/_jsxs("nav", Object.assign({
        "aria-label": I18n.text('salesUI.UIPaginator.label'),
        className: classNames('private-paginator', className),
        "data-current-page": page,
        role: "navigation"
      }, rest, {
        children: [/*#__PURE__*/_jsxs("span", {
          className: "private-paginator__backward-controls",
          children: [showFirstLastButtons ? /*#__PURE__*/_jsxs(UIButton, {
            "aria-label": I18n.text('salesUI.UIPaginator.firstPage.description'),
            className: "private-paginator__button",
            "data-first-page": true,
            disabled: page < 2,
            onClick: partial(this.goToPage, 1),
            responsive: false,
            size: "xs",
            use: "transparent",
            children: [/*#__PURE__*/_jsx(UIIcon, {
              className: "private-paginator__icon",
              name: "first"
            }), /*#__PURE__*/_jsx("span", {
              className: arrowButtonClassName,
              children: I18n.text('salesUI.UIPaginator.firstPage.label')
            })]
          }, "first") : null, /*#__PURE__*/_jsxs(UIButton, {
            "aria-label": I18n.text('salesUI.UIPaginator.previousPage.description'),
            className: "private-paginator__button",
            "data-prev-page": true,
            disabled: page < 2,
            onClick: partial(this.goToPage, Math.max(page - 1, 1)),
            responsive: false,
            size: "xs",
            use: "transparent",
            children: [/*#__PURE__*/_jsx(UIIcon, {
              className: "private-paginator__icon",
              name: "left",
              size: "xs"
            }), /*#__PURE__*/_jsx("span", {
              className: arrowButtonClassName,
              children: I18n.text('salesUI.UIPaginator.previousPage.label')
            })]
          }, "prev")]
        }), /*#__PURE__*/_jsxs("span", {
          className: "private-paginator__numbers",
          children: [this.renderNumberedPages(maxVisiblePageButtons, page, pageCount, enabledPageLimit, disabledPageTooltipTitle), showLastPageNumber && this.renderLastPageNumber(maxVisiblePageButtons, page, pageCount, enabledPageLimit, disabledPageTooltipTitle)]
        }), /*#__PURE__*/_jsxs("span", {
          className: "private-paginator__forward-controls",
          children: [/*#__PURE__*/_jsxs(UIButton, {
            "aria-label": I18n.text('salesUI.UIPaginator.nextPage.description'),
            className: "private-paginator__button",
            "data-next-page": true,
            disabled: page >= pageCount || enabledPageLimit != null && page >= enabledPageLimit,
            onClick: partial(this.goToPage, Math.min(page + 1, pageCount)),
            responsive: false,
            size: "xs",
            use: "transparent",
            children: [/*#__PURE__*/_jsx("span", {
              className: arrowButtonClassName,
              children: I18n.text('salesUI.UIPaginator.nextPage.label')
            }), /*#__PURE__*/_jsx(UIIcon, {
              className: "private-paginator__icon",
              name: "right",
              size: "xs"
            })]
          }, "next"), showFirstLastButtons ? /*#__PURE__*/_jsxs(UIButton, {
            "aria-label": I18n.text('salesUI.UIPaginator.lastPage.description'),
            className: "private-paginator__button",
            "data-last-page": true,
            disabled: enabledPageLimit != null ? page >= enabledPageLimit : pageCount === page,
            onClick: partial(this.goToPage, enabledPageLimit != null ? enabledPageLimit : pageCount),
            responsive: false,
            size: "xs",
            use: "transparent",
            children: [/*#__PURE__*/_jsx("span", {
              className: arrowButtonClassName,
              children: I18n.text('salesUI.UIPaginator.lastPage.label')
            }), /*#__PURE__*/_jsx(UIIcon, {
              className: "private-paginator__icon",
              name: "last"
            })]
          }, "last") : null]
        })]
      }));
    }
  }]);

  return UIPaginator;
}(PureComponent);

UIPaginator.propTypes = {
  className: PropTypes.string,
  disabledPageTooltipTitle: PropTypes.node,
  maxVisiblePageButtons: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  enabledPageLimit: PropTypes.number,

  /*
   * Show buttons for navigating to the first and
   * last pages. Requires a finite positive `pageCount`.
   */
  showFirstLastButtons: PropTypes.bool.isRequired,

  /*
   * Show the last page number after an ellipsis.
   * Requires a finite positive `pageCount`.
   */
  showLastPageNumber: PropTypes.bool,
  showButtonLabels: PropTypes.bool.isRequired
};
UIPaginator.defaultProps = {
  maxVisiblePageButtons: 11,
  showFirstLastButtons: false,
  showButtonLabels: true,
  page: 1
};
UIPaginator.displayName = 'UIPaginator';
export default Controllable(UIPaginator, ['page']);