'use es6';

import { VISIT } from 'customer-data-objects/constants/ObjectTypes';
import ScopesContainer from '../../containers/ScopesContainer';
import { isScoped } from '../../containers/ScopeOperators';
export default (function (objectType) {
  if (objectType === VISIT) {
    return 'all';
  } else if (isScoped(ScopesContainer.get(), 'super-user') || isScoped(ScopesContainer.get(), 'crm-views-all')) {
    return 'all';
  }

  return 'my';
});