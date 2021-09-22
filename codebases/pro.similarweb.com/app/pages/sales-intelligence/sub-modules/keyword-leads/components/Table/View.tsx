import React from "react";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TablePropsType } from "../../types";
import { StyledResultsTable } from "./styles";

export const View = ({
    data,
    isFetching,
    columns,
    onColumnSort,
    showCheckBoxColumn,
    maxSelectedRows,
    handleClickOutOfMaxSelected,
}: TablePropsType) => (
    <>
        <StyledResultsTable showCheckBox={showCheckBoxColumn}>
            <SWReactTableOptimizedWithSelection
                cleanOnUnMount
                tableData={data}
                onSort={onColumnSort}
                tableColumns={columns}
                isLoading={isFetching}
                tableSelectionKey="Metric"
                tableSelectionProperty="Domain"
                recordsField="Data"
                totalRecordsField="TotalCount"
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
                maxSelectedRows={maxSelectedRows}
            />
        </StyledResultsTable>
    </>
);
