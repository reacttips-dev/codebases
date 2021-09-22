import { lazyCalendarAutoSelectModule } from 'owa-calendar-module-calendar-auto-select';
import initializeAccountAndCalendars from './initializeAccountAndCalendars';
import { lazyLoadWorkloadScenarioSettings } from 'owa-workload-scenario-settings';

let hasBeenCalled = false;

/**
 * Initializes accounts, calendars, and settings necessary for OWA modules
 */
export default async function initializeCalendarsDataForModule() {
    // only allow single init per session
    if (hasBeenCalled) {
        return;
    }

    // STEP 0 - Mark init for session
    hasBeenCalled = true;

    // STEP 1 - Kick off async promises to load minimum data needed for module scenario
    const initPromises = [
        // initialize all accounts and associated calendars
        initializeAccountAndCalendars(),

        // initialize scenario settings for each account (since calendar ID setting is needed as part of boot flow)
        lazyLoadWorkloadScenarioSettings.importAndExecute(),
    ];

    // STEP 2 - Kick off background tasks that should occur close to initial render but are not necessarily blocking
    lazyCalendarAutoSelectModule.import();

    // STEP 3 - Block on resolution of init promises
    await Promise.all(initPromises);
}
