import ColorStack from "components/colorsStack/ColorStack";
import { CHART_COLORS } from "constants/ChartColors";
import { useRef } from "react";

export const useTableColors = () => {
    const colorStack = useRef(new ColorStack(CHART_COLORS.chartMainColors));

    const initializeTableRowsWithColor = (tableRows: any[], initialSelectedRowsCount: number) => {
        colorStack.current.reset();

        const rowsCountToSelect = initialSelectedRowsCount || tableRows.length;
        return tableRows.slice(0, rowsCountToSelect).map((row) => {
            return {
                ...row,
                selectionColor: colorStack.current.acquire(),
            };
        });
    };

    const handleRowSelectionWithColor = (row: any) => {
        if (row.selected) {
            colorStack.current.release(row.selectionColor);
            return row;
        }
        return {
            ...row,
            selectionColor: row.selectionColor || colorStack.current.acquire(),
        };
    };

    return { initializeTableRowsWithColor, handleRowSelectionWithColor };
};
