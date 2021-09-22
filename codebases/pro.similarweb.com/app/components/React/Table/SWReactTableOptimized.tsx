import * as React from "react";
import { SWReactTable } from "./SWReactTable";

export class SWReactTableOptimized extends SWReactTable {
    public componentDidUpdate(prevProps) {
        if (!this.props.isLoading) {
            if (prevProps.tableData !== this.props.tableData) {
                this.setState({
                    tableData:
                        this.props.tableData &&
                        (this.props.tableData.Records || this.props.tableData.Data),
                    tableColumns: this.props.tableColumns,
                });
            } else if (prevProps.tableColumns !== this.props.tableColumns) {
                this.setState({
                    tableColumns: this.props.tableColumns,
                });
            }
        }
    }

    public shouldComponentUpdate(nextProps, nextState) {
        const { tableData, tableColumns, isLoading } = this.props;
        const { visibleParents, tableColumnsWidths } = this.state;

        // avoid unnecessary renders
        if (
            nextProps.isLoading ||
            tableData !== nextProps.tableData ||
            this.state.tableData !== nextState.tableData ||
            visibleParents !== nextState.visibleParents ||
            tableColumnsWidths !== nextState.tableColumnsWidths
        ) {
            return true;
        }

        // check if # of visible columns has changed
        let hasColumnSorted = false;
        const haveColumnsChanged =
            tableColumns.length !== nextProps.tableColumns ||
            tableColumns.some(
                ({ visible, field }, idx) =>
                    visible !== nextProps.tableColumns[idx]?.visible ||
                    field !== nextProps.tableColumns[idx]?.field,
            );

        if (!haveColumnsChanged) {
            // check if user clicked on sort
            const oldSortedColumn = tableColumns.filter((item) => item.isSorted)[0] || {};
            const newSortedColumn = nextProps.tableColumns.filter((item) => item.isSorted)[0] || {};

            hasColumnSorted =
                oldSortedColumn.field !== newSortedColumn.field ||
                oldSortedColumn.sortDirection !== newSortedColumn.sortDirection;
        }
        const hasLoadingChanged = nextProps.isLoading !== isLoading;

        return haveColumnsChanged || hasColumnSorted || hasLoadingChanged;
    }
}
