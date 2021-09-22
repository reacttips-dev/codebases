import type { PanelView, TimePanelSettingStore } from './schema/TimePanelSettingsStore';
import { createNavigationStack } from 'owa-navigation-stack';
import { getTimePanelConfig } from 'owa-time-panel-config';
import { createStore } from 'satcheljs';

export const getStore = createStore<TimePanelSettingStore>('timePanelSettingStore', {
    panelViewStack: createNavigationStack<PanelView>(getTimePanelConfig().initialPanelView),
});
