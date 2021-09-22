import { updateCalendarCloudSettings } from '../actions/internalActions';
import { initBootCalendarCloudSettings } from '../actions/publicActions';
import convertSettingsToCalendarCloudSettings from '../utils/convertSettingsToCalendarCloudSettings';
import shouldInitCalendarCloudSettings from '../utils/shouldInitCalendarCloudSettings';
import { getPrimeBootCalendarCloudSettings } from 'owa-session-store';
import { orchestrator } from 'satcheljs';

/**
 * Initializes the calendar cloud settings - gets settings from the prime settings
 */
orchestrator(initBootCalendarCloudSettings, () => {
    if (!shouldInitCalendarCloudSettings()) {
        // If we already have the calendar cloud settings, we won't get it again
        return;
    }

    const primeBootCalendarCloudSettings = getPrimeBootCalendarCloudSettings();
    const calendarCloudSettings = convertSettingsToCalendarCloudSettings(
        primeBootCalendarCloudSettings
    );

    if (!calendarCloudSettings) {
        return;
    }

    updateCalendarCloudSettings(calendarCloudSettings);
});
