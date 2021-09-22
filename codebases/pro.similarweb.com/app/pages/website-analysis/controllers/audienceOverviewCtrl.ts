import { swSettings } from "common/services/swSettings";
import DurationService from "services/DurationService";
import { AudienceOverviewWidgets } from "../config/audience-overview";
import dayjs from "dayjs";
import angular from "angular";
import _ from "lodash";
import { i18nFilter } from "filters/ngFilters";
import CountryService from "services/CountryService";
import { AccountReviewAudienceOverviewWidgets } from "pages/website-analysis/config/audience-overview-sales";
import { betaVsLiveSwitchToggle, betaVsLiveUpdateCompleted } from "actions/commonActions";
import { USE_BETA_BRANCH_DATA_PREF_KEY } from "routes/websiteStateConfig";
import { PreferencesService } from "services/preferences/preferencesService";

angular
    .module("websiteAnalysis")
    .controller("newAudienceOverviewCtrl", function (
        $rootScope,
        $scope,
        swNavigator,
        $timeout,
        $filter,
        widgetFactoryService,
        chosenSites,
        $swNgRedux,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctrl = this;
        const state = swNavigator.current().name;
        const params = swNavigator.getParams();
        const key = params.key.split(",");
        let mode = key.length > 1 ? "compare" : "single";
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const hasMobileWebData =
                swSettings.allowedDuration(params.duration, "MobileWeb") &&
                swSettings.allowedCountry(params.country, "MobileWeb"),
            uniqueVisitorsStartDate = {
                Desktop: swSettings.components.UniqueVisitors.resources.FirstAvailableSnapshot,
                MobileWeb:
                    swSettings.components.UniqueVisitorsMobileWeb.resources.FirstAvailableSnapshot,
                Total: swSettings.components.WebAnalysis.startDate,
            },
            from = dayjs.utc(
                DurationService.getDurationData(params.duration).forAPI.from,
                "YYYY|MM|DD",
            );

        ctrl.webSources = [
            {
                value: "Total",
                title: i18nFilter()("websources.total"),
                buttonClass: "toggle-website",
                iconClass: "sw-icon-widget-total",
                disabled: !hasMobileWebData,
            },
            {
                value: "Desktop",
                title: i18nFilter()("toggler.title.desktop"),
                buttonClass: "toggle-website",
                iconClass: "desktop",
                disabled: !hasMobileWebPermission && hasMobileWebData,
            },
            {
                value: "MobileWeb",
                title: i18nFilter()("toggler.title.mobile"),
                buttonClass: "toggle-website",
                iconClass: "mobile-web",
                disabled: !hasMobileWebPermission || !hasMobileWebData,
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            },
        ];

        const uniqueVisits = {
            type: "UniqueVisitors",
            properties: {
                metric: "UniqueUsers",
                component: "UniqueVisitorsTraffic",
                apiController: "UniqueUsersTraffic",
                type: "UniqueVisitors",
                width: "4",
                loadingHeight: "211px",
                height: "211px",
                title: "wa.ao.trafficshare",
                options: {
                    showTitle: false,
                    showTitleTooltip: false,
                    titleType: "text",
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    titleClass: "page-widget-title",
                    titleIcon: true,
                    template: "/app/components/single-metric/single-metric-unique-visitors.html",
                    unsupportedDuration: from.isBefore(
                        dayjs.utc(uniqueVisitorsStartDate[ctrl.webSource]),
                    ),
                    noWindow: params.duration == "28d",
                    noTopPadding: true,
                    noBottomPadding: true,
                    claimMissing: swSettings.components.UniqueVisitors.resources.IsDisabled,
                },
                columns: [
                    {
                        field: "DesktopMobileShareVisits",
                        cellTemplate: "percentage-bar-cell-rounded",
                    },
                ],
            },
        };

        // Set webSources toggle selection according to url parameter if present or to the first enabled preset
        ctrl.webSource = params.webSource || _.find(ctrl.webSources, { disabled: false })["value"];
        if (!params.webSource) {
            setUniqueVisitorsDate(ctrl.webSource);
            swNavigator.updateParams({ webSource: ctrl.webSource });
        }
        setUniqueVisitorsDate(ctrl.webSource);

        // Set webSources toggle to 'Desktop' preset if no MobileWeb data exists for selected duration or country
        if (!hasMobileWebData && ctrl.webSource !== "Desktop") {
            ctrl.webSource = "Desktop";
            ctrl.showTooltip = true;
            setUniqueVisitorsDate(ctrl.webSource);
            swNavigator.updateParams({ webSource: ctrl.webSource });
        }

        // Set webSources toggle to 'Total' preset if no MobileWebPermission exists for user
        if (!hasMobileWebPermission && ctrl.webSource !== "Total" && hasMobileWebData) {
            ctrl.webSource = "Total";
            swNavigator.updateParams({ webSource: ctrl.webSource });
        }

        $scope.$watch("ctrl.webSource", function (newSource, oldSource) {
            if (newSource != oldSource) {
                //swNavigator.go(swNavigator.current(), Object.assign({}, params, { webSource: newSource }));
                swNavigator.updateParams({ webSource: newSource });
                setUniqueVisitorsDate(newSource);

                // need to call timeout because widgets or utilities may rely on the current params, and this
                // ensures that $routeUpdate is called before widgets are created again
                $timeout(function () {
                    initWidgets(newSource);
                });
            }
        });

        if (params.comparedDuration) {
            mode = mode + "PeriodOverPeriod";
        }
        ctrl.pageTitle = $rootScope.getSelectedMenuTitle();
        ctrl.mode = mode;
        ctrl.tooltipText = $filter("i18n")("wa.overview.websource.tooltip");

        const _showBetaBranchDataStorePath = "common.showBetaBranchData.value";
        const selectShowBetaBranchData = (state) => _.get(state, _showBetaBranchDataStorePath);
        ctrl.isSwReactWidget = (widget) => widget?.componentType === "swReact";
        ctrl.showBetaBranchData = selectShowBetaBranchData($swNgRedux.getState());
        if (ctrl.showBetaBranchData && (params.comparedDuration || params.duration === "28d")) {
            $swNgRedux.dispatch(betaVsLiveSwitchToggle(false, true));
            ctrl.showBetaBranchData = false;
            PreferencesService.add({
                [USE_BETA_BRANCH_DATA_PREF_KEY]: false,
            }).then(() => {
                $swNgRedux.dispatch(betaVsLiveUpdateCompleted());
            });
        }
        const cancelBetaNotify = $swNgRedux.notifyOnChange(
            _showBetaBranchDataStorePath,
            (path, showBetaBranchData) => {
                $scope.$apply(() => {
                    if (ctrl.showBetaBranchData !== showBetaBranchData) {
                        ctrl.showBetaBranchData = showBetaBranchData;
                        initWidgets(ctrl.webSource);
                    }
                });
            },
        );
        $scope.$on("$destroy", cancelBetaNotify);

        function setUniqueVisitorsDate(webSource) {
            uniqueVisits.properties.options.unsupportedDuration = from.isBefore(
                dayjs.utc(uniqueVisitorsStartDate[webSource]),
            );
        }

        function getCorrectWidgetsBasedOnState(mode: any, showBetaBranchData) {
            if (swNavigator.current().name === "accountreview_website_trafficandengagement") {
                return AccountReviewAudienceOverviewWidgets(mode);
            }

            return AudienceOverviewWidgets(mode, showBetaBranchData);
        }

        function initWidgets(webSource) {
            const useUniquMetrics = useUniqueMetrics(webSource, params);
            ctrl.widgets = [];
            const pageWidgets = getCorrectWidgetsBasedOnState(mode, ctrl.showBetaBranchData);
            if (useUniquMetrics) {
                // single mode
                if (key.length == 1) {
                    if (webSource !== "Total") {
                        const pieChartIndex = _.findIndex(pageWidgets, { type: "PieChart" });
                        if (pieChartIndex > -1) {
                            pageWidgets[pieChartIndex] = uniqueVisits;
                        }
                    }
                }
            }
            angular.forEach(pageWidgets, function (pageWidget) {
                const isWidgetReact = ctrl.isSwReactWidget(pageWidget);
                const widget = isWidgetReact ? pageWidget.original : pageWidget;
                const widgetProp = widget.properties;
                Object.assign(widgetProp, params);
                widgetProp.family = "Website";
                widgetProp.key = key.map(function (website) {
                    return {
                        id: website,
                        name: website,
                        image: chosenSites.getInfo(website).icon,
                        smallIcon: true,
                    };
                });

                widgetProp.webSource = webSource;

                // Update the value of webSource filter for EngagementVisits metric 'Graph' type in single mode only:
                if (combinedSourceAllowed(webSource, hasMobileWebPermission, mode, widget)) {
                    widgetProp.webSource = "Combined";
                }
                if (webSource !== "Total" && widgetProp.options.isMobileOrDesktopOnly) {
                    widgetProp.options.canAddToDashboard = false;
                }
                // When a user changes "from" date to be prior to "dailyDataSince" (Oct15) -> change granularity to Monthly
                if (
                    widgetProp.options.dailyDataSince &&
                    widgetProp.type === "EngagementMetricsChart" &&
                    from.isBefore(dayjs(widgetProp.options.dailyDataSince))
                ) {
                    widgetProp.apiParams.timeGranularity = "Monthly";
                    widgetProp.clearWidgetCache = true;
                }

                let graphTabs;

                if (_.includes(["ComparedLine", "ComparedBar"], widget.type)) {
                    graphTabs = widget.utilityGroups[0].utilities[0].properties.tabs;
                    const uvTab: any = _.find(graphTabs, { id: "UniqueUsers" });
                    if (uvTab) {
                        uvTab.tooltip =
                            webSource == "Total" ? "metric.uniquevisitors.tab.tooltip" : null;
                    }
                }
                graphTabs = _.find(pageWidgets, function (widget: any) {
                    return _.includes(["Graph", "ComparedLine", "ComparedBar"], widget.type);
                });
                // Override isWWW value coming from params for rank metric as we do not have ranking data for exclude subdomains
                if (widget.type === "SingleMetric" && widget.properties.metric === "WebRanks") {
                    widget.properties.isWWW = "*";
                }
                // for sw-react components (instead of widget)
                if (isWidgetReact) {
                    widgetProp.autoFetchData = false;
                }
                // don't create desktopOnly widgets when in MobileWeb
                // don't create worldWideOnly widgets when not in WorldWide
                if (
                    !(
                        (widgetProp.options.desktopOnly && webSource === "MobileWeb") ||
                        (widgetProp.options.worldWideOnly && params.country != 999)
                    )
                ) {
                    const widgetInstance = widgetFactoryService.create(widget, state);
                    if (isWidgetReact) {
                        pageWidget.viewData = widgetInstance.viewData;
                        pageWidget.componentProps = {
                            viewData: widgetInstance.viewData,
                            apiParams: widgetInstance.apiParams,
                            apiController: pageWidget.apiController,
                            apiWidgetType: pageWidget.apiWidgetType,
                            tableDataColumns: pageWidget.tableDataColumns,
                            tableOptions: pageWidget.tableOptions,
                            widgetConfig: widgetProp,
                        };
                        ctrl.widgets.push(pageWidget);
                    } else {
                        ctrl.widgets.push(widgetInstance);
                    }
                }
            });
        }

        // run once to init
        initWidgets(ctrl.webSource);

        function combinedSourceAllowed(webSource, hasMobileWebPermission, mode, widget) {
            if (
                webSource === "Total" &&
                hasMobileWebPermission &&
                _.includes(["single", "singleNoWWO", "singlePeriodOverPeriod"], mode) &&
                (widget.type === "EngagementMetricsChart" || widget.type === "ComparedBar")
            ) {
                if (!widget.metric || widget.metric === "EngagementVisits") {
                    return true;
                }
            }
            return false;
        }

        function useUniqueMetrics(webSource, params) {
            if (params.comparedDuration) {
                return false;
            }
            const availableWebsources = ["Desktop", "MobileWeb"];
            if (swSettings.components.UniqueVisitors.resources.IsDisabled) {
                availableWebsources.unshift("Total");
            }
            return _.includes(availableWebsources, webSource) && !params.comparedDuration;
        }
    });
