import React from "react";
import * as PropTypes from "prop-types";
import { colorsPalettes, rgba } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import { Pagination, PaginationInput } from "@similarweb/ui-components/dist/pagination";
import { Injector } from "common/ioc/Injector";
import * as _ from "lodash";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { LongLoaderAfterFewSeconds } from "UtilitiesAndConstants/UtilitiesComponents/LongLoaderAfterFewSeconds";
import { TableLoader, TableNoData } from "./FlexTable/Big/FlexTableStatelessComponents";
import { SWReactTableOptimized } from "./SWReactTableOptimized";
import { i18nFilter } from "filters/ngFilters";
import { LoaderListBulletsWrapper } from "components/Loaders/src/LoaderListItems";
import styled from "styled-components";

// eslint:disable-next-line
const tableBig = require("../../widget-loader/table-big.svg");

export interface ISWReactTableWrapperProps {
    getDataCallback?: (data: any) => void;
    recordsField?: string;
    totalRecordsField?: string;
    onDataError?: (...args: any[]) => any;
    noDataTitle?: string;
    noDataSubtitle?: string;
    changePageCallback?: (page: number) => void;

    serverApi: string;
    tableColumns: any[];
    initialFilters?: any;
    tableType?: string;
    tableHeight?: number;
    tableOptions?: any;
    rowsPerPage?: number;
    pageIndent?: number;
    paginationProps?: {
        captionPosition?: string;
        hasItemsPerPageSelect?: boolean;
        itemsPerPageOptions?: number[];
        hasJumpButton?: boolean;
        itemsPerPageLabel?: string;
        showPagination?: boolean;
    };
    fetchServerPages?: number;
    children?: any;
    onPageChange?: (...args: any[]) => void;
    onSort?: (...args: any[]) => void;
    onFilterChange?: (...args: any[]) => void;
    dataParamsAdapter?: (params: object) => object;
    allowClientSort?: boolean;
    // transformData will be called in the getData lifecycle, before saving the data to the state.
    transformData?: (data: any) => any;
    //  enrichData will be called before the render. It should be used in order to add external data to the rows
    enrichData?: (data: any) => any;
    requestBody?: unknown;
    // the table sends tracking of the total results returned from the backend. In the future the field
    // that holds that value could have a different name then the current names. Therefore, we
    // give the option to pass in a name prop to support that field.
    totalCountProperty?: string;
    preventCountTracking?: boolean;
}

export interface TableTopComponentProps {
    onFilterChange: (params, updateUrlOnChange) => void;
    onClickToggleColumns: (index: any) => void;
    filtersStateObject: any;
    page: number;
    tableColumns: any[];
    tableOptions: any;
    sort: string;
    asc: boolean;
    isLoadingData: boolean;
}

interface ISWReactTableWrapperState {
    page: number;
    sort: string;
    asc: boolean;
    filters: any;
    totalRecords: number;
    totalPages: number;
    tableRecords: any[];
    pageDataChunks: any[];
    currentChunksStartPage: number;
    tableColumns: any[];
    dataState: number;
    tableMeta?: any;
    tableItemsCount: number | "Error";
    didTrackItemsCount: boolean;
}

export const SWReactTableWrapperBox = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
`;

export const SWReactTableWrapperFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    span {
        font-size: 12px !important;
    }
`;

export const GhostLoader = () => (
    <SWReactTableWrapperBox>
        <TableLoader />
    </SWReactTableWrapperBox>
);

enum dataStates {
    LOADING,
    LOADED,
    ERROR,
}

let manualPageChangeToken = 0;

async function manualPageChage(delay) {
    return new Promise((resolve) => {
        clearTimeout(manualPageChangeToken);
        manualPageChangeToken = window.setTimeout(resolve, delay);
    });
}

class SWReactTableWrapper extends React.PureComponent<
    ISWReactTableWrapperProps,
    ISWReactTableWrapperState
> {
    public static propTypes = {
        serverApi: PropTypes.string.isRequired,
        tableColumns: PropTypes.array.isRequired,
        initialFilters: PropTypes.object,
        tableType: PropTypes.string,
        tableHeight: PropTypes.number,
        tableOptions: PropTypes.object,
        rowsPerPage: PropTypes.number,
        fetchServerPages: PropTypes.number,
        children: PropTypes.func,
        onPageChange: PropTypes.func,
        onSort: PropTypes.func,
        onFilterChange: PropTypes.func,
        pageIndent: PropTypes.number,
        paginationProps: PropTypes.object,
        totalCountProperty: PropTypes.string,
        preventCountTracking: PropTypes.bool,
    };

    public static defaultProps = {
        tableType: "sticky",
        tableHeight: null,
        tableOptions: {},
        rowsPerPage: 100,
        fetchServerPages: 1,
        transformData: _.identity,
        getDataCallback: (data) => null,
        changePageCallback: (page) => null,
        recordsField: "records",
        totalRecordsField: "totalRecords",
        initialFilters: {},
        pageIndent: 0,
        paginationProps: {
            captionPosition: "center",
            hasItemsPerPageSelect: false,
            showPagination: true,
        },
        onDataError: (err) => swLog.error("ERROR fetching table data", err),
        enrichData: (data) => data,
        preventCountTracking: false,
    };

    private fetchService;
    private swNavigator;
    private lastGetData;

    constructor(props) {
        super(props);

        this.fetchService = DefaultFetchService.getInstance();
        this.swNavigator = Injector.get("swNavigator");

        this.state = {
            page: 0,
            sort: "",
            asc: true,
            filters: this.compactFilters(props.initialFilters),
            totalRecords: 0,
            totalPages: 0,
            tableRecords: [],
            pageDataChunks: [],
            currentChunksStartPage: 0,
            tableColumns: props.tableColumns,
            dataState: dataStates.LOADING,
            tableItemsCount: -1,
            didTrackItemsCount: false,
        };
    }

    public componentDidUpdate(prevProps) {
        if (this.props.tableColumns !== prevProps.tableColumns) {
            this.setState({
                tableColumns: this.props.tableColumns,
            });
        }
        if (this.props.preventCountTracking !== prevProps.preventCountTracking) {
            this.trackTableItemsCount();
        }
    }

    public async componentDidMount() {
        await this.getData();
        this.setState({ tableRecords: this.state.pageDataChunks[0] });
    }

    public async getData(params = {}, headers?: Record<string, string | number | boolean>) {
        this.setState({ dataState: dataStates.LOADING });
        let allDataParams = { ...this.state.filters };
        if (this.state.sort) {
            allDataParams.sort = this.state.sort;
            allDataParams.asc = this.state.asc;
        }

        // SIM-24451 - when sorted field in state doesnt exists in tables config - resetting sort to default
        if (
            this.props.tableColumns.filter((column) => column.field === allDataParams.sort)
                .length === 0
        ) {
            const sortedColumn = this.props.tableColumns.find((column) => column.isSorted);
            if (sortedColumn) {
                allDataParams.sort = sortedColumn.field;
                allDataParams.asc = sortedColumn.sortDirection === "asc";
            }
        }
        allDataParams = { ...allDataParams, ...params };
        // ensure that table state shows sorting field and direction it requests.
        const orderBy = allDataParams.orderBy || allDataParams.orderby;
        const [sortedColumn, sortDirection = "asc"] = allDataParams.sort
            ? [allDataParams.sort, allDataParams.asc ? "asc" : "desc"]
            : orderBy?.split(" ") || [undefined, "asc"];
        this.updateTableColumnsSortState(sortedColumn, sortDirection);
        try {
            const requestParams = this.props.dataParamsAdapter
                ? this.props.dataParamsAdapter(allDataParams)
                : allDataParams;

            let promise;
            if (this.props.requestBody) {
                const url = `${this.props.serverApi}?${this.fetchService.requestParams(
                    requestParams,
                )}`;
                promise = this.fetchService.post(url, this.props.requestBody, { headers });
            } else {
                promise = this.fetchService.get(this.props.serverApi, requestParams, {
                    headers,
                });
            }
            this.lastGetData = promise;
            await promise;
            if (promise === this.lastGetData) {
                const data = this.props.transformData(await this.lastGetData);
                const {
                    [this.props.recordsField]: records, // Data
                    [this.props.totalRecordsField]: totalRecords, //TotalCount
                    ...dataMeta
                } = data;
                const pageDataChunks = _.chunk(records, this.props.rowsPerPage);
                this.setState({
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / this.props.rowsPerPage),
                    pageDataChunks,
                    tableRecords: pageDataChunks[0],
                    dataState: dataStates.LOADED,

                    tableMeta: { ...dataMeta },
                });
                const totalResults = this.props.totalCountProperty
                    ? data[this.props.totalCountProperty]
                    : data.totalRecords?.toString() ||
                      data.ResultCount?.toString() ||
                      data.TotalCount?.toString();

                this.setState(
                    { tableItemsCount: totalResults, didTrackItemsCount: false },
                    this.trackTableItemsCount,
                );
                this.props.getDataCallback(data);
            }
        } catch (err) {
            this.setState({ dataState: dataStates.ERROR });
            this.setState(
                { tableItemsCount: "Error", didTrackItemsCount: false },
                this.trackTableItemsCount,
            );
            this.props.onDataError(err);
        }
    }

    private trackTableItemsCount() {
        if (
            !this.props.preventCountTracking &&
            !this.state.didTrackItemsCount &&
            this.state.tableItemsCount >= 0
        ) {
            this.setState({ didTrackItemsCount: true });
            TrackWithGuidService.trackWithGuid("table.results", "table-results", {
                count: this.state.tableItemsCount,
            });
        }
    }

    private onPageChange = async (page) => {
        page--;
        if (page > this.state.totalPages - 1) {
            page = this.state.totalPages - 1;
        }
        if (page < 0) {
            page = 0;
        }
        if (page === this.state.page) {
            return;
        }
        const state =
            page === this.state.page + 1
                ? "next"
                : page === this.state.page - 1
                ? "prev"
                : "manual";
        const value =
            page === this.state.page + 1 || page === this.state.page - 1
                ? this.state.page + 1
                : `${this.state.page + 1}-${page + 1}`;
        allTrackers.trackEvent("Pagination", "click", `Table/${state}/${value}`);
        this.setState(
            {
                page,
            },
            async () => {
                if (state === "manual") {
                    await manualPageChage(1000);
                }
                if (this.shouldFetchServerPage(page)) {
                    return this.renderServerPage(page);
                } else {
                    return this.renderClientPage(page);
                }
            },
        );
        if (typeof this.props.changePageCallback === "function") {
            this.props.changePageCallback(page);
        }
    };

    private shouldFetchServerPage(page) {
        return !(
            page >= this.state.currentChunksStartPage &&
            page < this.state.currentChunksStartPage + this.props.fetchServerPages &&
            this.state.pageDataChunks.length > 1
        );
    }

    private async renderServerPage(page) {
        const pageNumber = page + this.props.pageIndent;
        // getting new rows from server
        if (this.props.onPageChange) {
            this.props.onPageChange(page);
        } else {
            await this.getData({ page: Math.floor(pageNumber / this.props.fetchServerPages) });
        }
        this.setState({
            page,
            tableRecords: this.state.pageDataChunks[page % this.props.fetchServerPages],
            currentChunksStartPage:
                Math.floor(page / this.props.fetchServerPages) * this.props.fetchServerPages,
        });
    }

    private renderClientPage(page) {
        // getting next chunk
        this.setState({
            page,
            tableRecords: this.state.pageDataChunks[page - this.state.currentChunksStartPage],
        });
    }

    private onSort = async ({ field, sortDirection }) => {
        if (this.props.onSort) {
            this.props.onSort({ field, sortDirection });
            if (
                this.props.allowClientSort &&
                this.state.totalRecords <= this.props.rowsPerPage * this.props.fetchServerPages
            ) {
                setTimeout(() => {
                    const allData = this.state.pageDataChunks.reduce(
                        (acc, curr) => acc.concat(curr),
                        [],
                    );
                    const pos = this.state.asc ? -1 : 1;
                    const sortedData = allData.sort((a, b) =>
                        a[this.state.sort] < b[this.state.sort] ? pos : pos * -1,
                    );
                    typeof this.props.getDataCallback === "function" &&
                        this.props.getDataCallback({
                            records: sortedData,
                            ...this.state.tableMeta,
                            totalRecords: this.state.totalRecords,
                            dataState: this.state.dataState,
                        });
                    typeof this.props.changePageCallback === "function" &&
                        this.props.changePageCallback(0);
                    const newChunks = _.chunk(sortedData, this.props.rowsPerPage);
                    this.setState({
                        pageDataChunks: newChunks,
                        tableRecords: newChunks[this.state.page],
                    });
                });
            } else {
                await this.getData({
                    sort: field,
                    asc: sortDirection === "asc",
                    orderBy: field + " " + sortDirection,
                });
            }
        } else {
            await this.getData({
                sort: field,
                asc: sortDirection === "asc",
                orderBy: field + " " + sortDirection,
            });
        }
        this.updateTableColumnsSortState(field, sortDirection);
    };

    private updateTableColumnsSortState(field, sortDirection) {
        const tableColumns = this.state.tableColumns.map((column) => {
            if (column.field === field) {
                return {
                    ...column,
                    isSorted: true,
                    sortDirection,
                };
            } else {
                return {
                    ...column,
                    isSorted: false,
                };
            }
        });
        this.setState({
            tableColumns,
            sort: field,
            asc: sortDirection === "asc",
            page: 0,
        });
    }

    private onFilterChange = (params, updateUrlOnChange) => {
        this.updateFiltersState(params, updateUrlOnChange, () => {
            if (this.props.onFilterChange) {
                return this.props.onFilterChange(params);
            } else {
                return this.getData(this.compactFilters(params));
            }
        });
    };

    private updateFiltersState(params, updateUrlOnChange, setStateCallback) {
        if (updateUrlOnChange) {
            // TODO: This is angular code that should be remove in the future
            Injector.get<any>("$rootScope").$apply(() => {
                this.swNavigator.updateQueryParams(params, { reload: false });
            });
        }
        this.setState(
            {
                filters: this.compactFilters({
                    ...this.state.filters,
                    ...params,
                }),
                page: 0,
            },
            setStateCallback,
        );
    }

    private onClickToggleColumns = (index) => {
        const tableColumns = [...this.state.tableColumns];
        if (Array.isArray(index)) {
            index.forEach((visible, idx) => (tableColumns[idx].visible = visible));
        } else {
            tableColumns[index].visible = !tableColumns[index].visible;
        }
        this.setState({ tableColumns });
    };

    private createTableLoader() {
        //except boolean for having long loader with default props or object for changing itle & subtitle
        return this.props.tableOptions.longLoader ? (
            <LongLoaderAfterFewSeconds
                SecondLoader={LoaderListBulletsWrapper}
                {...this.props.tableOptions.longLoader}
            />
        ) : (
            <GhostLoader />
        );
    }

    private createTableNoData() {
        return (
            <SWReactTableWrapperBox>
                {this.createTopComponent()}
                <TableNoData
                    messageTitle={
                        this.props.tableOptions.noDataTitle ||
                        i18nFilter()("global.nodata.notavilable")
                    }
                    messageSubtitle={this.props.tableOptions.noDataSubtitle || ""}
                />
            </SWReactTableWrapperBox>
        );
    }

    private createTopComponent() {
        return (
            this.props.children &&
            this.props.children({
                onFilterChange: this.onFilterChange,
                onClickToggleColumns: this.onClickToggleColumns,
                filtersStateObject: this.state.filters,
                page: this.state.page,
                tableColumns: this.state.tableColumns,
                tableOptions: this.props.tableOptions,
                sort: this.state.sort,
                asc: this.state.asc,
                isLoadingData: this.state.dataState === dataStates.LOADING,
                totalCount: this.state.totalRecords,
            })
        );
    }

    private compactFilters(filters) {
        return _.reduce(
            filters,
            (result, value, key) => {
                if (value != null && value !== "") {
                    return {
                        ...result,
                        [key]: value,
                    };
                }
                return result;
            },
            {},
        );
    }

    private hasData() {
        return this.state.tableRecords && this.state.tableRecords.length;
    }

    private showPager() {
        return (
            this.props.paginationProps.showPagination &&
            (this.state.dataState === dataStates.LOADING || this.hasData())
        );
    }

    public render() {
        const { dataState, tableRecords, totalRecords, page, tableColumns } = this.state;
        const isLoadingTable = dataState === dataStates.LOADING || this.props.tableOptions?.loading;

        if (dataState === dataStates.ERROR) {
            return this.createTableNoData();
        }

        return (
            <SWReactTableWrapperBox>
                {this.createTopComponent()}
                {isLoadingTable ? (
                    this.createTableLoader()
                ) : (
                    <SWReactTableOptimized
                        type={this.props.tableType}
                        tableHeight={this.props.tableHeight}
                        tableOptions={this.props.tableOptions}
                        tableData={{
                            Records: this.props.enrichData(tableRecords),
                            TotalCount: totalRecords,
                            page: page + 1,
                            pageSize: this.props.rowsPerPage,
                        }}
                        tableColumns={tableColumns}
                        onSort={this.onSort}
                    />
                )}
                {this.showPager() && (
                    <SWReactTableWrapperFooter>
                        {dataState === dataStates.LOADED && (
                            <Pagination
                                page={page + 1}
                                itemsPerPage={this.props.rowsPerPage}
                                itemsCount={totalRecords}
                                handlePageChange={this.onPageChange}
                                captionElement={PaginationInput}
                                {...this.props.paginationProps}
                            />
                        )}
                    </SWReactTableWrapperFooter>
                )}
            </SWReactTableWrapperBox>
        );
    }
}

export default SWReactTableWrapper;
