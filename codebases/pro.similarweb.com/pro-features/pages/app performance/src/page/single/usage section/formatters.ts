import numeral from "numeral";
import _ from "lodash";
import dayjs from "dayjs";

export const numberAbbr = ({ value }) =>
    `${_.isNumber(value) ? `${numeral(value).format("0.[00]a").toUpperCase()}` : "NA"}`;
export const duration = ({ value }) =>
    `${
        _.isNumber(value)
            ? dayjs.utc(dayjs.duration(value, "seconds").asMilliseconds()).format("HH:mm:ss")
            : "NA"
    }`;
export const percents = ({ value }) =>
    `${_.isNumber(value) ? `${numeral(Math.abs(value)).format("0.[00]%")}` : "NA"}`;
export const clearURl = (url) => url.replace(/%2F/g, "%252F");
