import getStore from '../store/store';
import type { DropViewState } from 'owa-dnd';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';

// TIME PANEL DND VIEW SELECTORS

export function isTimePanelDndViewEnabled(): boolean {
    // IE11 support for DnD is very inconsistent, so we have decided to disable Time Panel DnD for IE11
    if (isBrowserIE()) {
        return false;
    }
    const panelView = getCurrentPanelView();
    return panelView === 'Calendar' || panelView === 'Tasks';
}

// TIME PANEL DATA STATE SELECTORS

export function isTimePanelDataInitialized(): boolean {
    return getStore().isTimePanelDataInitialized;
}

// TIME PANEL SELECTORS

export function getTimePanelDropState(): DropViewState {
    return getStore().timePanelDropViewState;
}

export function getEventDropState(): DropViewState {
    return getStore().eventDropViewState;
}

export function getTaskDropState(): DropViewState {
    return getStore().taskDropViewState;
}
