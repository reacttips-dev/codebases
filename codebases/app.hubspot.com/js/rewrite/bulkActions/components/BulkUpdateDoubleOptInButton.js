'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import BulkActions from '../../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { makeLegacyBulkActionWrapper } from './makeLegacyBulkActionWrapper';
import { useDoubleOptInFetchStatus } from '../../doubleOptIn/hooks/useDoubleOptInFetchStatus';
export var LegacyUpdateDoubleOptInButton = makeLegacyBulkActionWrapper(BulkActions.updateDoubleOptIn);

var BulkUpdateDoubleOptInButton = function BulkUpdateDoubleOptInButton(props) {
  var status = useDoubleOptInFetchStatus();

  if (![SUCCEEDED, FAILED].includes(status)) {
    return null;
  }

  return /*#__PURE__*/_jsx(LegacyUpdateDoubleOptInButton, Object.assign({}, props));
};

BulkUpdateDoubleOptInButton.propTypes = {
  query: PropTypes.object,
  queryHydrationStatus: PropTypes.oneOf([UNINITIALIZED, PENDING, SUCCEEDED, FAILED]).isRequired,
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  inDropdown: PropTypes.bool,
  onConfirmBulkAction: PropTypes.func,
  onSuccess: PropTypes.func
};
export default BulkUpdateDoubleOptInButton;