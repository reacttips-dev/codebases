import React from "react";
import dayjs from "dayjs";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const CohortDateCell: React.StatelessComponent<ITableCellProps> = ({ value, rowIndex }) => {
    const text =
        rowIndex === 0
            ? i18nFilter()("appanalysis.engagement.retention.table.appave")
            : dayjs(value).format("MMM, YYYY");
    return <div className="cohort-date-cell">{text}</div>;
};
