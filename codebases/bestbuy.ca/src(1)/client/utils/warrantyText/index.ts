import messages from "./translations/messages";
import { InjectedIntl } from "react-intl";

const yearInDays = 365;

const convertDaysToYearString = (days: number): string => {
    // round to one decimal, if not a whole number
    const yearCount = days / yearInDays;
    if (yearCount % 1 !== 0) {
        return (Math.round(yearCount * 10) / 10).toFixed(1);
    }
    return yearCount.toString();
};

const formatWarrantyText = (numDays: number, intl: InjectedIntl) => {
    const unlimitedWarrantyTime = 9999;
    const { formatMessage } = intl;

    if (numDays === unlimitedWarrantyTime) {
        return formatMessage(messages.WarrantyLifetimeLabel);
    } else if (numDays < yearInDays) {
        return `${numDays} ${formatMessage(messages.WarrantyDaysLabel)}`;
    } else if (numDays === yearInDays) {
        return `1 ${formatMessage(messages.WarrantyOneYearLabel)}`;
    } else {
        return `${convertDaysToYearString(numDays)} ${formatMessage(messages.WarrantyYearsLabel)}`;
    }
};

export default formatWarrantyText;
