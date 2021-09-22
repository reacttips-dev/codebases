import setRoamingTimeZoneNotificationIsDisabled from '../data/mutators/setRoamingTimeZoneNotificationIsDisabled';
import { getRoamingTimeZoneNotificationIsDisabled } from 'owa-timezone-roaming';

export default function loadRoamingTimeZones() {
    let isDisabled = getRoamingTimeZoneNotificationIsDisabled();
    setRoamingTimeZoneNotificationIsDisabled(isDisabled);
}
