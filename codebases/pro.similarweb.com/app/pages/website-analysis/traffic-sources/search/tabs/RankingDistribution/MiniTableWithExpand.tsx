import React from "react";
import styled from "styled-components";
import { DomainCell } from "components/React/Table/cells";
import { SWReactIcons } from "@similarweb/icons";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import {
    numberFilter,
    pctSignFilter,
    percentageFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const DefaultHeaderCellContainer = styled(FlexRow)`
    height: 42px;
    border-width: 1px 0;
    border-color: ${colorsPalettes.carbon[50]};
    border-style: solid;
    align-items: center;
    ${setFont({ $size: 14 })};

    &:first-child {
        padding-left: 16px;
    }
`;

const DefaultCellContainer = styled(FlexRow)`
    height: 42px;
    border-width: 0 0 1px 0;
    border-color: ${colorsPalettes.carbon[50]};
    border-style: solid;
    align-items: center;
    ${setFont({ $size: 14 })};

    &[data-grid-col="0"] {
        padding-left: 25px;
        padding-right: 25px;
    }
}
`;

const ValueComponent = styled.span<{ isLeader: boolean }>`
    color: ${colorsPalettes.carbon[500]};
    font-weight: ${({ isLeader }) => (isLeader ? 700 : 400)};
    margin-right: 10px;
`;

const WinnerIcon: any = styled(SWReactIcons)`
    height: 1em;
    width: 1em;
    margin-right: 5px;
`;

const OpenGraphButton = styled.button`
    padding: 0 8px 0 4px;
    display: flex;
    align-items: center;
    ${setFont({ $size: 10, $color: colorsPalettes.carbon[200] })};
    border: 1px solid ${colorsPalettes.carbon[200]};
    background-color: transparent;
    border-radius: 4px;

    ${SWReactIcons} {
        margin-right: 8px;
    }
`;

const TierCellContainer = styled(FlexRow)`
    width: 100%;
    align-items: center;
`;

const IconContainer = styled.div`
    margin-left: 8px;
`;

const TierCell = ({ value, onClick, tooltip }) => {
    return (
        <TierCellContainer justifyContent="space-between">
            <FlexRow alignItems="center">
                {value}
                <IconContainer>
                    <PlainTooltip enabled={true} tooltipContent={tooltip}>
                        <div>
                            <SWReactIcons iconName="info" size="xs" />
                        </div>
                    </PlainTooltip>
                </IconContainer>
            </FlexRow>
            <OpenGraphButton onClick={onClick}>
                <SWReactIcons size="xs" iconName="chev-down" /> SEE TREND
            </OpenGraphButton>
        </TierCellContainer>
    );
};
const TableContainer: any = styled.div<{ columns: any[] }>`
    display: grid;
    grid-template-columns: ${(props: any) =>
        props.columns
            .map((col) => `minmax(${col.width ? `${col.width}` : 0}, ${col.maxWidth || "1fr"})`)
            .join(" ")};
`;
const ExpandedRowElementInner = styled.div`
    transform: scale3d(1, 1, 1);
    width: calc(100% + 24px);
    height: calc(100% + 70px);
    position: absolute;
    box-sizing: border-box;
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 20px 0px;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    padding-top: 6px;
    opacity: 1;
    transition: opacity 0.1s ease-out 0s;
    z-index: 1;
    left: -12px;
    top: -48px;
    height: auto;
`;
const ExpandRowElementContainer: any = styled.div<{ expanded?: boolean }>`
    height: ${({ expanded }) => (expanded ? 395 : 0)}px;
    position: relative;
    transition: height 0.3s ease-out 0s;
    grid-column: 1 / -1;
`;
const ExpandRowElement = ({ expanded, children, onClick }) => {
    return (
        <ExpandRowElementContainer expanded={expanded}>
            {expanded ? (
                <ExpandedRowElementInner onClick={onClick}>{children}</ExpandedRowElementInner>
            ) : null}
        </ExpandRowElementContainer>
    );
};

const createDomainColumn = (domain, index) => {
    return {
        name: domain,
        // eslint-disable-next-line react/display-name
        headerComponent: () => {
            return (
                <DefaultHeaderCellContainer>
                    <DomainCell field={domain} />
                </DefaultHeaderCellContainer>
            );
        },
        // eslint-disable-next-line react/display-name
        cellComponent: ({ row, rowIndex, colIndex, ...rest }) => {
            const value = row[domain]?.Value;
            const isLeader = row.leader === domain;
            return (
                <DefaultCellContainer {...rest}>
                    <ValueComponent isLeader={isLeader}>
                        {percentageSignFilter()(value, 2)}
                    </ValueComponent>
                    {isLeader && <WinnerIcon iconName="winner" />}
                </DefaultCellContainer>
            );
        },
    };
};
export const MiniTableWithExpand: any = ({
    expandedRowComponent,
    onExpandRowClick,
    expandedRowIndex,
    domains,
    data,
}) => {
    const columns = [
        {
            name: "Group",
            // eslint-disable-next-line react/display-name
            cellComponent: ({ row, rowIndex, colIndex, ...rest }) => {
                return (
                    <DefaultCellContainer {...rest}>
                        <TierCell
                            tooltip={row.tooltip}
                            value={row.metric}
                            onClick={onExpandRowClick(row)}
                        />
                    </DefaultCellContainer>
                );
            },
            width: "280px",
            maxWidth: "280px",
        },
        ...domains.map(createDomainColumn),
    ];

    const cells: any = [];

    columns.forEach((col, colIndex) => {
        const HeaderComponent =
            col.headerComponent ||
            (() => <DefaultHeaderCellContainer>{col.name}</DefaultHeaderCellContainer>);
        cells.push(<HeaderComponent />);
    });

    data.forEach((row, rowIndex) => {
        columns.forEach((col, colIndex) => {
            const Cell =
                col.cellComponent ||
                ((props) => (
                    <DefaultCellContainer {...props}>not implemented</DefaultCellContainer>
                ));
            cells.push(
                <Cell
                    data-grid-col={colIndex}
                    data-grid-row={rowIndex}
                    row={row}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                />,
            );
        });
        cells.push(
            <ExpandRowElement
                onClick={onExpandRowClick(row)}
                expanded={rowIndex === expandedRowIndex}
            >
                {expandedRowComponent}
            </ExpandRowElement>,
        );
    });
    return <TableContainer columns={columns}>{cells}</TableContainer>;
};
