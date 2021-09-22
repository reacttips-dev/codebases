import angular from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import DurationService from "services/DurationService";
import { TableAppRanksAchievementsWidget } from "./widgets/TableAppRanksAchievementsWidget";
import { TableAppRanksWidget } from "./widgets/TableAppRanksWidget";
import { chosenItems } from "common/services/chosenItems";
/**
 * Created by Eran.Shain on 5/9/2016.
 */
class rankingDaily {
    private tableSelectedCategory: string;
    private widgetsLoaded = false;
    private allScoresCompareMode: any = [];
    private countriesTableAvailableCategories: any = [];
    private state: any;

    constructor(
        private $scope: any,
        private $filter: any,
        private swNavigator: any,
        private widgetFactoryService: any,
        private $timeout: any,
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

        this.$scope.$watch("ctrl.tableSelectedCategory", (newCategory, oldCategory) => {
            if (newCategory && oldCategory && newCategory !== oldCategory) {
                this.$scope.dailyRankingTable.data.Records = this.getScoresForSelectedCategory();
                this.reloadAllWidgets(this.$scope.ranking.selections);
            }
        });
    }

    private processResponse(response) {
        let tableData;
        if (!this.$scope.ranking.isCompare) {
            tableData = this.transformToTableData(response);
        } else {
            tableData = this.transformToTableDataCompare(response);
            this.countriesTableAvailableCategories = this.getAvailableCategoriesCompare();
        }
        response.Data = tableData;
        if (response.Data && response.Data.length) {
            response.TotalCount = response.Data.length;
        }
        return response;
    }

    private transformToTableData({ Data: [{ Countries = [] }] }) {
        return (Countries || []).reduce((allRows, countryRecord) => {
            return [
                ...allRows,
                countryRecord.Categories.reduce(
                    (tableDataRow, categoryObject) => {
                        return Object.assign(tableDataRow, {
                            [categoryObject.Category]: categoryObject.Rank,
                            [categoryObject.Category + "Change"]: categoryObject.Change,
                        });
                    },
                    { Country: countryRecord.Country },
                ),
            ];
        }, []);
    }

    private getAvailableCategoriesCompare() {
        // #fixes SIM-12794 - don't show categories with empty data.
        const allApps = chosenItems.map((app) => app.Id);
        return this.$scope.ranking.filters.categories.filter((category) =>
            _.some(this.allScoresCompareMode, (record) => {
                return (
                    record.category === category.id &&
                    _.some(allApps, (appId) => _.isNumber(record[appId]))
                );
            }),
        );
    }

    private transformToTableDataCompare({ Data = [] }) {
        this.allScoresCompareMode = _.flattenDeep(
            _.map(Data, (appObject) => {
                const appCode = appObject.App;
                return (appObject.Countries || []).map((countryObject) => {
                    return countryObject.Categories.map((categoryObject) => {
                        return {
                            [appCode]: categoryObject.Rank,
                            [appCode + "Change"]: categoryObject.Change,
                            Country: countryObject.Country,
                            category: categoryObject.Category,
                        };
                    });
                });
            }),
        );
        return this.getScoresForSelectedCategory();
    }

    private getScoresForSelectedCategory() {
        this.tableSelectedCategory = this.tableSelectedCategory || this.findBestDefaultCategory();
        this.$scope.dailyRankingTable.selectedCategory = this.tableSelectedCategory;
        const filteredAndGroupedByGeos = _.groupBy(
            _.filter(
                this.allScoresCompareMode,
                (obj: any) => obj.category === this.tableSelectedCategory,
            ),
            "Country",
        );
        return _.map(_.values(filteredAndGroupedByGeos), (appsSeparated: any) =>
            appsSeparated.reduce((prevAppRanking, CurrentAppRanking) =>
                Object.assign(prevAppRanking, CurrentAppRanking),
            ),
        );
    }

    private findBestDefaultCategory() {
        // sets the selected category of the drop down to the category which has the most number of frequencies in all apps.
        // But this category must also be present in the main app.
        const mainAppCode = this.$scope.ranking.app.Id,
            allApps = chosenItems.map((app) => app.Id),
            rawAppsMetaData = this.$scope.ranking.rawMetaData,
            mainAppCategories = rawAppsMetaData[mainAppCode].settings.categories,
            frequenciesPerCategory = mainAppCategories.reduce((frequencies, category) => {
                frequencies[category] = 0;
                return frequencies;
            }, {});
        _.reduce(
            this.allScoresCompareMode,
            (frequenciesPerCategory, scoringRecord: any) => {
                if (frequenciesPerCategory.hasOwnProperty(scoringRecord.category)) {
                    // only count for categories that appears for the main app.
                    allApps.forEach((appId) => {
                        if (_.isNumber(scoringRecord[appId])) {
                            // competitor app also has rating for this category
                            frequenciesPerCategory[
                                scoringRecord.category
                            ] = ++frequenciesPerCategory[scoringRecord.category];
                        }
                    });
                }
                return frequenciesPerCategory;
            },
            frequenciesPerCategory,
        );

        const frequencies = _.values(frequenciesPerCategory),
            maxFrequency = Math.max.apply(Math, frequencies);
        return _.findKey(frequenciesPerCategory, (val) => val === maxFrequency);
    }

    private sortTable = (column, order, records) => {
        const that = this;
        return _.orderBy(
            records,
            (record) => {
                let value = record[column.field];
                if (column.field === "Country") {
                    value = that.$filter("countryById")(+value, "text");
                } else {
                    if (!_.isNumber(value)) {
                        value = order === "asc" ? Infinity : -Infinity;
                    } else {
                        if (!isNaN(value)) {
                            value = +value;
                            if (/change/i.test(column.field)) {
                                value = -1 * value;
                            }
                        } else {
                            value = record[column.field];
                        }
                    }
                }
                return value;
            },
            order,
        );
    };

    private reloadAllWidgets(newSelections) {
        this.$scope.dailyRankingTable = null;
        this.$scope.appRanksAchievementsTable = null;
        this.$timeout(() => {
            this.reloadTables(newSelections);
            this.widgetsLoaded = true;
        });
    }

    private reloadTables(newSelections) {
        let apiParams: any = this.$scope.ranking.getApiParams(newSelections);
        apiParams = _.pick(apiParams, [
            "appmode",
            "device",
            "timeGranularity",
            "from",
            "to",
            "isWindow",
        ]);
        const singleParams = {
            key: _.flatten([chosenItems.$all()]).map((app: any) => ({
                store: app.AppStore,
                id: app.Id,
                name: app.Title,
            })),
            filters: _.cloneDeep(apiParams),
            apiParams: {
                ...apiParams,
                from: apiParams.to,
            },
            onSort: this.sortTable,
            processResponse: this.processResponse.bind(this),
        };
        const compareParams = {
            key: _.flatten([chosenItems.$all()]).map((app: any) => ({
                store: app.AppStore,
                id: app.Id,
                name: app.Title,
            })),
            apiParams: {
                ...apiParams,
                ...DurationService.getDurationApiFor(
                    this.$scope.ranking.minStartDate.clone(),
                    this.$scope.ranking.lastScrapingDate.clone(),
                ),
            },
        };

        this.$scope.dailyRankingTable = this.widgetFactoryService.createWithConfigs(
            singleParams,
            TableAppRanksWidget,
            this.state,
        );
        if (!this.$scope.ranking.isCompare) {
            this.$scope.appRanksAchievementsTable = this.widgetFactoryService.createWithConfigs(
                compareParams,
                TableAppRanksAchievementsWidget,
                this.state,
            );
        }
    }

    public get lastDayOfScraping() {
        const lastDate = dayjs(chosenItems.$first().LastUpdate as any);
        return `${lastDate.format("MMMM DD, YYYY")}`;
    }

    public countryTableSubtitle() {
        const selections = this.$scope.ranking.selections;
        if (!_.isEmpty(selections)) {
            return `${selections.mode.id}`;
        } else {
            return "";
        }
    }
}

angular
    .module("sw.apps")
    .controller("rankingDailyCtrl", rankingDaily as ng.Injectable<ng.IControllerConstructor>);
