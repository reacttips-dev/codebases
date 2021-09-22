import angular from "angular";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";
import { i18nFilter } from "filters/ngFilters";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { chosenItems } from "common/services/chosenItems";
import { SwTrack } from "services/SwTrack";

enum Tabs {
    history,
    daily,
    /*,highest,*/
}
enum TabTitles {
    "mobileApps.overview.ranking.new.tabs.history.title",
    "mobileApps.overview.ranking.new.tabs.dailyapp.title",
}

type durationPreset = {
    text: string;
    id: string;
};

const AppRankingDurationPresets: () => durationPreset[] = () => [
    {
        text: i18nFilter()("datepicker.lastn", {
            count: "7",
            unit: i18nFilter()("datepicker.units.day.nomerous"),
        }),
        id: "7d",
    },
    {
        text: i18nFilter()("datepicker.lastn", {
            count: "30",
            unit: i18nFilter()("datepicker.units.day.nomerous"),
        }),
        id: "30d",
    },
    {
        text: i18nFilter()("datepicker.lastn", {
            count: "90",
            unit: i18nFilter()("datepicker.units.day.nomerous"),
        }),
        id: "90d",
    },
    {
        text: i18nFilter()("datepicker.lastn", {
            count: null,
            unit: i18nFilter()("datepicker.units.year.single"),
        }),
        id: "365d",
    },
    {
        text: i18nFilter()("datepicker.lastn", {
            count: "2",
            unit: i18nFilter()("datepicker.units.year.nomerous"),
        }),
        id: "730d",
    },
];

class rankingController {
    private _selectedTab: string;
    public app: any;
    public competitors: any[];
    public metaData: any;
    public noData: boolean;
    public rawMetaData: any;
    public filters: any = {};
    public selections: any = {};
    public isCompare: boolean;
    public lastScrapingDate: any;
    public maxDurationAllowed: number;
    public minStartDate: any;
    private swSettings = swSettings;
    constructor(
        private $scope: any,
        private swNavigator: any,
        private widgetResource: any,
        private $q: any,
    ) {
        this.app = angular.copy(chosenItems.$first());
        this.lastScrapingDate = dayjs.utc(this.app.LastUpdate).endOf("day");
        this.competitors = angular.copy(chosenItems.$all().slice(1));
        this.isCompare = !!this.competitors.length;
        this.maxDurationAllowed = this.swSettings.current.resources.AllowedDuration;
        this.minStartDate = this.lastScrapingDate
            .clone()
            .add(-1 * this.maxDurationAllowed, "days")
            .startOf("day");
        this.$scope.$watch("ranking.selections", this.onUpdate.bind(this), true);
    }

    private onUpdate() {
        this._selectedTab = this.swNavigator.getParams().tab;
        if (!this._selectedTab) {
            return this.swNavigator.go(
                this.swNavigator.current(),
                { tab: "history" },
                { reload: true },
            );
        }
        const metaDataBuilder = this.buildAppMetaData();

        if (!metaDataBuilder) {
            this.noData = true;
            return;
        }

        metaDataBuilder
            .then(() => this.resetFilters())
            .then(() => (this.selections = this.getNewSelections()))
            .then(() => this.updateURL())
            .then(() => this.publishSelections())
            .catch(() => (this.noData = true));
    }

    private publishSelections() {
        if (this.selections.mode && this.selections.mode.id) {
            this.$scope.$broadcast("onSelectionsChanged", this.selections);
        }
    }

    private convertToDropDownValue(val) {
        return {
            id: val,
            text: val,
        };
    }

    private getDurations() {
        return AppRankingDurationPresets().map((item: any) => {
            const durationInDays = parseInt(item.id, 10);
            item.disabled = durationInDays > this.maxDurationAllowed;
            return item;
        });
    }

    private resetFilters() {
        return (this.filters = {
            highestRankedCountry: this.swSettings.current.resources.InitialCountry,
            countries: _.get(this.metaData, "settings.countries", [])
                .map((countryId) =>
                    angular.copy(
                        _.find(
                            CountryService.countries,
                            (country: any) => countryId === country.id,
                        ),
                    ),
                )
                .filter((country) => !!country)
                .map((country) => {
                    country.states = country.children = [];
                    return country;
                })
                .sort((countryA, countryB) => {
                    if (countryA.text < countryB.text) {
                        return -1;
                    } else if (countryA.text > countryB.text) {
                        return 1;
                    } else {
                        return 0;
                    }
                }),
            modes: _.get(this.metaData, "filters.appmode", []).map(this.convertToDropDownValue),
            devices: _.get(this.metaData, "filters.device", []).map(this.convertToDropDownValue),
            categories: _.sortBy(
                _.get(this.metaData, "settings.categories", []).map(this.convertToDropDownValue),
                "text",
            ),
            durations: this.getDurations(),
            startDate: this.swSettings.current.startDate,
            endDate: this.swSettings.current.endDate,
        });
    }

    private getNewSelections() {
        const currentParams: any = _.mapValues(
            this.swNavigator.getParams(),
            (value) => (typeof value === "string" && decodeURIComponent(value)) || value,
        );
        return {
            country:
                this.selections.country ||
                _.find(this.filters.countries, { id: +currentParams.country }) ||
                _.find(this.filters.countries, { id: +this.filters.highestRankedCountry }),
            device:
                this.selections.device ||
                _.find(this.filters.devices, { id: currentParams.device }),
            mode:
                this.selections.mode ||
                _.find(this.filters.modes, { id: currentParams.mode }) ||
                this.filters.modes[0] ||
                this.convertToDropDownValue("Top Free"),
            category:
                this.selections.category ||
                _.find(this.filters.categories, { id: currentParams.category }) ||
                _.find(this.filters.categories, { id: this.app.Category }),
            duration:
                this.selections.duration ||
                _.find(this.filters.durations, { id: currentParams.duration }) ||
                _.find(this.filters.durations, { id: this.maxDurationAllowed + "d" }),
        };
    }

    private updateURL() {
        return this.swNavigator.go(
            this.swNavigator.current(),
            Object.assign(
                this.swNavigator.getParams(),
                _.pick(
                    _.mapValues(this.selections, (value: any, key) => {
                        switch (key) {
                            default:
                                let filtersKey = key + "s";
                                switch (key) {
                                    case "country":
                                        filtersKey = "countries";
                                        break;
                                    case "category":
                                        filtersKey = "categories";
                                        break;
                                }
                                const currentFilter = this.filters[filtersKey],
                                    filterNotEmpty = currentFilter && currentFilter.length;
                                let selectionValue =
                                    (value && value.id) || (filterNotEmpty && currentFilter[0].id);
                                if (
                                    key === "duration" &&
                                    parseInt(selectionValue, 10) > this.maxDurationAllowed
                                ) {
                                    selectionValue = this.swSettings.current.defaultParams.duration;
                                    this.selections.duration = _.find(this.getDurations(), {
                                        id: selectionValue,
                                    });
                                }
                                return selectionValue;
                        }
                    }),
                    Object.keys(this.swNavigator.getParams()),
                ),
            ),
        );
    }

    private buildRawMetaData(allMetaDataObjects: any) {
        const that = this;
        return allMetaDataObjects.reduce((allAppsRawMetaData, appMetaData, index) => {
            const appId = chosenItems[index] && chosenItems[index].Id;
            if (appId) {
                allAppsRawMetaData[appId] = angular.copy(appMetaData);
            }
            return allAppsRawMetaData;
        }, {});
    }

    private buildAppMetaData() {
        this.metaData = null;
        this.noData = false;
        const endDate = this.lastScrapingDate,
            startDate = this.minStartDate.clone(),
            durationForMetaData = DurationService.getDurationApiFor(startDate, endDate),
            queryParams: any = Object.assign(this.swNavigator.getApiParams(), durationForMetaData);

        queryParams.store = _.capitalize(queryParams.store);
        const metaDataParams: any = _.pick(queryParams, ["from", "to", "store"]);

        const allMetaDataResponses = chosenItems
            .filter((item) => item.AppStore)
            .map((item) => {
                // Search for scraped apps since last month
                const mobileScrapingDateMinus1Month = dayjs(
                    this.swSettings.current.resources.MobileScrapingDate,
                )
                    .utc()
                    .subtract(1, "months")
                    .format("YYYY|MM|DD");
                const itemMetaData = {
                    ...metaDataParams,
                    from: mobileScrapingDateMinus1Month,
                    keys: item.Id,
                };
                return this.widgetResource
                    .resourceByController("AppRanks", "AppRanks")
                    .Settings(itemMetaData).$promise;
            });

        if (allMetaDataResponses.length === 0) {
            this.noData = true;
            this.metaData = null;
            return;
        }

        // merge all the metadata for all the apps into one object so the filters will contain all the possible values.
        return this.$q
            .all(allMetaDataResponses)
            .then((allMetaDataObjects) => {
                this.rawMetaData = this.buildRawMetaData(allMetaDataObjects);
                return allMetaDataObjects;
            })
            .then((allMetaDataObjects) =>
                _.mergeWith.apply(_, [
                    ...allMetaDataObjects,
                    (objValue, srcValue) => {
                        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
                            return _.uniq(objValue.concat(srcValue));
                        }
                    },
                ]),
            )
            .then((metaData) => (this.metaData = metaData))
            .catch((error) => {
                this.noData = true;
            });
    }

    private sortByDisplayOrder(displayList, dataList) {
        return displayList.filter((displayName) =>
            _.some(dataList, (dataItem) => displayName.toLowerCase() === dataItem.toLowerCase()),
        );
    }

    public get activeTabIndex(): string {
        return Tabs[this._selectedTab];
    }

    public onTabSelected(index) {
        this._selectedTab = Tabs[index];
        SwTrack.all.trackEvent("Tab", "click", "Table/" + i18nFilter()(TabTitles[index]));
        this.swNavigator.updateParams({ tab: Tabs[index] });
    }

    public getApiParams(newSelections: any) {
        let params: any = DurationService.getDurationApiFor(
            this.minStartDate.clone(),
            this.lastScrapingDate.clone(),
        );
        params.country = this.swSettings.current.defaultParams.country;
        if (_.every(newSelections, (selection) => angular.isDefined(selection))) {
            const { from, to } = this.$scope.ranking.getSelectedDateRange();
            params = Object.assign(
                {
                    country: newSelections.country.id,
                    appmode: newSelections.mode.id,
                    device: newSelections.device.id,
                    category: newSelections.category.id,
                    timeGranularity: "Daily",
                },
                DurationService.getDurationApiFor(from, to),
            );
        }
        return params;
    }

    public getSelectedDateRange() {
        return {
            to: this.lastScrapingDate.clone(),
            from: this.lastScrapingDate
                .clone()
                .add(-1 * parseInt(this.selections.duration.id) || 0, "days")
                .startOf("day"),
        };
    }
}

angular
    .module("sw.apps")
    .controller(
        "appsRankingMainCtrl",
        rankingController as ng.Injectable<ng.IControllerConstructor>,
    );
