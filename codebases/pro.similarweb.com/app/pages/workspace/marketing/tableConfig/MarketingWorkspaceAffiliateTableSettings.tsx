import { colorsPalettes } from "@similarweb/styles";
import { default as React } from "react";
import { CoreWebsiteCell } from "../../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { TrafficShareWithTooltip } from "../../../../../.pro-features/components/TrafficShare/src/TrafficShareWithTooltip";
import ComponentsProvider from "../../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { DefaultCellHeader } from "../../../../components/React/Table/headerCells";
import { WebsiteTooltip } from "../../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter, minVisitsAbbrFilter } from "../../../../filters/ngFilters";
import { allTrackers } from "../../../../services/track/track";
import { MinNumberCell } from "../../../../../.pro-features/components/Workspace/TableCells/MinNumberCell";
import CoreTrendsBarCell from "../../../../../.pro-features/components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import { ChangeCell } from "../../../../../.pro-features/components/Workspace/TableCells/ChangeCell";
import styled, { css } from "styled-components";

import { NumberRow } from "../../../../../.pro-features/components/core cells/src/CoreNumberCell/StyledComponents";
import { FlexRow } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { ContentContainer } from "../../../../../.pro-features/components/core cells/src/CoreWebsiteCell/StyledComponents";
import { ChangePercentage } from "../../../../components/React/Table/cells";
import { RightAlignedCell } from "components/React/Table/cells/RankCell";

const DEFAULT_SORT_FIELD = "affiliateTotalOutgoingTraffic";
const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();

const LeadingDomainCellItem = styled.div<{ width?: number }>`
    ${({ width }) =>
        width &&
        css`
            min-width: ${width}px;
        `};
    display: flex;
    align-items: center;
`;

const LeadingDomainCellContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    ${LeadingDomainCellItem} {
        margin-right: 20px;
        overflow: hidden;
        max-width: 220px;
        ${ContentContainer} {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 196px;
        }
    }
`;

export const MarketingWorkspaceAffiliateTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "affiliateDomain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
        benchmark: boolean,
        monthSymbol?: string,
        isWindow?: boolean,
    ) => {
        const swNavigator = Injector.get<any>("swNavigator");
        const monthSymbolNum = parseInt(monthSymbol.replace("m", ""));
        const columns: any = [
            {
                width: 300,
                sortable: true,
                field: "affiliateDomain",
                showTotalCount: true,
                displayName: i18nFilter()("workspaces.affiliate.table.column.website"),
                cellComponent: ({ value, row }) => {
                    const props = {
                        domain: value,
                        icon: row.affiliateFavicon,
                        internalLink: swNavigator.href("websites-worldwideOverview", {
                            key: value,
                            country: row.country,
                            duration: "3m",
                            webSource: "Total",
                            isWWW: "*",
                        }),
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
            },
            {
                field: "affiliateTotalOutgoingTraffic",
                sortable: true,
                displayName: i18nFilter()("workspaces.affiliate.table.column.outgoing.traffic"),
                tooltip: i18nFilter()("workspaces.affiliate.table.column.outgoing.traffic.tooltip"),
                cellComponent: ({ value, row }) => {
                    if (typeof value !== "undefined") {
                        return <MinNumberCell value={value} />;
                    } else {
                        return <RightAlignedCell>-</RightAlignedCell>;
                    }
                },
                width: 125,
            },
            ...(!isWindow
                ? [
                      {
                          field: "affiliateTrafficTrendChange",
                          sortable: true,
                          cellComponent: ChangePercentage,
                          displayName: i18nFilter()(
                              "workspaces.affiliate.table.column.outgoing.change",
                          ),
                          tooltip: i18nFilter()(
                              "workspaces.affiliate.table.column.outgoing.change.tooltip",
                          ),
                          width: 162,
                      },
                  ]
                : []),
            ...(monthSymbol !== "1m"
                ? [
                      {
                          field: "affiliateTrafficTrend",
                          displayName: i18nFilter()("workspaces.affiliate.table.column.trend"),
                          tooltip: i18nFilter()("workspaces.affiliate.table.column.trend.tooltip"),
                          cellComponent: CoreTrendsBarCell,
                          width: monthSymbolNum * 12.5 < 100 ? 100 : monthSymbolNum * 12.5,
                      },
                  ]
                : []),
        ];
        if (benchmark) {
            columns.splice(1, 0, {
                field: "trafficDistribution",
                displayName: i18nFilter()("workspaces.affiliate.table.column.split"),
                tooltip: i18nFilter()("workspaces.affiliate.table.column.split.tooltip"),
                cellComponent: ({ value, tooltipTitle }) => {
                    return <TrafficShareWithTooltip data={value} title={tooltipTitle} />;
                },
                tooltipTitle: i18n("workspaces.marketing.trafficshare.tooltip.title"),
                width: 600,
            });
        } else {
            columns.push({
                width: 200,
                sortable: true,
                field: "leaderDomain",
                displayName: i18nFilter()("workspaces.affiliate.table.column.leadingdomain"),
                tooltip: i18nFilter()("workspaces.affiliate.table.column.leadingdomain.toolip"),
                cellComponent: ({ value, row }) => {
                    const props = {
                        domain: value,
                        icon: row.leaderFavicon,
                        internalLink: Injector.get<SwNavigator>("swNavigator").href(
                            "websites-worldwideOverview",
                            {
                                key: value,
                                country: row.country,
                                duration: "3m",
                                webSource: "Total",
                                isWWW: "*",
                            },
                        ),
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
                            <LeadingDomainCellContainer>
                                <LeadingDomainCellItem width={220}>
                                    <CoreWebsiteCell {...props} />
                                </LeadingDomainCellItem>
                                <LeadingDomainCellItem width={60}>
                                    <NumberRow>
                                        {minVisitsAbbrFilter()(row.leaderIncomingTraffic)}
                                    </NumberRow>
                                </LeadingDomainCellItem>
                                <LeadingDomainCellItem>
                                    <ChangeCell value={row.leaderTrafficChange} />
                                </LeadingDomainCellItem>
                            </LeadingDomainCellContainer>
                        </ComponentsProvider>
                    );
                },
            });
        }
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                headerComponent: DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    },
};
