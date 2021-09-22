import { colorsPalettes } from "@similarweb/styles";
import React from "react";
import styled from "styled-components";

export interface ISimpleTableColumnConfig {
    key: string;
    title: string;
    renderCell?: (cell: {
        colConfig: ISimpleTableColumnConfig;
        item: any;
        index: number;
    }) => React.ReactElement;
    renderHeader?: (header: { colConfig: ISimpleTableColumnConfig }) => React.ReactElement;
    width?: string;
    grow?: number;
}

export interface ISimpleTableConfig {
    columns: ISimpleTableColumnConfig[];
    onRowClick?: (item: any, index: number) => void;
}

export interface ISimpleTableProps {
    config: ISimpleTableConfig;
    data: any[];
}

export const SimpleTableContainer = styled.div<any>`
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    min-width: calc(
        ${({ columnsConfig }) =>
            columnsConfig
                .map((colConfig) => colConfig.width ?? "0")
                .concat(["60px"])
                .join(" + ")}
    );
`;

const SimpleTableBody = styled.div`
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: auto;
`;

const SimpleTableHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-items: flex-end;
    justify-content: flex-start;
    padding: 3px 30px;
    overflow-y: scroll;
    min-height: 30px;
`;

const rowColors = [colorsPalettes.bluegrey[100], colorsPalettes.carbon[25]];
export const SimpleTableRow = styled.div<any>`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-items: flex-start;
    justify-content: flex-start;
    padding: 3px 30px;
    background-color: ${({ index = 0 }) => rowColors[index % rowColors.length]};
    cursor: ${({ onClick }) => (onClick ? "pointer" : "auto")}

    &:hover {
        background-color: ${colorsPalettes.blue[200]};
    }

    &:last-child {
        border-bottom: 1px solid ${colorsPalettes.carbon[50]};
        margin-bottom: 10px;
    }
`;

export const SimpleTableCell = styled.div<any>`
    flex: ${({ grow, width }) => `${grow ?? 1} 0 ${width ?? "0"}`};
    overflow: hidden;
`;

export const DefaultHeader = styled.div`
    padding: 5px;
    font-weight: 500;
`;

export const DefaultCell = styled.div`
    padding: 3px 5px;
`;

const defaultRenderHeader = ({ colConfig }) => {
    const { headerComponent: HeaderComponent = DefaultHeader } = colConfig;
    return <HeaderComponent key={colConfig.key}>{colConfig.title}</HeaderComponent>;
};

const defaultRenderCell = ({ colConfig, item, index }) => {
    const { cellComponent: CellComponent = DefaultCell } = colConfig;
    return <CellComponent key={colConfig.key}>{item[colConfig.key]}</CellComponent>;
};

export const SimpleTable = ({ config, data = [] }: ISimpleTableProps) => {
    const { columns: columnsConfig, onRowClick } = config;
    return (
        <SimpleTableContainer columnsConfig={columnsConfig}>
            <SimpleTableHeaderRow>
                {columnsConfig.map((colConfig) => (
                    <SimpleTableCell
                        key={colConfig.key}
                        width={colConfig.width}
                        grow={colConfig.grow}
                    >
                        {(colConfig.renderHeader ?? defaultRenderHeader)({ colConfig })}
                    </SimpleTableCell>
                ))}
            </SimpleTableHeaderRow>
            <SimpleTableBody>
                {data.map((item, index) => (
                    <SimpleTableRow
                        key={item.domain}
                        index={index}
                        onClick={() => onRowClick(item, index)}
                    >
                        {columnsConfig.map((colConfig) => (
                            <SimpleTableCell
                                key={colConfig.key}
                                width={colConfig.width}
                                grow={colConfig.grow}
                            >
                                {(colConfig.renderCell ?? defaultRenderCell)({
                                    colConfig,
                                    item,
                                    index,
                                })}
                            </SimpleTableCell>
                        ))}
                    </SimpleTableRow>
                ))}
            </SimpleTableBody>
        </SimpleTableContainer>
    );
};
