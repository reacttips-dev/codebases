import angular from "angular";
import * as _ from "lodash";
import { IWidget, Widget } from "./Widget";
import { tableActionsCreator } from "../../../actions/tableActions";
import ColorStack from "../../colorsStack/ColorStack";
import { options, column } from "components/React/Table/SWReactTableDefaults";
import { allTrackers } from "../../../services/track/track";
import CountryService from "services/CountryService";
import {
    IPptSlideExportRequest,
    IPptTableRequest,
    PptMetricType,
} from "services/PptExportService/PptExportServiceTypes";
import {
    adaptTableDataToPpt,
    adaptTableColumnsToPpt,
} from "components/widget/widget-utilities/widgetPpt/tableUtils/PptTableWidgetUtils";
import { getWidgetEntities, getWidgetTitle } from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { getWidgetSubtitle } from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import { CHART_COLORS } from "constants/ChartColors";

/**
 * Created by vlads on 26/1/2016.
 */
export interface ITableRecord {
    selected?: boolean;
    selectable?: boolean;
    HasGraphData?: boolean;
    selectionColor?: string;
}
export interface ITableFilter {
    param: string;
    type?: string;
    name: string;
    operator?: string;
    value: string | number | boolean;
    column?: string;
}
export interface IWidgetTableResult {
    Filters: any;
    Header: any;
    TotalCount: number;
    Date: Array<any>;
}

export interface ITableWidget extends IWidget<any> {
    clearAllSelectedRows(): void;
}

export class TableWidget extends Widget implements ITableWidget {
    protected pagination: any = {
        // page size meaning the number of rows in the table view
        pageSize: 100, //response.pageSize || TABLE_CONFIG.pageSize
        pageDataChunks: [],
        ratio: 0,
        currentChunksStartPage: 0,
        numOfPages: 1, //this parameter will be sent to backend in the future
    };
    protected tableColors;
    private context: string;
    protected _$ngRedux;
    protected _colorsStack;
    protected tableSelectionProperty;
    protected tableSelection = {};
    protected maxSelection = 10;
    protected minSelection: number;
    protected displayTableOnEmptyData = true;
    protected clearSelectionOnWidgetRemoval = true;
    private toggleRows: any;
    private selectRows: any;
    private allRowsSelected: boolean;
    public clearAllSelectedRows: any;
    private unSubscribeFromStore: any;
    protected selectedRows;
    public subtitleData;
    private dataFetchCount = 0;
    protected geoChart;
    protected tableKey;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static $inject = ["$ngRedux", "$filter"];
    private tableClassName?: string;

    public isPptSupported = () => {
        const hasData = !!this.data?.Records;
        const hasColumns = !!this.metadata?.columns;
        return hasData && hasColumns;
    };

    public getDataForPpt(): IPptSlideExportRequest {
        const columnsConfig = this.getColumnsConfig();
        const tableEntities = getWidgetEntities(this);
        const columns = this.metadata.columns;
        const rows = this.data.Records;

        const pptColumns = adaptTableColumnsToPpt(columns, columnsConfig, tableEntities);
        const pptRows = adaptTableDataToPpt(rows, pptColumns, columnsConfig);

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this),
            type: "table",
            details: {
                columns: pptColumns,
                data: pptRows,
            } as IPptTableRequest,
        };
    }

    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
        this.onSort = this.onSort.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onToggleSelection = this.onToggleSelection.bind(this);
    }

    public page: number;

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.initTableWidget(widgetConfig, context);
        this.pagination.numOfPages =
            widgetConfig.properties.numOfPages || this.pagination.numOfPages;
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this.initTableWidget(config.widgetConfig, context);
    }

    initTableWidget(widgetConfig, context) {
        // in case of tabs above the table, we need to find the default filter to send.
        if (this.titleUtility) {
            // if we configure the widget with initial tabs (from outside) or the default for the tab is actual value
            if (
                this._widgetConfig.properties.initialTab ||
                this.titleUtility.properties.default != "null"
            ) {
                this.setFilterParam({
                    param: this.titleUtility.properties.param,
                    name: this.titleUtility.properties.column,
                    type: this.titleUtility.properties.type,
                    operator: this.titleUtility.properties.operator,
                    value:
                        this._widgetConfig.properties.initialTab ||
                        this.titleUtility.properties.default,
                });
            }
        }
        this.page = 1;
        this.context = context;
        const tblkey = `${this.getWidgetConfig().properties.metric}_Table`;
        this.tableKey = this.context ? `${this.context}_${tblkey}` : tblkey;
        const widgetCustomColors = _.result(
            widgetConfig,
            "properties.options.forceSetupColors",
            false,
        );
        const widgetCustomColorMap = widgetCustomColors
            ? CHART_COLORS[widgetConfig.properties.options.widgetColorsFrom]
            : CHART_COLORS.compareMainColors;

        this.tableColors = new ColorStack(widgetCustomColorMap);
        this.tableSelectionProperty = widgetConfig.properties.tableSelectionProperty;
        this.maxSelection = widgetConfig.properties.maxSelection;
        this.minSelection = widgetConfig.properties.minSelection;
        if (widgetConfig.properties.enableRowSelection) {
            this.unSubscribeFromStore = [
                this._$ngRedux.connect((newState) => {
                    return {
                        selectedRows: newState.tableSelection[this.getTableKey()],
                    };
                }, tableActionsCreator(this.getTableKey(), this.tableSelectionProperty))(this),
                this._$ngRedux.subscribe((newState) => {
                    this.onSelectionChange();
                }),
            ];
        }
        this.displayTableOnEmptyData = angular.isDefined(
            widgetConfig.properties.displayTableOnEmptyData,
        )
            ? widgetConfig.properties.displayTableOnEmptyData
            : this.displayTableOnEmptyData;
    }

    /**
     * get columns from metric
     * @returns {Array}
     */
    protected getMetricColumnsConfig() {
        let metricColumns = angular.copy(
            (this._metricTypeConfig && this._metricTypeConfig.columns) || [],
        );
        // remove specific columns for dashboard widgets
        if (this.dashboardId) {
            metricColumns = this.filterColumnsForDashboard(metricColumns);
        }
        // remove specific columns according to webSource
        return this.filterColumnsByWebSource(metricColumns);
    }

    /**
     * get columns from widget
     * @returns {Array}
     */
    protected getWidgetColumnsConfig() {
        const widgetConfig = this._widgetConfig;
        const widgetProp = widgetConfig.properties;
        const widgetColumns = widgetProp.columns || [];
        // remove specific columns according to webSource
        return this.filterColumnsByWebSource(widgetColumns);
    }

    /**
     * Remove specific columns according to webSource from "columns".
     * @param columns
     * @returns {T[]}
     */
    protected filterColumnsByWebSource(columns) {
        return (columns = _.filter(columns, (col) => {
            return col.webSources ? _.includes(col.webSources, this._params.webSource) : true;
        }));
    }

    protected filterColumnsForDashboard(columns) {
        return (columns = _.filter(columns, (col: any) => {
            if (this.getWidgetModel().duration === "28d" && col.hideFrom28Days) {
                return false;
            }
            return !col.dashboardHide;
        }));
    }

    public cleanup() {
        if (this.unSubscribeFromStore) {
            this.unSubscribeFromStore.forEach((listener) => {
                if (typeof listener === "function") {
                    listener();
                }
            });
            this.unSubscribeFromStore = [];
            if (this.clearSelectionOnWidgetRemoval) {
                this.clearAllSelectedRows();
            }
        }
        super.cleanup();
    }

    protected getColumnsConfig() {
        const widgetColumnsConfig = this.getWidgetColumnsConfig();
        const metricColumnsConfig = this.getMetricColumnsConfig();
        return this.shouldOverrideColumns() ? widgetColumnsConfig : metricColumnsConfig;
    }

    protected shouldOverrideColumns() {
        const widgetConfig = this._widgetConfig;
        const widgetProp = widgetConfig.properties;

        const shouldOverride = !!(widgetProp.options && widgetProp.options.overrideColumns);
        return shouldOverride;
    }

    /**
     * column config is a merge of metric and widget config
     * if overrideColumns is true, only widget columns are used.
     * if it is false, widget columns override metric columns
     * @returns {Array}
     */
    private getColumnsConfigInternal() {
        const widgetConfig = this._widgetConfig;
        const widgetProp = widgetConfig.properties;
        const columns = [];
        const columnsConfig = this.getColumnsConfig();
        const cellTemplateRegex = /(.+?)(-|\b)/gi;

        if (columnsConfig && columnsConfig.length) {
            columnsConfig.forEach((col) => {
                const formattedColumn: any = {
                    field: col.name || col.field,
                    subField: col.subName || col.subField,
                    format: col.format,
                    headerCellTemplate: col.headTemp,
                    headerComponent: col.headerComponent,
                    headerCellIcon: col.headerCellIcon,
                    headerCellIconName: col.headerCellIconName,
                    cellTemplate: col.cellTemp,
                    cellComponent: col.cellComponent,
                    cellClass: col.cellCls,
                    columnClass: col.colClass,
                    headerCellClass: col.headerCellClass,
                    sortable: Widget.toBoolean(col.sortable),
                    groupable: Widget.toBoolean(col.groupable),
                    isSorted: Widget.toBoolean(col.isSorted),
                    sortDirection: col.sortDirection,
                    isLegendItem: col.isLegendItem,
                    showTotalCount: Widget.toBoolean(col.totalCount),
                    disableHeaderCellHover: col.disableHeaderCellHover,
                    width: col.width,
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    tooltip: null,
                    progressBarTooltip: col.progressBarTooltip,
                    inverted: col.inverted,
                    category: col.category,
                    fixed: col.fixed,
                    isResizable: col.isResizable,
                    renderTextInsteadOfLinks: widgetProp.options.renderTextInsteadOfLinks,
                    dangerouslySetInnerHTML: col.dangerouslySetInnerHTML || false,
                };

                if (_.isString(col.title)) {
                    formattedColumn.displayName = col.title;
                } else if (_.isObject(col.title)) {
                    formattedColumn.displayName = this._params.isWindow
                        ? col.title.window
                        : col.title.snapshot;
                }

                // use predefined tooltip text
                if (_.isString(col.tooltip) && !_.isEmpty(col.tooltip)) {
                    formattedColumn.tooltip = col.tooltip;
                }
                // generate tooltip from widget metric and column
                // NOT SUPPORTED FOR DASHBOARD - DASHBOARD SHOULD USE ONLY STRING FOR TOOLTIP
                else if (col.tooltip == true && !this.dashboardId) {
                    formattedColumn.tooltip = (
                        "widget.table.tooltip." +
                        widgetProp.metric +
                        "." +
                        col.name
                    ).toLowerCase();
                }

                // allow override from widget columns config by field
                if (!this.shouldOverrideColumns()) {
                    const customColumn: any = _.find(this.getWidgetColumnsConfig(), {
                        field: formattedColumn.field,
                    });
                    if (customColumn) {
                        Object.assign(formattedColumn, customColumn);
                    }
                }
                columns.push(column(formattedColumn));
            });
        }
        return columns;
    }

    protected setMetadata() {
        const widgetConfig = this._widgetConfig;
        const widgetProp = widgetConfig.properties;
        widgetProp.options = widgetProp.options || {};
        const opts = options({
            showIndex: this._viewOptions.showIndex,
            stickyHeader: this._viewOptions.stickyHeader,
            scrollableTable: this._viewOptions.scrollableTable,
            loadingSize: this._viewOptions.loadingSize,
            tableType: this._viewOptions.tableType || this._viewOptions.cssClass,
            customTableClass: this._viewOptions.customTableClass,
            hideHeader: this._viewOptions.hideHeader,
            hideBorders: this._viewOptions.hideBorders,
            hideRowsBorders: this._viewOptions.hideRowsBorders,
            showCompanySidebar: this._viewOptions.showCompanySidebar,
            trackName: widgetProp.trackName || this.viewData.title,
            sortedColumnAddedWidth: this._viewOptions.sortedColumnAddedWidth,
            onSort: widgetProp.options && widgetProp.options.onSort,
            enableRowSelection: widgetProp.enableRowSelection,
            overrideIndexColumnWidth: widgetProp.overrideIndexColumnWidth,
            tableSelectionTrackingParam:
                widgetProp.options.tableSelectionTrackingParam || widgetProp.tableSelectionProperty,
            metric: widgetConfig.id ? `${widgetConfig.id}_${widgetProp.metric}` : widgetProp.metric,
            emptyResults: false,
            shouldEnrichRow: this._viewOptions.shouldEnrichRow,
            aboveHeaderComponents: this.getAboveHeaderComponents(),
            EnrichedRowComponent: this._viewOptions.EnrichedRowComponent,
            enrichedRowComponentHeight: this._viewOptions.enrichedRowComponentHeight,
            enrichedRowComponentTimeout: this._viewOptions.enrichedRowComponentTimeout,
            isFiltersSupported: this._viewOptions.isFiltersSupported,
            renderTextInsteadOfLinks: widgetProp.options.renderTextInsteadOfLinks,
            onEnrichedRowClick: this._viewOptions.onEnrichedRowClick,
        });
        // TODO (Sahar): we need to remove overflow: hidden completely from all widgets
        this._viewOptions.showOverflow =
            opts.tableType === "swTable--simple" ? this._viewOptions.showOverflow : true; // all big tables should'nt have overflow: hidden

        if (this.viewOptions.audienceOverviewColors) {
            opts.colors = "audienceOverview";
        }

        if (widgetProp.options.forceSetupColors) {
            opts.colors = widgetProp.options.widgetColorsFrom;
        }

        const columns = this.getColumnsConfigInternal();

        if (_.isEmpty(this.metadata)) {
            this.metadata = { columns, options: opts };
        } else {
            this.metadata.columns = _.merge(columns, this.metadata.columns);
            this.metadata.options = _.merge(opts, this.metadata.options);
        }
    }

    private getAboveHeaderComponents = () => {
        if (this._viewOptions.aboveHeaderComponentsFactory) {
            return this._viewOptions.aboveHeaderComponentsFactory(this);
        }
    };

    /**
     * Table pager utility calls it when any pagination requested by user
     * @param page (1 based page number)
     */
    setPageData(page) {
        //this.data.page used in templates to calculate row's index
        this.data.page = page;
        this._params.page = page; //we dont want to trigger getData, but we do want to update current page
        if (
            page >= this.pagination.currentChunksStartPage &&
            page < this.pagination.currentChunksStartPage + this.pagination.numOfPages &&
            this.pagination.pageDataChunks.length > 1
        ) {
            //getting next chunk
            this.data.Records = this.pagination.pageDataChunks[
                page - this.pagination.currentChunksStartPage
            ];
            this.setAllRowsSelectedStatus(this.data.Records);
        } else {
            //getting new rows from server
            this.apiParams = { page: Math.floor((page - 1) / this.pagination.numOfPages) + 1 };
        }
    }

    /**
     * Creates chunks of data from server's response
     *
     * @param records
     */
    createChunksForPagination(records: any[]) {
        //chunks data based on pageSize
        this.pagination.pageDataChunks = _.chunk(records, this.pagination.pageSize);
        //ratio required for the calculations in this.setPageData
        this.pagination.ratio = records.length / this.pagination.pageSize;
    }

    callbackOnGetData(response: any) {
        this.runProfiling();

        // TODO(dannyr): where is the 15 coming from? shouldn't this be used with createChunksForPagination() ?
        if (this.isDashboard()) {
            response.Data = response.Data.slice(0, 15);
        }

        this.data = { Records: this.reduceRecords(response.Data), TotalCount: response.TotalCount };
        this.createChunksForPagination(this.data.Records);
        //Sets widget data
        this.data = {
            Records: this.pagination.pageDataChunks[(this.page - 1) % this.pagination.numOfPages],
            minCellValue: response.Header ? response.Header.MinCellValue : undefined,
            maxCellValue: response.Header ? response.Header.MaxCellValue : undefined,
            Header: response.Header,
            TotalCount: response.TotalCount,
            // if virtual pagination is on, take the virtual page number, and not the backend page number
            page:
                this.pagination.pageDataChunks.length > 1
                    ? this.page
                    : _.get(this, "data.page") || this._params.page || 1,
            pageSize: this.pagination.pageSize,
        };
        this.pagination.currentChunksStartPage =
            Math.floor((this.page - 1) / this.pagination.numOfPages) * this.pagination.numOfPages +
            1;

        this.setMetadata();
        if (_.isEmpty(this.data.Records)) {
            return;
        }

        if (response.Filters) {
            this.data.Filters = response.Filters;
        }
        // This shit is only for website rank metric in compare mode
        this.subtitleData = {};
        if (response.Header) {
            _.forEach(response.Header, (val, key) => {
                this.subtitleData[key] =
                    key === "country" ? CountryService.countriesById[val] : val;
            });
        }
        if (response.Header) {
            this._viewData.subtitle = {};
            _.forEach(response.Header, (val, key) => {
                this._viewData.subtitle[key] =
                    key === "country" ? CountryService.countriesById[val] : val;
            });
        } else {
            this._viewData.subtitle = {};
        }
        if (this.metadata.options.enableRowSelection) {
            const { initialSelectedRowsCount = 0 } = this._widgetConfig.properties;
            if (!this.selectedRows || !this.selectedRows.length) {
                // TODO(dannyr): why do we need this?
                if (!this.dataFetchCount) {
                    this.dataFetchCount++;
                    this.selectTopNrows(
                        isNaN(initialSelectedRowsCount) ? 5 : initialSelectedRowsCount,
                    );
                }
            } else {
                //this.onSelectionChange();
                this.clearAllSelectedRows();
                this.selectTopNrows(isNaN(initialSelectedRowsCount) ? 5 : initialSelectedRowsCount);
            }
        }

        //Dashboard widgets should receive keys since there are no chosenSites/chosenItems available.
        if (this.dashboardId) {
            this.data.Items = this.apiParams.keys;
        }
        //Merge response.Data with response.KeysDataVerification for isGAVerified flag per property.
        this.mergeGAVerifiedFlag(response, this.data.Records);
    }

    setSortedColumn(column, direction) {
        // reset sorted columns
        this.metadata.columns.forEach((column) => {
            column.isSorted = false;
        });
        const columnObject: any = _.find(this.metadata.columns, { field: column });
        columnObject.isSorted = true;
        columnObject.sortDirection = direction;
    }

    onSort(column: any, setSortedColumn?: boolean) {
        if (setSortedColumn === true) {
            this.setSortedColumn(column.field, column.sortDirection);
        }
        this.apiParams = { orderBy: `${column.field} ${column.sortDirection}` };
    }

    onItemClick(column, value) {
        function findFilterUtility() {
            let result;
            _.forEach(this.utilityGroups, function (group) {
                const utility = _.find(group.utilities, { properties: { column: column } });
                if (utility) {
                    result = utility;
                }
            });

            return result;
        }

        const utility = findFilterUtility.call(this);
        if (utility) {
            const filter: ITableFilter = Object.assign({}, utility.properties);
            filter.value = value;
            filter.name = filter.column;
            delete filter.column;
            this.setFilterParam(filter);
        }
    }

    protected validateData(data) {
        return data && data.length;
    }

    public setFilterParam(filter: ITableFilter): void {
        const paramsObject = {};
        if (filter.param == "filter") {
            if (filter.value !== null) {
                // parse a filter into a DLinq form for the server
                if (filter.type === "string") {
                    filter.value = `"${filter.value}"`;
                } else if (filter.type === "number") {
                    const numericValue = parseInt(filter.value.toString());
                    filter.value = numericValue >= 0 ? numericValue : '""'; //here '""' is sent intentionally and it's handled in _setFilterParam of widget.service
                }
            }
            paramsObject[filter.param] = filter.name
                ? [filter.name, filter.operator, filter.value].join(";")
                : filter.value;
        } else {
            paramsObject[filter.param] = filter.value;
        }
        this.apiParams = paramsObject;
    }

    onResize() {
        return;
    }

    getTableKey() {
        return this.tableKey;
    }

    isSelectable(row) {
        return (
            !(row.hasOwnProperty("HasGraphData") && row.HasGraphData === false) &&
            row.Domain !== "grid.upgrade"
        );
    }

    onToggleSelection(row: any) {
        const selectionSize = this.selectedRows.length;
        const selectionRemoved = row.selected;
        const selectionAdded = !selectionRemoved;
        const belowMin =
            this.minSelection && selectionSize == this.minSelection && selectionRemoved;
        const aboveMax = selectionSize >= this.maxSelection && selectionAdded;

        if (belowMin || aboveMax) return;

        if (selectionAdded) row.selectionColor = this.tableColors.acquire();
        else this.tableColors.release(row.selectionColor);

        this.toggleRows([row]);
    }

    protected selectTopNrows(numberOfRows, actionCreator = this.toggleRows) {
        this.tableColors.reset();
        const rows = _.chain(this.data.Records)
            .filter((row) => this.isSelectable(row))
            .take(numberOfRows)
            .forEach((row) => (row.selectionColor = this.tableColors.acquire()))
            .slice()
            .value();
        actionCreator(rows);
    }

    private selectAllPageRows = () => {
        if (this.allRowsSelected) {
            allTrackers.trackEvent(
                "Check box all",
                `Table/${this.metadata.options.trackName}`,
                "remove",
            );
            return this.selectTopNrows(this.data.Records.length);
        } else {
            allTrackers.trackEvent(
                "Check box all",
                `Table/${this.metadata.options.trackName}`,
                "add",
            );
            return this.selectTopNrows(this.data.Records.length, this.selectRows);
        }
    };

    private onSelectionChange(selectedRows = this.selectedRows) {
        if (this.data && this.data.Records) {
            if (this.selectedRows.length > 0 && this._viewOptions.useFloatingSelectionBar) {
                this.tableClassName = "flex-table-row-selection-active";
            } else this.tableClassName = "";
            if (_.isArray(selectedRows)) {
                this.metadata.options.disableSelection = false;
                if (selectedRows.length >= this.maxSelection) {
                    this.metadata.options.disableSelection = true;
                }
            }
            _.forEach(this.data.Records, (record: ITableRecord) => {
                const matchedRow: any = _.find(selectedRows, {
                    [this.tableSelectionProperty]: record[this.tableSelectionProperty],
                });
                // check if the selected row should be unselect
                record.selectable = this.isSelectable(record);
                if (matchedRow) {
                    record.selected = record.selectable;
                    record.selectionColor = matchedRow.selectionColor;
                } else {
                    record.selected = false;
                    record.selectionColor = null;
                }
            });
            this.setAllRowsSelectedStatus(this.data.Records);
        }
    }

    private setAllRowsSelectedStatus = (records) => {
        this.allRowsSelected = records.every((record) => record.selected);
    };

    protected reduceRecords(records: any[]) {
        const widgetParams = this._params;
        return records.map((row) => {
            return {
                ...this.rowReducer(row, widgetParams, this.getProUrl.bind(this)),
                Children:
                    row.Children &&
                    row.Children.length &&
                    row.Children.map((child) =>
                        this.rowReducer(child, widgetParams, this.getProUrl.bind(this)),
                    ),
            };
        });
    }

    protected rowReducer(row: any, params, getProUrl: any): any {
        if (
            row.Domain ||
            row.App ||
            row.SearchTerm ||
            (row.TrafficSource && _.includes(["Referral", "Display Ad"], row.SourceType))
        ) {
            const rowParams: any = {};
            const keys = row.Domain || row.App || row.TrafficSource;
            if (row.SearchTerm) {
                rowParams.keyword = row.SearchTerm;
            }
            if (params.store) {
                rowParams.appId =
                    (params.store.toLowerCase() === "google" ? "0" : "1") + "_" + keys;
            } else {
                rowParams.key = keys;
            }

            return {
                ...row,
                url: getProUrl(rowParams),
            };
        }
        return { ...row };
    }
}

TableWidget.register();
