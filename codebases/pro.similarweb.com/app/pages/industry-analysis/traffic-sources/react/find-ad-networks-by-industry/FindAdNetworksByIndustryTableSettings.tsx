import {
    IndexCell,
    TrafficShare,
    ChangePercentage,
    WebsiteTooltipTopCell,
    DefaultCellHookTypeWebsite,
} from "components/React/Table/cells";
import { DefaultCellHeader, HeaderCellBlank } from "components/React/Table/headerCells";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { NewChangeWrapper } from "./Components/StyledComponents";
const i18n = i18nFilter();
const TableColumns = [
    {
        fixed: true,
        // eslint-disable-next-line react/display-name
        cellComponent: ({ row }) => {
            return (
                <>
                    {!row.parent && (
                        <IconButton iconName="chev-down" type="flat" className="enrich" />
                    )}
                </>
            );
        },
        sortable: false,
        headerComponent: HeaderCellBlank,
        isResizable: false,
        width: 48,
        columnClass: "collapseControlColumn",
        cellClass: "collapseControlCell",
        disableHeaderCellHover: true,
    },
    {
        fixed: true,
        cellComponent: IndexCell,
        disableHeaderCellHover: true,
        sortable: false,
        width: 46,
        isResizable: false,
    },
    {
        fixed: true,
        field: "Name",
        cellComponent: DefaultCellHookTypeWebsite,
        displayName: i18n("find.ad.networks.by.industry.table.columns.adnetworks"),
        tooltip: i18n("find.ad.networks.by.industry.table.columns.adnetworks.tooltip"),
        sortable: true,
        showTotalCount: true,
        width: 220,
    },
    {
        field: "TotalShare",
        cellComponent: TrafficShare,
        displayName: i18n("find.ad.networks.by.industry.table.columns.trafficshare"),
        tooltip: i18n("find.ad.networks.by.industry.table.columns.trafficshare.tooltip"),
        sortable: true,
        width: 275,
    },
    {
        field: "Change",
        // eslint-disable-next-line react/display-name
        cellComponent: (props) =>
            props.row.NewChange ? (
                <NewChangeWrapper>{i18n("new.label.pill")}</NewChangeWrapper>
            ) : (
                <ChangePercentage {...props} />
            ),
        displayName: i18n("find.ad.networks.by.industry.table.columns.change"),
        tooltip: i18n("find.ad.networks.by.industry.table.columns.change.tooltip"),
        sortable: true,
        width: 115,
    },
    {
        field: "TrafficLeader",
        displayName: i18n("find.ad.networks.by.industry.table.columns.leader"),
        tooltip: i18n("find.ad.networks.by.industry.table.columns.leader.tooltip"),
        // eslint-disable-next-line react/display-name
        cellComponent: (props) =>
            props.value && props.value !== "grid.upgrade" ? (
                <WebsiteTooltipTopCell
                    {...props}
                    secondaryIcon={props.row.TrafficLeaderFavicon}
                    secondaryUrl={props.row.TrafficLeaderUrl}
                    secondaryValue={props.row.TrafficLeader}
                />
            ) : (
                <div style={{ marginLeft: 25 }}>-</div>
            ),
        sortable: false,
        minWidth: 200,
    },
];
export const DEFAULT_SORT_FIELD = "TotalShare";
export const DEFAULT_SORT_DIRECTION = "desc";
export const FindAdNetworksByIndustryTableSettings = {
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
    ) => {
        return TableColumns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: col.visible !== false,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
            };
        });
    },
};
