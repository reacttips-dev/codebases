import { getUserMailboxInfo } from 'owa-client-ids';
import { dedupeArrayValues } from 'owa-selected-calendars-utils';
import { trace } from 'owa-trace';
import { lazyUpdateUserConfigurationService } from 'owa-session-store';
import { getMailboxRequestOptions } from 'owa-request-options-types';

const VIEW_STATE_CONFIGURATION = 'OWA.ViewStateConfiguration';

export function updateSelectedCalendarsState(selectedCalendars: string[], userIdentity: string) {
    if (selectedCalendars) {
        lazyUpdateUserConfigurationService
            .importAndExecute(
                [
                    {
                        key: 'SelectedCalendarsDesktop',
                        valuetype: 'StringArray',
                        value: dedupeArrayValues(selectedCalendars),
                    },
                ],
                VIEW_STATE_CONFIGURATION,
                getMailboxRequestOptions(getUserMailboxInfo(userIdentity))
            )
            .catch(error => {
                trace.warn('Could not save new selected calendars list to user configuration');
            });
    }
}
