import * as moment from "moment";
import { englishMonthAbbr, frenchMonthAbbr } from "./constants";
/**
 * Returns the date in format 'Jan. 1'
 * @param date UTC representation of the date
 * @param lang "en" for English or "fr" for French
 */
export const formatDate = (date, lang) => {
    const UTCFormattedDate = convertToUTC(date);
    const pacificTimeDate = moment(UTCFormattedDate).utcOffset("-08:00").format();
    const saleEndDate = new Date(pacificTimeDate);
    const monthInt = saleEndDate.getMonth();
    const dateInt = saleEndDate.getDate();
    if (lang && lang.startsWith("fr")) {
        const monthAbbr = frenchMonthAbbr[monthInt];
        return `${monthAbbr} ${dateInt}`;
    }
    else {
        const monthAbbr = englishMonthAbbr[monthInt];
        return `${monthAbbr} ${dateInt}`;
    }
};
// TODO: Duplicate code from ecomm-webapp. Can be removed after moving these
// components to ecomm-webapp <11-04-19, joshualim> //
/**
 *  Currently we retrieve dates as Epoch time or as a Long Date Pattern
 *  The date is stored on our servers as CST/CDT (Central Standard Time) UTC -6/-5
 *  All the dates should be displayed in PST/PDT (Pacific Standard Time) UTC -8/-7 regardless of the local time
 *
 *  Example inputs:
 *      EPOCH:      1488506340000
 *      En:         2017-03-03 1:59:00 AM
 *      Fr:         2017-03-03 01:59:00
 *
 *  Date in PST should be in this case "March 2, 2017 11:59 PM"
 *  Expected display:
 *      En:         March 2, 2017
 *      Fr:         2 mars 2017
 *
 * @private
 * @param {(string | number)} saleEndDate
 * @returns {string} ISO 8601 fomratted date string
 * @memberof ProductBase
 */
export const convertToUTC = (saleEndDate) => {
    if (!saleEndDate) {
        return undefined;
    }
    const englishApiDateFormat = "YYYY-MM-DD h:mm:ss A Z";
    const frenchApiDateFormat = "YYYY-MM-DD HH:mm:ss Z";
    const cstOffset = " -06:00";
    let saleEndDateMoment;
    if (isNaN(Number(saleEndDate))) {
        // PDP logic
        // Add CST/CDT timezone offset from UTC
        saleEndDate += cstOffset;
        saleEndDateMoment = moment.parseZone(saleEndDate, englishApiDateFormat, true);
        if (!saleEndDateMoment.isValid()) {
            saleEndDateMoment = moment.parseZone(saleEndDate, frenchApiDateFormat, true);
        }
    }
    else {
        // PLP logic
        const saleEndDateNum = typeof saleEndDate === "string" ? Number(saleEndDate) : saleEndDate;
        saleEndDateMoment = moment.utc(saleEndDateNum);
    }
    return saleEndDateMoment.format();
};
//# sourceMappingURL=dateFormatter.js.map