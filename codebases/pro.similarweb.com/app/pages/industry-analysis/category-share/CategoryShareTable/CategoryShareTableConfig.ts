import {
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    PercentageBarCellRounded,
    RankCell,
    TimeCell,
    TrafficShare,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    HeaderCellBlank,
    DefaultCellHeader,
    DefaultEllipsisHeaderCell,
} from "components/React/Table/headerCells";
import { i18nFilter } from "filters/ngFilters";
import { WebsiteTooltipTopCell } from "components/React/Table/cells/WebsiteTooltipTopCell";
import { ITableColumnSort } from "./CategoryShareTableTypes";
import { PagesPerVisit } from "components/React/Table/cells/PagesPerVisit";
import { BounceRate } from "components/React/Table/cells/BounceRate";
import { AdsenseCell } from "components/React/Table/cells/AdsenseCell";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";

const i18n = i18nFilter();

export const getTableFilters = (params: any, services: { apiHelper: any }) => {
    const isCustomCategory = UserCustomCategoryService.isCustomCategory(params.category);

    const tableParams = {
        ...params,
        includeSubDomains: true,
        timeGranularity: "Monthly",
        categoryHash: isCustomCategory
            ? UserCustomCategoryService.getCategoryHash(
                  UserCustomCategoryService.removeCategoryIdPrefix(params.category),
                  "categoryId",
              )
            : "",
        keys: `$${decodeURIComponent(params.category)}`,
    };
    return services.apiHelper.transformParamsForAPI(tableParams);
};

export const getUrlForTableRow = (
    row: { Domain: string },
    tableParams: { country: string; duration: string; webSource: string },
) => {
    const { Domain } = row;
    const { country, duration, webSource } = tableParams;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const toState = "companyresearch_website_websiteperformance";
    const navigationParams = {
        key: Domain,
        country,
        duration,
        webSource,
        isWWW: "*",
    };
    const innerLink = swNavigator.href(toState, navigationParams);
    return innerLink;
};

export const getTableColumnsConfig = (sortedColumn: ITableColumnSort) => {
    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            isResizable: false,
            width: 33,
            disableHeaderCellHover: true,
            headerComponent: DefaultCellHeader,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 65,
        },
        {
            field: "Domain",
            fixed: true,
            displayName: "Domain",
            type: "string",
            format: "None",
            sortable: true,
            cellComponent: WebsiteTooltipTopCell,
            headerComponent: DefaultCellHeader,
            showTotalCount: true,
            tooltip: i18n("widget.table.tooltip.topsites.domain"),
            width: 185,
            isResizable: false,
        },
        {
            field: "Share",
            displayName: "Traffic Share",
            type: "string",
            format: "percentagesign",
            fixed: false,
            sortable: true,
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeader,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.share"),
            minWidth: 150,
            isResizable: false,
        },
        {
            field: "Change",
            displayName: "Change",
            type: "double",
            format: "number",
            fixed: false,
            sortable: true,
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: ChangePercentage,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.change"),
            width: 110,
            isResizable: true,
        },
        {
            field: "Rank",
            displayName: "Rank",
            fixed: false,
            sortable: true,
            type: "long",
            format: "swRank",
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: RankCell,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.rank"),
            width: 90,
            isResizable: true,
            inverted: true,
        },
        {
            field: "AvgMonthVisits",
            displayName: "Monthly Visits",
            type: "double",
            format: "minVisitsAbbr",
            fixed: false,
            sortable: true,
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: DefaultCellRightAlign,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.monthlyvisits"),
            width: 130,
            isResizable: true,
        },
        {
            field: "DesktopMobileShare",
            displayName: "Desktop vs Mobile",
            fixed: false,
            sortable: false,
            type: "double",
            format: "abbrNumber",
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: PercentageBarCellRounded,
            showTotalCount: false,
            tooltip: i18n("wa.ao.desktopvsmobile.tooltip"),
            minWidth: 190,
            isResizable: true,
            webSources: ["Total"],
        },
        {
            field: "AvgVisitDuration",
            displayName: "Visit Duration",
            type: "double",
            format: "number",
            fixed: false,
            sortable: true,
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: TimeCell,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.avgvisitduration"),
            width: 130,
            isResizable: true,
        },
        {
            field: "PagesPerVisit",
            displayName: "Pages/Visit",
            fixed: false,
            sortable: true,
            type: "double",
            format: "number",
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: PagesPerVisit,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.ppv"),
            width: 120,
            isResizable: true,
        },
        {
            field: "BounceRate",
            displayName: "Bounce Rate",
            type: "double",
            format: "number",
            fixed: false,
            sortable: true,
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: BounceRate,
            showTotalCount: false,
            tooltip: i18n("widget.table.tooltip.topsites.bouncerate"),
            width: 125,
            isResizable: true,
            inverted: true,
        },
        {
            field: "HasAdsense",
            displayName: "Adsense",
            type: "bool",
            format: "None",
            fixed: false,
            sortable: true,
            headerComponent: DefaultEllipsisHeaderCell,
            cellComponent: AdsenseCell,
            showTotalCount: false,
            width: 100,
            isResizable: true,
        },
    ].map((col) => {
        const isSorted = sortedColumn && col.field === sortedColumn.field;
        return {
            ...col,
            visible: true,
            isSorted,
            sortDirection: isSorted ? sortedColumn.sortDirection : "desc",
        };
    });
};
