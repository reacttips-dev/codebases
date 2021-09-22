import * as moment from "moment";
import {PickupHoursOffset, StoreHoursConfig, WeekStoreHoursMap} from "../../models";

const isNumber = (value: any) => typeof value === "number";

const hasOpeningTimeProps = (hours: StoreHoursConfig): boolean => {
    return hours && hours.hasOwnProperty("openHour") && hours.hasOwnProperty("openMinute");
};

const hasClosingTimeProps = (hours: StoreHoursConfig): boolean => {
    return hours && hours.hasOwnProperty("closeHour") && hours.hasOwnProperty("closeMinute");
};

export const hasValidStoreHours = (hours: StoreHoursConfig): boolean => {
    return hours && hasValidOpenHours(hours) && hasValidCloseHours(hours);
};

const hasValidOpenHours = (hours: StoreHoursConfig): boolean => {
    return hasOpeningTimeProps(hours) && isNumber(hours.openHour) && isNumber(hours.openMinute);
};

const hasValidCloseHours = (hours: StoreHoursConfig): boolean => {
    return hasClosingTimeProps(hours) && isNumber(hours.closeHour) && isNumber(hours.closeMinute);
};

const buildFormattedTimestamp = (timeFormat: string, hour: number | null, minute: number | null): string => {
    const hourValueString = `${hour}`.padStart(2, "0");
    const minuteValueString = `${minute}`.padStart(2, "0");
    const secondValueString = "00";
    const randomDayForTimestamp = "2020-10-15";
    // YYYY-MM-DD 00:00:00
    let timestamp = `${randomDayForTimestamp} ${hourValueString}:${minuteValueString}:${secondValueString}`;

    if (timeFormat !== "h") {
        timestamp = `${timestamp} ${timeFormat}`;
    }
    return timestamp;
};

const getHourFromTimestamp = (timestamp: moment.MomentInput, isTwelveHourFormat: boolean): number => {
    return parseInt(moment(timestamp).format(isTwelveHourFormat ? "hh" : "HH"), 10);
};

const getCurbsideHours = (weekStoreHours: WeekStoreHoursMap, pickupHoursOffset?: PickupHoursOffset) => {
    const curbsideHoursMap: WeekStoreHoursMap = {};

    const twelveHourFormat = "YYYY-MM-DD hh:mm A";
    const twentyFourHourFormat = "YYYY-MM-DD HH:mm";

    Object.keys(weekStoreHours).forEach((dayOfWeek) => {
        const dayOfWeekIndex = parseInt(dayOfWeek, 10);
        const hours = weekStoreHours[dayOfWeekIndex];

        if (hours && hasOpeningTimeProps(hours) && hasClosingTimeProps(hours)) {
            // this covers use case of store being close and having offsets
            let openHour: number | null = null;
            let openMinute: number | null = null;
            let closeHour: number | null = null;
            let closeMinute: number | null = null;

            const {openFormat, closeFormat} = hours;
            const storeIsOpen = hasValidStoreHours(hours);

            if (!pickupHoursOffset && storeIsOpen) {
                openHour = hours.openHour;
                openMinute = hours.openMinute;
                closeHour = hours.closeHour;
                closeMinute = hours.closeMinute;
            } else if (pickupHoursOffset && storeIsOpen) {
                const isTwelveHourFormat = closeFormat !== "h";
                const timestampFormat = isTwelveHourFormat ? twelveHourFormat : twentyFourHourFormat;

                const openTimestamp = buildFormattedTimestamp(openFormat, hours.openHour, hours.openMinute);
                const closeTimestamp = buildFormattedTimestamp(closeFormat, hours.closeHour, hours.closeMinute);

                const openOffset = pickupHoursOffset.openOffset;
                const closeOffset = pickupHoursOffset.closeOffset;

                const originalOpenTimestamp = moment(openTimestamp, timestampFormat);
                let adjustedOpenTimestamp = moment(originalOpenTimestamp).subtract(openOffset, "hours");

                // Cap the opening hours to 12:00 if it rolls back to the previous day
                if (adjustedOpenTimestamp.date() < originalOpenTimestamp.date()) {
                    adjustedOpenTimestamp = adjustedOpenTimestamp.startOf("day");
                }
                openHour = getHourFromTimestamp(adjustedOpenTimestamp, isTwelveHourFormat);
                openMinute = adjustedOpenTimestamp.minutes();

                const originalCloseTimestamp = moment(closeTimestamp, timestampFormat);
                let adjustedCloseTimestamp = moment(originalCloseTimestamp).add(closeOffset, "hours");

                // Cap the closing hours to 11:59 PM if it rolls over to the next day
                if (adjustedCloseTimestamp.date() > originalCloseTimestamp.date()) {
                    adjustedCloseTimestamp = adjustedCloseTimestamp.endOf("day");
                }
                closeHour = getHourFromTimestamp(adjustedCloseTimestamp, isTwelveHourFormat);
                closeMinute = adjustedCloseTimestamp.minutes();
            }

            curbsideHoursMap[dayOfWeekIndex] = {
                openHour,
                openMinute,
                openFormat,
                closeHour,
                closeMinute,
                closeFormat,
            };
        }
    });
    return curbsideHoursMap;
};

export default getCurbsideHours;
