import React from "react";
import CoreTrendsBarCell from "../../../../.pro-features/components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import { ITrendsBarValue } from "../../../../.pro-features/components/TrendsBar/src/TrendsBar";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import {
    DefaultCellRightAlign,
    IndexCell,
    LeadingSite,
    OrganicPaid,
    RelevancyCell,
    SearchKeywordCell,
    ProgressBarPercentCell,
} from "../../../components/React/Table/cells";
import { RowSelectionConsumer } from "../../../components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "../../../components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "../../../components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { abbrNumberFilter, i18nFilter } from "../../../filters/ngFilters";
import dayjs from "dayjs";

const DEFAULT_SORT_FIELD = "score";
const DEFAULT_SORT_DIRECTION = "desc";
const dateFormat = (date) => dayjs(date).format("MMM, YYYY");
export const RelatedTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    getColumns: (
        sortedColumn = { field: "volume", sortDirection: "desc" },
        webSource: string,
        country,
        duration,
    ) => {
        const swNavigator = Injector.get<any>("swNavigator");
        return [
            {
                fixed: true,
                cellComponent: RowSelectionConsumer,
                sortable: false,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
                width: 50,
                disableHeaderCellHover: true,
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
                fixed: true,
                field: "keyword",
                sortable: true,
                showTotalCount: true,
                cellComponent: (props) => (
                    <SearchKeywordCell
                        {...props}
                        adsUrl={swNavigator.href("keywordAnalysis-ads", {
                            webSource,
                            country,
                            duration,
                            keyword: props.value,
                        })}
                    />
                ),
                displayName: i18nFilter()("keyword.generator.tool.table.column.keyword"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.keyword.tooltip"),
                width: 258,
                groupKey: "keywordGeneratorToolRelated",
            },
            {
                field: "score",
                sortable: true,
                cellComponent: RelevancyCell,
                displayName: i18nFilter()("keyword.generator.tool.table.column.score"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.keyword.score"),
                width: 100,
                groupKey: "keywordGeneratorToolRelated",
            },
            {
                field: "volume",
                sortable: true,
                displayName: i18nFilter()("keyword.generator.tool.table.table.column.volume"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.volume.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "swPosition",
                width: 100,
                groupKey: "keywordGeneratorToolRelated",
            },
            {
                field: "volumeTrend",
                displayName: i18nFilter()("keyword.generator.tool.table.column.volumetrend"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.volumetrend.tooltip"),
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
                format: "swPosition",
                width: 130,
                groupKey: "keywordGeneratorToolRelated",
            },
            {
                field: "zeroClicksShare",
                sortable: false,
                displayName: i18nFilter()("keyword.generator.tool.table.column.zero.click"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.zero.clicks.tooltip"),
                cellComponent: (props) => <ProgressBarPercentCell value={props.value} />,
                width: 170,
            },
            {
                field: "cpc",
                sortable: true,
                displayName: i18nFilter()("keyword.generator.tool.table.column.cpc"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.cpc.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "CPC",
                width: 86,
                groupKey: "keywordGeneratorToolRelated",
            },
            ...(webSource === "MobileWeb"
                ? []
                : [
                      {
                          field: "organicShare",
                          displayName: i18nFilter()(
                              "keyword.generator.tool.table.column.organicshare",
                          ),
                          tooltip: i18nFilter()(
                              "keyword.generator.tool.table.column.organicshare.tooltip",
                          ),
                          cellComponent: OrganicPaid,
                          width: 105,
                          groupKey: "keywordGeneratorToolRelated",
                      },
                  ]),
            {
                width: 200,
                sortable: true,
                field: "leadingSite",
                displayName: i18nFilter()("keyword.generator.tool.table.column.website"),
                tooltip: i18nFilter()("keyword.generator.tool.table.column.website.tooltip"),
                cellComponent: LeadingSite,
                groupKey: "keywordGeneratorToolRelated",
            },
        ].map((col) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                visible: true,
                headerComponent: DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
                ...col,
            };
        });
    },
};
