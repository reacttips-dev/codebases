import {
    CountryCell,
    DefaultCell,
    DefaultCellRightAlign,
    IndexCell,
    RelevancyCell,
} from "../../../components/React/Table/cells";
import CoreTrendsBarCell from "components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import {
    DefaultCellHeaderRightAlign,
    DefaultEllipsisHeaderCell,
    HeaderCellBlank,
} from "../../../components/React/Table/headerCells";
import { i18nFilter } from "../../../filters/ngFilters";

export const DEFAULT_SORT_DIRECTION = "desc";
const scoreDotsAmount = 5;

export const YoutubeKeywordGeneratorRelatedColumnsConfig = {
    getColumns: (sortBy: string, showScore: boolean) => {
        return [
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
                field: "Keyword",
                sortable: true,
                showTotalCount: true,
                cellComponent: DefaultCell,
                displayName: i18nFilter()("youtube.keyword.generator.table.column.keyword"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.keyword.tooltip"),
                width: 294,
            },
            {
                field: "Score",
                sortable: true,
                // eslint-disable-next-line react/display-name
                cellComponent: (props) => (
                    <RelevancyCell {...props} value={Math.ceil(props.value * scoreDotsAmount)} />
                ),
                displayName: i18nFilter()("youtube.keyword.generator.table.column.score"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.score.tooltip"),
                width: 144,
                visible: showScore,
            },
            {
                field: "Volume",
                sortable: true,
                displayName: i18nFilter()("youtube.keyword.generator.table.column.volume"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.volume.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "swPosition",
                width: 115,
            },
            {
                field: "VolumeTrend",
                displayName: i18nFilter()("youtube.keyword.generator.table.column.volumetrend"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.volumetrend.tooltip"),
                cellComponent: ({ value }) => {
                    if (value) {
                        return <CoreTrendsBarCell value={value} />;
                    } else {
                        return "N/A";
                    }
                },
                format: "swPosition",
                width: 130,
                groupKey: "keywordGeneratorTool",
            },
            {
                field: "Clicks",
                sortable: true,
                displayName: i18nFilter()("youtube.keyword.generator.table.table.column.clicks"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.clicks.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "swPosition",
                width: 100,
            },
            {
                field: "TopCountry",
                displayName: i18nFilter()("youtube.keyword.generator.table.column.topCountry"),
                tooltip: i18nFilter()("youtube.keyword.generator.table.column.topCountry.tooltip"),
                cellComponent: CountryCell,
                minWidth: 180,
            },
        ].map((col: any) => {
            const isSorted = col.field === sortBy;
            return {
                visible: true,
                headerComponent: DefaultEllipsisHeaderCell,
                isSorted,
                sortDirection: DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
                ...col,
            };
        });
    },
};
