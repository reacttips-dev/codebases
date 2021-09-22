import angular from "angular";
import * as _ from "lodash";
import { column } from "components/React/Table/SWReactTableDefaults";
import { DefaultCellHeaderRightAlign } from "../../../../app/components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { RankCell } from "../../../../app/components/React/Table/cells";
import DurationService from "services/DurationService";
import organicPaidService from "../../../common/services/organicPaid";
import { C_TABLE } from "../../../../app/constants/cTable";

angular
    .module("websiteAnalysis")
    .controller("TrafficDestinationPaidOutgoingCtrl", function (
        $scope,
        $filter,
        i18nFilter,
        $location,
        $rootScope,
        chosenSites,
        paidOutgoing,
        adNetworks,
        swNavigator,
    ) {
        // Currently this page isn't using tabs anymore, therefore code is commented out to fix bug SIM-22490
        // Return this code if tabs are returned to the page
        //
        // var unregisterLocationListener = $scope.$on("$locationChangeStart", function () {
        //     var nextParams = swNavigator.getParams();
        //     var prevTab = nextParams.selectedTab === 'advertisers' ? 'adNetworks' : 'advertisers';
        //     var currentParams = Object.assign({}, nextParams, { selectedTab: prevTab });
        //     swNavigator.updateQueryParams({
        //         selectedTab: prevTab
        //     });
        //     $rootScope.$broadcast(
        //         'navChangeSuccess',
        //         swNavigator.current(),
        //         nextParams,
        //         swNavigator.current(),
        //         currentParams,
        //         'state'
        //     );
        // });

        if (swNavigator.validateResloves(paidOutgoing, adNetworks)) {
            return;
        }

        // Currently this page isn't using tabs anymore, therefore code is commented out to fix bug SIM-22490
        // Return this code if tabs are returned to the page
        //
        // $scope.$on("$destroy", function () {
        //     if (unregisterLocationListener && angular.isFunction(unregisterLocationListener)) {
        //         unregisterLocationListener();
        //     }
        // });

        $scope.isCompare = chosenSites.isCompare();

        $scope.legendItems = chosenSites.sitelistForLegend();

        var params = swNavigator.getParams();

        const setPageTitle = ({ selectedTab }) => {
            $scope.pageTitle = i18nFilter(
                `analysis.monetization.${(selectedTab || "").toLowerCase()}.title`,
            );
        };
        $scope.$on("navUpdate", (event, state, params) => {
            setPageTitle(params);
        });
        setPageTitle(params);

        var durationTooltip = _.mapValues(
            DurationService.getDurationData(params ? params.duration : "").forTooltip,
            function (v) {
                return decodeURIComponent(v);
            },
        );
        var durationTooltipParams = {
            currentMonth: durationTooltip.to,
            lastMonth: durationTooltip.from,
        };

        var processTableResponse = function (response) {
            $scope.totalVisitsFiltered = response.TotalVisits;
            $scope.filteredShare = response.TotalShare > 0.99 ? 1 : response.TotalShare || 0;

            return response;
        };

        var processAdNetworksTable;

        var advertisersCommonColumns = [
            column({
                fixed: true,
                cellTemplate: "index",
                sortable: false,
                width: 40,
                disableHeaderCellHover: true,
            }),
        ];
        var advertisersSingleColumns = [
            column({
                fixed: true,
                field: "Domain",
                displayName: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.domain.title",
                ),
                tooltip: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.domain.title.tooltip",
                ),
                cellTemplate: "website-tooltip-top-cell",
                sortable: true,
                showTotalCount: true,
                groupable: true,
                width: "224px",
            }),
            column({
                field: "Category",
                displayName: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.category.title",
                ),
                tooltip: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.category.title.tooltip",
                ),
                cellTemplate: "category-filter-cell",
                sortable: true,
                isResizable: true,
                minWidth: 254,
            }),
            column({
                field: "Rank",
                displayName: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.rank.title",
                ),
                tooltip: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.rank.title.tooltip",
                ),
                cellComponent: RankCell,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "rank",
                sortable: true,
                isResizable: true,
                minWidth: 92,
            }),
            column({
                field: "Share",
                displayName: i18nFilter("analysis.destination.paidout.trafficShare"),
                tooltip: i18nFilter("analysis.destination.paidout.trafficShare.tooltip"),
                cellTemplate: "traffic-share",
                sortable: true,
                isResizable: true,
                minWidth: 108,
                width: 108,
            }),
            column({
                field: "Change",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.change.title"),
                tooltip: $filter("i18nTemplate")(
                    "analysis.source.ad.websites.table.columns.change.title.tooltip",
                    durationTooltipParams,
                ), //i18nFilter('analysis.source.ad.websites.table.columns.change.title.tooltip'),
                cellTemplate: "change-percentage",
                headerComponent: DefaultCellHeaderRightAlign,
                sortable: true,
                isResizable: true,
                minWidth: "104",
            }),
            column({
                field: "HasAdsense",
                displayName: i18nFilter("analysis.all.table.columns.googleAds.title"),
                tooltip: i18nFilter("analysis.all.table.columns.googleAds.title.tooltip"),
                cellTemplate: "adsense-cell",
                sortable: true,
                width: "72",
            }),
        ];
        var advertisersCompareColumns = [
            column({
                fixed: true,
                field: "Domain",
                displayName: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.domain.title",
                ),
                tooltip: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.domain.title.tooltip",
                ),
                cellTemplate: "website-tooltip-top-cell",
                sortable: true,
                showTotalCount: true,
                groupable: true,
                width: "244px",
            }),
            column({
                field: "Category",
                displayName: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.category.title",
                ),
                tooltip: i18nFilter(
                    "analysis.destination.ad.websites.table.columns.category.title.tooltip",
                ),
                cellTemplate: "category-filter-cell",
                sortable: true,
                isResizable: true,
                minWidth: 292,
            }),
            column({
                field: "TotalShare",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18nFilter(
                    "analysis.advertisers.table.columns.totalShareCompare.title.tooltip",
                ),
                cellTemplate: "traffic-share",
                sortable: true,
                isResizable: true,
                minWidth: 128,
                width: 128,
            }),
            column({
                field: "SiteOrigins",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.shareCompare.title",
                ),
                cellTemplate: "group-traffic-share",
                width: "190px",
            }),
        ];

        var adNetworksCommonColumns = [
            column({
                fixed: true,
                cellTemplate: "index",
                sortable: false,
                width: 65,
                disableHeaderCellHover: true,
            }),
            column({
                field: "Name",
                displayName: i18nFilter("analysis.source.ad.networks.table.columns.network.title"),
                sortable: true,
                cellTemplate: "default-cell-hook-type-website",
                showTotalCount: true,
                groupable: true,
            }),
        ];
        var adNetworksSingleColumns = [
            column({
                field: "Share",
                displayName: i18nFilter("analysis.destination.paidout.trafficShare"),
                cellTemplate: "traffic-share",
                sortable: true,
            }),
        ];
        var adNetworksCompareColumns = [
            column({
                field: "TotalShare",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18nFilter(
                    "analysis.advertisers.table.columns.totalShareCompare.title.tooltip",
                ),
                cellTemplate: "traffic-share",
                sortable: true,
                width: "300px",
            }),
            column({
                field: "SiteOrigins",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.shareCompare.title",
                ),
                cellTemplate: "group-traffic-share",
                width: "300px",
            }),
        ];

        var run = {
            pre: function () {
                $scope.tabs = { advertisers: false, adNetworks: false };
                $scope.tabSelect = similarweb.utils.tabSelect($location, $rootScope, $scope);
                var site = chosenSites.getPrimarySite().name;

                similarweb.utils.bindCategories(paidOutgoing.Categories, $scope, $filter);

                $scope.filters.options.networks = {
                    placeholder: $filter("i18n")("forms.networks.all"),
                    formatResult: function (item) {
                        return item.text + " (" + item.count + ")";
                    },
                    data: _.map(
                        _.filter(paidOutgoing.Networks, function (network) {
                            return !!network.Name;
                        }),
                        function (item) {
                            return {
                                id: item.Name,
                                text: item.Name,
                                count: $filter("number")(item.Count),
                            };
                        },
                    ),
                };

                $scope.Networks = {};

                setAdvertisersTable();
                setAdNetworksTable();
            },

            single: function (data) {
                var monthly = _.map(data.Volumes, function (item) {
                    return item[0] + item[1];
                });
                var totalVisits = _.reduce(
                    monthly,
                    function (memo, item) {
                        return memo + item;
                    },
                    0,
                );

                $scope.totalVisits = similarweb.utils.bigNumber(totalVisits);
                $scope.share = totalVisits / data.VolumeTotal;
                $scope.change = similarweb.utils.calcChange(monthly);
                $scope.TrafficVisits = { data: monthly, dates: data.Dates };

                processTableResponse = _.flowRight(processTableResponse, function (response) {
                    var site = chosenSites.getPrimarySite().name;
                    var categories = response.Categories && response.Categories[site],
                        networks = response.Networks && response.Networks[site];

                    if (!response || !response.TotalCount) {
                        $scope.leadingCategories = [];
                        $scope.Networks.data = [];
                    }

                    $scope.leadingCategories = similarweb.utils.formatTopList(categories, 6, {
                        transformFunction: similarweb.utils.addCategoryIdFromName,
                        filter: $scope.advertisersTable.filters.category.getValue(
                            $scope.advertisersTable.filters.category.value,
                        ),
                    });
                    $scope.Networks.data = similarweb.utils.formatKeyValue(
                        similarweb.utils.formatTopList(networks, 5),
                    );

                    return response;
                });
            },

            compare: function (data) {
                $scope.advertisersTable.options.defaultSorted = "TotalShare";
                $scope.adNetworksTable.options.defaultSorted = "TotalShare";
                similarweb.utils.registerTotalsCompare(
                    $scope,
                    organicPaidService,
                    chosenSites,
                    data,
                );

                $scope.selectedFilterTab = "categories";

                $scope.selectedFilterTabChange = function (value) {
                    $scope.selectedFilterTab = value;
                };

                $scope.TrafficVisits = {
                    data: chosenSites.map(function (site) {
                        return {
                            name: site,
                            data: organicPaidService.mapSum(data[site].Volumes),
                            dates: data[site].Dates,
                        };
                    }),
                };

                processTableResponse = _.flowRight(processTableResponse, function (response) {
                    if (!response || !response.TotalCount) {
                        $scope.advertisersTable.visitsList = [];
                        $scope.advertisersTable.CategoriesList = [];
                        $scope.advertisersTable.NetworksList = [];
                    } else {
                        chosenSites.registerVisits($scope, "advertisersTable", response);
                        chosenSites.registerLists(
                            $scope,
                            [
                                {
                                    name: "Categories",
                                    topList: response.TopCategories,
                                    func: function (obj, category) {
                                        if (
                                            category.Name.toLowerCase() !== "others" &&
                                            category.Name.toLowerCase() !== "other"
                                        ) {
                                            obj.Id = category.Name.replace("/", "~");
                                        }
                                        return obj;
                                    },
                                },
                                {
                                    name: "Networks",
                                    //topList: response.TopNetworks,
                                    topList: _.map(_.take(adNetworks.Records, 5), function (
                                        record,
                                    ) {
                                        return {
                                            Name: record.Name,
                                            Value: record.TotalShare,
                                        };
                                    }),
                                    func: function (obj, category) {
                                        if (
                                            category.Name &&
                                            category.Name.toLowerCase() !== "other" &&
                                            category.Name.toLowerCase() !== "others"
                                        ) {
                                            obj.Id = category.Name;
                                        }

                                        return obj;
                                    },
                                },
                            ],
                            "advertisersTable",
                            response,
                        );
                        //TODO - move to column after grid refactor
                        chosenSites.registerSiteOrigins(response.Records);
                    }

                    return response;
                });

                processAdNetworksTable = function (response) {
                    //TODO - move to column after grid refactor
                    chosenSites.registerSiteOrigins(response.Records);
                };

                $scope.toggleItems = [
                    {
                        title: $filter("i18n")("analysis.common.trafficsource.ad.cat"),
                        value: "categories",
                    },
                    {
                        title: $filter("i18n")("analysis.common.trafficsource.ad.sources"),
                        value: "networks",
                    },
                ];
            },

            post: function () {
                var tab = $location.search().selectedTab;
                tab = $scope.tabs.hasOwnProperty(tab) ? tab : "advertisers";
                $scope.tabs[tab] = true;
            },
        };

        chosenSites.execute(run, paidOutgoing.dictionary);

        function setAdNetworksTable() {
            $scope.adNetworksTable = {
                name: "AdNetwork",
                ready: false,
                csvUrl: "GetTrafficDisplayPaidOutgoingAds",
                url: "websiteanalysis/GetTrafficDisplayPaidOutgoingAdsTable",
                processResponse: function (response) {
                    $scope.adNetworksTable.ready = true;

                    var page = $location.search().AdNetwork_page || 1;
                    $scope.adNetworksTable.data = response;
                    processAdNetworksTable && processAdNetworksTable(response);
                    $scope.adNetworksTable.data.page = page;
                    $scope.adNetworksTable.data.pageSize = C_TABLE.pageSize;
                    $scope.adNetworksTable.showLoading = false;
                },
                onLoadStart: function () {
                    $scope.adNetworksTable.showLoading = true;
                },
                filters: {
                    name: {
                        action: "contains",
                        delay: true,
                    },
                },
                tableColumns: $scope.isCompare
                    ? adNetworksCommonColumns.concat(adNetworksCompareColumns)
                    : adNetworksCommonColumns.concat(adNetworksSingleColumns),
                options: {
                    defaultSorted: "Share",
                    showCompanySidebar: true,
                    metric: "outgoingAdsAdvertisersTable",
                },
            };
        }

        function setAdvertisersTable() {
            $scope.advertisersTable = {
                name: "advertisers",
                ready: false,
                csvUrl: "GetTrafficDisplayPaidOutgoingWebsites",
                url: "websiteanalysis/GetTrafficDisplayPaidOutgoingWebsitesTable",
                filters: {
                    domain: {
                        action: "contains",
                        delay: true,
                    },
                    network: {
                        action: "==",
                        getValue: function (val) {
                            return (val && val.id) || val;
                        },
                    },
                    category: {
                        getValue: function (val) {
                            return (val && val.id) || val;
                        },
                    },
                },
                processResponse: function (response) {
                    $scope.advertisersTable.ready = true;
                    angular.forEach(response.Records, function (row, index) {
                        row.url = swNavigator.href(
                            "websites-worldwideOverview",
                            {
                                key: row.Domain,
                                duration: params.duration,
                                country: params.country,
                                isWWW: params.isWWW,
                            },
                            {},
                        );
                        angular.forEach(row.Children, function (row) {
                            row.url = swNavigator.href(
                                "websites-worldwideOverview",
                                {
                                    key: row.Domain,
                                    duration: params.duration,
                                    country: params.country,
                                    isWWW: params.isWWW,
                                },
                                {},
                            );
                        });
                    });

                    var page = $location.search().advertisers_page || 1;
                    $scope.advertisersTable.data = response;
                    processTableResponse(response);
                    $scope.advertisersTable.data.page = page;
                    $scope.advertisersTable.data.pageSize = C_TABLE.pageSize;
                    $scope.advertisersTable.showLoading = false;
                },
                onLoadStart: function () {
                    $scope.advertisersTable.showLoading = true;
                },
                tableColumns: $scope.isCompare
                    ? advertisersCommonColumns.concat(advertisersCompareColumns)
                    : advertisersCommonColumns.concat(advertisersSingleColumns),
                options: {
                    defaultSorted: "Share",
                    showCompanySidebar: true,
                    metric: "outgoingAdsAdNetworksTable",
                },
            };
        }
    });
