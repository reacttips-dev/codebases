import { setLocale } from 'owa-localize';
import {
    getSupportedFallbackForLocale,
    SupportedLocale,
} from 'owa-shared-bootstrap/lib/getSupportedFallbackForLocale';
import { getUserConfiguration } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import getOwaUserConfigurationOperation from 'owa-service/lib/operation/getOwaUserConfigurationOperation';
import { updateDateTime } from 'owa-shared-bootstrap/lib/initializeDateTime';
import setMailboxRegionalConfiguration from '../services/setMailboxRegionalConfiguration';
import setUserConfiguration from 'owa-session-store/lib/actions/setUserConfiguration';
import updateSurfaceOptions from 'owa-calendar-appearance-option/lib/data/actions/updateSurfaceOptions';
import { languageChanged } from '../actions/publicActions';

function getRegionalOptionsServiceRequests(
    languageHasChanged: boolean,
    timeZoneHasChanged: boolean,
    shouldRenameDefaultFolders: boolean,
    selectedLocale: string | null
): Promise<any>[] {
    let { UserOptions, SessionSettings } = getUserConfiguration();

    // Make service request
    let setMailboxRegionalConfigurationPromise = setMailboxRegionalConfiguration(
        SessionSettings.UserCulture,
        shouldRenameDefaultFolders,
        UserOptions.DateFormat,
        UserOptions.TimeFormat,
        UserOptions.TimeZone
    );

    let promises: Promise<any>[] = [setMailboxRegionalConfigurationPromise];

    // VSO:14100 - Rename the default folders, without pulling in mail code.
    if (languageHasChanged) {
        promises.push(setMailboxRegionalConfigurationPromise.then(languageChanged));

        if (isFeatureEnabled('fwk-localeHotReload') && selectedLocale) {
            let language: SupportedLocale = getSupportedFallbackForLocale(selectedLocale);

            setLocale(language.locale, language.dir);
        }
    }

    if (timeZoneHasChanged) {
        promises.push(
            setMailboxRegionalConfigurationPromise.then(async () => {
                // When time zone changes there are several properties under
                // user configuration that change as well: time zone, working hours,
                // time zone offsets, preferred time zones to display and maybe others.
                // I'm reloading the entire config and re-initializing the affected stores.
                const userConfiguration = await getOwaUserConfigurationOperation();
                setUserConfiguration(userConfiguration);
                updateDateTime(userConfiguration);

                // Calendar Surface has a bad pattern of duplicating some properties,
                // particularly the UserOption, which is where time zone and working hours live.
                // We need to fire this event so calendar code will reset its store.
                // (And we should change calendar code to just use the same store instead of copying values)
                updateSurfaceOptions();
            })
        );
    }

    return promises;
}

export default getRegionalOptionsServiceRequests;
