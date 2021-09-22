import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { DefaultCellRightAlign } from "components/React/Table/cells";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter, minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import {
    chartDataAdapterEmpty,
    chartDataFetcher,
    tablesDataFetcher,
} from "pages/workspace/marketing/pages/AffiliatesOverviewTabService";
import { TableWithAlertBoxWrapper } from "pages/workspace/marketing/pages/TableWithAlertBoxWrapper";
import { TrafficStateless } from "pages/workspace/marketing/pages/TrafficStateless";
import {
    MarketingWorkspaceOverviewTablesContainer,
    MarketingWorkspaceOverviewTablesSubTitle,
} from "pages/workspace/marketing/shared/styledComponents";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IncomingReferralsAdvancedFilterService } from "services/AdvancedFilterService/IncomingReferralsAdvancedFilter";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import CoreNumberCell from "components/core cells/src/CoreNumberCell/CoreNumberCell";

const AffiliatesOverviewTab = (props) => {
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
    const [tablesData, setTablesData] = useState<any>([]); // todo
    const chartColors = [...CHART_COLORS.chartMainColors].reverse();
    const [isChartLoading, setIsChartLoading] = useState(true);
    const getGranularityByDuration = () =>
        (durationString === "28d" || durationString === "1m") && webSource !== "MobileWeb" ? 1 : 2;
    const [granularity, setGranularity] = useState(getGranularityByDuration());
    const [checked, selectChecked] = useState(false);
    const [chartData, setChartData] = useState(chartDataAdapterEmpty(granularity));

    const colorsForDomain = {};
    keys.forEach((key) => {
        colorsForDomain[key.domain] = chartColors.pop();
    });
    const keysForApi = keys.map((x) => x.domain).join(",");
    useEffect(() => {
        setGranularity(getGranularityByDuration());
    }, [durationString, webSource]);

    useEffect(() => {
        setTablesData([]);
        const params = {
            country,
            from: tablesFrom,
            to: tablesTo,
            webSource,
            includeSubDomains,
            sites: keysForApi,
            isWindow: tablesIsWindow,
            limits: IncomingReferralsAdvancedFilterService.getAllFilters()
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
            setTablesData(results as any); // todo any
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
        chartDataFetcher({ params, granularity, colorsForDomain, keys }).then((results) => {
            setChartData(results as any); // todo any
            setIsChartLoading(false);
        });
    }, [from, to, country, webSource, keysForApi, isWindow, includeSubDomains, durationString]);

    const TableColumn = [
        {
            width: 200,
            sortable: false,
            field: "domain",
            displayName: i18n("workspaces.marketing.affiliates.table.column.domain"),
            // tooltip: i18n('workspaces.marketing.organic.search.table.column.domain.tooltip'),
            cellComponent: ({ value, row }) => {
                const props = {
                    domain: value,
                    icon: row.favicon,
                    target: "_blank",
                    internalLink: row.url,
                    trackInternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
                    },
                    externalLink: `http://${value}`,
                    trackExternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("External Link", "click", `Table/${value}`);
                    },
                    hideTrackButton: true,
                };
                return (
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell {...props} />
                    </ComponentsProvider>
                );
            },
            visible: true,
            headerComponent: DefaultCellHeader,
            isResizable: false,
        },
        {
            field: "volume",
            sortable: false,
            displayName: i18n("workspaces.marketing.affiliates.table.column.volume"),
            tooltip: i18n("workspaces.marketing.affiliates.table.column.volume.tooltip"),
            cellComponent: ({ value }) => {
                return <CoreNumberCell value={value * 100} format="0.00" suffix="%" />;
            },
            headerComponent: DefaultCellHeaderRightAlign,
            width: 100,
            visible: true,
            isResizable: false,
        },
        {
            field: "trafficDistribution",
            sortable: false,
            displayName: i18n("workspaces.marketing.affiliates.table.column.split"),
            tooltip: i18n("workspaces.marketing.affiliates.table.column.split.tooltip"),
            cellComponent: ({ value, tooltipTitle }) => {
                return <TrafficShareWithTooltip data={value} title={tooltipTitle} />;
            },
            headerComponent: DefaultCellHeader,
            visible: true,
            isResizable: false,
        },
    ];

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
                    tableTitle: i18n("workspaces.marketing.affiliates.table.title"), // "Most valuable referrals:",
                    buttonLink: link,
                    buttonText: "SEE ALL WEBSITES",
                    sitesForLegend,
                    isPdf,
                    onAlertClick: tableTrack({ id, type: "banner" }),
                    onFooterLinkClick: tableTrack({ id, type: "footer" }),
                    alertLink: link,
                }}
                isLoading={false}
                error={false}
                noDataTitle={i18n("workspaces.marketing.affiliates.suggestions.nodata.title")}
                noDataSubtitle={i18n("workspaces.marketing.affiliates.suggestions.nodata.subtitle")}
            />
        );
    };
    const onGranularityClick = (index, selectedGranularity) => {
        allTrackers.trackEvent(
            "Granularity Button",
            "click",
            `Graph name/${selectedGranularity.charAt(0)}`,
        );
        setGranularity(index);
    };
    const onCheckBoxClick = () => {
        allTrackers.trackEvent("Checkbox", checked ? "remove" : "add", `Graph name`);
        selectChecked(!checked);
    };
    const getChartData = () => {
        const unfiltered = chartData[checked ? "growth" : "traffic"][granularity] || [];
        const selectedDomains = selectedRows ? selectedRows.map((x) => x.Domain) : [];
        return unfiltered.reduce((result, item) => {
            if (selectedDomains.includes(item.name)) {
                result.push(item);
            }
            return result;
        }, []);
    };

    return (
        <>
            <TrafficStateless
                title={i18n("workspaces.marketing.affiliates.chart.title")}
                titleTooltip={i18n("workspaces.marketing.affiliates.chart.tooltip")}
                isPdf={isPdf}
                tableData={chartData.table}
                chartData={getChartData()}
                isChecked={checked}
                onCheckBoxClick={onCheckBoxClick}
                dropdownItems={[]}
                disableDropDown={true}
                subtitleFilters={subtitleFilters}
                chartFilter={[checked ? percentageSignFilter : minVisitsAbbrFilter, 1]}
                isChartLoading={isChartLoading}
                onGranularityClick={onGranularityClick}
                selectedGranularityIndex={granularity}
                tableSelectionKey={"AffiliatesOverviewTabTable"}
                componentNameForI18n={"referrals.overview"}
                filters={filters}
                selectedCategoryId={selectedCategoryId}
                buttonLabel={
                    "workspace.referrals_overview.referral_traffic_and_engagement.learn_more.button"
                }
                navigateTo={"websites-trafficReferrals"}
            />
            <MarketingWorkspaceOverviewTablesSubTitle>
                {i18n("workspaces.marketing.affiliates.subtitle")}
            </MarketingWorkspaceOverviewTablesSubTitle>
            <MarketingWorkspaceOverviewTablesContainer>
                {tablesData.ReferralOpportunities &&
                tablesData.LosingToCompetitionReferral &&
                tablesData.ReferralExclusive &&
                tablesData.HighCompetitiveReferral ? (
                    <>
                        {getComponentForFilter(tablesData.ReferralOpportunities)}
                        {getComponentForFilter(tablesData.HighCompetitiveReferral)}
                        {getComponentForFilter(tablesData.LosingToCompetitionReferral)}
                        {getComponentForFilter(tablesData.ReferralExclusive)}
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
const mapStateToProps = ({ tableSelection: { AffiliatesOverviewTabTable } }) => {
    return {
        selectedRows: AffiliatesOverviewTabTable,
    };
};

export default connect(mapStateToProps)(AffiliatesOverviewTab);
