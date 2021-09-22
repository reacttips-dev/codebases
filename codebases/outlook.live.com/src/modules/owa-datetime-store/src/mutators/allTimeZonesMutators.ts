import { getStore } from '../store';
import type TimeZoneEntry from 'owa-service/lib/contract/TimeZoneEntry';
import { mutatorAction } from 'satcheljs';

export const updateAllTimeZones = mutatorAction(
    'updateAllTimeZones',
    function (timeZoneList: TimeZoneEntry[]) {
        getStore().AllTimeZones = timeZoneList;
    }
);
