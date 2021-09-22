import angular from "angular";
import * as _ from "lodash";
import { column } from "components/React/Table/SWReactTableDefaults";
import { markSortedColumn } from "components/React/Table/SWReactTableUtils";
import { DefaultCellHeaderRightAlign } from "../../../../app/components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import DurationService from "services/DurationService";
import { HeaderCellBlank } from "../../../../app/components/React/Table/headerCells";
import { OvertimeDefaultCell } from "../../../../app/components/React/SocialOvertime/SocialOvertimeCell";
import { GetSocialOverTimeEnrichedRow } from "../../../../app/components/React/SocialOvertime/SocialOverTimeEnrichedRow";
import React from "react";
import { allTrackers } from "../../../../app/services/track/track";
import organicPaidService from "../../../common/services/organicPaid";
import { C_TABLE } from "../../../../app/constants/cTable";

angular
    .module("websiteAnalysis")
    .controller("TrafficSocialCtrl", function (
        $rootScope,
        $location,
        $scope,
        $timeout,
        $filter,
        chosenSites,
        trafficSocial,
        swNavigator,
    ) {
        if (swNavigator.validateResloves(trafficSocial)) {
            return;
        }

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

        var i18nFilter = $filter("i18n"),
            typeText = i18nFilter("utils.social").toLowerCase(),
            trendLineMapping = {
                all: typeText,
                organic:
                    i18nFilter("analysis.trafficsource.social.trendline.organic.title") +
                    " " +
                    typeText,
                paid:
                    i18nFilter("analysis.trafficsource.social.trendline.paid.title") +
                    " " +
                    typeText,
            };

        var processTableResponse = function (response) {
            $scope.totalVisitsFiltered = $scope.totalVisits * response.TotalShare; //response.TotalVisits;
            $scope.filteredShare = response.TotalShare > 0.99 ? 1 : response.TotalShare || 0;

            return response;
        };

        var commonColumns = [
            column({
                fixed: true,
                cellComponent: OvertimeDefaultCell,
                sortable: false,
                headerComponent: HeaderCellBlank,
                isResizable: false,
                width: 48,
                columnClass: "collapseControlColumn",
                cellClass: "collapseControlCell",
            }),
            column({
                width: 65,
                cellTemplate: "index",
                sortable: false,
                fixed: true,
            }),
            column({
                field: "Page",
                displayName: i18nFilter("analysis.source.social.table.columns.pages.title"),
                tooltip: i18nFilter("analysis.source.social.table.columns.pages.title.tooltip"),
                cellTemplate: "grouped-cell-site",
                sortable: true,
                showTotalCount: true,
                minWidth: 220,
            }),
        ];

        var singleColumns = [
            column({
                field: "Share",
                displayName: i18nFilter("analysis.source.social.table.columns.share.title"),
                tooltip: i18nFilter("analysis.source.social.table.columns.share.title.tooltip"),
                cellTemplate: "traffic-share",
                sortable: true,
                minWidth: 150,
            }),
            column({
                field: "Change",
                displayName: i18nFilter("analysis.source.social.table.columns.change.title"),
                tooltip: $filter("i18nTemplate")(
                    "analysis.source.social.table.columns.change.title.tooltip",
                    durationTooltipParams,
                ),
                cellTemplate: "change-percentage",
                headerComponent: DefaultCellHeaderRightAlign,
                sortable: true,
                width: 110,
            }),
        ];

        var compareColumns = [
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
                isSorted: true,
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

        $scope.isCompare = chosenSites.isCompare();
        $scope.legendItems = chosenSites.sitelistForLegend();

        var run = {
            pre: function () {
                var params = swNavigator.getParams() || {};
                $scope.typeText = typeText;

                $scope.selectTrendLine = { value: "all", text: trendLineMapping.all };
                $scope.trendLineChange = function (value) {
                    $scope.selectTrendLine.value = value;
                    $scope.selectTrendLine.text = trendLineMapping[value];
                };

                $scope.socialTable = {
                    name: "social",
                    url: "websiteanalysis/GetTrafficSocialTable",
                    csvUrl: "GetTrafficSocial",
                    processResponse: function (response, query) {
                        angular.forEach(response.Records, function (row, index) {
                            row.url = swNavigator.href(
                                "websites-worldwideOverview",
                                {
                                    key: row.Domain,
                                    duration: params.duration,
                                    country: params.country,
                                },
                                {},
                            );
                        });
                        var page = $location.search().social_page || 1;
                        $scope.socialTable.data = response;
                        processTableResponse(response, query);
                        $scope.socialTable.data.page = page;
                        $scope.socialTable.data.pageSize = C_TABLE.pageSize;
                    },
                    filters: {
                        page: {
                            action: "contains",
                            delay: true,
                        },
                        socialNetwork: {
                            action: "==",
                            getValue: function (val) {
                                return (val && val.id) || val;
                            },
                        },
                        OP: {
                            action: "==",
                            type: "number",
                            getValue: function (val) {
                                return (val && val.id) || val;
                            },
                        },
                    },
                    tableColumns: $scope.isCompare
                        ? commonColumns.concat(compareColumns)
                        : commonColumns.concat(singleColumns),
                    options: {
                        defaultSorted: "Share",
                        metric: "TrafficSourcesSocial",
                        showIndex: true,

                        get EnrichedRowComponent() {
                            return GetSocialOverTimeEnrichedRow($scope.socialTable.data);
                        },
                        shouldEnrichRow: (props, index, e) => {
                            const openEnrich = e?.currentTarget?.childNodes[0]?.className.includes(
                                "enrich",
                            );
                            if (openEnrich) {
                                allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Expand");
                            }
                            return openEnrich;
                        },
                        get enrichedRowComponentHeight() {
                            const width = window.innerWidth;
                            if (width < 1200 && width > 320) {
                                return 625;
                            }
                            if (width <= 320) {
                                return 685;
                            } else return 580;
                        },

                        onEnrichedRowClick: (isOpen, rowIndex, row) => {
                            if (row === undefined) {
                                return;
                            }
                        },
                        get enrichOnLoadRowNumber() {
                            const durationObject = DurationService.getDurationData(
                                params.duration,
                                null,
                                null,
                                null,
                            );
                            const { isCustom } = durationObject.raw;
                            let isMinThreeMonths;
                            // 'isCustom' ie. not a preset duration.
                            if (!isCustom) {
                                isMinThreeMonths =
                                    params.duration !== "28d" && params.duration !== "1m";
                            } else {
                                isMinThreeMonths =
                                    DurationService.diffByUnit(
                                        durationObject.forAPI.from,
                                        durationObject.forAPI.to,
                                        "months",
                                    ) +
                                        1 >=
                                    3;
                            }
                            if (isMinThreeMonths) {
                                return 1;
                            }
                            return null;
                        },

                        get enrichedRowComponentAppendTo() {
                            return ".social-traffic-table";
                        },
                        shouldApplyEnrichedRowHeightToCell: false,
                        customTableClass: "social-traffic-table",
                    },
                };

                $scope.filters = {
                    sources: {
                        placeholder: $filter("i18n")("forms.social.sources.all"),
                        formatResult: function (item) {
                            return item.text + " (" + item.results + ")";
                        },
                        data: _.map(trafficSocial.Sources, function (item) {
                            return {
                                id: item.Name,
                                text: item.Name,
                                results: $filter("number")(item.Count),
                            };
                        }),
                    },
                    OP: {
                        placeholder: $filter("i18n")("forms.search.organicpaid.all"),
                        data: [
                            {
                                id: "0",
                                text: $filter("i18n")("forms.search.organicpaid.organiconly"),
                            },
                            { id: "1", text: $filter("i18n")("forms.search.organicpaid.paidonly") },
                        ],
                    },
                };
            },

            single: function (data) {
                var stats = similarweb.utils.setTotals(
                    $scope,
                    $filter,
                    organicPaidService,
                    data.Volumes,
                );
                $scope.share = stats.realTotal / data.VolumeTotal;
                $scope.chartType = "area";

                processTableResponse = _.flowRight(processTableResponse, function (response) {
                    var sources =
                            response.Sources && response.Sources[chosenSites.getPrimarySite().name],
                        op = response.OP && response.OP[chosenSites.getPrimarySite().name],
                        total = 0,
                        organic = 0,
                        paid = 0;

                    if (!response || !response.TotalCount) {
                        $scope.socialTable.sources = [];
                    }

                    angular.forEach(op, function (item) {
                        if (item.Name === "0") {
                            organic = item.Value;
                        }
                        if (item.Name === "1") {
                            paid = item.Value;
                        }

                        total += item.Value;
                    });

                    sources = _.sortBy(sources, function (item) {
                        return -1 * item.Value;
                    });

                    $scope.sources = {
                        data: similarweb.utils.formatKeyValue(
                            _.map(similarweb.utils.formatTopList(sources, 6), function (item) {
                                if (
                                    item.Name &&
                                    item.Name.toLowerCase() !== "other" &&
                                    item.Name.toLowerCase() !== "others"
                                ) {
                                    item.Id = item.Name;
                                }
                                return item;
                            }),
                        ),
                    };

                    $scope.organicVsPaid =
                        total > 0
                            ? [
                                  ["Organic", total ? organic / total : 0, 0],
                                  ["Paid", total ? paid / total : 0, 1],
                              ]
                            : [];

                    markSortedColumn(
                        $scope.socialTable.name,
                        $scope.socialTable.tableColumns,
                        $scope.socialTable.options.defaultSorted,
                    );

                    return response;
                });
            },

            compare: function (data) {
                $scope.socialTable.options.defaultSorted = "TotalShare";
                similarweb.utils.registerTotalsCompare(
                    $scope,
                    organicPaidService,
                    chosenSites,
                    data,
                );
                $scope.totalVisits = chosenSites.calcTotal(data, "Volumes");

                $scope.selectedFilterTab = "sources";

                $scope.chartType = "line";

                $scope.selectedFilterTabChange = function (value) {
                    $scope.selectedFilterTab = value;
                };

                $scope.TrafficOrganicPaidVisits = {
                    data: chosenSites.map(function (site) {
                        return {
                            name: site,
                            data: organicPaidService.mapSum(data[site].Volumes),
                        };
                    }),
                };

                $scope.TrafficOrganicVisits = {
                    data: chosenSites.map(function (site) {
                        return {
                            name: site,
                            data: organicPaidService.mapSumOrganic(data[site].Volumes),
                        };
                    }),
                };

                $scope.TrafficPaidVisits = {
                    data: chosenSites.map(function (site) {
                        return {
                            name: site,
                            data: organicPaidService.mapSumPaid(data[site].Volumes),
                        };
                    }),
                };

                processTableResponse = _.flowRight(processTableResponse, function (response) {
                    if (!response || !response.TotalCount) {
                        $scope.socialTable.visitsList = [];
                        $scope.socialTable.opsList = [];
                        $scope.socialTable.SourcesList = [];
                    } else {
                        chosenSites.registerVisits($scope, "socialTable", response);
                        chosenSites.registerLists(
                            $scope,
                            [
                                {
                                    name: "Sources",
                                    topList: response.TopSources,
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
                            "socialTable",
                            response,
                        );
                        chosenSites.registerOPS($scope, "socialTable", response);
                        //TODO - move to column after grid refactor
                        chosenSites.registerSiteOrigins(response.Records);
                    }

                    return response;
                });

                markSortedColumn(
                    $scope.socialTable.name,
                    $scope.socialTable.tableColumns,
                    $scope.socialTable.options.defaultSorted,
                );
            },
        };

        chosenSites.execute(run, trafficSocial.dictionary);
    });
