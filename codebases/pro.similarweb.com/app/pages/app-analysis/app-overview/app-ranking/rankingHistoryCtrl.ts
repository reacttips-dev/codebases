import angular, { ITimeoutService } from "angular";
import _ from "lodash";
import dayjs from "dayjs";

import { RankingHistoryGraphWidget } from "./widgets/RankingHistoryGraphWidget";
import { RankingHistoryTableWidget } from "./widgets/RankingHistoryTableWidget";
import { CHART_COLORS } from "constants/ChartColors";
import { chosenItems } from "common/services/chosenItems";
import { INTERVALS } from "constants/Intervals";

class rankingHistory {
    private widgetsLoaded = false;
    private state: any;

    constructor(
        private $scope: any,
        private swNavigator: any,
        private widgetFactoryService: any,
        private $timeout: ITimeoutService,
        private $filter: any,
    ) {
        this.$scope.$on("onSelectionsChanged", (event, newSelections) => {
            this.reloadAllWidgets(newSelections);
        });
        this.state = swNavigator.current().name;
        this.$timeout(() => {
            if (
                this.$scope.ranking.metaData &&
                this.$scope.ranking.selections &&
                this.$scope.ranking.selections.mode &&
                this.$scope.ranking.selections.mode.id &&
                !this.widgetsLoaded
            ) {
                this.reloadAllWidgets(this.$scope.ranking.selections);
            }
        }, 100);
    }

    private sortTable(column, order, records) {
        return _.orderBy(
            records,
            (record) => {
                let value: number | { Value: number } = record[column.field];
                if (_.isObject(value)) {
                    value = value.Value;
                }
                if (value === null || value === undefined) {
                    value = order === "asc" ? Infinity : -Infinity;
                } else {
                    if (!isNaN(value)) {
                        value = +value;
                        if (/change/i.test(column.field)) {
                            value = value * -1;
                        }
                    }
                }
                return value;
            },
            order,
        );
    }

    private processGraphResponse(response) {
        const timeSpan = this.$scope.ranking.getSelectedDateRange();
        response.Data = _.mapValues(response.Data, (appCategories: any, appCode) => {
            return _.mapValues(appCategories, (resultsForCategory: any, categoryName: string) => {
                const filteredResults = (
                    (resultsForCategory.length && resultsForCategory[0]) ||
                    []
                ).filter((dataPoint) => {
                    const countDate = dayjs.utc(dataPoint.Key);
                    return countDate.isBetween(timeSpan.from, timeSpan.to, null, "(]");
                });
                return [filteredResults];
            });
        });

        if (!this.$scope.ranking.isCompare) {
            response.Data = _.mapValues(response.Data, (categoryObject, appName) => {
                return _.pickBy(categoryObject, (val, key) => _.flattenDeep(val).length > 0);
            });
        } else {
            const reducer = {};
            _.reduce(
                response.Data,
                (seed, appCategoryObject, appCode) => {
                    for (const pair of _.toPairs<any>(appCategoryObject)) {
                        const numOfItemsInCategory = _.flattenDeep(pair[1]).length;
                        seed[pair[0]] = (seed[pair[0]] || 0) + numOfItemsInCategory;
                    }
                    return seed;
                },
                reducer,
            );
            response.Data = _.mapValues(response.Data, (categoryObject, appName) => {
                return _.pickBy(categoryObject, (value, categoryName) => {
                    return reducer[categoryName] > 0;
                });
            });
        }
        return response;
    }

    private processTableResponse(response) {
        response.Data = _.sortBy(response.Data, "Category");
        response.Data = _.map(response.Data, (item: any) => {
            item.Category = this.$filter("prettifyCategory")(item.Category);
            return item;
        });
        const colorsDictionary = {},
            rowsWithData = (response.Data || []).some((app) => app.StoreRank || app.UsageRank);
        let siteColors = CHART_COLORS.main.slice();

        if (rowsWithData) {
            let formattedData = response.Data.map((app) => {
                /*   app.StoreRank = [app.StoreRank,app.StoreChange];
                 app.UsageRank = [app.UsageRank,app.UsageChange];*/
                if (!this.$scope.ranking.isCompare) {
                    app.Category = {
                        Key: colorsDictionary[app.Category] =
                            colorsDictionary[app.Category] ||
                            siteColors.shift() ||
                            (siteColors = CHART_COLORS.main.slice()).shift(),
                        Value: app.Category,
                    };
                }
                return app;
            });
            if (this.$scope.ranking.isCompare) {
                formattedData = _.sortBy(formattedData, (record) => record.Category);
            }
            response.Data = formattedData;
        }

        return response;
    }

    private reloadAllWidgets(newSelections) {
        this.$scope.historyRankingTable = null;
        this.$scope.historicRankingGraph = null;
        this.$timeout(() => {
            this.reloadGraph(newSelections);
            this.reloadTable(newSelections);
            this.widgetsLoaded = true;
        });
    }

    private reloadGraph(newSelections: any) {
        const that = this;
        let apiParams: any = this.$scope.ranking.getApiParams(newSelections);
        if (!this.$scope.ranking.isCompare) {
            apiParams = _.pick(apiParams, [
                "country",
                "appmode",
                "device",
                "timeGranularity",
                "from",
                "to",
                "isWindow",
            ]);
        }
        const graphParams = {
            duration: newSelections.duration.id,
            key: _.flatten([this.$scope.ranking.app, this.$scope.ranking.competitors]).map(
                (app) => {
                    const appItem = angular.merge({}, app, {
                        store: app.AppStore,
                        id: app.Id,
                        name: app.Title,
                        markerShadow: true,
                    });
                    return appItem;
                },
            ),
            xAxisTickInterval: that.defineXAxisTickInterval(
                that.$scope.ranking.selections.duration.id,
            ),
            getTitle: that.getTitle,
            dateRange: that.$scope.ranking.getSelectedDateRange(),
            filters: _.cloneDeep(apiParams),
            processResponse: this.processGraphResponse.bind(this),
            ...apiParams,
        };
        this.$scope.historicRankingGraph = this.widgetFactoryService.createWithConfigs(
            graphParams,
            RankingHistoryGraphWidget,
            this.state,
        );
    }

    private defineXAxisTickInterval(durationId) {
        let xInterval = INTERVALS.daily * 2;
        switch (durationId) {
            case "30d":
                xInterval = INTERVALS.daily * 2;
                break;
            case "90d":
                xInterval = INTERVALS.daily * 6;
                break;
            case "365d":
                xInterval = INTERVALS.daily * 6 * 4;
                break;
            case "730d":
                xInterval = INTERVALS.daily * 6 * 4 * 2;
                break;
            case "1095d":
                xInterval = INTERVALS.daily * 6 * 4 * 3;
                break;
            default:
                xInterval = INTERVALS.daily;
                break;
        }
        return xInterval;
    }

    public getTitle() {
        const that = this;
        const currentCountry = that.$scope.ranking.selections.country.text,
            currentCategory = that.$scope.ranking.selections.category.id;

        return `<div style="width: 1285px; padding-bottom: 18px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4;">
                                                    <span style="font-size: 35px; font-family: 'sans serif'; font-weight: 200; color: #2b3d52; letter-spacing: -2px;">Ranking History</span>
                                                    <span style="font-size: 18px; font-family: 'sans serif'; font-weight: 200; color: #2b3d52; letter-spacing: 0px; padding-left: 24px;">${
                                                        /google/i.test(
                                                            that.$scope.ranking.app.AppStore,
                                                        )
                                                            ? "Google Play"
                                                            : "Apple Store"
                                                    } | ${currentCountry}</span>
                                                </div>
                                                <div style="margin-top: 20px;">
                                                    <span style="font-size: 24px; font-family: 'sans serif'; font-weight: 200; color: #2b3d52; letter-spacing: 0px;">${
                                                        that.$scope.ranking.isCompare
                                                            ? currentCategory
                                                            : that.$scope.ranking.app.Title
                                                    }</span>
                                                </div>`;
    }

    private reloadTable(newSelections: any) {
        let apiParams: any = this.$scope.ranking.getApiParams(newSelections);
        apiParams.from = apiParams.to; // hardcoded for last day of scraping
        apiParams = _.merge({}, _.omit(apiParams, ["category"]), {
            key: _.flatten([this.$scope.ranking.app, this.$scope.ranking.competitors]).map(
                (app) => ({
                    store: app.AppStore,
                    id: app.Id,
                    name: app.Title,
                }),
            ),
        });
        const tableParams = {
            ...apiParams,
            onSort: this.sortTable.bind(this),
            processResponse: this.processTableResponse.bind(this),
        };
        this.$scope.historyRankingTable = this.widgetFactoryService.createWithConfigs(
            tableParams,
            RankingHistoryTableWidget,
            this.state,
        );
    }

    public get scrapingTableTitle() {
        const lastDate = dayjs(chosenItems.$first().LastUpdate as any);
        return `App Ranking in ${lastDate.format("MMMM DD, YYYY")}`;
    }

    public get scrapingTableSubtitle() {
        const selections = this.$scope.ranking.selections,
            lastDate = dayjs(chosenItems.$first().LastUpdate as any);
        if (!_.isEmpty(selections)) {
            return `${selections.country.text} | ${lastDate.format("MMMM DD, YYYY")} | ${
                selections.mode.id
            }`;
        } else {
            return "";
        }
    }
}
angular
    .module("sw.apps")
    .controller("rankingHistoryCtrl", rankingHistory as ng.Injectable<ng.IControllerConstructor>);
