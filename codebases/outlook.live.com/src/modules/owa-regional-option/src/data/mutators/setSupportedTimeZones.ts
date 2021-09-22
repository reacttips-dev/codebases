import type TimeZoneEntry from 'owa-service/lib/contract/TimeZoneEntry';
import { mutatorAction } from 'satcheljs';
import getRegionalOptions from '../store/store';

export default mutatorAction(
    'setSupportedTimeZones',
    function setSupportedTimeZones(supportedTimeZones: TimeZoneEntry[]) {
        let regionalOptions = getRegionalOptions();
        regionalOptions.supportedTimeZones = supportedTimeZones;
    }
);
