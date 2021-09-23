'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import BulkActions from '../../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { useCallback } from 'react';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { makeLegacyBulkActionWrapper } from './makeLegacyBulkActionWrapper';
export var LegacyBulkDeleteWrapper = makeLegacyBulkActionWrapper(BulkActions.bulkDelete);

var LegacyBulkDeleteButton = function LegacyBulkDeleteButton(props) {
  var selection = props.selection;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectsDeleted = _useCrmObjectsActions.crmObjectsDeleted;

  var handleSuccess = useCallback(function () {
    crmObjectsDeleted({
      objectIds: selection.toArray()
    });
  }, [crmObjectsDeleted, selection]);
  return /*#__PURE__*/_jsx(LegacyBulkDeleteWrapper, Object.assign({}, props, {
    onSuccess: handleSuccess
  }));
};

LegacyBulkDeleteButton.propTypes = {
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  onConfirmBulkAction: PropTypes.func,
  onSuccess: PropTypes.func
};
export default LegacyBulkDeleteButton;