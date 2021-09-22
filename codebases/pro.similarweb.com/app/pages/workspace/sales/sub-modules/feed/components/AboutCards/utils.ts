import { percentageFilter, abbrNumberFilter } from "filters/ngFilters";
import { RED, GREEN, BLACK } from "./consts";

export const formatWithAbbrNumbers = (num: number): string => {
    if (num < 5000) {
        return "<5000";
    }
    return abbrNumberFilter()(num);
};

export const formatWithPercents = (base: number | string, num: number): string =>
    percentageFilter()(base, num);

export const calcColorFromValue = (value: number) => {
    if (typeof value === "number") {
        return value < 0 ? RED : GREEN;
    }
    return BLACK;
};
