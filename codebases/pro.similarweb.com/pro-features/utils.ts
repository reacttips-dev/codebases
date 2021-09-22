import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";

export const granularities = ["Daily", "Weekly", "Monthly"];

export function formatDate(from = null, to = null, format = "MMM YYYY", useRangeDisplay = false) {
    const f = typeof from === "string" ? dayjs.utc(from.replace(/\|/g, "")) : dayjs.utc(from);
    const t = typeof to === "string" ? dayjs.utc(to.replace(/\|/g, "")) : dayjs.utc(to);
    const daysDiff = t.diff(f, "days") + 1; // doing +1 as for data we include ends
    const monthsDiff = t.diff(f, "months");

    if (!f.isValid() && t.isValid()) {
        return t.format(format);
    } else if (f.isValid() && !t.isValid()) {
        return f.format(format);
    }

    if (monthsDiff > 1 || useRangeDisplay) {
        // 2+ months diff or if force range display (e.g. Month To Date data)
        return `${f.format(format)} - ${t.format(format)}`;
    } else if (daysDiff === 28 && f.month() === 1 && t.month() === 1) {
        return f.format(format);
    } else if (daysDiff <= 28) {
        // 28 days diff and less
        return `Last ${daysDiff} days (As of ${t.format("MMM DD")})`;
    } else {
        return t.format(format);
    }
}

export function getChange(origNum, newNum) {
    return origNum ? ((newNum - origNum) / origNum) * 100 : 0;
}

export function getVsText(granularity, translate, next?) {
    const map = {
        [granularities[0]]: translate("timegranularity.day"),
        [granularities[1]]: translate("timegranularity.week"),
        [granularities[2]]: translate("timegranularity.month"),
    };
    return `${translate(`timegranularity.vs.${next ? "next" : "prev"}`)} ${map[granularity]}`;
}

export const getListItemsByI18n = (idTranslateItem: string): string[] => {
    let i = 1;
    const items = [];
    const getKey = (i) => `${idTranslateItem}${i}`;

    while (i18nFilter()(getKey(i)) !== getKey(i)) {
        items.push(i18nFilter()(getKey(i)));
        i++;
    }

    return items;
};
