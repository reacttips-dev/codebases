import { getStore } from '../store';
import type TimeZoneEntry from 'owa-service/lib/contract/TimeZoneEntry';

export default function getTimeZonesList() {
    const { AllTimeZones } = getStore();
    return AllTimeZones && AllTimeZones.length > 0
        ? AllTimeZones
        : Object.keys(getStore().TimeZoneRanges).map(function (timeZoneId) {
              var timeZoneEntry: TimeZoneEntry = {
                  Name: timeZoneId,
                  Value: timeZoneId,
              };

              return timeZoneEntry;
          });
}
