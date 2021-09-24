'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { TABLE_BORDER_COLOR } from 'HubStyleTokens/theme';
import { TABLE_HEADER_HEIGHT } from 'HubStyleTokens/sizes';
import { addSelection, clearSelection } from '../actions/selectionActions';
import { connect } from 'react-redux';
import { getIdFromRecordOrValue } from 'customer-data-table/tableFunctions';
import { pageRowsType } from 'customer-data-table/utils/propTypes';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { memo, Fragment, useCallback, useEffect, useMemo } from 'react';
import SelectAllTr from './SelectAllTr';
import TableActionsTr, { StyledTr } from './TableActionsTr';
import styled from 'styled-components';
var MainThead = styled.thead.withConfig({
  displayName: "BulkActionThead__MainThead",
  componentId: "f0uwfu-0"
})(["display:flex;width:100%;border-bottom:", ";"], function (_ref) {
  var isSelectAllBannerVisible = _ref.isSelectAllBannerVisible;
  return isSelectAllBannerVisible ? 'none!important' : "1px solid " + TABLE_BORDER_COLOR + " !important";
});
export var SelectAllThead = styled.thead.withConfig({
  displayName: "BulkActionThead__SelectAllThead",
  componentId: "f0uwfu-1"
})(["display:flex;width:100%;position:absolute;position:sticky;top:", " !important;border:none !important;border-top:1px solid ", " '';"], TABLE_HEADER_HEIGHT, TABLE_BORDER_COLOR);
export var BulkActionThead = function BulkActionThead(props) {
  var children = props.children,
      pageRows = props.pageRows,
      dispatchAddSelection = props.dispatchAddSelection,
      dispatchClearSelection = props.dispatchClearSelection,
      colSpan = props.colSpan,
      getBulkActionProps = props.getBulkActionProps,
      selection = props.selection;

  var _getBulkActionProps = getBulkActionProps(),
      objectType = _getBulkActionProps.objectType,
      pageSize = _getBulkActionProps.pageSize,
      allSelected = _getBulkActionProps.allSelected,
      getBulkActions = _getBulkActionProps.getBulkActions,
      maxItemsToBeSelected = _getBulkActionProps.maxItemsToBeSelected,
      onSelectAllChange = _getBulkActionProps.onSelectAllChange,
      totalResults = _getBulkActionProps.totalResults,
      query = _getBulkActionProps.query,
      onSelectChange = _getBulkActionProps.onSelectChange;

  var selectedCount = allSelected ? totalResults : selection.size;
  var isBulkActionRowOpen = selectedCount > 0 && selection.size > 0;
  var isExactlyThisPageSelected = selection.size > 0 && pageRows.every(function (row) {
    return selection.has(getIdFromRecordOrValue(row._original));
  });
  var isSelectAllBannerVisible = allSelected && isExactlyThisPageSelected || isExactlyThisPageSelected;
  useEffect(function () {
    if (!isSelectAllBannerVisible) {
      onSelectAllChange(false);
    }
  }, [isSelectAllBannerVisible, onSelectAllChange, pageRows]);
  useEffect(function () {
    onSelectChange(selection);
  }, [onSelectChange, selection]);
  var onClickSelectAll = useCallback(function () {
    var pageIds = pageRows.reduce(function (acc, row) {
      return acc.add(getIdFromRecordOrValue(row._original));
    }, ImmutableSet());
    dispatchAddSelection(pageIds);
    onSelectAllChange(true);
  }, [pageRows, dispatchAddSelection, onSelectAllChange]);
  var onClickDeselectAll = useCallback(function () {
    dispatchClearSelection();
    onSelectAllChange(false);
  }, [dispatchClearSelection, onSelectAllChange]);
  var bulkActions = useMemo(function () {
    return isBulkActionRowOpen && getBulkActions ? getBulkActions({
      allSelected: allSelected,
      checked: selection,
      clearSelection: dispatchClearSelection,
      pageSize: pageSize,
      query: query,
      selectedCount: selectedCount,
      selection: selection,
      totalResults: totalResults,
      view: ImmutableMap({
        state: ImmutableMap({})
      })
    }) : [];
  }, [allSelected, dispatchClearSelection, getBulkActions, isBulkActionRowOpen, pageSize, query, selectedCount, selection, totalResults]);
  var TheadWrapper = isBulkActionRowOpen ? TableActionsTr : StyledTr;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(MainThead, {
      isSelectAllBannerVisible: isSelectAllBannerVisible,
      children: /*#__PURE__*/_jsx(TheadWrapper, {
        actions: bulkActions,
        colSpan: colSpan,
        openAtColumnIndex: 1,
        pageSize: pageSize,
        children: children.props.children
      })
    }), isSelectAllBannerVisible && /*#__PURE__*/_jsx(SelectAllThead, {
      isSelectAllBannerVisible: isSelectAllBannerVisible,
      children: /*#__PURE__*/_jsx(SelectAllTr, {
        allSelected: allSelected,
        colSpan: colSpan,
        itemsSelected: selectedCount,
        maxItemsToBeSelected: maxItemsToBeSelected,
        objectType: objectType,
        onClickDeselectAll: onClickDeselectAll,
        onClickSelectAll: onClickSelectAll,
        totalResults: totalResults
      })
    })]
  });
};
BulkActionThead.propTypes = {
  children: PropTypes.element.isRequired,
  colSpan: PropTypes.number,
  dispatchAddSelection: PropTypes.func,
  dispatchClearSelection: PropTypes.func,
  getBulkActionProps: PropTypes.func,
  pageRows: pageRowsType,
  selection: ImmutablePropTypes.setOf(PropTypes.number)
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    loading: false,
    selection: state
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    dispatchAddSelection: function dispatchAddSelection(ids) {
      dispatch(addSelection(ids));
    },
    dispatchClearSelection: function dispatchClearSelection() {
      dispatch(clearSelection());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( /*#__PURE__*/memo(BulkActionThead));