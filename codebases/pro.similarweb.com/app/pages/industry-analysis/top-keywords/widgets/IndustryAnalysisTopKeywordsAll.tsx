import { colorsPalettes } from "@similarweb/styles";
import { IRootScopeService } from "angular";
import { TrafficShareWithVisits } from "components/React/Table/cells/TrafficShareWithVisits";
import { ReactTableCheckbox } from "components/widget/widget-utilities/ReactTableCeckbox";
import dayjs from "dayjs";
import { IndustryAnalysisTopKeywordsBase } from "pages/industry-analysis/top-keywords/widgets/IndustryAnalysisTopKeywordsBase";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { BooleanSearchUtilityWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import CoreTrendsBarCell from "../../../../../.pro-features/components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import { Pill } from "../../../../../.pro-features/components/Pill/Pill";
import { ITrendsBarValue } from "../../../../../.pro-features/components/TrendsBar/src/TrendsBar";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import { tableActionsCreator } from "../../../../actions/tableActions";
import NaiveColorStack from "../../../../components/colorsStack/NaiveColorStack";
import { SearchKeywordCell, LeadingSite } from "../../../../components/React/Table/cells";
import { SelectAllRowsHeaderCell } from "../../../../components/React/Table/headerCells";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { abbrNumberFilter, i18nFilter } from "../../../../filters/ngFilters";
import AddTableRowsKeywordsToGroupUtility from "../../../keyword-analysis/AddTableRowsKeywordsToGroupUtility";
import _ from "lodash";
import DurationService from "services/DurationService";

const StyledPill = styled(Pill)`
    margin-left: 8px;
`;

enum BrandedDropdown {
    brandedAndNonBranded,
    nonBrandedOnly,
    brandedOnly,
}

export enum ETopKeywordsTable {
    all = 0,
    organic = 1,
    paid = 2,
}

const dateFormat = (date) => dayjs(date).format("MMM, YYYY");

export const addFilter = (params) => (newFilter) => {
    const { filter = false } = params;
    return {
        ...params,
        filter: [filter, newFilter].filter((f) => f).join(","),
    };
};

export const getCustomApiParams = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    let {
        channel = null,
        excludeBranded = "",
        orderBy = "",
        search = "",
        BooleanSearchTerms,
        IncludeTrendingKeywords,
        IncludeQuestions,
        IncludeNewKeywords,
        includeBranded = true,
        includeNoneBranded = true,
    } = swNavigator.getParams();
    const [, sortField = "TotalShare", sortDirection = "desc"] =
        /^(SearchTerm|TotalShare|Change|Cpc)(?:\s+(asc|desc))?$/.exec(orderBy) || [];
    orderBy = `${sortField} ${sortDirection}`;
    const [, source = "", sourceText = ""] = /(\d+)(?:\s+(.+))?/.exec(channel) || [];
    let apiParams = {
        includeBranded,
        includeNoneBranded,
        orderBy,
    } as any;
    if (source) {
        apiParams = addFilter(apiParams)(`Source;==;${source}`);
    }
    if (search) {
        apiParams = addFilter(apiParams)(`SearchTerm;contains;"${search}"`);
    }
    if (BooleanSearchTerms) {
        const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(BooleanSearchTerms);
        if (IncludeTerms) {
            apiParams = { ...apiParams, IncludeTerms: decodeURIComponent(IncludeTerms) };
        }
        if (ExcludeTerms) {
            apiParams = { ...apiParams, ExcludeTerms: decodeURIComponent(ExcludeTerms) };
        }
    }
    if (IncludeTrendingKeywords === "true") {
        apiParams.IncludeTrendingKeywords = true;
    }

    if (IncludeNewKeywords === "true") {
        apiParams.IncludeNewKeywords = true;
    }

    if (IncludeQuestions === "true") {
        apiParams.IncludeQuestions = true;
    }

    return {
        apiParams,
        channel: source,
        channelText: sourceText || source,
        search,
    };
};

const sortOptions = (field, orderByField) => ({
    isSorted: orderByField.split(" ")[0].toLowerCase() === field.toLowerCase(),
    sortDirection: orderByField.split(" ")[1].toLowerCase(),
});

export const getChannelValue = (channel, channelText) => {
    if (!channel) {
        return null;
    }
    if (channel === channelText || !channelText) {
        return channel;
    }
    return `${channel} ${channelText}`;
};

export const getDropDownChosen = (includeBranded, includeNoneBranded) => {
    if (!includeBranded && includeNoneBranded) {
        return BrandedDropdown.nonBrandedOnly;
    }
    if (includeBranded && !includeNoneBranded) {
        return BrandedDropdown.brandedOnly;
    }
    return BrandedDropdown.brandedAndNonBranded;
};

const getWidgetConfig = (params, tab = ETopKeywordsTable.all) => {
    const { apiParams, channel, channelText, search } = getCustomApiParams();
    const { duration, isSearchTrends = false } = params;
    const durationTooltip = _.mapValues(
        DurationService.getDurationData(duration || "", "", "").forTooltip,
        (v) => {
            return decodeURIComponent(v);
        },
    );
    const durationTooltipParams = {
        currentMonth: durationTooltip.to,
        lastMonth: durationTooltip.from,
    };
    const { includeBranded, orderBy, includeNoneBranded } = apiParams;
    const isWindow = duration === "28d";
    const showOrganicColumn = !isSearchTrends && tab === ETopKeywordsTable.all;

    return {
        type: "Table",
        properties: {
            family: "Industry",
            ...params,
            apiParams,
            channelText,
            metric: "SearchKeywordsAbb",
            apiController: "IndustryAnalysisTopKeywords",
            type: "Table",
            height: "auto",
            width: "12",
            enableRowSelection: true,
            tableSelectionProperty: "SearchTerm",
            options: {
                useFloatingSelectionBar: true,
                forceSetupColors: true,
                widgetColorsFrom: "audienceOverview",
                cssClass: "widgetTable",
                showIndex: true,
                showTitle: false,
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: false,
                loadingSize: 20,
                showCompanySidebar: true,
                indexColumnWidth: "65px",
                scrollableTable: true,
                overrideColumns: true,
                addPaddingRightCell: true,
                aboveHeaderComponentsFactory: (widget) => {
                    return [
                        <AddTableRowsKeywordsToGroupUtility
                            key="1"
                            clearAllSelectedRows={
                                tableActionsCreator(
                                    widget.getTableKey(),
                                    widget.tableSelectionProperty,
                                ).clearAllSelectedRows
                            }
                            stateKey={widget.getTableKey()}
                            isSearchTrends={isSearchTrends}
                        />,
                    ];
                },
            },
            columns: [
                {
                    fixed: true,
                    name: "row-selection",
                    cellTemp: "row-selection",
                    sortable: false,
                    width: 45,
                    headerComponent: SelectAllRowsHeaderCell,
                    headerCellClass: "row-selection-all",
                },
                {
                    fixed: true,
                    cellTemp: "index",
                    sortable: false,
                    width: 50,
                    disableHeaderCellHover: true,
                },
                {
                    name: "SearchTerm",
                    title: "ia.topkeywords.table.column.searchTerm",
                    type: "string",
                    format: "None",
                    sortable: true,
                    ...sortOptions("SearchTerm", orderBy),
                    groupable: false,
                    cellComponent: (props) => {
                        const swNavigator = Injector.get<any>("swNavigator");
                        return (
                            <SearchKeywordCell
                                {...props}
                                adsUrl={swNavigator.href("keywordAnalysis-ads", {
                                    ...swNavigator.getParams(),
                                    keyword: props.value,
                                })}
                                withAdsLink={!isSearchTrends}
                            />
                        );
                    },
                    headTemp: "",
                    totalCount: true,
                    tooltip: true,
                    minWidth: 150,
                    isResizable: true,
                },
                {
                    name: "TotalShare",
                    title: "ia.topkeywords.table.column.trafficShareWithVisits",
                    tooltip: "ia.topkeywords.table.column.trafficShareWithVisits.tooltip",
                    type: "double",
                    sortable: true,
                    ...sortOptions("TotalShare", orderBy),
                    groupable: false,
                    cellComponent: TrafficShareWithVisits,
                    headTemp: "",
                    totalCount: false,
                    width: 148,
                    isResizable: true,
                },
                showOrganicColumn
                    ? {
                          name: "Organic",
                          title: "analysis.source.search.all.table.columns.Org/Paid.title",
                          type: "double",
                          format: "None",
                          ...sortOptions("Organic", orderBy),
                          groupable: false,
                          tooltip: "analysis.source.search.all.table.columns.vs.title.tooltip",
                          cellTemp: "organic-paid",
                          width: 105,
                          sortable: false,
                          isResizable: true,
                      }
                    : false,
                {
                    name: "Change",
                    title: "ia.topkeywords.table.column.change",
                    type: "double",
                    format: "percentagesign",
                    sortable: true,
                    ...sortOptions("Change", orderBy),
                    groupable: false,
                    cellTemp: "change-percentage",
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: false,
                    tooltip: i18nFilter()(
                        "analysis.source.search.all.table.columns.change.title.tooltip",
                        durationTooltipParams,
                    ),
                    width: 95,
                    isResizable: true,
                },
                {
                    name: "Volume",
                    title: "ia.topkeywords.table.column.volume",
                    type: "double",
                    format: "abbrNumber",
                    sortable: false,
                    ...sortOptions("Volume", orderBy),
                    groupable: false,
                    cellTemp: "DefaultCellRightAlign",
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: false,
                    tooltip: true,
                    width: 81,
                    isResizable: true,
                },
                {
                    name: "VolumeTrend",
                    title: "ia.topkeywords.table.column.trend",
                    type: "double",
                    format: "None",
                    sortable: false,
                    groupable: false,
                    cellComponent: ({ value }) => {
                        if (value) {
                            const data = Object.keys(value)
                                .sort()
                                .map((item) => ({
                                    value: value[item],
                                    tooltip: (
                                        <span>
                                            <strong>{`${abbrNumberFilter()(value[item])}`}</strong>
                                            {` searches in ${dateFormat(item)}`}
                                        </span>
                                    ),
                                })) as ITrendsBarValue[];
                            return <CoreTrendsBarCell value={data} />;
                        } else {
                            return "N/A";
                        }
                    },
                    totalCount: false,
                    tooltip: true,
                    width: 130,
                    isResizable: true,
                },
                !isSearchTrends
                    ? {
                          name: "Cpc",
                          title: "ia.topkeywords.table.column.cpc",
                          type: "double",
                          format: "CPC",
                          sortable: false,
                          ...sortOptions("Cpc", orderBy),
                          groupable: false,
                          cellTemp: "DefaultCellRightAlign",
                          headerComponent: DefaultCellHeaderRightAlign,
                          totalCount: false,
                          tooltip: true,
                          width: 65,
                          isResizable: true,
                      }
                    : false,
                {
                    field: "LeadingSite",
                    title: "keywords.seasonality.table.leader.name",
                    tooltip: "keywords.seasonality.table.leader.name.tooltip",
                    sortable: false,
                    ...sortOptions("LeadingSite", orderBy),
                    cellComponent: LeadingSite,
                    width: 150,
                },
            ].filter((column) => !!column),
        },
        utilityGroups: [
            {
                properties: {
                    className: "tableTopRow u-flex-center",
                },
                utilities: [
                    ...(!isSearchTrends
                        ? [
                              {
                                  id: "dropdown",
                                  properties: {
                                      param: "filter",
                                      type: "number",
                                      column: "Source",
                                      operator: "==",
                                      placeholder:
                                          "industry_analysis.top_keywords.dropdown.search_channels.placeholder",
                                      trackingName: "Search Channels",
                                      emptySelect: true,
                                      asChipDown: true,
                                      onFiltersWatch: (
                                          dropdownValues,
                                          oldDropdownValues,
                                          ctrl,
                                          $scope,
                                      ) => {
                                          const { Source: options } = dropdownValues || {
                                              Source: channel
                                                  ? [
                                                        {
                                                            id: channel,
                                                            text: channelText,
                                                        },
                                                    ]
                                                  : [],
                                          };
                                          const selectedOption = channel;
                                          if (ctrl.selectedOption !== selectedOption) {
                                              ctrl.selectedOption = selectedOption;
                                          }
                                          ctrl.oldOptions = ctrl.options;
                                          ctrl.options = options;
                                          // SIM-25291: not optimal solution, but it's promise that the $evalAsync callback will be called only if
                                          // the dropdown values has changed
                                          if (
                                              JSON.stringify(ctrl.oldOptions) !==
                                              JSON.stringify(ctrl.options)
                                          ) {
                                              const { selectedOption } = ctrl;
                                              ctrl.selectedOption = "skipupdate";
                                              $scope.$evalAsync(() => {
                                                  ctrl.selectedOption = selectedOption;
                                              });
                                          }
                                      },
                                      onChange(ctrl, newVal) {
                                          if (newVal !== "skipupdate") {
                                              const { id = null, text = null } =
                                                  ctrl.options.find(({ id }) => id === newVal) ||
                                                  {};
                                              return ctrl.widget._swNavigator.updateParams({
                                                  channel: getChannelValue(id, text),
                                              });
                                          }
                                      },
                                  },
                              },
                          ]
                        : []),
                    {
                        id: "dropdown",
                        properties: {
                            param: "filter",
                            type: "number",
                            column: "",
                            operator: "==",
                            emptySelect: true,
                            asChipDown: true,
                            placeholder:
                                "industry_analysis.top_keywords.dropdown.branded.placeholder",
                            // cast the boolean string to boolean value 'true' => true, 'false' => false
                            chosen: getDropDownChosen(
                                includeBranded === "true",
                                includeNoneBranded === "true",
                            ),
                            trackingName: "Exclude Branded Keyword",
                            values: [
                                {
                                    id: BrandedDropdown.brandedAndNonBranded,
                                    text: "industry_analysis.top_keywords.dropdown.text.all",
                                },
                                {
                                    id: BrandedDropdown.nonBrandedOnly,
                                    text:
                                        "industry_analysis.top_keywords.dropdown.text.non_branded",
                                },
                                {
                                    id: BrandedDropdown.brandedOnly,
                                    text: "industry_analysis.top_keywords.dropdown.text.branded",
                                },
                            ],
                            onChange: (ctrl, newVal) => {
                                if (!newVal || newVal === BrandedDropdown.brandedAndNonBranded) {
                                    return ctrl.widget._swNavigator.updateParams({
                                        includeBranded: true,
                                        includeNoneBranded: true,
                                    });
                                }
                                if (newVal === BrandedDropdown.nonBrandedOnly) {
                                    return ctrl.widget._swNavigator.updateParams({
                                        includeBranded: false,
                                        includeNoneBranded: true,
                                    });
                                }
                                if (newVal === BrandedDropdown.brandedOnly) {
                                    return ctrl.widget._swNavigator.updateParams({
                                        includeBranded: true,
                                        includeNoneBranded: false,
                                    });
                                }
                            },
                        },
                    },
                    ...(duration !== "28d"
                        ? [
                              {
                                  id: "react-component",
                                  properties: {
                                      component: ReactTableCheckbox,
                                      tracking: "categoryAnalysis.topkeywords.table.filters.new",
                                      name: "new",
                                      tooltip: i18nFilter()(
                                          "industry_analysis.top_keywords.checkbox.new.tooltip",
                                      ),
                                      label: i18nFilter()(
                                          "industry_analysis.top_keywords.checkbox.new.placeholder",
                                      ),
                                      param: "IncludeNewKeywords",
                                      onChange: (newVal) => {
                                          return Injector.get<SwNavigator>(
                                              "swNavigator",
                                          ).updateParams({
                                              IncludeNewKeywords: Boolean(newVal),
                                          });
                                      },
                                  },
                              },
                          ]
                        : []),
                    {
                        id: "react-component",
                        properties: {
                            component: ReactTableCheckbox,
                            tracking: "categoryAnalysis.topkeywords.table.filters.trending",
                            name: "trending",
                            tooltip: isWindow
                                ? i18nFilter()(
                                      "industry_analysis.top_keywords.checkbox.trending28d.tooltip",
                                  )
                                : i18nFilter()(
                                      "industry_analysis.top_keywords.checkbox.trending.tooltip",
                                  ),
                            label: isWindow ? (
                                <FlexRow alignItems="center">
                                    {i18nFilter()(
                                        "industry_analysis.top_keywords.checkbox.trending.placeholder",
                                    )}
                                    <StyledPill
                                        backgroundColor={colorsPalettes.orange[400]}
                                        text={i18nFilter()("sidenav.new")}
                                    />
                                </FlexRow>
                            ) : (
                                i18nFilter()(
                                    "industry_analysis.top_keywords.checkbox.trending.placeholder",
                                )
                            ),
                            param: "IncludeTrendingKeywords",
                            onChange: (newVal) => {
                                return Injector.get<SwNavigator>("swNavigator").updateParams({
                                    IncludeTrendingKeywords: Boolean(newVal),
                                });
                            },
                        },
                    },
                    ...(duration !== "28d" && !isSearchTrends
                        ? [
                              {
                                  id: "react-component",
                                  properties: {
                                      component: ReactTableCheckbox,
                                      tracking:
                                          "categoryAnalysis.topkeywords.table.filters.questions",
                                      name: "questions",
                                      tooltip: i18nFilter()(
                                          "industry_analysis.top_keywords.checkbox.questions.tooltip",
                                      ),
                                      label: (
                                          <FlexRow alignItems="center">
                                              {i18nFilter()(
                                                  "industry_analysis.top_keywords.checkbox.questions.placeholder",
                                              )}{" "}
                                              <StyledPill
                                                  backgroundColor={colorsPalettes.orange[400]}
                                                  text={i18nFilter()("sidenav.new")}
                                              />
                                          </FlexRow>
                                      ),
                                      param: "IncludeQuestions",
                                      isNewLabel: true,
                                      onChange: (newVal) => {
                                          return Injector.get<SwNavigator>(
                                              "swNavigator",
                                          ).updateParams({
                                              IncludeQuestions: Boolean(newVal),
                                          });
                                      },
                                  },
                              },
                          ]
                        : []),
                ],
            },
            {
                properties: {
                    className: "boolean-search",
                },
                utilities: [
                    {
                        id: "react-component",
                        properties: {
                            component: BooleanSearchUtilityWrapper,
                        },
                    },
                    {
                        id: "table-export",
                        properties: {},
                    },
                    {
                        id: "columns-toggle",
                        properties: {},
                    },
                ],
            },
            {
                properties: {
                    className: "tableBottom",
                },
                utilities: [
                    {
                        id: "table-pager",
                        properties: {},
                    },
                ],
            },
        ],
    };
};

const getMetricConfig = (params) => {
    const { isSearchTrends = false } = params;
    return {
        dashboard: "true",
        family: "Industry",
        state: isSearchTrends
            ? "marketresearch_keywordmarketanalysis_total"
            : "keywordAnalysis-overview",
        title: isSearchTrends ? "ia.topkeywords.searchtrends" : "ia.topkeywords.organicpaid",
        apiController: "IndustryAnalysisTopKeywords",
        component: "IndustryAnalysisTopKeywords",
    };
};
const metricTypeConfig = {};

export class IndustryAnalysisTopKeywordsAll extends IndustryAnalysisTopKeywordsBase {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params, tab?) {
        const widgetConfig = getWidgetConfig(params, tab);
        const metricConfig = getMetricConfig(params);
        return {
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController: widgetConfig.properties.apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public cleanup() {}

    public forceCleanup() {
        super.cleanup();
    }

    initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this.tableColors = new NaiveColorStack("#4996e7");
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    public getWidgetModel() {
        const model = super.getWidgetModel();
        const { isSearchTrends } = this.getWidgetConfig().properties;
        model.type = "IndustryKeywordsDashboardTable";
        model.metric = isSearchTrends ? "SearchTrends" : "SearchKeywordsAbbAll";
        return model;
    }

    public onSort(column: any, setSortedColumn?: boolean) {
        const $rootScope = Injector.get<IRootScopeService>("$rootScope");
        $rootScope.$evalAsync(() => {
            this._swNavigator.updateParams({ orderBy: `${column.field} ${column.sortDirection}` });
        });
    }
}
