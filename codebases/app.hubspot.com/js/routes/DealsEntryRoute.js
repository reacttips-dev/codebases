'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useStoreDependency } from 'general-store';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import localSettings from '../utils/localSettings';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { useLocation, Redirect } from 'react-router-dom';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { withProvidedObjectTypeId } from '../objectTypeIdContext/components/withProvidedObjectTypeId';
export var dealPageTypeDependency = {
  stores: [UserSettingsStore],
  deref: function deref() {
    return UserSettingsStore.get(UserSettingsKeys.DEAL_VIEWTYPE_DEFAULT);
  }
};
export function DealsEntryRoute() {
  var location = useLocation();
  var localViewType = localSettings.get('deals.default');
  var userSettingsViewType = useStoreDependency(dealPageTypeDependency);

  if (localViewType) {
    return localViewType === INDEX ? /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/deals/list'
      })
    }) : /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/deals/board'
      })
    });
  }

  if (userSettingsViewType === LOADING) {
    return null;
  }

  return userSettingsViewType === INDEX ? /*#__PURE__*/_jsx(Redirect, {
    to: Object.assign({}, location, {
      pathname: '/deals/list'
    })
  }) : /*#__PURE__*/_jsx(Redirect, {
    to: Object.assign({}, location, {
      pathname: '/deals/board'
    })
  });
}
export default withProvidedObjectTypeId(DealsEntryRoute, '0-3');