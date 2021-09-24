'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import BulkActions from '../../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { useCallback } from 'react';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { makeLegacyBulkActionWrapper } from './makeLegacyBulkActionWrapper';
export var LegacyBulkEditWrapper = makeLegacyBulkActionWrapper(BulkActions.edit);

var LegacyBulkEditButton = function LegacyBulkEditButton(props) {
  var selection = props.selection;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectsUpdated = _useCrmObjectsActions.crmObjectsUpdated;

  var handleSuccess = useCallback(function (updates) {
    crmObjectsUpdated({
      objectIds: selection.toArray(),
      propertyValues: updates
    });
  }, [crmObjectsUpdated, selection]);
  return /*#__PURE__*/_jsx(LegacyBulkEditWrapper, Object.assign({}, props, {
    onSuccess: handleSuccess
  }));
};

LegacyBulkEditButton.propTypes = {
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  onConfirmBulkAction: PropTypes.func,
  onSuccess: PropTypes.func
};
export default LegacyBulkEditButton;