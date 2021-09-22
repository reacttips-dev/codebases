import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import worldWideOverviewCompetitiveWidgets from "pages/website-analysis/config/worldwide-overview-competitive";
import worldWideOverviewWidgets from "../config/worldwide-overview";
import accountReviewWorldWideOverviewWidgets from "../config/worldwide-overview-sales";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import { HELP_ARTICLE_IDS } from "help-widget/constants";
import "help-widget/react/WithHelpWidgetArticle";
/* eslint:enable */

export class WorldwideOverviewCtrl {
    public title: string;
    public subtitle: string;
    public dateTitle: string;
    public widgets: any;
    public state;
    public tooltipText: string;
    public webSource: any;
    public webSources: any[];
    public showTooltip: boolean;
    public deviceIcon: string;
    public deviceTitle: string;
    public key: any;
    public params: any;
    public isWWOApiController: any;
    public isCompare: boolean;
    public titleText: string;
    public showError: boolean;
    public showSection: Function;
    public helpArticleId: string;
    private _widgetFactoryService: any;
    private fetchService: any;

    /**
     * Used for understanding where this controller was initialized from.
     * we want the underlying controller's widgets to behave differently, depending on
     * which package the user is currently at.
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from the website overview widgets, from every package, besides the websiteResearch package (legacy)
     */
    public isLegacyPackage: boolean;

    constructor(
        public swNavigator,
        public $scope,
        public $rootScope: any,
        widgetFactoryService: any,
        private $timeout,
    ) {
        const ctrl = this;
        this.fetchService = DefaultFetchService.getInstance();
        ctrl.params = swNavigator.getParams();
        ctrl.state = swNavigator.current().name;
        ctrl.isLegacyPackage = swNavigator.getPackageName(swNavigator.current()) === "legacy";

        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed,
            hasMobileWebData =
                swSettings.allowedDuration(ctrl.params.duration, "MobileWeb") &&
                swSettings.allowedCountry(ctrl.params.country, "MobileWeb");
        ctrl.key = ctrl.params.key.split(",");
        ctrl.isCompare = ctrl.key.length > 1;
        ctrl.webSource = "Total";
        ctrl.isWWOApiController =
            this.params.country === "999" &&
            !swSettings.allowedCountry(ctrl.params.country, "WebAnalysis");
        ctrl.title = ctrl.state + ".title";
        ctrl.subtitle = swNavigator.current().hideSubtitle ? null : ctrl.state + ".subtitle";
        ctrl._widgetFactoryService = widgetFactoryService;
        ctrl.deviceIcon = "sw-icon-widget-total";
        ctrl.deviceTitle = "Total";
        ctrl.tooltipText = i18nFilter()("wa.overview.websource.tooltip");
        ctrl.showError = false;

        this.titleText = i18nFilter()($scope.ctrl.title);

        this.webSources = [
            {
                value: "Total",
                title: i18nFilter()("websources.total"),
                buttonClass: "toggle-website",
                iconClass: "sw-icon-widget-total",
                disabled: this.isWWOApiController ? false : !hasMobileWebData,
            },
            {
                value: "Desktop",
                title: i18nFilter()("toggler.title.desktop"),
                buttonClass: "toggle-website",
                iconClass: "desktop",
                disabled: this.isWWOApiController
                    ? true
                    : !hasMobileWebPermission && hasMobileWebData,
            },
            {
                value: "MobileWeb",
                title: i18nFilter()("toggler.title.mobile"),
                buttonClass: "toggle-website",
                iconClass: "mobile-web",
                disabled: !hasMobileWebPermission || !hasMobileWebData,
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(this.params.country),
            },
        ];

        ctrl.helpArticleId = HELP_ARTICLE_IDS.WEBSITE_PERFORMANCE;

        // Set webSources toggle selection according to url parameter if present or to the first enabled preset
        this.webSource =
            this.params.webSource ||
            _.find<{ value: string; disabled: boolean }>(this.webSources, { disabled: false })[
                "value"
            ];
        if (!this.params.webSource) {
            swNavigator.updateParams({ webSource: this.webSource });
        }
        // Set webSources toggle to 'Desktop' preset if no MobileWeb data exists for selected duration or country
        if (!this.isWWOApiController && !hasMobileWebData && this.webSource !== "Desktop") {
            this.webSource = "Desktop";
            this.showTooltip = true;
            swNavigator.updateParams({ webSource: this.webSource });
        }

        // Set webSources toggle to 'Total' preset if no MobileWebPermission exists for user
        if (!hasMobileWebPermission && this.webSource !== "Total" && hasMobileWebData) {
            this.webSource = "Total";
            swNavigator.updateParams({ webSource: this.webSource });
        }

        if (this.isWWOApiController) {
            this.webSource = "Total";
            swNavigator.updateParams({ webSource: this.webSource });
        }

        $scope.$watch("ctrl.webSource", (newSource, oldSource) => {
            if (newSource != oldSource) {
                //swNavigator.go(swNavigator.current(), Object.assign({}, params, { webSource: newSource }));
                swNavigator.updateParams({ webSource: newSource });
                const params = swNavigator.getParams();
                // need to call timeout because widgets or utilities may rely on the current params, and this
                // ensures that $routeUpdate is called before widgets are created again
                this.widgets = {};
                $timeout(() => {
                    this.initWidgets(params);
                });
            }
        });
        if (!ctrl.isCompare) {
            this.getSimilarItems(ctrl.key).then((sites) => {
                this.params.keyForGraphInSingle = sites;
                this.initWidgets(this.params);
            });
        } else {
            // run once to init
            this.initWidgets(this.params);
        }

        ctrl.showSection = (section, inview) => {
            if (inview) {
                ctrl[section] = true;
            }
        };
    }

    protected async getSimilarItems(key) {
        const url = `/api/WebsiteOverview/getsimilarsites?key=${key}&limit=4`;
        const similarSite = await this.fetchService.get(url).then((result) => {
            return result.map((item) => {
                return item.DomainWithoutSub;
            });
        });
        return this.key.concat(similarSite);
    }

    getCorrectWidgetsBasedOnState(isUsState: boolean) {
        if (this.state === "competitiveanalysis_website_overview_websiteperformance") {
            return worldWideOverviewCompetitiveWidgets(
                this.isCompare ? "compare" : "single",
                isUsState ? { type: "WWOGeography" } : null,
                !this.isLegacyPackage,
            );
        }

        if (this.state === "accountreview_website_overview_websiteperformance") {
            return accountReviewWorldWideOverviewWidgets(
                this.isCompare ? "compare" : "single",
                isUsState ? { type: "WWOGeographySI" } : null,
                !this.isLegacyPackage,
            );
        }

        return worldWideOverviewWidgets(
            this.isCompare ? "compare" : "single",
            isUsState ? { type: "WWOGeography" } : null,
            !this.isLegacyPackage,
        );
    }

    protected initWidgets(params: any) {
        const defaultVisitsDuration = "6m";
        let isUsState = false;
        if (params.country) {
            if (CountryService.isUSState(parseInt(params.country))) {
                isUsState = true;
            }
        }
        let singlePageWidgets: any[] = this.getCorrectWidgetsBasedOnState(isUsState);
        const apiController = this.isWWOApiController ? "WorldwideOverview" : "WebsiteOverview";
        singlePageWidgets = singlePageWidgets.map((item) => {
            // set api controller for each widget

            item.properties.apiController = item.properties.apiController || apiController;
            const WIDGET_TYPES_USING_NEW_API_CONTRACT = [
                "WWOSearchTraffic",
                "WWOTopKeywordsTable",
                "WWOTopKeywordsTableSI",
                "WWOSearchTrafficSI",
            ];

            if (item.type.startsWith("WWOVisitsGraph")) {
                if (
                    params.duration === "1m" &&
                    (swSettings.allowedDuration(defaultVisitsDuration, "WebAnalysis") ||
                        this.isWWOApiController)
                ) {
                    item.properties.forcedDuration = defaultVisitsDuration;
                } else {
                    item.properties.forcedDuration = params.duration;
                }
                if (this.isWWOApiController) {
                    item.properties.apiController = "WorldwideOverviewVisits";
                } else {
                    item.properties.apiController = "WebsiteOverview";
                }
            } else if (item.type.startsWith("WWOGeography")) {
                if (this.isWWOApiController) {
                    item.properties.apiController = "WorldwideOverview";
                    params.duration = "1m";
                }
            } else {
                if (
                    item.properties.options.desktopOnly &&
                    !WIDGET_TYPES_USING_NEW_API_CONTRACT.includes(item.type)
                ) {
                    item.properties.apiController += "Desktop";
                }
            }
            if (
                item.id == "EngagementOverviewTable" &&
                params.duration != "28d" &&
                this.isCompare
            ) {
                item.properties.metric = "EngagementOverviewUniques";
                item.properties.columns.splice(
                    1,
                    0,
                    {
                        field: "UniqueUsers",
                        cellTemplate: "leader-default-cell",
                        format: "minVisitsAbbr",
                        sortable: true,
                        headerCellTemplate: "leader-default-header-cell",
                        headerCellIconName: "monthly-unique-visitors",
                        cellClass: "leaders-cell",
                    },
                    {
                        field: "VisitsPerUser",
                        cellTemplate: "leader-default-cell",
                        format: "number:2",
                        sortable: true,
                        headerCellTemplate: "leader-default-header-cell",
                        headerCellIconName: "employees",
                        cellClass: "leaders-cell",
                    },
                );
            }

            return item;
        });

        const pageWidgets = _.filter(singlePageWidgets, (item: any) =>
            this.webSource === "MobileWeb" ? !item.properties.options.desktopOnly : true,
        );
        this.widgets = {};
        pageWidgets.forEach((widget) => {
            widget.properties = Object.assign(widget.properties, params);
            widget.properties.family = "Website";
            // check if the page is on single mode
            if (widget.type.startsWith("WWOVisitsGraph") && !this.isCompare) {
                widget.properties.key = this.params.keyForGraphInSingle.map((name) => {
                    return {
                        id: name,
                        name,
                    };
                });
            } else {
                widget.properties.key = this.key.map(function (website) {
                    return {
                        id: website,
                        name: website,
                        // image: chosenSites.getInfo(website).icon,
                        // smallIcon: true
                    };
                });
            }
            widget.properties.webSource = widget.properties.options.desktopOnly
                ? "Desktop"
                : this.webSource;

            //widget.properties.autoFetchData = false;
            const instance = this._widgetFactoryService.create(widget, this.state);
            this.widgets[widget.id || widget.type] = instance;
        });
    }

    public widgetsExist() {
        return _.keys(this.widgets).length > 0;
    }
}

angular
    .module("sw.common")
    .controller(
        "worldwideOverviewCtrl",
        WorldwideOverviewCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
