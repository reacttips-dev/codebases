import type { PanelView } from '../store/schema/TimePanelSettingsStore';
import { getStore } from '../store/store';
import { isSupportedViewForUser } from '../utils/isSupportedViewForUser';
import { pop, push, updateTop } from 'owa-navigation-stack';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { getUserMailboxInfo } from 'owa-client-ids';
import { mutator } from 'satcheljs';
import {
    popTimePanelView,
    pushTimePanelView,
    updateTopTimePanelView,
} from '../actions/publicActions';

/**
 * Mutators for view stack
 */

mutator(pushTimePanelView, actionMessage => {
    const { newView } = actionMessage;
    if (isSupportedViewForUser(newView)) {
        push(newView, getStore().panelViewStack.stack);
    }
});

mutator(updateTopTimePanelView, actionMessage =>
    updateTopTimePanelViewInternal(actionMessage.updatedView)
);

mutator(popTimePanelView, () => {
    const { panelViewStack } = getStore();
    pop(panelViewStack.stack);
});

mutator(workloadScenarioSettingsLoaded, actionMessage => {
    const { settings, userIdentity } = actionMessage;
    if (getUserMailboxInfo().userIdentity === userIdentity && settings.timePanelSelectedView) {
        updateTopTimePanelViewInternal(settings.timePanelSelectedView);
    }
});

function updateTopTimePanelViewInternal(updatedTop: PanelView) {
    if (isSupportedViewForUser(updatedTop)) {
        updateTop(updatedTop, getStore().panelViewStack.stack);
    }
}
