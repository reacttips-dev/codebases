'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useStoreDependency } from 'general-store';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import localSettings from '../utils/localSettings';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { useTicketsAccessCheck } from './useTicketsAccessCheck';
import { useLocation, Redirect } from 'react-router-dom';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { withProvidedObjectTypeId } from '../objectTypeIdContext/components/withProvidedObjectTypeId';
export var ticketPageTypeDependency = {
  stores: [UserSettingsStore],
  deref: function deref() {
    return UserSettingsStore.get(UserSettingsKeys.TICKET_VIEWTYPE_DEFAULT);
  }
};
export function TicketsEntryRoute() {
  var location = useLocation();
  useTicketsAccessCheck();
  var localViewType = localSettings.get('tickets.default');
  var userSettingsViewType = useStoreDependency(ticketPageTypeDependency);

  if (localViewType) {
    return localViewType === INDEX ? /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/tickets/list'
      })
    }) : /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/tickets/board'
      })
    });
  }

  if (userSettingsViewType === LOADING) {
    return null;
  }

  return userSettingsViewType === INDEX ? /*#__PURE__*/_jsx(Redirect, {
    to: Object.assign({}, location, {
      pathname: '/tickets/list'
    })
  }) : /*#__PURE__*/_jsx(Redirect, {
    to: Object.assign({}, location, {
      pathname: '/tickets/board'
    })
  });
}
export default withProvidedObjectTypeId(TicketsEntryRoute, '0-5');