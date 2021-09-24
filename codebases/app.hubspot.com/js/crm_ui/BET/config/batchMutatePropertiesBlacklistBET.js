// works alongside `crm_ui/config/batchMutatePropertiesBlacklist`
'use es6';

import ScopesContainer from '../../../containers/ScopesContainer';
import { isScoped } from '../../../containers/ScopeOperators';

function batchMutatePropertiesBlacklistBET() {
  if (!isScoped(ScopesContainer.get(), 'bet-restrict-deal-stage-bulk-edit')) {
    return {};
  }

  return {
    DEAL: ['dealstage']
  };
}

export default batchMutatePropertiesBlacklistBET();