import { setPanelInitialized } from '../mutators/timePanelStoreMutators';
import { lazyInitializeCalendarsDataForModule } from 'owa-calendar-bootstrap-utils';
import { lazyLoadCharmsCatalog } from 'owa-calendar-charms-store';
import { initBootCalendarCloudSettings } from 'owa-calendar-cloud-settings/lib/bootIndex';
import { initializeTimePanelConfig, TimePanelConfig } from 'owa-time-panel-config';
import { updateTopTimePanelView } from 'owa-time-panel-settings';

/**
 * Handles loading the minimum data necessary to render Time Panel
 */
export async function loadTimePanelData(config?: TimePanelConfig) {
    // initialize config, if provided
    if (config) {
        initializeTimePanelConfig(config);
        updateTopTimePanelView(config.initialPanelView);
    }

    // block on primary data needed before first render
    //
    // TODO: VSO #86844 Update calendar views to show loading state until minimum data for render is ready
    // This work item will separate out all calendar-specific dependencies to be handled the Calendar tab
    // rather than as panel-level concerns
    await lazyInitializeCalendarsDataForModule.importAndExecute();

    // mark panel as initialized to unblock render
    setPanelInitialized();

    // lazy-load secondary data needed after first render
    lazyLoadCharmsCatalog.importAndExecute();
    initBootCalendarCloudSettings();
}
