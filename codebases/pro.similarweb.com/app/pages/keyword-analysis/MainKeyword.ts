import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
/**
 * Created by Eran.Shain on 6/15/2016.
 */
import { KeywordGroupsDataFetcher } from "components/widget/widget-fetchers/KeywordGroupsDataFetcher";
import CountryService from "services/CountryService";
import { Injector } from "common/ioc/Injector";
import { IAccountUser, SharingService } from "sharing/SharingService";
import { DEFAULT_PAGE_LAYOUT_CLASS_NAME } from "UtilitiesAndConstants/Constants/css";
import { SwTrack } from "services/SwTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

enum Tabs {
    domains,
    keywords,
}

export class MainKeyword {
    private filters: any;
    private selections: any = {};
    private _selectedGroupForDropDown = null;
    private _keywordsGroupsForDropDown = [];
    private _keywordsGroupsMyListsForDropDown = [];
    private _keywordsGroupsSharedListsForDropDown = [];
    private _keywordsGroupsForAddToMenu = [];
    public searchTerm: any;
    public allWidgets: any;
    public tableWidgets: any;
    public nonTableWidgets: any;
    private swSettings = swSettings;
    private isShareModalOpen: boolean;
    private shareKeywordGroup: any;
    public pageLayoutClassName: string;
    private accountUsers: IAccountUser[];

    constructor(
        private $scope: any,
        private $rootScope: any,
        private swNavigator: any,
        private widgetFactoryService: any,
        private $timeout: any,
    ) {
        this.searchTerm = this.swNavigator.getParams().keyword || "";
        this.loadFilters();
        this.$scope.$watch("ctrl.selections", this.onSelectionChanged.bind(this), true);
        this.$scope.$on("navChangeComplete", this.onNavUpdate.bind(this));
        this.$scope.$on("onUniversalSearch", this.onSearch.bind(this));
        this.selectGroup = this.selectGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.pageLayoutClassName =
            this.swNavigator.current().pageLayoutClassName ?? DEFAULT_PAGE_LAYOUT_CLASS_NAME;
        if (keywordsGroupsService.isEnabled) {
            this.$scope.$watch(
                () => keywordsGroupsService.userGroups,
                (newVal, oldVal) => {
                    this.init();
                },
            );
        }
        this.$timeout(() => {
            if (!this.$scope.$$destroyed) {
                //fixes #SIM-15255
                this.$scope.$broadcast("searchReady");
            }
        });

        this.loadUsers();
    }

    private init() {
        this._keywordsGroupsMyListsForDropDown = this.loadKeywordsGroups();
        this._keywordsGroupsSharedListsForDropDown = this.loadSharedKeywordGroups();
        this._keywordsGroupsForDropDown = [];
        this._keywordsGroupsForDropDown.push(this._keywordsGroupsMyListsForDropDown);
        this._keywordsGroupsForDropDown.push(this._keywordsGroupsSharedListsForDropDown);
        this._keywordsGroupsForAddToMenu = [
            { text: "New Group" },
            ...this._keywordsGroupsForDropDown,
        ];
        if (!this.isKeywordMode()) {
            const groupId = this.searchTerm.replace(
                new RegExp("^[" + keywordsGroupsService.keywordPrefix + "]"),
                "",
            );
            this._selectedGroupForDropDown = _.find(
                this._keywordsGroupsForDropDown.flat(1),
                (item) => {
                    return (
                        groupId.toLowerCase() === item.id.toLowerCase() ||
                        groupId.toLowerCase() === item.text.toLowerCase()
                    );
                },
            );
        }
    }

    private async loadUsers() {
        const { users } = await SharingService.getAccountUsers();
        this.$scope.$applyAsync(() => {
            this.accountUsers = users;
        });
    }

    private loadKeywordsGroups() {
        return keywordsGroupsService.groupsToDropDown().map((item) => {
            return {
                ...item,
                shareable: true,
                editable: true,
                deletable: true,
            };
        });
    }

    private loadSharedKeywordGroups() {
        return keywordsGroupsService.sharedGroupsToDropDown().map((item) => {
            return {
                ...item,
                shareable: false,
                editable: false,
                deletable: false,
            };
        });
    }

    private fromDropDownGroup(group) {
        return keywordsGroupsService.groupFromDropDown(group);
    }

    private loadFilters() {
        const component = this.swSettings.current;
        this.filters = {
            countries: this.swSettings.filterCountries(component.resources.Countries, true),
            durations: _.cloneDeep(component.datePickerPresets),
            startDate: component.startDate,
            endDate: component.endDate,
        };
    }

    private getGroupFromId(selectedId) {
        const userGroups = keywordsGroupsService.userGroups;
        const sharedGroups = keywordsGroupsService.getSharedGroups();
        return _.find([...userGroups, ...sharedGroups], ({ Id }) => Id === selectedId);
    }

    private gotoGroup(group) {
        return this.swNavigator.go(
            this.swNavigator.current(),
            _.merge({}, this.swNavigator.getParams(), {
                keyword: `${keywordsGroupsService.keywordPrefix}${group.Id}`,
            }),
        );
    }

    get userKeywordsGroups() {
        return this._keywordsGroupsForDropDown;
    }

    get selectedKeywordsGroup() {
        return this._selectedGroupForDropDown;
    }

    get backStateUrl() {
        const homeState = this.swNavigator.current().homeState;
        const homeStateUrl = this.swNavigator.href(homeState, null);
        return homeStateUrl;
    }

    selectGroup(selectedId) {
        const group: any = this.getGroupFromId(selectedId);
        if (group) {
            return this.gotoGroup(group);
        }
    }

    isLoading() {
        return this.isKeywordMode() && _.startsWith(this.searchTerm, "*");
    }

    isKeywordMode() {
        return !_.startsWith(this.selections.keyword, keywordsGroupsService.keywordPrefix);
    }

    hasKeywordsGroups() {
        return !!this.userKeywordsGroups.length;
    }

    keywordsGroupsEnabled() {
        return keywordsGroupsService.isEnabled;
    }

    deleteGroup(item) {
        const group: any = this.getGroupFromId(item.id);
        const currentGroup = this._selectedGroupForDropDown || {};
        return keywordsGroupsService.deleteGroup(group).then((groupList) => {
            if (item.id === currentGroup.id) {
                return this.swNavigator.go("keywordAnalysis-home");
            }
        });
    }

    getCountry(countryId) {
        return _.cloneDeep(CountryService.getCountryById(countryId));
    }

    getDuration(durationId) {
        return (
            _.cloneDeep(
                _.find(this.filters.durations, (duration) => duration.value === durationId),
            ) || { value: this.swNavigator.getParams().duration }
        );
    }

    private getSelection(paramName, searchOrder) {
        searchOrder = searchOrder.slice();
        const currentSearchLocation = searchOrder.shift();
        let retValue;
        switch (currentSearchLocation) {
            case "selections":
                retValue = this.selections[paramName];
                break;
            case "url":
            case "defaultParams":
                const paramValue =
                    currentSearchLocation === "url"
                        ? this.swNavigator.getParams()[paramName]
                        : this.swSettings.current.defaultParams[paramName];
                if (paramValue) {
                    switch (paramName) {
                        case "country":
                            retValue =
                                this.swSettings.allowedCountry(paramValue) &&
                                this.getCountry(paramValue);
                            break;
                        case "duration":
                            retValue =
                                this.swSettings.allowedDuration(paramValue) &&
                                this.getDuration(paramValue);
                            break;
                        case "keyword":
                            retValue = this.normalizeKeyword(this.searchTerm);
                            break;
                        case "tab":
                            if (!_.startsWith(this.searchTerm, "*")) {
                                // in keyword mode
                                return Tabs[0];
                            } else {
                                return Tabs[Tabs[paramValue]];
                            }
                    }
                    break;
                }
        }

        if (!retValue) {
            if (searchOrder.length) {
                retValue = this.getSelection(paramName, searchOrder);
            }
        }
        return retValue;
    }

    private isValidState() {
        const params = this.swNavigator.getParams();
        return _.every(params, (value, key) => {
            let isLegalValue = false;
            switch (key) {
                case "keyword":
                    isLegalValue =
                        params.keyword && params.keyword === this.normalizeKeyword(params.keyword);
                    break;
                case "tab":
                    isLegalValue = !!Tabs[Tabs[value]];
                default:
                    isLegalValue = angular.isDefined(value) && !!value;
                    break;
            }
            return isLegalValue;
        });
    }

    private onSelectionChanged() {
        const searchOrder = ["selections", "url", "defaultParams"];
        Object.assign(this.selections, {
            country: this.getSelection("country", searchOrder),
            duration: this.getSelection("duration", searchOrder),
            keyword: this.getSelection("keyword", searchOrder),
            tab: this.getSelection("tab", searchOrder),
        });
        const isValidState = this.isValidState();
        this.swNavigator.go(
            this.swNavigator.current().name,
            Object.assign({}, this.swNavigator.getParams(), {
                country: this.selections.country.id,
                duration: this.selections.duration.value,
                keyword: this.selections.keyword || "iphone",
                tab: this.selections.tab,
            }),
            { location: isValidState ? true : "replace" },
        );
    }

    private onNavUpdate() {
        this.loadFilters();
        this.$timeout(() => {
            if (!this.$scope.$$destroyed) {
                //fixes #SIM-15255
                this.$scope.$broadcast("searchReady");
            }
        });
    }

    private normalizeKeyword(searchTerm: any) {
        if (typeof searchTerm === "string") {
            searchTerm = searchTerm.trim();
            if (!_.startsWith(searchTerm, "*")) {
                searchTerm = searchTerm.toLowerCase();
            }
        }
        return searchTerm;
    }

    public onSearch() {
        this.selections.keyword = this.searchTerm.trim().toLowerCase();
        SwTrack.all.trackEvent("Search Bar", "click", "Header/" + this.selections.keyword);
    }

    public shouldDisplayGraph() {
        return true;
    }

    private trackNoData(context) {
        if (
            this.$scope.noData.noDataCpc == true &&
            this.$scope.noData.noDataOrganicVsPaid == true
        ) {
            SwTrack.all.trackEvent(
                "Search Bar",
                "click",
                `Header/${context}/${this.$scope.ctrl.selections.keyword}/not found`,
            );
        }
    }

    public buildWidgetsFromConfig(
        widgetsConfig,
        context,
        customWidgetConfigTransformer = _.identity,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const params = that.$scope.ctrl.selections;
        this.$scope.displayGraph = this.$scope.ctrl.shouldDisplayGraph();
        this.allWidgets = widgetsConfig
            .filter((widgetConfig) => {
                if (this.isKeywordMode() && widgetConfig.tabTitle === "Keywords") {
                    return false;
                }
                switch (widgetConfig.properties.type) {
                    case "KeywordsGraph":
                        return that.$scope.displayGraph;
                    default:
                        return true;
                }
            })
            .map((widgetConfig) => {
                const widget = angular.copy(widgetConfig);
                let { properties: widgetProp } = widget;
                const isGroup = params.keyword.startsWith("*");
                const key = isGroup ? params.keyword.substring(1) : params.keyword;
                const groupName = keywordsGroupsService.findGroupById(key).Name;
                widgetProp.key = [
                    {
                        id: key,
                        name: groupName,
                    },
                ];
                widget.isKeywordMode = () => this.$scope.ctrl.isKeywordMode();
                widget.widgetDataFetcher = KeywordGroupsDataFetcher;
                Object.defineProperty(widgetProp, "tooltip", {
                    get() {
                        if (that.$scope.ctrl.isKeywordMode()) {
                            return `${this.title}.tooltip`;
                        } else {
                            return `${this.title}.keywordgroup.tooltip`;
                        }
                    },
                    set() {
                        if (that.$scope.ctrl.isKeywordMode()) {
                            return `${this.title}.tooltip`;
                        } else {
                            return `${this.title}.keywordgroup.tooltip`;
                        }
                    },
                });

                widgetProp.country = params.country.id;
                widgetProp.duration = params.duration.value;
                widgetProp.apiParam = {
                    keys: params.keyword,
                };

                if (widgetProp.type === "KeywordsGraph") {
                    widgetProp.apiParam = {
                        sites: "",
                    };
                }

                if (/table/i.test(widgetConfig.type)) {
                    // remove row selection when on 28 days
                    widgetProp.enableRowSelection =
                        that.$scope.displayGraph && widgetProp.enableRowSelection;
                }
                if (widgetProp.metric === "KeywordAnalysisCPC") {
                    widgetProp.validateData = (response) => {
                        if (_.isEmpty(response)) {
                            that.$scope.noData = Object.assign({}, that.$scope.noData);
                            that.$scope.noData.noDataCpc = true;
                            that.trackNoData(context);
                        }
                        const val = response[key]?.CPC;
                        switch (typeof val) {
                            case "number":
                                return val > 0;
                            case "string":
                                return _.every(val.split(/\s*[-]\s*/), (num) => +num >= 0);
                        }
                    };
                }
                if (widgetProp.metric === "KeywordAnalysisVolumes") {
                    widgetProp.validateData = (response) => {
                        const val = response[key]?.Volume;
                        return val >= 0;
                    };
                    const originalSubtitle = widgetProp.subtitle;
                    widgetProp = _.merge(widgetProp, {
                        get subtitle() {
                            if (widget.isKeywordMode()) {
                                return originalSubtitle;
                            } else {
                                return `${originalSubtitle}.keywordgroup`;
                            }
                        },
                    });
                }
                if (widgetProp.metric === "KeywordAnalysisTrafficShareOverTime") {
                    const originalSubtitle = widgetProp.subtitle;
                    widgetProp = _.merge(widgetProp, {
                        get subtitle() {
                            if (widget.isKeywordMode()) {
                                return originalSubtitle;
                            } else {
                                return `${originalSubtitle}.keywordgroup`;
                            }
                        },
                    });
                }
                if (widgetProp.metric === "KeywordAnalysisTrafficShare") {
                    widgetProp.validateData = (response: any) => {
                        const trafficShare = response[key] || {};
                        const validData = trafficShare.Organic > 0 || trafficShare.Paid > 0;
                        if (!validData) {
                            that.$scope.noData = Object.assign({}, that.$scope.noData);
                            that.$scope.noData.noDataOrganicVsPaid = true;
                            that.trackNoData(context);
                        }
                        return validData;
                    };
                }
                return customWidgetConfigTransformer(widget);
            })
            .reduce((allWidgets, widgetFinalConfig) => {
                return widgetFinalConfig
                    ? [
                          ...allWidgets,
                          that.widgetFactoryService.create(
                              widgetFinalConfig,
                              this.swNavigator.current().name,
                          ),
                      ]
                    : allWidgets;
            }, []);

        const [tableWidgets, nonTableWidgets] = _.partition(this.allWidgets, ({ _widgetConfig }) =>
            /table/i.test(_widgetConfig.type),
        );
        this.tableWidgets = tableWidgets;
        this.nonTableWidgets = nonTableWidgets;
    }

    onTabSelected(index) {
        SwTrack.all.trackEvent("Tab", "click", `Table/${Tabs[index]}`);
        this.selections.tab = Tabs[index];
    }

    get activeTabIndex() {
        return Tabs[this.selections.tab];
    }

    onShare = (group) => {
        function camelCase(str) {
            return str
                .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                    return index == 0 ? word.toLowerCase() : word.toUpperCase();
                })
                .replace(/\s+/g, "");
        }
        const groupFromService = keywordsGroupsService.findGroupById(group.id || group.Id);

        this.$scope.$apply(() => {
            this.isShareModalOpen = true;
            this.shareKeywordGroup = {
                ...group,
                ...Object.fromEntries(
                    Object.entries(groupFromService).map(([key, value]) => {
                        return [camelCase(key), value];
                    }),
                ),
            };
        });
    };
}

angular
    .module("keywordAnalysis")
    .controller("keywordSearchCtrl", MainKeyword as ng.Injectable<ng.IControllerConstructor>);
