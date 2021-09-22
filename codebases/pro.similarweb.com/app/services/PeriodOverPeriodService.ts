import { i18nFilter } from "filters/ngFilters";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import DurationService, { IDurationData } from "./DurationService";
import { IWidgetModelTypesFamily } from "../components/widget/widget-types/Widget";
import widgetSettings from "components/dashboard/WidgetSettings";
export class PeriodOverPeriodService {
    private MAX_MONTHS_DIFF = 12;
    private DEFAULT_COMPARED_DURATION = "12m";
    private periodOverPeriodDefaultVs: string;
    private swSettings = swSettings;
    private i18nFilter = i18nFilter();

    constructor() {
        this.periodOverPeriodDefaultVs = this.i18nFilter("compared.duration.vs");
    }

    periodOverPeriodEnabledForMetric(
        metricId: string,
        isCompare: boolean,
        family?: IWidgetModelTypesFamily,
    ) {
        if (["Website", "Industry"].indexOf(family) === -1) {
            return false;
        }
        const metricWidgets = widgetSettings.getMetricWidgets(metricId, isCompare);
        return !_.isUndefined(_.find(metricWidgets, "properties.periodOverPeriodSupport"));
    }
    /**
     * Whether or not to enable the period-over-period dropdown
     * @param durationParam
     * @param comparedDurationParam
     * @param key
     * @param componentId
     * @returns {boolean}
     */
    _periodOverPeriodEnabled(
        durationParam: string,
        comparedDurationParam: string,
        key: string | unknown[],
        componentId: string,
    ): boolean {
        // do not allow period over period in 28d or in more then 1 year
        comparedDurationParam = comparedDurationParam || this.DEFAULT_COMPARED_DURATION;
        if (!durationParam) {
            return false;
        }
        const duration: IDurationData = DurationService.getDurationData(
            durationParam,
            comparedDurationParam,
            componentId,
            false,
        );
        const keyArray = _.isArray(key) ? key : key.split(",");
        const comparePeriodFrom: Dayjs = duration.raw.compareFrom;
        const poPstartDate = this.swSettings.components[componentId].resources
            .PeriodOverPeriodStartDate;
        // don't allow period over period
        // 1. moving window
        // 2. more then 12 months or before minimum start date
        // 3. compare mode
        // 4. the user don't have permission to see period over period
        const isKeyArrayValid =
            this.swSettings.components[componentId].resources.AllowPeriodOverPeriodWithCompare ||
            keyArray.length <= 1;
        if (
            durationParam == "28d" ||
            !this._isValidDuration(duration, comparePeriodFrom, componentId) ||
            !isKeyArrayValid ||
            !duration.forAPI.compareFrom ||
            !duration.forAPI.compareTo ||
            (poPstartDate && comparePeriodFrom.isBefore(poPstartDate))
        ) {
            return false;
        } else {
            return true;
        }
    }

    periodOverPeriodEnabled(
        durationParam: string,
        comparedDurationParam: string,
        key: string | unknown[],
        componentId: string,
        periodOverPeriodSymbol?: string,
    ): boolean {
        const _popItems = this.getPeriodOverPeriodDropdownItems(
            durationParam,
            key,
            componentId,
            false,
            periodOverPeriodSymbol,
        );
        const _hasEnabled =
            comparedDurationParam === "12m"
                ? _.find(_popItems, { disabled: false, id: "previous year" })
                : _.find(_popItems, { disabled: false });
        return !_.isUndefined(_hasEnabled);
    }
    /**
     * Get the available values for the period-over-period dropown
     * @returns {[{text: any, id: string},{text: any, id: string}]}
     */
    getPeriodOverPeriodDropdownItems(
        duration,
        keys,
        componentId,
        overrideEnabled = false,
        periodOverPeriodSymbol?: string,
    ) {
        const previousYear = {
            text: this.i18nFilter("compared.duration.dropdown.previous.year"),
            id: "previous year",
            disabled: overrideEnabled
                ? false
                : !this._periodOverPeriodEnabled(duration, "12m", keys, componentId),
        };
        const previousPeriod = {
            text: this.i18nFilter("compared.duration.dropdown.previous.period"),
            id: "previous period",
            disabled: overrideEnabled
                ? false
                : !this._periodOverPeriodEnabled(
                      duration,
                      periodOverPeriodSymbol || duration,
                      keys,
                      componentId,
                  ),
        };
        return [previousYear, previousPeriod];
    }

    /**
     * Returns the type of the comparison, for showing the correct value in the dropdown
     * @param duration
     * @returns {string|string}
     */
    getPeriodOverPeriodType(duration: string) {
        return duration == "12m" ? "previous year" : "previous period";
    }

    /**
     * This function calculates the compared duration. Currently we support only compared duration which is the same length as the main duration
     * @param duration
     * @returns {string}
     */
    calculateComparedDuration(compareDuration) {
        const durationObject = DurationService.getDurationData(compareDuration);
        return DurationService.getDiffSymbol(
            durationObject.forAPI.from,
            durationObject.forAPI.to,
            "months",
        );
    }

    /**
     * Calculates if the duration valid for period over period.
     * @param {String} duration - selected period
     * @param {Moment} compareDurationFrom - start date of compare period
     * @param {String} componentId - component name
     * @returns {boolean}
     * @privates
     */
    private _isValidDuration(duration, compareDurationFrom: Dayjs, componentId: string): boolean {
        const minimumStartDate = dayjs.utc(
            this.swSettings.components[componentId].resources.PeriodOverPeriodStartDate,
            "YYYY-MM",
        );
        const monthsDiff = DurationService.getMonthsFromApiDuration(
            duration.raw.from,
            duration.raw.to,
            false,
        );

        // if the range is more then 12 months or the start date is prior to the minimum start date
        if (duration.raw.from.isBefore(minimumStartDate) || monthsDiff > this.MAX_MONTHS_DIFF) {
            return false;
        }
        // if from duration is less that minimum possible
        if (
            compareDurationFrom &&
            compareDurationFrom.isBefore(minimumStartDate) &&
            !duration.raw.from.isSame(compareDurationFrom)
        ) {
            return false;
        }
        // the compared duration cannot be before the user's minimum start date
        if (
            duration.raw.compareFrom &&
            duration.raw.compareFrom.isBefore(this.swSettings.components[componentId].startDate)
        ) {
            return false;
        }
        return true;
    }
}

export const periodOverPeriodService = new PeriodOverPeriodService();
