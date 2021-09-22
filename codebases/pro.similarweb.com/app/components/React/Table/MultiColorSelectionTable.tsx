import ColorStack from "components/colorsStack/ColorStack";
import React, { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { tableActionsCreator } from "../../../actions/tableActions";
import { CHART_COLORS } from "../../../constants/ChartColors";
import { SWReactTable } from "./SWReactTable";
import { SWReactTableWithSelection } from "./SWReactTableWrapperSelectionContext";

export interface IMultiColorSelectionTableProps {
    selectedRows?: any[];
    resetSelectedRows?: (tableSelectionKey: string) => void;
    tableData: any;
    isLoading?: boolean;
    tableSelectionKey: string;
    tableSelectionProperty: string;
    tableProps: any;
    params?: any;
}
const chartMainColors = new ColorStack(CHART_COLORS.chartMainColors);

const MultiColorSelectionTable: FunctionComponent<IMultiColorSelectionTableProps> = (props) => {
    const MAX_SELECTED_ROWS = 7;
    const [userToggledRow, setUserToggledRow] = useState(false);
    useEffect(() => {
        props.resetSelectedRows(props.tableSelectionKey);
        chartMainColors.reset();
    }, [props.params]);

    const onBeforeRowSelectionToggle = (row) => {
        setUserToggledRow(true);
        if (row.selected) {
            chartMainColors.release(row.selectionColor);
            return row;
        }
        return {
            ...row,
            selectionColor: row.selectionColor ? row.selectionColor : chartMainColors.acquire(),
        };
    };

    const { isLoading, tableProps, selectedRows, tableData } = props;
    let initialSelectedRows = [];
    if (!isLoading && tableData) {
        initialSelectedRows =
            selectedRows && (selectedRows.length > 0 || userToggledRow)
                ? selectedRows
                : tableData.filter((dataItem, index) => {
                      // set color for this row if it still doesn't have one
                      if (!dataItem.selectionColor) {
                          dataItem.selectionColor = chartMainColors.acquire();
                      }
                      return index < MAX_SELECTED_ROWS;
                  });
    }

    return (
        <>
            {isLoading ? (
                <SWReactTable {...tableProps} />
            ) : (
                <SWReactTableWithSelection
                    tableSelectionKey={props.tableSelectionKey}
                    tableSelectionProperty={props.tableSelectionProperty}
                    initialSelectedRows={initialSelectedRows}
                    maxSelectedRows={MAX_SELECTED_ROWS}
                    onBeforeRowSelectionToggle={onBeforeRowSelectionToggle}
                    {...tableProps}
                />
            )}
        </>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        resetSelectedRows: (tableSelectionKey: string) => {
            dispatch(tableActionsCreator(tableSelectionKey, null).clearAllSelectedRows());
        },
    };
}

function mapStateToProps({ routing: { params } }) {
    return {
        params,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MultiColorSelectionTable);
