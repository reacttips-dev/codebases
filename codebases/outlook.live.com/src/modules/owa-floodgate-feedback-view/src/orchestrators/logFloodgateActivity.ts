import { logFloodgateActivity } from '../actions/publicActions';
import { default as loadAndInitializeFloodgateEngine } from '../utils/loadAndInitializeFloodgateEngine';
import { orchestrator } from 'satcheljs';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default orchestrator(logFloodgateActivity, async actionMessage => {
    const { IsConsumerChild } = getUserConfiguration();

    if (!isHostAppFeatureEnabled('floodgate') || IsConsumerChild) {
        return;
    }

    // Make sure the engine is loaded. If loaded, this is a no-op
    await loadAndInitializeFloodgateEngine(actionMessage.searchTraceId, false);

    // Then log the activity
    if (window.OfficeBrowserFeedback?.floodgate) {
        const floodGateEngine = window.OfficeBrowserFeedback.floodgate.getEngine();
        if (floodGateEngine) {
            floodGateEngine.getActivityListener().logActivity(actionMessage.activityType);
        }
    }
});
