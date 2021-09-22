import { getTimeZone } from 'owa-regional-options-service';
import setSupportedTimeZones from '../data/mutators/setSupportedTimeZones';

export default async function loadTimeZoneOptions() {
    await getTimeZone().then(timeZones => {
        setSupportedTimeZones(timeZones);
    });
}
