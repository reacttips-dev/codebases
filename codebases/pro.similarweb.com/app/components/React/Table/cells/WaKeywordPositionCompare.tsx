import * as React from "react";
import { WaPositionTooltip } from "../../Tooltip/WaPositionTooltip/WaPositionTooltip";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";
import { RightAlignCell } from "./WaKeywordPosition";
import styled from "styled-components";

const NoRanksCell = styled.span`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 5px;
`;

export type tooltipChildType = "icon" | "cell";

interface IWaKeywordPositionCompareProps extends ITableCellProps {
    tooltipChild?: tooltipChildType;
}

export const WaKeywordPositionCompare: StatelessComponent<IWaKeywordPositionCompareProps> = ({
    row,
    field,
    tooltipChild,
}) => {
    const chosenSites = Injector.get("chosenSites") as any,
        items: { Key: string; Value: number }[] = row[field],
        firstItem = items[0],
        rank = firstItem.Value,
        site = firstItem.Key,
        hasRanks = rank !== -1;

    if (!hasRanks) {
        return (
            <RightAlignCell className="cell-innerText">
                <span className="cell-innerText"> - </span>
            </RightAlignCell>
        );
    }
    const color = chosenSites.getSiteColor(site);

    return tooltipChild === ("cell" as tooltipChildType) ? (
        <WaPositionTooltip data={items}>
            <RightAlignCell className="cell-innerText wa-keyword-position-compare">
                <span
                    className="legend-item-circle"
                    style={{ background: color, marginRight: 5 }}
                />
                <span style={{ marginRight: 5 }}>{rank}</span>
            </RightAlignCell>
        </WaPositionTooltip>
    ) : (
        <RightAlignCell className="cell-innerText">
            <span className="legend-item-circle" style={{ background: color, marginRight: 5 }} />
            <span style={{ marginRight: 5 }}>{rank}</span>
            <WaPositionTooltip data={items}>
                <span className="sw-icon-show-more" style={{ verticalAlign: "middle" }} />
            </WaPositionTooltip>
        </RightAlignCell>
    );
};
WaKeywordPositionCompare.displayName = "WaKeywordPositionCompare";

WaKeywordPositionCompare.defaultProps = {
    tooltipChild: "icon",
};
