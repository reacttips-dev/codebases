import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { getDiffCustomRangeParam } from "helpers/duration/customRange";
import { apiFormat, customRangeFormat } from "constants/dateFormats";
import { granularityNameToMomentUnit } from "UtilitiesAndConstants/Constants/Moment";

type durationLatestParams = "28d" | "l";
export interface IDurationObject<T> {
    from: T;
    to: T;
    isWindow?: boolean;
    isDaily?: boolean;
    compareTo?: T;
    compareFrom?: T;
    isCustom?: boolean;
    latest?: durationLatestParams;
}

export interface IDurationData {
    forAPI: IDurationObject<string>;
    raw: IDurationObject<Dayjs>;
    forTitle: string | string[];
    forWidget: string | string[];
    forTooltip: string | string[];
}

export { apiFormat, customRangeFormat };

const uiFormat = "MMM, YYYY";
const uiFormatDaily = "MMM D, YYYY";
const widgetFormat = "MMM YYYY";
const widgetFormatDaily = "MMM D, YYYY";
const windowFormat = "MMM DD";
const diffUnitSymbol = {
    days: "d",
    weeks: "w",
    months: "m",
    years: "y",
};
const customDateRangeRegexp = /^[0-9]{4}\.[0-9]{2}(\.[0-9]{2})?\-[0-9]{4}\.[0-9]{2}(\.[0-9]{2})?$/;
const relativeDateRangeRegexp = /^[0-9]+[dwmy]{1}$/;
const supportedRelativeDays = [7, 28];
const windowDays = [28];
export const BasicDurations = {
    LAST_TWENTY_EIGHT_DAYS: "28d",
    LAST_MONTH: "1m",
    LAST_THREE_MONTHS: "3m",
    LAST_SIX_MONTHS: "6m",
    LAST_TWELVE_MONTHS: "12m",
    LAST_EIGHTEEN_MONTHS: "18m",
    LAST_TWENTY_FOUR_MONTHS: "24m",
};

const LESS_THAN_OR_EQUAL_TO_ONE_MONTHS_DURATIONS = [
    BasicDurations.LAST_TWENTY_EIGHT_DAYS,
    BasicDurations.LAST_MONTH,
];
const LESS_THAN_OR_EQUAL_TO_THREE_MONTHS_DURATIONS = [
    ...LESS_THAN_OR_EQUAL_TO_ONE_MONTHS_DURATIONS,
    BasicDurations.LAST_THREE_MONTHS,
];

const LESS_THAN_OR_EQUAL_TO_SIX_MONTHS_DURATIONS = [
    ...LESS_THAN_OR_EQUAL_TO_THREE_MONTHS_DURATIONS,
    BasicDurations.LAST_SIX_MONTHS,
];

export class DurationService {
    private i18n: (key, obj?) => string;
    constructor(i18n = i18nFilter()) {
        this.i18n = i18n;
    }

    public isMonthToDateSupportedForDuration(durationParam: string): boolean {
        // MTD is not supported in periods that are shorter than one month
        if (durationParam === "28d") return false;

        // In any other case - MTD should be supported only in case the selected
        // duration end month matches the latest supported month on the swSettings.
        const selectedDuration = this.getDurationData(durationParam);
        const latestSupportedMonth = swSettings.current.endDate.month();
        const selectedDurationEndMonth = selectedDuration.raw.to.month();
        return selectedDurationEndMonth === latestSupportedMonth;
    }

    public getDurationData(
        durationParam: string,
        comparedDuration?: string,
        componentId?: string,
        usePermissions = true,
    ): IDurationData {
        const component = componentId ? swSettings.components[componentId] : swSettings.current;
        const mainDurationObject: IDurationData = {} as IDurationData;

        mainDurationObject.raw = this._createDurationObject(durationParam, component);

        const texts = this._createTextRepresentation(mainDurationObject.raw);
        mainDurationObject.forTitle = texts.uiString;
        mainDurationObject.forWidget = texts.widgetString;
        mainDurationObject.forTooltip = texts.forTooltip;

        if (comparedDuration) {
            const comparedDurationObject: IDurationData = {} as IDurationData;
            comparedDurationObject.raw = this._calculateOffset(
                mainDurationObject.raw,
                comparedDuration,
                component,
                usePermissions,
            );
            if (comparedDurationObject.raw !== null) {
                mainDurationObject.raw.compareFrom = comparedDurationObject.raw.from;
                mainDurationObject.raw.compareTo = comparedDurationObject.raw.to;

                const comparedTexts = this._createTextRepresentation(comparedDurationObject.raw);
                mainDurationObject.forTitle = [mainDurationObject.forTitle, comparedTexts.uiString];
                mainDurationObject.forWidget = [
                    mainDurationObject.forWidget,
                    comparedTexts.widgetString,
                ];
                mainDurationObject.forTooltip = [
                    mainDurationObject.forTooltip,
                    comparedTexts.forTooltip,
                ];
            }
        }

        mainDurationObject.forAPI = this._createApiParams(mainDurationObject.raw);

        return mainDurationObject;
    }

    public getDiffCustomRangeParam(from, to) {
        return getDiffCustomRangeParam(from, to);
    }

    public getClosestPreset(from, to, availablePresets) {
        if (!Array.isArray(availablePresets) || availablePresets.length === 0) {
            return undefined;
        }
        const diff = this.diffByUnit(from, to, "months");
        for (let i = 0; i < availablePresets.length; i++) {
            const preset = availablePresets[i];
            if (preset === "28d") {
                if (diff === 0) {
                    return preset;
                }
            } else {
                const presetNum = +preset.substring(0, preset.length - 1);
                if (presetNum >= diff) {
                    return preset;
                }
            }
        }
    }

    public getDiffSymbol(from, to, diffUnit = "months") {
        const diff = this.diffByUnit(from, to, diffUnit);
        return _.isNumber(diff)
            ? diff + 1 + diffUnitSymbol[diffUnit]
            : `${from.format(customRangeFormat)}-${to.format(customRangeFormat)}`;
    }

    public getMonthsFromApiDuration(from, to, isWindow) {
        if (isWindow) {
            return 0;
        } else {
            return this.diffByUnit(from, to, "months") + 1;
        }
    }

    public getDurationApiFor(from: Dayjs, to: Dayjs, isWindow?: boolean) {
        const apiParams: any = {
            isWindow: typeof isWindow !== "undefined" ? isWindow : false,
            from: from.format(apiFormat),
            to: dayjs.isDayjs(to) ? to.format(apiFormat) : from.format(apiFormat),
        };
        if (isWindow) {
            apiParams.latest = "28d";
        }
        return apiParams;
    }

    public createRange(from: Dayjs, to: Dayjs, unit: OpUnitType, format = "YYYY-MM-DD") {
        let tempDate = from.clone();
        const result: string[] = [];
        while (tempDate.isBetween(from, to, unit, "[]")) {
            result.push(tempDate.format(format));
            tempDate = tempDate.add(1, unit);
        }

        return result;
    }

    private _createDurationObject(durationParam: string, component: any): IDurationObject<Dayjs> {
        // empty duration
        if (_.isEmpty(durationParam)) {
            const now = dayjs();
            return {
                from: now.clone(),
                to: now.clone(),
                isWindow: false,
            };
        }

        // custom range
        if (customDateRangeRegexp.test(durationParam)) {
            const [from, to] = durationParam.split("-");
            const [fromYear, fromMonth, fromDay] = from.split(".");
            const [toYear, toMonth, toDay] = to.split(".");
            // daily
            if (fromDay && toDay) {
                return {
                    from: swSettings.momentFromString(from),
                    to: swSettings.momentFromString(to),
                    isCustom: true,
                    isWindow: false,
                    isDaily: true,
                };
            } else {
                return {
                    from: this._startOfMonth(swSettings.momentFromString(from)),
                    to: this._endOfMonth(swSettings.momentFromString(to)),
                    isCustom: true,
                    isWindow: false,
                    isDaily: false,
                };
            }
        }

        if (relativeDateRangeRegexp.test(durationParam)) {
            const { unit, count } = this._parsedDurationParam(durationParam);
            const isDaily = unit === "D" && supportedRelativeDays.includes(count);
            const isWeekly = unit === "W";
            const to =
                isDaily || isWeekly
                    ? component.windowEndDate ?? component.endDate
                    : this._endOfMonth(component.endDate.clone());

            if (isDaily) {
                return {
                    to,
                    from: to.clone().subtract(count - 1, unit.toLowerCase()),
                    isWindow: windowDays.includes(count),
                    // in case of '28d', turn off this flag
                    isDaily: !windowDays.includes(count),
                };
            } else if (isWeekly) {
                const endIsoWeek = to.isoWeek() - 1;
                const startIsoWeek = endIsoWeek - count + 1;
                return {
                    from: dayjs.utc().isoWeek(startIsoWeek).startOf("isoWeek"),
                    to: dayjs.utc().isoWeek(endIsoWeek).endOf("isoWeek"),
                    isDaily: true,
                    isWindow: false,
                };
            }
            // last N months|years
            else {
                return {
                    to,
                    from: this._startOfMonth(to.clone().subtract(count - 1, unit)),
                    isWindow: false,
                };
            }
        }
    }

    private _parsedDurationParam(durationParam: string): any {
        const unit = durationParam.replace(/\d+/g, "").toUpperCase();
        // eslint:disable-next-line:radix
        const count = parseInt(durationParam.replace(/[a-zA-Z]+/g, ""));
        return { unit, count };
    }

    private _createTextRepresentation(durationObject: IDurationObject<Dayjs>) {
        const result: any = {};

        if (durationObject.isDaily) {
            if (durationObject.isCustom) {
                result.uiString = this.i18n("global.from", {
                    param1: durationObject.from.format(uiFormatDaily),
                    param2: durationObject.to.format(uiFormatDaily),
                });
                result.widgetString =
                    durationObject.from.format(widgetFormatDaily) +
                    " - " +
                    durationObject.to.format(widgetFormatDaily);
            } else {
                const count = durationObject.to.diff(durationObject.from, "d") + 1;
                result.uiString = this.i18n("global.from_window_generic", {
                    date: durationObject.to.format(windowFormat),
                    count: count.toString(),
                });
                result.widgetString = this.i18n("global.from_window_generic", {
                    date: durationObject.to.format(windowFormat),
                    count: count.toString(),
                });
            }
        } else if (durationObject.isWindow) {
            const count = durationObject.to.diff(durationObject.from, "d") + 1;
            result.uiString = this.i18n("global.from_window_generic", {
                date: durationObject.to.format(windowFormat),
                count: count.toString(),
            });
            result.widgetString = this.i18n("global.from_window_generic", {
                date: durationObject.to.format(windowFormat),
                count: count.toString(),
            });
        }

        // same month and year
        else if (
            durationObject.from.month() === durationObject.to.month() &&
            durationObject.from.year() === durationObject.to.year()
        ) {
            result.uiString = this.i18n("global.for", {
                param1: durationObject.from.format(uiFormat),
            });
            result.widgetString = durationObject.from.format(widgetFormat);
        } else {
            result.uiString = this.i18n("global.from", {
                param1: durationObject.from.format(uiFormat),
                param2: durationObject.to.format(uiFormat),
            });
            result.widgetString =
                durationObject.from.format(widgetFormat) +
                " - " +
                durationObject.to.format(widgetFormat);
        }

        if (durationObject.isDaily) {
            const clonedTo = durationObject.to.clone();
            const prevWeek = clonedTo.clone().subtract(7, "days");
            result.forTooltip = {
                from: `${prevWeek.startOf("isoWeek").format("MMM D")}-${prevWeek
                    .endOf("isoWeek")
                    .format("MMM D")}`,
                to: `${clonedTo.startOf("isoWeek").format("MMM D")}-${clonedTo
                    .endOf("isoWeek")
                    .format("MMM D")}`,
            };
        } else {
            // always two last months
            result.forTooltip = {
                from: durationObject.to
                    .clone()
                    .subtract(1, "months")
                    .format(encodeURIComponent(uiFormat)),
                to: durationObject.to.format(encodeURIComponent(uiFormat)),
            };
        }
        return result;
    }

    private _createApiParams(durationObject: IDurationObject<Dayjs>) {
        const apiParams: any = {
            to: durationObject.to.format(apiFormat),
            from: durationObject.from.format(apiFormat),
            compareTo: durationObject.compareTo && durationObject.compareTo.format(apiFormat),
            compareFrom: durationObject.compareFrom && durationObject.compareFrom.format(apiFormat),
            isWindow: durationObject.isWindow,
            isDaily: durationObject.isDaily,
        };
        if (durationObject.isWindow) {
            apiParams.latest = "28d";
        }

        return apiParams;
    }

    private _endOfMonth(momentObj: Dayjs) {
        return momentObj.endOf("month").startOf("day");
    }

    private _startOfMonth(momentObj: Dayjs) {
        return momentObj.startOf("month").startOf("day");
    }

    private _calculateOffset(
        durationObject: IDurationObject<Dayjs>,
        durationParam: string,
        component: any,
        usePermissions: boolean,
    ): IDurationObject<Dayjs> {
        // TODO: add support of custom offset
        let calculated: IDurationObject<Dayjs> = {} as IDurationObject<Dayjs>;

        const { unit, count } = this._parsedDurationParam(durationParam);
        const minStartDate: Dayjs = component.startDate;
        calculated.from = this._startOfMonth(durationObject.from.clone().subtract(count, unit));
        calculated.to = this._endOfMonth(durationObject.to.clone().subtract(count, unit));

        if (usePermissions) {
            // check that the compared duration is permitted
            if (calculated.from.isBefore(minStartDate)) {
                // if the compared range is partially allowed, return the valid part only
                if (calculated.to.isAfter(minStartDate)) {
                    calculated.from = minStartDate;
                }
                // special case when the user select compare which is not valid at all
                else {
                    calculated = null;
                }
            }
        }

        return calculated;
    }

    public diffByUnit(from: string | Dayjs, to: string | Dayjs, unit) {
        const fromMoment = dayjs.isDayjs(from) ? from : dayjs.utc(from, apiFormat);
        const toMoment = dayjs.isDayjs(to) ? to : dayjs.utc(to, apiFormat);
        return toMoment.diff(fromMoment, unit);
    }

    public isLessThanOrEqualToOneMonths(durationParam: string) {
        const { from, to } = this.getDurationData(durationParam).forAPI;
        const monthsBetweenFromAndTo = this.diffByUnit(
            from,
            to,
            granularityNameToMomentUnit.Monthly,
        );
        return monthsBetweenFromAndTo <= 1;
    }

    public isGreaterThanThreeMonths(durationParam: string) {
        return !LESS_THAN_OR_EQUAL_TO_THREE_MONTHS_DURATIONS.includes(durationParam);
    }

    public isGreaterThanSixMonths(durationParam: string) {
        return !LESS_THAN_OR_EQUAL_TO_SIX_MONTHS_DURATIONS.includes(durationParam);
    }
}
export const DurationServiceFactory = (i18n?) => {
    return new DurationService(i18n);
};

export default new DurationService();
