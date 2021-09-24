'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Set as ImmutableSet } from 'immutable';
import { addSelection, clearSelection } from '../actions/selectionActions';
import { connect } from 'react-redux';
import { getIdFromRecordOrValue } from 'customer-data-table/tableFunctions';
import { pageRowsType } from 'customer-data-table/utils/propTypes';
import I18n from 'I18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import UICheckbox from 'UIComponents/input/UICheckbox';
export var SelectViewCell = function SelectViewCell(props) {
  var pageRows = props.data,
      dispatchAddSelection = props.dispatchAddSelection,
      dispatchClearSelection = props.dispatchClearSelection,
      loading = props.loading,
      onSelectAllChange = props.onSelectAllChange,
      selection = props.selection;
  var isExactlyThisPageSelected = selection.size > 0 && pageRows.every(function (row) {
    return selection.has(getIdFromRecordOrValue(row._original));
  });
  var onClick = useCallback(function () {
    if (isExactlyThisPageSelected) {
      dispatchClearSelection();
      onSelectAllChange(false);
    } else {
      var pageIds = pageRows.reduce(function (acc, row) {
        return acc.add(getIdFromRecordOrValue(row._original));
      }, ImmutableSet());
      dispatchAddSelection(pageIds);
    }
  }, [dispatchAddSelection, dispatchClearSelection, isExactlyThisPageSelected, onSelectAllChange, pageRows]);
  return /*#__PURE__*/_jsx(UICheckbox, {
    alignment: "center",
    "aria-label": I18n.text('customerDataTable.selection.selectAllAria'),
    checked: isExactlyThisPageSelected,
    "data-selenium-test": "DataGridHeaderRow__select-all-checkbox" // TODO: This should be a prop and not hard coded to the CRM
    ,
    disabled: loading,
    indeterminate: selection.size > 0 && !isExactlyThisPageSelected,
    innerPadding: "none",
    onClick: onClick
  });
};
SelectViewCell.propTypes = {
  data: pageRowsType,
  dispatchAddSelection: PropTypes.func.isRequired,
  dispatchClearSelection: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onSelectAllChange: PropTypes.func.isRequired,
  selection: ImmutablePropTypes.setOf(PropTypes.number).isRequired
};
SelectViewCell.defaultProps = {
  data: [],
  loading: true
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

export default connect(mapStateToProps, mapDispatchToProps)( /*#__PURE__*/memo(SelectViewCell));