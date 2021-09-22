import React, { createRef, createContext, PureComponent, FunctionComponent, Ref } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { tableActionsCreator } from "../../../actions/tableActions";
import { SWReactTable } from "./SWReactTable";
import { SWReactTableOptimized } from "./SWReactTableOptimized";
import SWReactTableWrapper, { ISWReactTableWrapperProps } from "./SWReactTableWrapper";
import { RootState, ThunkDispatchCommon } from "store/types";

interface ISWReactTableWrapperSelectionContext {
    selectedRows: any[];
    onRowSelection: (row) => void;
    onSelectAllRows: (rows) => void;
    clearAllSelectedRows: () => void;
    isRowSelected: (row) => boolean;
    allRowsSelected: boolean;
    selectRows: (rows) => void;
    getStoreRow: (row) => any;
    changePageCallback?: (page: number) => void;
    totalRecord?: number;
    textFilter?: string;
}

const defaultValue = {
    selectedRows: [],
    onRowSelection: (row) => null,
    onSelectAllRows: (rows) => null,
    clearAllSelectedRows: () => null,
    isRowSelected: (row) => false,
    allRowsSelected: false,
    selectRows: (rows) => null,
    getStoreRow: (row) => null,
};

export const SWReactTableWrapperContext = createContext<ISWReactTableWrapperSelectionContext>(
    defaultValue,
);
export const SWReactTableWrapperContextProvider = SWReactTableWrapperContext.Provider;
export const SWReactTableWrapperContextConsumer = SWReactTableWrapperContext.Consumer;

interface IWithSelectionProps {
    tableSelectionKey: string;
    tableSelectionProperty: string;
    initialSelectedRows?: any[];
    onBeforeRowSelectionToggle?: (row) => any;
    shouldSelectRow?: (row) => any;
    cleanOnUnMount?: boolean;
    deleteTableSelectionOnUnMount?: boolean;
    maxSelectedRows?: number;
    selectAllCount?: number;
    getDataCallback?: (data) => void;
    tableData?: any;
    tableRef?: Ref<any>;
    handleClickOutOfMaxSelected?: () => void;
}

interface IWithSelectionState {
    data: any;
    page: number;
}

const withSelection = (WrappedComponent) =>
    class WithSelection extends PureComponent<
        IWithSelectionProps & ISWReactTableWrapperSelectionContext,
        IWithSelectionState
    > {
        public static defaultProps = {
            onBeforeRowSelectionToggle: (row) => row,
            shouldSelectRow: () => true,
            cleanOnUnMount: true,
            deleteTableSelectionOnUnMount: false,
            maxSelectedRows: undefined,
            selectAllCount: undefined,
            getDataCallback: _.identity,
            tableRef: createRef(),
        };

        public static getDerivedStateFromProps(nextProps, prevState) {
            // to support different ways to store on backend side
            const dataRecords =
                _.get(nextProps, "tableData.Records", undefined) ||
                _.get(nextProps, "tableData.Data", undefined);
            if (dataRecords && dataRecords !== prevState.data.records) {
                return {
                    data: {
                        records: dataRecords,
                    },
                };
            }
            return null;
        }

        constructor(props) {
            super(props);
            const dataRecords =
                _.get(this.props, "tableData.Records", undefined) ||
                _.get(this.props, "tableData.Data", undefined);
            const records = dataRecords ? [dataRecords] : [];
            this.state = {
                data: { records },
                page: 0,
            };
        }

        public componentWillUnmount() {
            if (this.props.cleanOnUnMount) {
                this.props.clearAllSelectedRows();
            }
        }

        public componentDidMount() {
            this.props.initialSelectedRows && this.props.selectRows(this.props.initialSelectedRows);
        }

        private onGetData = (data) => {
            // support different data keys from backend
            const adoptedData =
                data && data.records
                    ? data
                    : {
                          ...data,
                          records: data.Data || data.Records,
                      };
            this.setState({
                data: {
                    ...adoptedData,
                },
            });
            this.props.getDataCallback(data);
        };

        private changePage = (page) => {
            this.setState({ page });
            if (this.props.changePageCallback) {
                this.props.changePageCallback(page);
            }
        };
        private onRowSelection = (row) => {
            const shouldSelect = this.props.shouldSelectRow(row);
            if (!shouldSelect) {
                return;
            }

            if (
                this.props.maxSelectedRows &&
                this.props.selectedRows.length >= this.props.maxSelectedRows &&
                !row.selected
            ) {
                this.props.handleClickOutOfMaxSelected && this.props.handleClickOutOfMaxSelected();
                return;
            }
            const modifiedRow = this.props.onBeforeRowSelectionToggle(row);
            this.props.onRowSelection(modifiedRow);
        };
        private getStoreRow = (row) => {
            const { selectedRows, tableSelectionProperty } = this.props;
            const matchedRow = _.find(selectedRows, {
                [tableSelectionProperty]: row[tableSelectionProperty],
            });
            return matchedRow;
        };
        private isRowSelected = (row) => {
            const { selectedRows, tableSelectionProperty } = this.props;
            const matchedRow = _.find(selectedRows, {
                [tableSelectionProperty]: row[tableSelectionProperty],
            });
            return !!matchedRow;
        };
        private allRowsSelected = () =>
            this.state &&
            this.state.data &&
            this.state.data.records &&
            this.state.data.records.length &&
            this.checkIfAllRowsSelected();
        private checkIfAllRowsSelected = () => {
            const selectableRecords = this.state.data.records.filter((row) =>
                this.props.shouldSelectRow(row),
            );
            if (this.props.selectAllCount) {
                const page = this.state.page || 0;
                return selectableRecords
                    .slice(page * this.props.selectAllCount, (page + 1) * this.props.selectAllCount)
                    .every(this.isRowSelected);
            } else {
                return selectableRecords.every(this.isRowSelected);
            }
        };
        private onSelectAllRows = () => {
            if (this.allRowsSelected()) {
                this.props.clearAllSelectedRows();
            } else {
                if (this.props.selectAllCount) {
                    const page = this.state.page || 0;
                    this.props.onSelectAllRows(
                        this.state.data.records
                            .slice(
                                page * this.props.selectAllCount,
                                (page + 1) * this.props.selectAllCount,
                            )
                            .filter((row) => this.props.shouldSelectRow(row)),
                    );
                } else {
                    this.props.onSelectAllRows(
                        this.state.data.records.filter((row) => this.props.shouldSelectRow(row)),
                    );
                }
            }
        };

        public render() {
            const {
                data: { TotalCount, freeTextFilter, filteredResultCount },
            } = this.state;

            const {
                selectedRows,
                clearAllSelectedRows,
                selectRows,
                tableRef,
                ...restProps
            } = this.props;

            const onRowSelection = this.onRowSelection;
            const contextValue = {
                selectedRows,
                onRowSelection,
                clearAllSelectedRows,
                isRowSelected: this.isRowSelected,
                allRowsSelected: this.allRowsSelected(),
                onSelectAllRows: this.onSelectAllRows,
                selectRows,
                getStoreRow: this.getStoreRow,
                totalRecord: TotalCount || filteredResultCount,
                textFilter: freeTextFilter,
            };
            return (
                <SWReactTableWrapperContextProvider value={contextValue}>
                    <WrappedComponent
                        ref={tableRef}
                        {...restProps}
                        getDataCallback={this.onGetData}
                        changePageCallback={this.changePage}
                    />
                </SWReactTableWrapperContextProvider>
            );
        }
    };

const emptyArray = [];

type OwnPropsType = {
    tableSelectionKey: string;
    tableSelectionProperty: string;
    deleteTableSelectionOnUnMount: boolean;
};

export const mapStateToProps = (state: RootState, ownProps: OwnPropsType) => {
    return {
        selectedRows: ownProps.tableSelectionKey
            ? state.tableSelection[ownProps.tableSelectionKey] || emptyArray
            : emptyArray,
    };
};

export const mapDispatchToProps = (dispatch: ThunkDispatchCommon, ownProps: OwnPropsType) => {
    if (ownProps.tableSelectionKey && ownProps.tableSelectionProperty) {
        const { toggleRows, clearAllSelectedRows, selectRows } = tableActionsCreator(
            ownProps.tableSelectionKey,
            ownProps.tableSelectionProperty,
        );
        return {
            onRowSelection: (row) => {
                dispatch(toggleRows([row]));
            },
            selectRows: (rows) => {
                dispatch(selectRows(rows));
            },
            onSelectAllRows: (rows) => {
                dispatch(selectRows(rows));
            },
            clearAllSelectedRows: () => {
                dispatch(clearAllSelectedRows(ownProps.deleteTableSelectionOnUnMount));
            },
        };
    }
    return {};
};

export const SWReactTableWrapperWithSelection: FunctionComponent<
    IWithSelectionProps & ISWReactTableWrapperProps
> = connect(mapStateToProps, mapDispatchToProps)(withSelection(SWReactTableWrapper));
SWReactTableWrapperWithSelection.displayName = "SWReactTableWrapperWithSelection";
export const SWReactTableWithSelection: FunctionComponent<
    IWithSelectionProps & ISWReactTableWrapperProps
> = connect(mapStateToProps, mapDispatchToProps)(withSelection(SWReactTable));
export const SWReactTableOptimizedWithSelection: FunctionComponent<
    IWithSelectionProps & any
> = connect(mapStateToProps, mapDispatchToProps)(withSelection(SWReactTableOptimized));
SWReactTableWithSelection.displayName = "SWReactTableWithSelection";
