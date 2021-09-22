import type AddinRecurrence from './schema/AddinRecurrence';

// This function renames object keys. Example- It converts
// "seriesTimeJson":{"startYear":2021,"startMonth":3,"startDay":20,"endYear":2021,"endMonth":6,"endDay":20,"startTimeMin":870,"durationMin":25}
// "seriesTime":{"startYear":2021,"startMonth":3,"startDay":20,"endYear":2021,"endMonth":6,"endDay":20,"startTimeMinutes":870,"durationMinutes":25}
export default function seriesTimeJsonConverter(recurrence: AddinRecurrence) {
    let recurrenceObj = null;
    if (recurrence) {
        recurrenceObj = JSON.parse(JSON.stringify(recurrence));
    }
    let seriesTime = recurrenceObj?.seriesTimeJson;
    if (seriesTime) {
        seriesTime.startTimeMinutes = seriesTime.startTimeMin;
        seriesTime.durationMinutes = seriesTime.durationMin;

        delete seriesTime.startTimeMin;
        delete seriesTime.durationMin;
        delete recurrenceObj.seriesTimeJson;

        recurrenceObj.seriesTime = seriesTime;
    }
    return recurrenceObj;
}
