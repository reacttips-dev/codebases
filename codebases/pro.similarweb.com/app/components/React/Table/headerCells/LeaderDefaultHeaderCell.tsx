import { SWReactIcons } from "@similarweb/icons";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import { SortComponent } from "./DefaultCellHeader";

const HeaderCellLeader = styled.div`
    display: flex;
    align-items: flex-start;
`;

const HeaderCellIconComponent: any = styled(SWReactIcons).attrs({
    size: "sm",
})`
    margin-right: 6px;
`;

export const LeaderDefaultHeaderCell: StatelessComponent<ITableHeaderCellProps> = (props) => {
    const {
        sortDirection,
        headerCellIcon,
        headerCellIconName,
        displayName,
        tooltip,
        tableMetadata,
        onSort,
        sortable,
        showTotalCount,
    } = props;
    const i18nDisplayName = i18nFilter()(displayName);
    const tooltipAttr = tooltip ? i18nFilter()(tooltip) : false;

    return (
        <HeaderCellLeader
            className="headerCell headerCell-leader u-truncate"
            onClick={() => {
                onSort(props);
            }}
        >
            {headerCellIconName && <HeaderCellIconComponent iconName={headerCellIconName} />}
            {headerCellIcon ? (
                <i className={`sw-icon-${headerCellIcon} header-icon-offset`} />
            ) : null}
            <PlainTooltip
                cssClass={"plainTooltip-element plainTooltip-element--header"}
                placement={"bottom"}
                text={tooltipAttr || ""}
                enabled={tooltipAttr !== false}
            >
                <span className="headerCell-text u-truncate">{i18nDisplayName}</span>
            </PlainTooltip>
            {sortable && <SortComponent sortDirection={sortDirection} />}
            {showTotalCount ? (
                <div className="headerCell-totalCount">
                    {numberFilter()(tableMetadata.totalCount)}
                </div>
            ) : null}
        </HeaderCellLeader>
    );
};
LeaderDefaultHeaderCell.displayName = "LeaderDefaultHeaderCell";
