import { getMailboxRegionalConfiguration } from 'owa-regional-options-service';
import setRegionalConfiguration from '../data/mutators/setRegionalConfiguration';
import loadTimeZoneOptions from './loadTimeZoneOptions';
import loadRoamingTimeZones from './loadRoamingTimeZones';

export default function loadRegionalOptions() {
    return Promise.all([
        getMailboxRegionalConfiguration().then(options => {
            setRegionalConfiguration(
                options.SupportedCultures,
                options.SupportedShortDateFormats,
                options.SupportedShortTimeFormats
            );
        }),
        loadTimeZoneOptions(),
        loadRoamingTimeZones(),
    ]);
}
