import React from "react";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TrafficTableData } from "../../types";
import { FlexTableSortedColumnType } from "pages/sales-intelligence/types";
import { StyledResultsTable } from "pages/sales-intelligence/sub-modules/competitor-customers/components/CompetitorsCustomersTable/styles";

type CompetitorsCustomersTableProps = {
    data: TrafficTableData;
    columns: object[];
    dataFetching: boolean;
    onColumnSort(sortedColumn: FlexTableSortedColumnType): void;
    showCheckBoxColumn: boolean;
    maxSelectedRows: number;
    handleClickOutOfMaxSelected(): void;
};

const CompetitorsCustomersTable = (props: CompetitorsCustomersTableProps) => {
    const {
        data,
        dataFetching,
        columns,
        onColumnSort,
        showCheckBoxColumn,
        maxSelectedRows,
        handleClickOutOfMaxSelected,
    } = props;

    return (
        <StyledResultsTable showCheckBox={showCheckBoxColumn}>
            <SWReactTableOptimizedWithSelection
                cleanOnUnMount
                tableData={data}
                onSort={onColumnSort}
                tableColumns={columns}
                isLoading={dataFetching}
                tableSelectionKey="Metric"
                tableSelectionProperty="Domain"
                recordsField="Records"
                totalRecordsField="TotalCount"
                maxSelectedRows={maxSelectedRows}
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
            />
        </StyledResultsTable>
    );
};

export default CompetitorsCustomersTable;
