'use es6';

import { useStoreDependency } from 'general-store';
import UserStore from 'crm_data/user/UserStore';
import { useSelector } from 'react-redux';
import { getCurrentUserId } from '../../rewrite/auth/selectors/authSelectors';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
export var userIdDependency = {
  stores: [UserStore],
  deref: function deref() {
    return UserStore.get('user_id');
  }
};
export var useConditionalUserId = function useConditionalUserId() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getCurrentUserId);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(userIdDependency);
};