import { action } from 'satcheljs';
import type { PanelView } from '../store/schema/TimePanelSettingsStore';

export const pushTimePanelView = action('pushTimePanelView', (newView: PanelView) => ({
    newView,
}));

export const updateTopTimePanelView = action(
    'updateTopTimePanelView',
    (updatedView: PanelView) => ({
        updatedView,
    })
);

export const popTimePanelView = action('popTimePanelView');
