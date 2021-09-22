import {StoreHoursConfig} from "../../models";

const TWELVE_HOUR_SEPARATOR = ":";
const TWENTY_FOUR_HOUR_SEPARATOR = " h ";

const buildMinuteString = (minutes: number, isTwelveHourFormat: boolean): string => {
    const timeSeparator = isTwelveHourFormat ? TWELVE_HOUR_SEPARATOR : TWENTY_FOUR_HOUR_SEPARATOR;
    return `${timeSeparator}${minutes}`;
};

const formatHoursForUI = (storeHours: StoreHoursConfig): string => {
    const isTwelveHourFormat = storeHours.openFormat !== "h";

    let timeStr = `${storeHours.openHour}`;

    if (typeof storeHours.openMinute === "number" && storeHours.openMinute > 0) {
        timeStr += buildMinuteString(storeHours.openMinute, isTwelveHourFormat);
    }

    timeStr +=
        isTwelveHourFormat || (!isTwelveHourFormat && storeHours.openMinute === 0)
            ? ` ${storeHours.openFormat} - ${storeHours.closeHour}`
            : ` - ${storeHours.closeHour}`;

    if (typeof storeHours.closeMinute === "number" && storeHours.closeMinute > 0) {
        timeStr += buildMinuteString(storeHours.closeMinute, isTwelveHourFormat);
    }

    if (isTwelveHourFormat || (!isTwelveHourFormat && storeHours.closeMinute === 0)) {
        timeStr += ` ${storeHours.closeFormat}`;
    }

    return timeStr;
};

export default formatHoursForUI;
