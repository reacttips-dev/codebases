'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Children } from 'react';
import { fromJS, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import cloneElement from 'SalesContentIndexUI/utils/cloneElement';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';
import IndexTableRowHoverCellSlot from 'SalesContentIndexUI/slots/IndexTableRowHoverCellSlot';
import IndexTableCheckboxCell from './IndexTableCheckboxCell';

function isClickInActionButton(el) {
  var actionsParentMaybe = el.parentElement;

  while (actionsParentMaybe && actionsParentMaybe.classList && !actionsParentMaybe.classList.contains('sales-content-table-actions')) {
    actionsParentMaybe = actionsParentMaybe.parentElement;
  }

  return Boolean(actionsParentMaybe);
}

export default createReactClass({
  displayName: "IndexTableRow",
  mixins: [PureRenderMixin],
  propTypes: {
    children: PropTypes.any,
    selectionData: PropTypes.object,
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
    isPreview: PropTypes.bool.isRequired,
    isModal: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    toggleRowSelection: PropTypes.func,
    onClick: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isPreview: false,
      isModal: false,
      disabled: false
    };
  },
  getChildMap: function getChildMap() {
    var _this$props = this.props,
        children = _this$props.children,
        searchResult = _this$props.searchResult;
    var childMap = fromJS({
      cells: List()
    });
    Children.forEach(children, function (child) {
      var childType = child ? child.type : '';

      switch (childType) {
        case IndexTableRowCellSlot:
        case IndexTableRowHoverCellSlot:
          {
            var childWithProps = cloneElement(child, {
              searchResult: searchResult
            });
            childMap = childMap.update('cells', function (cells) {
              return cells.push(Object.assign({}, childWithProps, {
                key: "index-table-row-cell-" + searchResult.id + "-" + cells.size + "}"
              }));
            });
            break;
          }

        default:
          break;
      }
    });
    return childMap;
  },
  handleToggleSelection: function handleToggleSelection() {
    this.props.toggleRowSelection(this.props.searchResult);
  },
  handleClick: function handleClick(e) {
    var onClick = this.props.onClick;
    var isAction = isClickInActionButton(e.target);

    if (!isAction && onClick) {
      onClick(e);
    }
  },
  renderCheckboxCell: function renderCheckboxCell() {
    var _this$props2 = this.props,
        selectionData = _this$props2.selectionData,
        searchResult = _this$props2.searchResult,
        isPreview = _this$props2.isPreview,
        isModal = _this$props2.isModal,
        disabled = _this$props2.disabled;

    if (isModal) {
      return null;
    } else if (isPreview) {
      return /*#__PURE__*/_jsx("td", {});
    }

    return /*#__PURE__*/_jsx(IndexTableCheckboxCell, {
      contentId: searchResult.get('contentId'),
      selectionData: selectionData,
      toggleSelection: this.handleToggleSelection,
      disabled: disabled
    });
  },
  render: function render() {
    var hasOnClick = Boolean(this.props.onClick);
    return /*#__PURE__*/_jsxs("tr", {
      className: 'table-row' + (hasOnClick ? " pointer" : ""),
      onClick: hasOnClick ? this.handleClick : null,
      children: [this.renderCheckboxCell(), this.getChildMap().get('cells')]
    });
  }
});