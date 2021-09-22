import angular from "angular";
import * as classNames from "classnames";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";

import swLog from "@similarweb/sw-log";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import noop from "lodash/noop";
import { Component } from "react";
import { allTrackers } from "services/track/track";
import UIComponentStateService from "services/UIComponentStateService";
import { FlexTable } from "./FlexTable/Big/FlexTable";
import { TableLoader, TableNoData } from "./FlexTable/Big/FlexTableStatelessComponents";
import { TABLE_CONFIG } from "./SWReactTableDefaults";
import {
    decorateColumn,
    getTableMetadata,
    paddingRightCell,
    toggleDirection,
} from "./SWReactTableUtils";

export const defaultGetStableKey = (index, col) => `${col.field}_${index}`;

export interface SWReactTableProps {
    allRowsSelected?: boolean;
    className?: string;
    getStableKey?: (...args: any[]) => any;
    isLoading?: boolean;
    loaderRowsNumber?: number;
    onItemClick?: (...args: any[]) => any;
    onItemToggleSelection?: (...args: any[]) => any;
    onSelectAllRows?: (...args: any[]) => any;
    onSort?: (...args: any[]) => any;
    setSortedColumn?: (...args: any[]) => any;
    tableColumns: any[];
    tableData?: Record<string, any>;
    tableHeight?: number;
    tableOptions?: Record<string, any>;
    type?: string;
}

@SWReactRootComponent
export class SWReactTable extends Component<SWReactTableProps, any> {
    public static propTypes = {
        allRowsSelected: PropTypes.bool,
        getStableKey: PropTypes.func,
        loaderRowsNumber: PropTypes.number,
        onItemClick: PropTypes.func,
        onItemToggleSelection: PropTypes.func,
        onSelectAllRows: PropTypes.func,
        onSort: PropTypes.func,
        setSortedColumn: PropTypes.func,
        tableColumns: PropTypes.array.isRequired,
        tableData: PropTypes.object,
        tableHeight: PropTypes.number,
        tableOptions: PropTypes.object,
        type: PropTypes.string,
    };

    public static defaultProps = {
        allRowsSelected: false,
        getStableKey: defaultGetStableKey,
        loaderRowsNumber: 12, // backward comptability number
        onItemClick: () => noop,
        onItemToggleSelection: () => noop,
        onSelectAllRows: () => null,
        onSort: () => noop,
        tableHeight: null,
        tableOptions: {},
        type: "sticky",
    };

    public uiComponentState: any;
    public columnsWidthKey: string | boolean;
    public columnsTogglesKey: string | boolean;
    public displayedData: any;
    public displayedColumns: any;
    public tableHasChilds: boolean;
    public isBigTable: any;
    public get totalCount(): number {
        return this.props.tableData.TotalCount || this.props.tableData.TotalUnGroupedCount;
    }
    private get tableData(): any {
        if (this.state.sortedData) {
            return this.state.sortedData;
        }
        return this.props.tableData && (this.props.tableData.Records || this.props.tableData.Data);
    }

    constructor(props, context) {
        super(props, context);
        const { tableOptions } = this.props;
        this.uiComponentState = UIComponentStateService;
        this.tableHasChilds = false;
        this.state = {
            visibleParents: {},
        };
        this.columnsTogglesKey = tableOptions.metric
            ? `${tableOptions.metric}_Table_columnsToggles`
            : false;

        if (!this.columnsTogglesKey) {
            swLog.warn(
                "Column toggles and resizing are DISABLED, must supply `metric` field on tableOptions",
            );
        }
    }

    public shouldComponentUpdate(nextProps, nextState) {
        // some classes (like SWReactTableOptimized) overrides this function
        return true;
    }

    public getSavedResizedColumnWidth() {
        return {
            ...this.state.tableColumnsWidths,
            ...(this.uiComponentState.getItem(this.columnsWidthKey, "sessionStorage") || {}),
        };
    }

    public saveResizedColumnWidth(column, width) {
        const widths = this.uiComponentState.getItem(this.columnsWidthKey, "sessionStorage") || {};
        widths[column.field] = width;
        this.uiComponentState.setItem(this.columnsWidthKey, "sessionStorage", widths);
    }

    public getSavedColumnsToggles() {
        const toggles = this.uiComponentState.getItem(this.columnsTogglesKey, "localStorage");
        if (toggles) {
            return this.props.tableColumns.map((column) => ({
                ...column,
                visible: toggles.hasOwnProperty(column.field)
                    ? !!toggles[column.field]
                    : column.visible,
            }));
        }
        return this.props.tableColumns;
    }

    public getDisplayedColumns() {
        const widths = this.getSavedResizedColumnWidth(); // get columns widths from sessionStorage
        let toggles;
        if (this.columnsTogglesKey) {
            toggles = this.getSavedColumnsToggles();
        } else {
            toggles = this.props.tableColumns;
        }

        if (this.props.tableOptions.addPaddingRightCell) {
            toggles = [...toggles, { ...paddingRightCell }];
        }

        return toggles
            .filter((col) => col.visible)
            .map((column, idx, arr) => {
                const isLast = idx === arr.length - 1;
                // validate column props
                if (column.fixed && !column.width) {
                    swLog.error(
                        `FlexTable: fixed column '${
                            column.name || column.field
                        }' requires a 'width' property`,
                    );
                }
                const { overrideSortedColumn, overrideSortedDirection } = this.state;
                if (overrideSortedColumn === column.field) {
                    column.isSorted = true;
                    column.sortDirection = overrideSortedDirection;
                }
                return decorateColumn(column, this.props.tableOptions, widths, isLast);
            });
    }

    public onColumnResize = (column, width) => {
        if (this.columnsWidthKey) {
            this.saveResizedColumnWidth(column, width); // save columns widths on sessionStorage
            this.forceUpdate(); // re-render component to draw new column width (from sessionStorage)
        } else {
            this.setState({
                tableColumnsWidths: {
                    ...this.state.tableColumnsWidths,
                    [column.field]: width,
                },
            });
        }
        allTrackers.trackEvent("Column resize", "click", column.field);
    };

    public toggleChildRows = (row, value) => {
        const newVisibleParents = _.clone(this.state.visibleParents);
        if (row.index in newVisibleParents && newVisibleParents[row.index].expanded) {
            // collapse
            newVisibleParents[row.index].expanded = false;
        } else {
            // expand
            newVisibleParents[row.index] = {
                childsCount: row.childsToShow || TABLE_CONFIG.CHILDS_BUNCH,
                expanded: true,
            };
        }
        const directionString =
            newVisibleParents[row.index].expanded === true ? "Expand" : "Collapse";
        allTrackers.trackEvent("Expand Collapse", "click", `Table/${directionString}/${value}`);
        this.setState({
            visibleParents: newVisibleParents,
        });
    };

    public showMoreChildRows = (row, value) => {
        const newVisibleParents = _.clone(this.state.visibleParents);
        let childsToShow =
            newVisibleParents[row.parent.index].childsCount + TABLE_CONFIG.CHILDS_BUNCH;
        childsToShow =
            row.parent.childsCount < childsToShow ? row.parent.childsCount : childsToShow;
        newVisibleParents[row.parent.index].childsCount = childsToShow;
        allTrackers.trackEvent("Show More", "click", `Table/${value}`);
        this.setState({
            visibleParents: newVisibleParents,
        });
    };

    public getDisplayedList() {
        const { visibleParents } = this.state;
        const { tableData } = this;
        return tableData.reduce((targetList, parent, parentIndex) => {
            parent.index = Number(parentIndex);
            parent.childsToShow = visibleParents[parentIndex]
                ? visibleParents[parentIndex].childsCount
                : 0;
            const childs = parent.Children
                ? parent.Children.map((item, childIndex) => {
                      this.tableHasChilds = true;
                      const obj = {
                          index: childIndex,
                          isLast: childIndex + 1 === parent.childsToShow,
                          parent: {
                              index: Number(parentIndex),
                              childsCount: parent.Children.length,
                          },
                      };
                      return Object.assign(item, obj);
                  })
                : [];
            const isExpanded = visibleParents[parentIndex] && visibleParents[parentIndex].expanded;
            return [
                ...targetList,
                parent,
                ...childs.slice(0, isExpanded ? parent.childsToShow : 0),
            ];
        }, []);
    }

    public onSort = (column) => {
        if (!column.sortable) {
            return;
        }
        const { onSort, tableOptions } = this.props;
        const sortDirection = column.isSorted
            ? toggleDirection(column)
            : column.sortDirection.toLowerCase();

        if (_.isFunction(tableOptions.onSort)) {
            this.clientSort(column, sortDirection, tableOptions.onSort); // custom client sort
        } else if (!this.isBigTable || tableOptions.doClientSort) {
            this.clientSort(column, sortDirection); // default client sort
        } else {
            onSort({ field: column.field, sortDirection }, true, column); // server sort
        }
        allTrackers.trackEvent(
            "Sort",
            "click",
            "Table/" + (column.trackingName || column.displayName) + "/" + sortDirection,
        );
    };

    public clientSort = (column, sortDirection, sortFunc?: any) => {
        const { tableData } = this;
        this.setState({
            overrideSortedColumn: column.field,
            overrideSortedDirection: sortDirection,
            sortedData: sortFunc
                ? sortFunc(column, sortDirection, tableData)
                : _.orderBy(tableData, column.field, sortDirection),
        });
    };

    public render() {
        const {
            isLoading,
            tableOptions,
            loaderRowsNumber,
            type,
            tableHeight,
            tableData,
            className,
            onItemToggleSelection,
            onSelectAllRows,
            allRowsSelected,
            onItemClick,
            getStableKey,
        } = this.props;

        if (isLoading) {
            return <TableLoader rowNum={loaderRowsNumber} />;
        }

        if (!this.tableData || !this.tableData.length) {
            if (tableOptions.noDataComponent) {
                return tableOptions.noDataComponent;
            } else {
                return (
                    <TableNoData
                        messageTitle={
                            tableOptions.noDataTitle || i18nFilter()("global.nodata.notavilable")
                        }
                        messageSubtitle={tableOptions.noDataSubtitle || ""}
                    />
                );
            }
        }

        const classes = classNames(
            "swTable",
            `table-type-${type}`,
            tableOptions.tableType,
            tableOptions.customTableClass,
            {
                "swTable--no-borders": tableOptions.hideBorders,
                "swTable--no-rows-borders": tableOptions.hideRowsBorders,
                "swTable--big-table": this.isBigTable,
                "swTable-selection-disabled": tableOptions.disableSelection,
            },
        );

        this.columnsWidthKey = tableOptions.metric
            ? `${tableOptions.metric}_Table_columnsWidth`
            : false;
        this.columnsTogglesKey = tableOptions.metric
            ? `${tableOptions.metric}_Table_columnsToggles`
            : false;
        this.isBigTable = tableOptions.tableType !== TABLE_CONFIG.simpleTableType;
        this.displayedData = this.getDisplayedList();
        this.displayedColumns = this.getDisplayedColumns();
        const tableMetadata = getTableMetadata(tableData, this.tableHasChilds, this.totalCount);
        return (
            <div className={classes}>
                <FlexTable
                    type={type}
                    tableHeight={tableHeight}
                    tableData={this.displayedData}
                    tableColumns={this.displayedColumns}
                    tableOptions={tableOptions}
                    tableMetadata={tableMetadata}
                    visibleParents={this.state.visibleParents}
                    toggleChildRows={this.toggleChildRows}
                    showMoreChildRows={this.showMoreChildRows}
                    className={className}
                    onSort={this.onSort}
                    onColumnResize={this.onColumnResize}
                    onItemToggleSelection={onItemToggleSelection}
                    onSelectAllRows={onSelectAllRows}
                    allRowsSelected={allRowsSelected}
                    onItemClick={onItemClick}
                    getStableKey={getStableKey}
                />
            </div>
        );
    }
}
