import { SWReactIcons } from "@similarweb/icons";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import styled from "styled-components";

export interface IDefaultCellHeaderProps extends ITableHeaderCellProps {
    headerCellTextCls: string;
    isBeta: boolean;
    totalCountFormatter?(totalCount: number): string;
}

const BetaLabelWrapper = styled.span`
    display: flex;

    > div {
        height: 16px;
    }
`;

export const SortComponent: StatelessComponent<{ sortDirection: string }> = (props) => {
    const { sortDirection } = props;
    return (
        <div className="headerCell-sortDirection">
            {sortDirection.toUpperCase() === "DESC" && (
                <SWReactIcons iconName="arrow-down-grey" size="xs" />
            )}
            {sortDirection.toUpperCase() === "ASC" && (
                <SWReactIcons iconName="arrow-up-grey" size="xs" />
            )}
        </div>
    );
};

export const DefaultCellHeader: StatelessComponent<IDefaultCellHeaderProps> = (props) => {
    const {
        className,
        sortDirection,
        tableMetadata,
        showTotalCount,
        sortable,
        headerCellTextCls,
        displayName = i18nFilter()(props.field),
        isBeta,
        totalCountFormatter = numberFilter(),
    } = props;
    return (
        <div className={`u-relative ${className}`}>
            <div className="u-flex-row">
                <span className={headerCellTextCls || "headerCell-text u-truncate"}>
                    {displayName}
                </span>
                {showTotalCount && (
                    <div className="headerCell-totalCount">
                        {tableMetadata.totalCount < 0
                            ? "..."
                            : `(${totalCountFormatter(tableMetadata.totalCount)})`}{" "}
                    </div>
                )}
                {isBeta && (
                    <BetaLabelWrapper>
                        <BetaLabel />
                    </BetaLabelWrapper>
                )}
                {sortable && <SortComponent sortDirection={sortDirection} />}
            </div>
        </div>
    );
};
DefaultCellHeader.displayName = "DefaultCellHeader";
