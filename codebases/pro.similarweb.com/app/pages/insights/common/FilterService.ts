import { ILocationService, ITimeoutService } from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import { IFilter, IPeriod } from "./../deep-insights/types";

export enum FilterQuery {
    Types = "types",
    SearchText = "search",
    SkipExamples = "skipExamples",
    PeriodFrom = "from",
    PeriodTo = "to",
    DeliveryDate = "delivery",
}

export interface IInitialFilterOptions {
    selectedTypeId?: string[];
    period?: IPeriod;
    deliveryType?: string;
    searchText?: string;
    skipExamples?: boolean;
}

export class FilterService {
    constructor(
        private swNavigatorObject: any,
        private $location: ILocationService,
        private $timeout: ITimeoutService,
    ) {}

    public getInitialFilters(): IInitialFilterOptions {
        const params: any = this.$location.search();
        const selectedTypeId: string = _.get(params, FilterQuery.Types, null);
        const periodTo: string = _.get(params, FilterQuery.PeriodTo, null);
        const periodFrom: string = _.get(params, FilterQuery.PeriodFrom, null);

        const period: IPeriod = {
            to: periodTo != null ? dayjs(periodTo) : null,
            from: periodFrom != null ? dayjs(periodFrom) : null,
        };

        const skipExmpl: any = _.get(params, FilterQuery.SkipExamples);
        const filters: IInitialFilterOptions = {
            skipExamples: skipExmpl === undefined ? skipExmpl : skipExmpl === "true",
            selectedTypeId:
                selectedTypeId === "" || selectedTypeId === "ALL" || selectedTypeId === null
                    ? []
                    : selectedTypeId.split(","),
            searchText: _.get(params, FilterQuery.SearchText),
            period,
            deliveryType: _.get(params, FilterQuery.DeliveryDate),
        };

        return filters;
    }

    public updateFiltersQuery(filters: Partial<IFilter>): void {
        const queryObject: object = {};
        for (const filter in filters) {
            if (filters.hasOwnProperty(filter)) {
                switch (filter) {
                    case "searchText":
                        const searchText: string = filters[filter];
                        if (searchText != null) {
                            queryObject[FilterQuery.SearchText] = filters[filter];
                        }
                        break;
                    case "selectedTypeId":
                        if (filters[filter] !== null && filters[filter].length > 0) {
                            queryObject[FilterQuery.Types] = filters[filter].join(",");
                        }
                        break;
                    case "skipExamples":
                        queryObject[FilterQuery.SkipExamples] = `${!!filters[filter]}`;
                        break;
                    case "period":
                        const { to: periodTo, from: periodFrom } = filters[filter];
                        if (periodTo !== null) {
                            queryObject[FilterQuery.PeriodTo] = periodTo.format("YYYY-MM-DD");
                        }
                        if (periodFrom !== null) {
                            // evgk:
                            // force month range to second day, related to bug with date picker component,
                            // when month ranges are shifted, probably due to incorrect rounding
                            // @todo: investigate and fix
                            queryObject[FilterQuery.PeriodFrom] = periodFrom.format("YYYY-MM-02");
                        }
                        break;
                    case "deliveryDate":
                        if (filters[filter] && filters[filter]["id"] != null) {
                            queryObject[FilterQuery.DeliveryDate] = filters[filter]["id"];
                        }
                        break;
                    default:
                }
            }
        }
        this.setQueryFilter(queryObject);
        return;
    }

    public resetFilterQuery(): void {
        this.$timeout(() => this.$location.url(this.$location.path()));
    }

    private setQueryFilter(queryObject: object): void {
        this.$timeout(() => this.$location.search(queryObject));
    }
}
