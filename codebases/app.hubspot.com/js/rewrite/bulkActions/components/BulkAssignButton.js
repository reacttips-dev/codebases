'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import BulkActions from '../../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { useCallback } from 'react';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { makeLegacyBulkActionWrapper } from './makeLegacyBulkActionWrapper';
import { Set as ImmutableSet } from 'immutable';
export var LegacyBulkActionWrapper = makeLegacyBulkActionWrapper(BulkActions.assign);

var BulkAssignButton = function BulkAssignButton(props) {
  var selection = props.selection;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectsUpdated = _useCrmObjectsActions.crmObjectsUpdated; // TODO: Handle "apply to all" case the same way the rewrite does, when that happens


  var handleSuccess = useCallback(function (updates) {
    crmObjectsUpdated({
      objectIds: selection.toArray(),
      propertyValues: updates
    });
  }, [crmObjectsUpdated, selection]);
  return /*#__PURE__*/_jsx(LegacyBulkActionWrapper, Object.assign({}, props, {
    onSuccess: handleSuccess
  }));
};

BulkAssignButton.propTypes = {
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  onConfirmBulkAction: PropTypes.func,
  onSuccess: PropTypes.func
};
export default BulkAssignButton;