import { column } from "components/React/Table/SWReactTableDefaults";
import { markSortedColumn, addReactIndexColumn } from "components/React/Table/SWReactTableUtils";
import angular from "angular";
import * as _ from "lodash";
import { DefaultCellHeaderRightAlign } from "../../../../app/components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { RankCell } from "../../../../app/components/React/Table/cells";
import { AdvertisingCategoryCell } from "./AdvertisingCategoryCell";
import DurationService from "services/DurationService";
import organicPaidService from "../../../common/services/organicPaid";
import { C_TABLE } from "../../../../app/constants/cTable";

angular
    .module("websiteAnalysis")
    .controller("TrafficAdvertisingCtrl", function (
        $rootScope,
        $location,
        $scope,
        $filter,
        i18nFilter,
        $timeout,
        chosenSites,
        trafficDisplayAdvertising,
        adNetworks,
        swNavigator,
    ) {
        if (swNavigator.validateResloves(trafficDisplayAdvertising)) {
            return;
        }

        var processTableResponse = function (response) {
            $scope.totalVisitsFiltered = response.TotalVisits;
            $scope.filteredShare = response.TotalShare > 0.99 ? 1 : response.TotalShare || 0;

            return response;
        };

        var params = swNavigator.getParams();
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

        $scope.isCompare = chosenSites.isCompare();

        $scope.legendItems = chosenSites.sitelistForLegend();

        var processAdNetworksTable;
        var adNetworksCommonColumns = [
            column({
                field: "Name",
                fixed: true,
                displayName: i18nFilter("analysis.source.ad.networks.table.columns.network.title"),
                sortable: true,
                cellTemplate: "default-cell",
                showTotalCount: true,
                width: 230,
            }),
        ];
        var adNetworksSingleColumns = [
            column({
                field: "Share",
                displayName: i18nFilter("analysis.source.ad.networks.table.columns.share.title"),
                cellTemplate: "traffic-share",
                sortable: true,
                minWidth: 150,
                maxWidth: 250,
            }),
        ];
        var adNetworksCompareColumns = [
            column({
                field: "TotalShare",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18nFilter(
                    "analysis.source.search.all.table.columns.totalShareCompare.fix.title.tooltip",
                ),
                cellTemplate: "traffic-share",
                sortable: true,
                minWidth: 190,
                maxWidth: 250,
            }),
            column({
                field: "SiteOrigins",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.shareCompare.title",
                ),
                //tooltip: analysis.source.search.all.table.columns.totalShareCompare.fix.title.tooltip'),
                cellTemplate: "group-traffic-share",
                minWidth: 250,
            }),
        ];

        var websitesCommonColumns = [
            column({
                field: "Domain",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.domain.title"),
                tooltip: i18nFilter(
                    "analysis.source.ad.websites.table.columns.domain.title.tooltip",
                ),
                cellTemplate: "website-tooltip-top-cell",
                sortable: true,
                fixed: true,
                showTotalCount: true,
                width: 220,
            }),
            column({
                field: "Category",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.category.title"),
                tooltip: i18nFilter(
                    "analysis.source.ad.websites.table.columns.category.title.tooltip",
                ),
                cellComponent: AdvertisingCategoryCell,
                sortable: true,
                minWidth: 220,
            }),
        ];
        var websitesSingleColumns = [
            column({
                field: "Rank",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.rank.title"),
                tooltip: i18nFilter("analysis.source.ad.websites.table.columns.rank.title.tooltip"),
                cellComponent: RankCell,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "rank",
                sortable: true,
                width: 85,
            }),
            column({
                field: "Share",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.share.title"),
                tooltip: i18nFilter(
                    "analysis.source.ad.websites.table.columns.share.title.tooltip",
                ),
                cellTemplate: "traffic-share",
                sortable: true,
                minWidth: 150,
            }),
            column({
                field: "Change",
                displayName: i18nFilter("analysis.source.ad.websites.table.columns.change.title"),
                tooltip: $filter("i18nTemplate")(
                    "analysis.source.ad.websites.table.columns.change.title.tooltip",
                    durationTooltipParams,
                ),
                cellTemplate: "change-percentage",
                headerComponent: DefaultCellHeaderRightAlign,
                sortable: true,
                width: 95,
            }),
            column({
                field: "HasAdsense",
                displayName: i18nFilter("analysis.all.table.columns.googleAds.title"),
                tooltip: i18nFilter("analysis.all.table.columns.googleAds.title.tooltip"),
                cellTemplate: "adsense-cell",
                sortable: true,
                width: 95,
            }),
        ];
        var websitesCompareColumns = [
            column({
                field: "TotalShare",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18nFilter(
                    "analysis.publishers.table.columns.totalShareCompare.title.tooltip",
                ),
                cellTemplate: "traffic-share",
                sortable: true,
                minWidth: 150,
            }),
            column({
                field: "SiteOrigins",
                displayName: i18nFilter(
                    "analysis.source.search.all.table.columns.shareCompare.title",
                ),
                //tooltip: analysis.source.search.all.table.columns.totalShareCompare.fix.title.tooltip'),
                cellTemplate: "group-traffic-share",
                minWidth: 250,
            }),
        ];
        var run = {
            pre: function () {
                $scope.tabs = { websites: false, adNetworks: false };
                $scope.tabSelect = similarweb.utils.tabSelect($location, $rootScope, $scope);
                $scope.adCreativeLoading = true;
                $scope.adCreatives = [];
                $scope.getTabLink = function (tab) {
                    return swNavigator.href(
                        swNavigator.current().name,
                        Object.assign({}, swNavigator.getParams(), { selectedTab: tab }),
                    );
                };
                $scope.adsSortItems = [
                    {
                        text: "Last Seen",
                        sortProp: "LastDetected",
                        id: "LastSeen",
                    },
                    {
                        text: "First Seen",
                        sortProp: "FirstDetected",
                        id: "FirstSeen",
                    },
                ];
                $scope.selectedSortItem = $scope.adsSortItems[0];

                $scope.changeAdsSortOrder = function (value) {
                    // sort desc
                    $scope.adCreatives = _.sortBy($scope.adCreatives, value.sortProp).reverse();
                };

                similarweb.utils.bindCategories(
                    trafficDisplayAdvertising.Categories,
                    $scope,
                    $filter,
                );

                $scope.filters.options.networks = {
                    placeholder: $filter("i18n")("forms.networks.all"),
                    formatResult: function (item) {
                        return item.text + " (" + item.count + ")";
                    },
                    data: _.map(
                        _.filter(trafficDisplayAdvertising.Networks, function (network) {
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

                $scope.websitesTable = {
                    name: "websites",
                    ready: false,
                    csvUrl: "GetTrafficDisplayAdvertisingWebsites",
                    url: "websiteanalysis/GetTrafficDisplayAdvertisingWebsitesTable",
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
                        $scope.websitesTable.ready = true;
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

                        var page = $location.search().websites_page || 1;
                        $scope.websitesTable.data = response;
                        processTableResponse(response);
                        $scope.websitesTable.data.page = page;
                        $scope.websitesTable.data.pageSize = C_TABLE.pageSize;
                    },
                    tableColumns: $scope.isCompare
                        ? websitesCommonColumns.concat(websitesCompareColumns)
                        : websitesCommonColumns.concat(websitesSingleColumns),
                    options: {
                        defaultSorted: "Share",
                        metric: "TrafficSourcesDisplayPublishers",
                        showCompanySidebar: true,
                    },
                };

                $scope.adNetworksTable = {
                    name: "AdNetwork",
                    ready: false,
                    csvUrl: "GetTrafficDisplayAdvertisingAds",
                    url: "websiteanalysis/GetTrafficDisplayAdvertisingAdsTable",
                    processResponse: function (response) {
                        $scope.adNetworksTable.ready = true;

                        var page = $location.search().AdNetwork_page || 1;
                        $scope.adNetworksTable.data = response;
                        processAdNetworksTable && processAdNetworksTable(response);
                        $scope.adNetworksTable.data.page = page;
                        $scope.adNetworksTable.data.pageSize = C_TABLE.pageSize;
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
                        metric: "TrafficSourcesDisplayNetworks",
                    },
                };

                $scope.onTabSelect = function (tabName) {
                    swNavigator.updateParams({ selectedTab: tabName });
                };
            },

            single: function (data) {
                $scope.tabs.adCreative = false;

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
                    var categories =
                            response.Categories &&
                            response.Categories[chosenSites.getPrimarySite().name],
                        networks =
                            response.Networks &&
                            response.Networks[chosenSites.getPrimarySite().name];

                    if (!response || !response.TotalCount) {
                        $scope.leadingCategories = [];
                        $scope.Networks.data = [];
                    }

                    $scope.leadingCategories = similarweb.utils.formatTopList(categories, 6, {
                        transformFunction: similarweb.utils.addCategoryIdFromName,
                        filter: $scope.websitesTable.filters.category.getValue(
                            $scope.websitesTable.filters.category.value,
                        ),
                    });
                    $scope.Networks.data = similarweb.utils.formatKeyValue(
                        similarweb.utils.formatTopList(networks, 5),
                    );

                    return response;
                });
            },

            compare: function (data) {
                $scope.websitesTable.options.defaultSorted = "TotalShare";
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
                        $scope.websitesTable.visitsList = [];
                        $scope.websitesTable.CategoriesList = [];
                        $scope.websitesTable.NetworksList = [];
                    } else {
                        chosenSites.registerVisits($scope, "websitesTable", response);
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
                            "websitesTable",
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
            },

            post: function () {
                var tab = $location.search().selectedTab;
                tab = $scope.tabs.hasOwnProperty(tab) ? tab : "adNetworks";
                $scope.tabs[tab] = true;

                markSortedColumn(
                    $scope.websitesTable.name,
                    $scope.websitesTable.tableColumns,
                    $scope.websitesTable.options.defaultSorted,
                );
                addReactIndexColumn($scope.websitesTable.tableColumns);
                markSortedColumn(
                    $scope.adNetworksTable.name,
                    $scope.adNetworksTable.tableColumns,
                    $scope.adNetworksTable.options.defaultSorted,
                );
                addReactIndexColumn($scope.adNetworksTable.tableColumns);
            },
        };

        chosenSites.execute(run, trafficDisplayAdvertising.dictionary);
    });
