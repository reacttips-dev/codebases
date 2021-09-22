import { registerAdditionalQuickActions } from 'owa-search-actions';
import { orchestrator } from 'satcheljs';
import { registerAdditionalQuickActionsInternal } from '../selectors/getAdditionalQuickActions';

export default orchestrator(registerAdditionalQuickActions, actionMessage => {
    registerAdditionalQuickActionsInternal(actionMessage.scenarioId, actionMessage.callback);
});
