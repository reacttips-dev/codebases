import { DefaultCellRightAlign } from "components/React/Table/cells";
import React from "react";

function getCpcValue(row) {
    if (!isNaN(row.MinCpc) && !isNaN(row.MaxCpc) && row.MinCpc !== row.MaxCpc) {
        return `${row.MinCpc}-${row.MaxCpc}`;
    }
    return row?.MaxCpc?.toString();
}
export function KeywordsGeoCpcCell(props) {
    const { row, tableOptions } = props;
    const value = getCpcValue(row) ? getCpcValue(row).toString() : null;
    if (tableOptions.isKeywordGroup) {
        return <DefaultCellRightAlign {...props} format={"CPCGroup"} value={value} />;
    }
    return <DefaultCellRightAlign {...props} value={value} />;
}
