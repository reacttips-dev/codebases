/**
 * Created by Sahar.Rehani on 1/19/2017.
 */

import * as classNames from "classnames";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Component } from "react";
import { allTrackers } from "services/track/track";
import {
    decorateColumn,
    getTableMetadata,
    setColumnWidth,
    toggleDirection,
} from "../../SWReactTableUtils";
import { TableNoData } from "../Big/FlexTableStatelessComponents";
import {
    MiniFlexTableCell,
    MiniFlexTableColumn,
    MiniFlexTableHeaderCell,
} from "./MiniFlexTableStatelessComponents";

@SWReactRootComponent
export class MiniFlexTable extends Component<any, any> {
    public static propTypes = {
        tableData: PropTypes.object.isRequired,
        tableColumns: PropTypes.array.isRequired,
        tableOptions: PropTypes.object.isRequired,
        tablePayload: PropTypes.object,
    };

    public static getDerivedStateFromProps(props, state) {
        const dataDiff = _(state.tableData)
            .differenceWith(props.tableData.Records, _.isEqual)
            .isEmpty();
        const columnDiff = _(state.tableColumns)
            .differenceWith(props.tableColumns, _.isEqual)
            .isEmpty();

        const newState = {};
        if (dataDiff) {
            newState["tableData"] = props.tableData.Records;
        }

        if (columnDiff) {
            newState["tableColumns"] = props.tableColumns;
        }

        return Object.keys(newState).length > 0 ? newState : null;
    }

    private tableEl: any;
    private tableMetadata: any;

    constructor(props, context) {
        super(props, context);
        this.state = {
            tableData: this.props.tableData.Records,
            tableColumns: this.props.tableColumns,
        };
    }

    // *******************
    //  Lifecycle events
    // *******************

    public render() {
        if (!this.state.tableData.length) {
            return <TableNoData messageTitle={i18nFilter()("global.nodata.notavilable")} />;
        }

        const opt = this.props.tableOptions;
        const classes = classNames("swTable", opt.tableType, opt.customTableClass, {
            "swTable--no-borders": opt.hideBorders,
            "swTable--no-rows-borders": opt.hideRowsBorders,
            "swTable-selection-disabled": opt.disableSelection,
            "swTable--gaVerified": this.props.tableData.isGAVerified,
        });
        const totalCount = this.props.tableData
            ? this.props.tableData.TotalCount || this.props.tableData.TotalUnGroupedCount
            : 0;
        this.tableMetadata = getTableMetadata(this.props.tableData, false, totalCount);
        const columns = this.getColumns();

        return (
            <div className={classes}>
                <div
                    className="swReactTable-container"
                    ref={(el) => {
                        this.tableEl = el;
                    }}
                >
                    {columns}
                </div>
            </div>
        );
    }

    // ****************
    //  Class methods
    // ****************

    private getColumns() {
        return this.state.tableColumns.map((col, colIndex) => {
            const items =
                this.props.tablePayload && this.props.tablePayload.items
                    ? this.props.tablePayload.items
                    : undefined;
            let style;
            col = decorateColumn(col, this.props.tableOptions, null, null);
            style = setColumnWidth(false, col);

            const columnHeader = (
                <MiniFlexTableHeaderCell
                    tableData={this.state.tableData}
                    key={"h" + colIndex}
                    index={colIndex}
                    columnConfig={col}
                    onColumnReformat={this.reformatColumn}
                    onSort={this.sortColumn}
                    tableMetadata={this.tableMetadata}
                />
            );
            const columnCells = [columnHeader].concat(
                this.state.tableData.map((row, rowIndex) => {
                    return (
                        <MiniFlexTableCell
                            key={rowIndex}
                            columnConfig={col}
                            row={row}
                            rowIndex={rowIndex}
                            tableOptions={this.props.tableOptions}
                            tableMetadata={this.tableMetadata}
                            items={items}
                        />
                    );
                }),
            );

            return (
                <MiniFlexTableColumn
                    key={colIndex}
                    columnConfig={col}
                    columnCells={columnCells}
                    style={style}
                />
            );
        });
    }

    private reformatColumn = (column, item) => {
        if (item.format === column.format) {
            return;
        }
        allTrackers.trackEvent(
            "Measure Button",
            "click",
            `Table/${column.trackingName ? column.trackingName : ""}/${
                item.trackingValue ? item.trackingValue : ""
            }`,
        );
        this.setState({
            tableColumns: this.state.tableColumns.map((col) => {
                if (col.field === column.field) {
                    col.field = item.field;
                    col.format = item.format;
                }
                return col;
            }),
        });
    };

    private sortColumn = (column) => {
        if (!column.sortable) {
            return;
        }
        const sortDirection = column.isSorted ? toggleDirection(column) : column.sortDirection;
        this.setState({
            tableColumns: this.state.tableColumns.map((col: any) => {
                return {
                    ...col,
                    isSorted: col.field === column.field,
                    sortDirection,
                };
            }),
            tableData: _.orderBy(this.state.tableData, `${column.field}.Value`, sortDirection),
        });
        allTrackers.trackEvent(
            "Sort",
            "click",
            "Table/" + (column.trackingName || column.displayName) + "/" + column.sortDirection,
        );
    };
}
