import type { PanelView } from '../store/schema/TimePanelSettingsStore';
import { getStore } from '../store/store';
import { getTopOfStack } from 'owa-navigation-stack';
import { getPanelViewType } from '../utils/getPanelViewType';
import type { TimePanelSelectedViewType } from 'owa-scenario-settings';

export function getCurrentPanelViewType(): TimePanelSelectedViewType {
    return getPanelViewType(getCurrentPanelView());
}

export function getCurrentPanelView(): PanelView {
    const { panelViewStack } = getStore();
    return getTopOfStack(panelViewStack.stack);
}

export function getStackLength(): number {
    const { panelViewStack } = getStore();
    return panelViewStack.stack.length;
}

export function isShowingConflictsView(): boolean {
    const { panelViewStack } = getStore();
    return panelViewStack.stack.indexOf('Conflicts') !== -1;
}

export function isShowingAttendeeTrackingView(): boolean {
    const { panelViewStack } = getStore();
    return panelViewStack.stack.indexOf('AttendeeTracking') !== -1;
}

export function getPreviousPanelView(): PanelView {
    const { panelViewStack } = getStore();
    if (getStackLength() >= 2) {
        return panelViewStack.stack[getStackLength() - 2];
    } else {
        return null;
    }
}
