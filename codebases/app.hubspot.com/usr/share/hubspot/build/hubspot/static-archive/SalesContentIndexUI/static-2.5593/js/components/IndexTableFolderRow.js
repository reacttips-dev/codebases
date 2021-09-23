'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Children } from 'react';
import { List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import cloneElement from 'SalesContentIndexUI/utils/cloneElement';
import UIIcon from 'UIComponents/icon/UIIcon';
import IndexTableRowCellSlot from 'SalesContentIndexUI/slots/IndexTableRowCellSlot';
import IndexTableCheckboxCell from './IndexTableCheckboxCell';
import UILink from 'UIComponents/link/UILink';
import * as colors from 'HubStyleTokens/colors';
export default createReactClass({
  displayName: "IndexTableFolderRow",
  mixins: [PureRenderMixin],
  propTypes: {
    children: PropTypes.any,
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
    selectionData: PropTypes.object.isRequired,
    setSelectedFolder: PropTypes.func.isRequired,
    toggleFolderSelection: PropTypes.func.isRequired,
    isModal: PropTypes.bool.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isModal: false
    };
  },
  getCells: function getCells() {
    var _this$props = this.props,
        children = _this$props.children,
        searchResult = _this$props.searchResult;
    var cells = List();
    Children.forEach(children, function (child) {
      var childType = child ? child.type : '';

      switch (childType) {
        case IndexTableRowCellSlot:
          {
            var childWithProps = cloneElement(child, {
              key: "index-folder-row-cell-" + searchResult.id + "-" + cells.size + "}",
              searchResult: searchResult
            });
            cells = cells.push(childWithProps);
            break;
          }

        default:
          break;
      }
    });
    return cells;
  },
  handleOpen: function handleOpen() {
    var _this$props2 = this.props,
        searchResult = _this$props2.searchResult,
        setSelectedFolder = _this$props2.setSelectedFolder;
    setSelectedFolder(searchResult);
  },
  handleToggleSelection: function handleToggleSelection() {
    var _this$props3 = this.props,
        searchResult = _this$props3.searchResult,
        toggleFolderSelection = _this$props3.toggleFolderSelection;
    toggleFolderSelection(searchResult);
  },
  renderCheckboxCell: function renderCheckboxCell() {
    var _this$props4 = this.props,
        selectionData = _this$props4.selectionData,
        searchResult = _this$props4.searchResult,
        isModal = _this$props4.isModal;

    if (isModal) {
      return null;
    }

    return /*#__PURE__*/_jsx(IndexTableCheckboxCell, {
      contentId: searchResult.contentId,
      selectionData: selectionData,
      toggleSelection: this.handleToggleSelection,
      isFolder: true
    });
  },
  renderFolderCell: function renderFolderCell() {
    return /*#__PURE__*/_jsx("td", {
      children: /*#__PURE__*/_jsxs(UILink, {
        onClick: this.handleOpen,
        "data-selenium-test": "sales-content-index-table-folder-link",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          color: colors.CALYPSO,
          name: "folder"
        }), this.props.searchResult.get('name')]
      })
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("tr", {
      className: "sales-content-index-folder-row",
      children: [this.renderCheckboxCell(), this.renderFolderCell(), this.getCells()]
    });
  }
});