import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { PercentageCellRightAlign } from "components/React/Table/cells/PercentageCell";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { DefaultCell } from "components/Workspace/TableCells/DefaultCell";
import { categoryLoyaltyTableBarChartAdaptor } from "pages/industry-analysis/category-loyalty/IndustryAnalysisLoyaltyContainer";
import { StyledCoreWebsiteCell } from "pages/industry-analysis/category-loyalty/StyledComponents";
import { LOYALTY_CATEGORIES } from "pages/website-analysis/audience-loyalty/AudienceLoyalty";
import React from "react";
import styled from "styled-components";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import {
    DefaultCellRightAlign,
    IndexCell,
    TimeCell,
    TrafficShare,
} from "../../../components/React/Table/cells/index";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells/index";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";

const Capitalize = styled.div`
    text-transform: capitalize;
`;

const index = {
    field: "#",
    fixed: true,
    sortDirection: "desc",
    cellComponent: IndexCell,
    headerComponent: DefaultCellHeader,
    disableHeaderCellHover: true,
    sortable: false,
    width: 40,
    visible: true,
};
const domain = {
    field: "Domain",
    displayName: i18nFilter()("category.analysis.loyalty.table.column.domain"),
    type: "string",
    format: "None",
    sortable: true,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        const params = Injector.get<SwNavigator>("swNavigator").getParams();
        const props = {
            className: "coreWebsiteCell",
            domain: value,
            icon: row.Favicon,
            internalLink: Injector.get<SwNavigator>("swNavigator").href(
                "websites-worldwideOverview",
                {
                    key: value,
                    country: params.country || 840,
                    duration: params.duration || "3m",
                    webSource: "Desktop",
                    isWWW: "*",
                },
            ),
            trackInternalLink: (e) => {
                e.stopPropagation();
                allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
            },
            externalLink: `http://${value}`,
            hideTrackButton: true,
        };
        return (
            <ComponentsProvider components={{ WebsiteTooltip }}>
                <StyledCoreWebsiteCell
                    {...props}
                    trackExternalLink={() =>
                        allTrackers.trackEvent(
                            "external link",
                            "click",
                            `Category loyalty Analysis`,
                        )
                    }
                />
            </ComponentsProvider>
        );
    },
    sortDirection: "desc",
    totalCount: true,
    tooltip: i18nFilter()("category.analysis.loyalty.table.column.domain.tooltip"),
    showTotalCount: true,
    visible: true,
    maxWidth: 245,
    minWidth: 140,
};
const share = {
    field: "Share",
    displayName: i18nFilter()("category.loyalty.table.column.traffic.share"),
    type: "double",
    sortable: true,
    isSorted: false,
    cellComponent: TrafficShare,
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.traffic.share.tooltip"),
    minWidth: 110,
    hideZeroValue: true,
    visible: true,
};
const visits = {
    field: "Visits",
    displayName: i18nFilter()("category.loyalty.table.column.visits"),
    type: "double",
    format: "minVisitsAbbr",
    sortable: true,
    isSorted: false,
    cellComponent: DefaultCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.visits.tooltip"),
    minWidth: 105,
    visible: true,
};
const pagesPerVisit = {
    field: "PagesPerVisit",
    displayName: i18nFilter()("category.loyalty.table.column.pages.per.visit"),
    type: "double",
    format: "number:2",
    sortable: true,
    isSorted: false,
    cellComponent: DefaultCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.pages.per.visit.tooltip"),
    minWidth: 105,
    visible: true,
};
const bounceRate = {
    field: "BounceRate",
    displayName: i18nFilter()("category.loyalty.table.column.bounce.rate"),
    type: "double",
    format: "percentage:2",
    sortable: true,
    isSorted: false,
    cellComponent: PercentageCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.bounce.rate.tooltip"),
    minWidth: 100,
    visible: true,
};

const avgVisitDuration = {
    field: "AvgVisitDuration",
    displayName: i18nFilter()("category.loyalty.table.column.avg.visit.duration"),
    type: "double",
    format: "number",
    sortable: true,
    isSorted: false,
    cellComponent: TimeCell,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.avg.visit.duration.tooltip"),
    minWidth: 100,
    visible: true,
};

const loyalty = {
    field: "Loyalty",
    displayName: i18nFilter()("category.loyalty.table.column.loyalty"),
    type: "string",
    format: "None",
    sortable: false,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        const chartData = categoryLoyaltyTableBarChartAdaptor(value);
        return chartData ? (
            <TrafficShareWithTooltip title={""} data={chartData} />
        ) : (
            <DefaultCellRightAlign value={"-"} />
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.loyalty.tooltip"),
    minWidth: 260,
    visible: true,
};

const oneSiteVisit = {
    field: "OneSiteLoyalty",
    displayName: i18nFilter()("category.loyalty.table.column.loyalty.one.site"),
    sortable: true,
    isSorted: false,
    customSort: (a, b) => {
        const aLo = a?.Loyalty?.[LOYALTY_CATEGORIES[0]] || 0;
        const bLo = b?.Loyalty?.[LOYALTY_CATEGORIES[0]] || 0;
        return aLo - bLo;
    },
    cellComponent: (props) => {
        const { row } = props;
        const value = row?.Loyalty?.[LOYALTY_CATEGORIES[0]];
        return value ? (
            <PercentageCellRightAlign {...props} className={""} value={value} />
        ) : (
            <DefaultCellRightAlign value={"N/A"} />
        );
    },
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("category.loyalty.table.column.loyalty.one.site.tooltip"),
    minWidth: 105,
    visible: true,
};

export const CategoryLoyaltyTableColumnsConfig = () => [
    index,
    domain,
    share,
    visits,
    pagesPerVisit,
    bounceRate,
    avgVisitDuration,
    oneSiteVisit,
    loyalty,
];

export const CategoryLoyaltyTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
) => {
    const columns: any = CategoryLoyaltyTableColumnsConfig();
    return columns.map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: col.field === sortbyField,
            sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};
