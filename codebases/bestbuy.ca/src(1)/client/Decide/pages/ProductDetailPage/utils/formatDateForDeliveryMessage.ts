import * as moment from "moment";

const formatDateForDeliveryMessage = (year: number, month: number, day: number) => {
    const FULL_MONTH_DAY_YEAR_FORMAT = "LL";
    return moment(new Date(year, month, day)).format(FULL_MONTH_DAY_YEAR_FORMAT);
};

export default formatDateForDeliveryMessage;
