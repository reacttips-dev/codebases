import React from "react";
import classNames from "classnames";
import { objectKeys } from "pages/workspace/sales/helpers";
import { TableItem, CustomRenderers, TableColumn, CustomHeaderRenderers } from "../types";
import { StyledTable, StyledTableHeader, StyledTableBody, StyledTableColumn } from "./styles";
import { StyledTableHeaderCell, StyledTableCell } from "../TableCell/styles";
import {
    INITIAL_HOVERED_ROW_INDEX,
    HOVERED_ROW_CLASSNAME,
    CAN_BE_HOVERED_ROW_CLASSNAME,
} from "../constants";

type TableProps<T extends TableItem> = {
    data: ReadonlyArray<T>;
    columns?: TableColumn<T>;
    customRenderers?: CustomRenderers<T>;
    customHeaderRenderers?: CustomHeaderRenderers<TableColumn<T>>;
    reactsToMouseEnter?: boolean;
};

const Table = <T extends TableItem>(props: TableProps<T>) => {
    const {
        data,
        columns,
        customRenderers,
        customHeaderRenderers,
        reactsToMouseEnter = false,
    } = props;
    const [hoveredRowIndex, setHoveredRowIndex] = React.useState(INITIAL_HOVERED_ROW_INDEX);
    const columnKeys = objectKeys(columns);

    function resetHoveredRowIndex() {
        setHoveredRowIndex(INITIAL_HOVERED_ROW_INDEX);
    }

    function getMouseEnterLeaveHandlers(index: number) {
        if (reactsToMouseEnter) {
            return {
                onMouseLeave: resetHoveredRowIndex,
                onMouseEnter: () => setHoveredRowIndex(index),
            };
        }

        return {};
    }

    function renderCell(key: keyof T, entry: T, index: number) {
        const isHovered = hoveredRowIndex === index;
        const customRenderer = customRenderers?.[key];
        const cellContent = customRenderer
            ? customRenderer(entry[key], index, isHovered)
            : entry[key];

        return (
            <StyledTableCell
                key={`col-${key}-row-${index}`}
                className={classNames({
                    [CAN_BE_HOVERED_ROW_CLASSNAME]: reactsToMouseEnter,
                    [HOVERED_ROW_CLASSNAME]: isHovered,
                })}
                {...getMouseEnterLeaveHandlers(index)}
            >
                {cellContent}
            </StyledTableCell>
        );
    }

    function renderHeaderCell(key: keyof TableColumn<T>) {
        const customRenderer = customHeaderRenderers?.[key];

        if (customRenderer) {
            return customRenderer();
        }

        return <StyledTableHeaderCell>{columns[key].text}</StyledTableHeaderCell>;
    }

    return (
        <StyledTable>
            <StyledTableHeader>
                {columnKeys.map((key, i, array) => (
                    <StyledTableColumn
                        key={`head-${i}`}
                        length={array.length}
                        size={columns[key].size}
                        align={columns[key].align}
                    >
                        {renderHeaderCell(key)}
                    </StyledTableColumn>
                ))}
            </StyledTableHeader>
            <StyledTableBody>
                {columnKeys.map((key, i, array) => (
                    <StyledTableColumn
                        key={`col-${key}`}
                        length={array.length}
                        size={columns[key].size}
                        align={columns[key].align}
                    >
                        {data.map((entry, index) => renderCell(key, entry, index))}
                    </StyledTableColumn>
                ))}
            </StyledTableBody>
        </StyledTable>
    );
};

export default Table;
