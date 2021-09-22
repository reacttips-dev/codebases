import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import {
    CategoryFilterCell,
    DefaultCellRightAlign,
    IndexCell,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import React from "react";
import categoryService from "common/services/categoryService";
import {
    abbrNumberVisitsFilter,
    i18nFilter,
    percentageFilter,
    subCategoryFilter,
} from "filters/ngFilters";
import { PercentageCellRightAlign } from "components/React/Table/cells/PercentageCell";
import { KeywordCompetitorsAffinityCell } from "components/React/Table/cells/KeywordCompetitorsAffinityCell";

const i18n = i18nFilter();

export const getColumns = ({ tabMetaData, orderBy, onSelectCategory, isPaid }) => {
    const field = orderBy.split(" ")[0];
    const sortDirection = orderBy.split(" ")[1];
    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            isResizable: false,
            width: 40,
            visible: categoryService.hasCustomCategoriesPermission(),
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            sortable: false,
            width: 40,
            isResizable: false,
            disableHeaderCellHover: true,
        },
        {
            width: 217,
            isResizable: true,
            sortable: true,
            field: "Domain",
            showTotalCount: true,
            displayName: i18n(`analysis.competitors.search.organic.table.columns.domain.title`),
            tooltip: i18n(`analysis.competitors.search.organic.table.columns.domain.title.tooltip`),
            cellComponent: WebsiteTooltipTopCell,
        },
        {
            width: 163,
            isResizable: true,
            sortable: true,
            field: "Affinity",
            displayName: i18n(`analysis.competitors.search.organic.table.columns.affinity.title`),
            tooltip: i18n(`analysis.competitors.search.organic.table.columns.affinity.tooltip`),
            cellComponent: KeywordCompetitorsAffinityCell,
            headerComponent: DefaultCellHeader,
            scatterChart: true,
            scatterChartFormatter: (value) =>
                i18n("analysis.competitors.search.table.scatter.tooltip.points", {
                    data: Math.round(value),
                }),
            hideScatterTooltipPill: true,
        },
        {
            width: 135,
            isResizable: true,
            sortable: true,
            field: "KwOverlapped",
            displayName: i18n(
                `analysis.competitors.search.organic.table.columns.sharedkeywords.title`,
            ),
            tooltip: i18n(
                `analysis.competitors.search.organic.table.columns.sharedkeywords.tooltip`,
            ),
            cellComponent: PercentageCellRightAlign,
            headerComponent: DefaultCellHeader,
            scatterChart: true,
            scatterChartFormatter: (value) => `${percentageFilter()(value || 0, 2)}%`,
            hideScatterTooltipPill: true,
        },
        {
            width: 119,
            isResizable: true,
            sortable: false,
            field: "Traffic",
            displayName: i18n(
                `analysis.competitors.search.organic.table.columns.${
                    isPaid ? "paidtraffic" : "organictraffic"
                }.title`,
            ),
            tooltip: i18n(
                `analysis.competitors.search.organic.table.columns.${
                    isPaid ? "paidtraffic" : "organictraffic"
                }.tooltip`,
            ),
            cellComponent: (props) => <DefaultCellRightAlign {...props} format="minVisitsAbbr" />,
            headerComponent: DefaultCellHeader,
            scatterChart: true,
            scatterChartBenchmark: true,
            scatterChartFormatter: (value) =>
                i18n("analysis.competitors.search.table.scatter.tooltip.visits", {
                    data: abbrNumberVisitsFilter()(value),
                }),
        },
        {
            width: 103,
            isResizable: true,
            sortable: false,
            field: "TotalTraffic",
            displayName: i18n(
                `analysis.competitors.search.organic.table.columns.totaltraffic.title`,
            ),
            tooltip: i18n(`analysis.competitors.search.organic.table.columns.totaltraffic.tooltip`),
            cellComponent: (props) => <DefaultCellRightAlign {...props} format="minVisitsAbbr" />,
            headerComponent: DefaultCellHeader,
            scatterChart: true,
            scatterChartBenchmark: true,
            scatterChartFormatter: (value) =>
                i18n("analysis.competitors.search.table.scatter.tooltip.visits", {
                    data: abbrNumberVisitsFilter()(value),
                }),
        },
        {
            width: 260,
            isResizable: true,
            sortable: true,
            field: "Category",
            displayName: i18n(`analysis.competitors.search.organic.table.columns.category.title`),
            tooltip: i18n(
                `analysis.competitors.search.organic.table.columns.category.title.tooltip`,
            ),
            cellComponent: (row) => {
                const onItemClick = () => onSelectCategory(row.value);
                const filter = (cat) => {
                    cat = cat.replace("/", "~");
                    return subCategoryFilter()(cat);
                };
                return <CategoryFilterCell {...row} onItemClick={onItemClick} filter={filter} />;
            },
        },
    ].map((col: any) => {
        const isSorted = col.field === field;
        return {
            ...col,
            visible: col.visible !== false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection,
            isResizable: col.isResizable !== false,
        };
    });
};
