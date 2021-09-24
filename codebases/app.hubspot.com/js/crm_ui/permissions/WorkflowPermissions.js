/*
Related logic used in the nav:
https://git.hubteam.com/HubSpot/Navigation/blob/master/NavigationService/src/main/java/com/hubspot/navigation/v1/core/ConditionTypes.java#L223-L261
*/
'use es6';

import ScopesContainer from '../../containers/ScopesContainer';
import { isScoped } from '../../containers/ScopeOperators';
export function canView() {
  return isScoped(ScopesContainer.get(), 'workflows-access');
}