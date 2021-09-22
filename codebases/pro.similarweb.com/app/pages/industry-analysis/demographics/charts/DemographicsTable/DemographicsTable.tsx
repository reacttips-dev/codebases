import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import React, { FunctionComponent, useCallback, useState } from "react";
import { connect } from "react-redux";

import { tableActionsCreator } from "../../../../../actions/tableActions";
import { showSuccessToast } from "../../../../../actions/toast_actions";
import { getToastItemComponent } from "../../../../../components/React/Toast/ToastItem";
import { allTrackers } from "../../../../../services/track/track";
import { getTableColumns, getTableOptions } from "./demographicsTableConfig";
import { buildTableData } from "./DemographicsTableDataHandler";
import { TableContainer } from "./DemographicsTableStyles";
import { IDemographicsTableProps, ITableColumnSelection } from "./DemographicsTableTypes";
import { DemographicsTableTop } from "./DemographicsTableTop";

const DEFAULT_SORT: ITableColumnSelection = {
    field: "Share",
    sortDirection: "desc",
};

const DemographicsTable: FunctionComponent<IDemographicsTableProps> = (props) => {
    const {
        isLoading,
        tableRecords,
        showToast,
        clearAllSelectedRows,
        selectedRows,
        queryParams,
    } = props;

    const [domainFilter, setDomainFilter] = useState<string>(null);
    const [sortedColumn, setSortedColumn] = useState<ITableColumnSelection>(DEFAULT_SORT);

    /**
     * Sets a new sorted column. this will trigger re-ordering all table columns, and mark the
     * currently selected column and its direction on the table
     */
    const handleSort = useCallback(
        (column: { field: string; sortDirection: "asc" | "desc" }) => {
            setSortedColumn({ ...column });
        },
        [setSortedColumn],
    );

    const tableColumns = getTableColumns(sortedColumn);
    const tableOptions = getTableOptions(showToast, clearAllSelectedRows, selectedRows);

    const tableData = buildTableData(tableRecords, sortedColumn, domainFilter);

    return (
        <TableContainer isLoading={isLoading}>
            <DemographicsTableTop
                clearAllSelectedRows={clearAllSelectedRows}
                setDomainFilter={setDomainFilter}
                domainFilter={domainFilter}
                queryParams={queryParams}
                sortedColumn={sortedColumn}
            />
            <SWReactTableOptimizedWithSelection
                tableSelectionKey="IndustryDemographicsTable"
                tableSelectionProperty="Domain"
                isLoading={isLoading}
                tableData={tableData}
                tableOptions={tableOptions}
                tableColumns={tableColumns}
                onSort={handleSort}
            />
        </TableContainer>
    );
};

const mapStateToProps = ({ tableSelection: { IndustryDemographicsTable } }) => {
    return {
        selectedRows: IndustryDemographicsTable,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("IndustryDemographicsTable", "Domain").clearAllSelectedRows(),
            );
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            allTrackers.trackEvent(
                                "add to Custom Category",
                                "click",
                                "internal link/websites.overview",
                            ),
                    }),
                ),
            );
        },
    };
};

const connectedIndustryDemographicsTable = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
)(DemographicsTable);
export default connectedIndustryDemographicsTable;
