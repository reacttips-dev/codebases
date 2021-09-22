import getLogger from "common/logging/getLogger";

import {WeekStoreHoursMap, StoreClosedStatus, StoreHoursConfig} from "../../models";
import getWeekDayIndex from "../getWeekDayIndex";

export const getTimeFromHourString = (storeHourStr: string): string | null => {
    const timeRegex = /(\d*(:\d*)?\s(AM|PM|h))\s-\s(\d*(:\d*)?\s(AM|PM|h))|(closed|fermé)/i;
    const timeRegexResult = storeHourStr.match(timeRegex);
    return timeRegexResult && timeRegexResult[0] && timeRegexResult[0].trim();
};

export const getDayFromStoreHourString = (storeHourStr: string): string | null => {
    const daysOfWeekRegex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i;
    const dayRegexResult = storeHourStr.match(daysOfWeekRegex);
    return dayRegexResult && dayRegexResult[0] && dayRegexResult[0].trim();
};

export const getHourObject = (hourStr: string): {hour: number; minute: number; format: string} => {
    const openData = hourStr.split(" ");
    const openTime = openData[0].split(":");
    return {
        hour: parseInt(openTime[0], 10) || 0,
        minute: parseInt(openTime[1], 10) || 0,
        format: openData[1],
    };
};

export const convertStoreTimeToObject = (storeHours: string): StoreHoursConfig => {
    const storeHoursLowerCase = storeHours.toLowerCase();

    if (storeHoursLowerCase === StoreClosedStatus.EN || storeHoursLowerCase === StoreClosedStatus.FR) {
        // represent store closed times as null
        return {
            openHour: null,
            openMinute: null,
            openFormat: null,
            closeHour: null,
            closeMinute: null,
            closeFormat: null,
        };
    }
    // input: 1 AM - 2 PM or 1 h - 19 h
    const hours = storeHours.split("-");
    const open = hours[0] && hours[0].trim();
    const close = hours[1] && hours[1].trim();
    const openConfig = getHourObject(open);
    const closeConfig = getHourObject(close);

    return {
        openHour: openConfig.hour,
        openMinute: openConfig.minute,
        openFormat: openConfig.format,
        closeHour: closeConfig.hour,
        closeMinute: closeConfig.minute,
        closeFormat: closeConfig.format,
    };
};

const convertStoreHoursToMap = (storeHours: string[] = [], lang: Language): WeekStoreHoursMap => {
    try {
        const storeMapping: WeekStoreHoursMap = {};

        storeHours.forEach((storeHourStr: string) => {
            const time = getTimeFromHourString(storeHourStr);
            const day = getDayFromStoreHourString(storeHourStr);

            if (day && time) {
                const timeMapping = convertStoreTimeToObject(time);
                const dayIndex = getWeekDayIndex(day, lang);

                if (typeof dayIndex !== "undefined") {
                    storeMapping[dayIndex] = {
                        ...timeMapping,
                    };
                }
            }
        });
        return storeMapping;
    } catch (e) {
        getLogger().error(e);
        return {};
    }
};

export default convertStoreHoursToMap;
