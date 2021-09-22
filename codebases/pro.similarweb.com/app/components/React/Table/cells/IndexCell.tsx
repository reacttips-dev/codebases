import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const PAGE_SIZE_FALLBACK = 100;

export function getIndex(index, page, pageSize) {
    return page > 1 ? page * pageSize - pageSize + (index + 1) : index + 1;
}

export const IndexCell: StatelessComponent<ITableCellProps> = ({ row, tableMetadata }) => {
    const pageSize = tableMetadata.pageSize || PAGE_SIZE_FALLBACK;
    const isChild = row.parent;
    const index = isChild ? "" : getIndex(row.index, tableMetadata.page, pageSize);

    return <div className="u-alignCenter">{index}</div>;
};
IndexCell.displayName = "IndexCell";
