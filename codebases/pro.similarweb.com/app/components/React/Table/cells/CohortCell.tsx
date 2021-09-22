import * as React from "react";
import { TABLE_COLORS } from "constants/TableColors";
import { percentageSignFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const CohortCell: React.StatelessComponent<ITableCellProps> = ({
    value,
    subField,
    tableMetadata,
}) => {
    const shades = TABLE_COLORS.cohort.single;
    const val = subField ? value[subField] : value;
    let text, backgroundColor, color;
    const minCellValue = (tableMetadata.minCellValue && tableMetadata.minCellValue[subField]) || 0;
    const maxCellValue = (tableMetadata.maxCellValue && tableMetadata.maxCellValue[subField]) || 1;

    if (val) {
        const shadeRange = (maxCellValue - minCellValue) / shades.length;
        const shadeIndex =
            val === maxCellValue
                ? shades.length - 1
                : Math.floor((val - minCellValue) / shadeRange);
        backgroundColor = shades[shadeIndex];
        color = shadeIndex < 2 ? shades[shades.length - 1] : undefined; // change text color for 2 most brightest cells
        text = percentageSignFilter()(val, "%");
    } else {
        backgroundColor = shades[0];
        color = shades[shades.length - 1];
        text = "-";
    }
    return (
        <div className="cohort-cell" style={{ backgroundColor, color }}>
            {text}
        </div>
    );
};
