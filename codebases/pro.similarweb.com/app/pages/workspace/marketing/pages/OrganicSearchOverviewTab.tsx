import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import {
    chartDataAdapterEmpty,
    chartDataFetcher,
    tablesDataFetcher,
} from "pages/workspace/marketing/pages/OrganicSearchOverviewTabService";
import {
    MarketingWorkspaceOverviewTablesContainer,
    MarketingWorkspaceOverviewTablesSubTitle,
} from "pages/workspace/marketing/shared/styledComponents";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { DefaultCellRightAlign, SearchKeywordCell } from "../../../../components/React/Table/cells";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../../components/React/Table/headerCells";
import { TableWithAlertBoxWrapper } from "./TableWithAlertBoxWrapper";
import { TrafficStateless } from "./TrafficStateless";

const OrganicSearchOverviewTab = (props) => {
    const durationStringForTables = "3m"; // const value it part of the requirement
    const {
        from: tablesFrom,
        to: tablesTo,
        isWindow: tablesIsWindow,
    } = DurationService.getDurationData(durationStringForTables).forAPI;

    const i18n = i18nFilter();
    const {
        webSource,
        from,
        to,
        keys,
        country,
        isPdf,
        includeSubDomains,
        isWindow,
        getLink,
        selectedRows,
        getCountryById,
        sitesForLegend,
        durationString,
        filters,
        selectedCategoryId,
    } = props;
    const [checked, selectChecked] = useState(false);
    const [tablesData, setTablesData] = useState<any>([]); // todo
    const getGranularityByDuration = () =>
        durationString === "28d" || durationString === "1m" ? 1 : 2;
    const [granularity, setGranularity] = useState(getGranularityByDuration());
    const chartColors = [...CHART_COLORS.chartMainColors].reverse();
    const colorsForDomain = {};
    keys.forEach((key) => {
        colorsForDomain[key.domain] = chartColors.pop();
    });
    const keysForApi = keys.map((x) => x.domain).join(",");

    const dropdownItems = [
        {
            id: "total",
            children: i18n("workspaces.marketing.organic.search.overview.graph.filter.all"),
        },
        {
            id: "branded",
            children: i18n("workspaces.marketing.organic.search.overview.graph.filter.branded"),
        },
        {
            id: "nonBranded",
            children: i18n("workspaces.marketing.organic.search.overview.graph.filter.nonbranded"),
        },
    ];
    const [selectedDropdownItem, setSelectedDropdownItem] = useState(dropdownItems[0]);
    const [chartData, setChartData] = useState(
        chartDataAdapterEmpty(granularity, selectedDropdownItem.id),
    );
    const [isChartLoading, setIsChartLoading] = useState(true);
    const [disableDropDown, setDisableDropDown] = useState(granularity !== 2);
    const [excludeColumns, setExcludeColumns] = useState([]);
    useEffect(() => {
        setGranularity(getGranularityByDuration());
    }, [durationString]);
    useEffect(() => {
        setTablesData([]);
        const params = {
            country,
            from: tablesFrom,
            to: tablesTo,
            webSource,
            sites: keysForApi,
            isWindow: tablesIsWindow,
            includeSubDomains,
            limits: KeywordAdvancedFilterService.getAllFilters()
                .map((x) => x.api)
                .join(","),
        };
        tablesDataFetcher({
            main_website: keys[0].domain,
            colorsForDomain,
            params,
            getLink,
            durationString: durationStringForTables,
        }).then((results) => {
            setTablesData(results as any); // todo
        });
    }, [from, to, country, webSource, includeSubDomains, isWindow, keysForApi]);
    useEffect(() => {
        setIsChartLoading(true);
        const params = {
            country,
            from,
            to,
            webSource,
            sites: keysForApi,
            isWindow,
            includeSubDomains,
        };
        chartDataFetcher({
            params,
            granularity,
            selectedDropdownItemId: selectedDropdownItem.id,
            colorsForDomain,
            keys,
        }).then((results) => {
            setChartData(results as any); // todo
            setIsChartLoading(false);
        });
    }, [from, to, country, webSource, keysForApi, isWindow, includeSubDomains, durationString]);

    const TableColumn = [
        {
            fixed: true,
            field: "keyword",
            sortable: false,
            cellComponent: SearchKeywordCell,
            displayName: i18n("workspaces.marketing.organic.search.overview.table.column.keyword"),
            // tooltip: i18n('workspaces.marketing.organic.search.overview.table.column.keyword.tooltip'),
            width: 150,
            visible: true,
            headerComponent: DefaultCellHeader,
            isResizable: false,
        },
        {
            field: "volume",
            sortable: false,
            displayName: i18n("workspaces.marketing.organic.search.overview.table.column.volume"),
            tooltip: i18n(
                "workspaces.marketing.organic.search.overview.table.column.volume.tooltip",
            ),
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            format: "swPosition",
            width: 100,
            visible: true,
            isResizable: false,
        },
        {
            field: "trafficDistribution",
            sortable: false,
            displayName: i18n("workspaces.marketing.organic.search.overview.table.column.split"),
            tooltip: i18n(
                "workspaces.marketing.organic.search.overview.table.column.split.tooltip",
            ),
            cellComponent: ({ value, tooltipTitle }) => {
                return <TrafficShareWithTooltip data={value} title={tooltipTitle} />;
            },
            headerComponent: DefaultCellHeader,
            visible: true,
            isResizable: false,
        },
    ];

    const onCheckBoxClick = () => {
        allTrackers.trackEvent("Checkbox", checked ? "remove" : "add", `Graph name`);
        selectChecked(!checked);
    };
    const onDropDownToggle = (isOpen) => {
        const action = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", action, `Filter/Branded filter`);
    };
    const onDropDownItemClick = (selectedItem) => {
        allTrackers.trackEvent("Drop down", "click", `Filter/Branded filter/${selectedItem.id}`);
        setSelectedDropdownItem(selectedItem);
        if (selectedItem.id === "total") {
            setExcludeColumns([]);
        } else {
            setExcludeColumns(["BounceRate", "PagesPerVisit", "ArgVisitDuration"]);
        }
    };
    const onCloseItem = () => {
        onDropDownItemClick(dropdownItems[0]);
    };

    const sharedFilters = [
        {
            filter: "webSource",
            value: webSource,
        },
        {
            filter: "country",
            countryCode: country,
            value: getCountryById(country).text,
        },
    ];
    const subtitleFilters = [
        {
            filter: "date",
            value: { from, to },
        },
        ...sharedFilters,
    ];
    const subtitleFiltersTables = [
        {
            filter: "date",
            value: { from: tablesFrom, to: tablesTo },
        },
        ...sharedFilters,
    ];
    const onGranularityClick = (index, selectedGranularity) => {
        if (index !== 2) {
            setSelectedDropdownItem(dropdownItems[0]); // only for monthly granularity there is a data for drop-downs
            setDisableDropDown(true);
        } else {
            setDisableDropDown(false);
        }
        setGranularity(index);
        allTrackers.trackEvent(
            "Granularity Button",
            "click",
            `Graph name/${selectedGranularity.charAt(0)}`,
        );
    };

    const getChartData = () => {
        const dataSet = chartData[checked ? "growth" : "traffic"][granularity] || [];
        const unfiltered = dataSet[selectedDropdownItem.id] || [];
        const selectedDomains = selectedRows ? selectedRows.map((x) => x.Domain) : [];
        return unfiltered.reduce((result, item) => {
            if (selectedDomains.includes(item.name)) {
                result.push(item);
            }
            return result;
        }, []);
    };

    const tableTrack = ({ id, type }) => () => {
        allTrackers.trackEvent("Internal Link", "click", `${id}/${type}`);
    };

    const getComponentForFilter = (tableDataObj) => {
        const { title, tableData, tooltip, alertContent, link, id } = tableDataObj;
        return (
            <TableWithAlertBoxWrapper
                key={`TableWithAlertStatelessBox_${id}`}
                data={{
                    subtitleFilters: subtitleFiltersTables,
                    tableColumn: TableColumn,
                    tableData: { Data: tableData },
                    alertContent: <div dangerouslySetInnerHTML={{ __html: alertContent }} />,
                    boxTitle: title,
                    boxTitleTooltip: tooltip,
                    tableTitle: "Most valuable keywords:",
                    buttonLink: link,
                    buttonText: "SEE ALL KEYWORDS",
                    sitesForLegend,
                    isPdf,
                    onAlertClick: tableTrack({ id, type: "banner" }),
                    onFooterLinkClick: tableTrack({ id, type: "footer" }),
                    alertLink: link,
                }}
                isLoading={false}
                error={false}
                noDataTitle={i18n("workspaces.marketing.organic.search.suggestions.nodata.title")}
                noDataSubtitle={i18n(
                    "workspaces.marketing.organic.search.suggestions.nodata.subtitle",
                )}
            />
        );
    };

    return (
        <>
            <TrafficStateless
                title={i18n("workspaces.marketing.organic.search.overview.chart.title")}
                titleTooltip={i18n("workspaces.marketing.organic.search.overview.chart.tooltip")}
                excludeColumns={excludeColumns}
                isPdf={isPdf}
                tableData={chartData.table[selectedDropdownItem.id]}
                chartData={getChartData()}
                isChecked={checked}
                onCheckBoxClick={onCheckBoxClick}
                selectedDropdownItem={selectedDropdownItem}
                onDropDownToggle={onDropDownToggle}
                onDropDownItemClick={onDropDownItemClick}
                onCloseItem={onCloseItem}
                dropdownItems={dropdownItems}
                disableDropDown={disableDropDown}
                subtitleFilters={subtitleFilters}
                chartFilter={[checked ? percentageSignFilter : minVisitsAbbrFilter, 1]}
                isChartLoading={isChartLoading}
                onGranularityClick={onGranularityClick}
                selectedGranularityIndex={granularity}
                tableSelectionKey={"OrganicSearchOverviewTabTable"}
                componentNameForI18n={"organic.search"}
                filters={filters}
                selectedCategoryId={selectedCategoryId}
                buttonLabel={
                    "workspace.organic_search_overview.traffic_and_engagement.learn_more.button"
                }
                navigateTo={"websites-trafficSearch-overview"}
            />
            <MarketingWorkspaceOverviewTablesSubTitle>
                {i18n("workspaces.marketing.organic.search.overview.subtitle")}
            </MarketingWorkspaceOverviewTablesSubTitle>
            <MarketingWorkspaceOverviewTablesContainer>
                {tablesData.opportunities &&
                tablesData.losing &&
                tablesData.exclusive &&
                tablesData.competitive ? (
                    <>
                        {getComponentForFilter(tablesData.opportunities)}
                        {getComponentForFilter(tablesData.competitive)}
                        {getComponentForFilter(tablesData.losing)}
                        {getComponentForFilter(tablesData.exclusive)}
                    </>
                ) : (
                    KeywordAdvancedFilterService.getAllFilters().map((item, index) => (
                        <TableWithAlertBoxWrapper
                            key={`TableWithAlertStatelessBox_${index}`}
                            isLoading={true}
                        />
                    ))
                )}
            </MarketingWorkspaceOverviewTablesContainer>
        </>
    );
};
const mapStateToProps = ({ tableSelection: { OrganicSearchOverviewTabTable } }) => {
    return {
        selectedRows: OrganicSearchOverviewTabTable,
    };
};

export default connect(mapStateToProps)(OrganicSearchOverviewTab);
