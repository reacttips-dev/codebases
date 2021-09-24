'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Set as ImmutableSet } from 'immutable';
import { addSelection, removeSelection } from '../actions/selectionActions';
import { connect } from 'react-redux';
import { maybeRowId } from '../tableFunctions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import UICheckbox from 'UIComponents/input/UICheckbox';
import styled from 'styled-components';
import unescapedText from 'I18n/utils/unescapedText';
export var StyledUICheckbox = styled(UICheckbox).withConfig({
  displayName: "SelectCell__StyledUICheckbox",
  componentId: "ylzhus-0"
})(["margin:0 auto;width:calc( 1.25em + 1px );"]);
export var SelectCell = function SelectCell(props) {
  var dispatchAddSelection = props.dispatchAddSelection,
      dispatchRemoveSelection = props.dispatchRemoveSelection,
      row = props.row,
      viewIndex = props.viewIndex,
      selection = props.selection;
  var checked = selection.has(maybeRowId(row));
  var onChange = useCallback(function () {
    var id = maybeRowId(row);

    if (checked) {
      dispatchRemoveSelection(ImmutableSet.of(id));
    } else {
      dispatchAddSelection(ImmutableSet.of(id));
    }
  }, [checked, dispatchAddSelection, dispatchRemoveSelection, row]);
  return /*#__PURE__*/_jsx(StyledUICheckbox, {
    alignment: "center",
    "aria-label": unescapedText('customerDataTable.selection.selectOne', {
      value: viewIndex
    }),
    checked: checked,
    "data-selenium-test": "BulkActionCheckboxCell__checkbox" // TODO: make this a prop
    ,
    innerPadding: "none",
    onChange: onChange
  });
};
SelectCell.propTypes = {
  dispatchAddSelection: PropTypes.func.isRequired,
  dispatchRemoveSelection: PropTypes.func.isRequired,
  row: PropTypes.object,
  selection: ImmutablePropTypes.setOf(PropTypes.number).isRequired,
  viewIndex: PropTypes.number.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    selection: state
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    dispatchAddSelection: function dispatchAddSelection(id) {
      dispatch(addSelection(id));
    },
    dispatchRemoveSelection: function dispatchRemoveSelection(id) {
      dispatch(removeSelection(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( /*#__PURE__*/memo(SelectCell));