import { ILocationService, ITimeoutService } from "angular";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import { FC } from "react";
import dayjs from "dayjs";
import I18n from "components/React/Filters/I18n";
import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { IInsightReport } from "./../types";
import { InsightsService } from "./insightsService";
import { DefaultFetchService } from "services/fetchService";

import { TablePaginator } from "@similarweb/ui-components/dist/table-paginator";
import { Alert } from "@similarweb/ui-components/dist/alert";
import { CookieManager } from "components/cookie-manager/CookieManager";
import { column } from "components/React/Table/SWReactTableDefaults";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { InsightsHomeService } from "../insightsHomeService";
import { FilterService, IInitialFilterOptions } from "./../common/FilterService";
import { SWFilters } from "./SWFilters";
import { IFilter, IPeriod } from "./types";
import ContactUsButton from "components/React/ContactUs/ContactUsButton";
import { SwTrack } from "services/SwTrack";

const DefaultApiCell: FC<{ value: string }> = ({ value }) => {
    return <div className="um-inputCell">{value}</div>;
};

class DeepInsightsTexts {
    public actionsBlockedMessage: string;
    public downloadErrorMessage: string;
}

export class SWGeneratedReports extends InjectableComponentClass<any, any> {
    private pageSize = 50;
    private apiService: InsightsService;
    private swFilters: SWFilters;
    private tableOptions: any;
    private tableColumns: any[];
    private localizationTexts: DeepInsightsTexts;
    private insightsHomeService: InsightsHomeService = new InsightsHomeService();
    private cookieManager: CookieManager = new CookieManager();
    private defaultSortField = "DeliveryDate";
    private exampleTag = "example";
    private fetchService: DefaultFetchService = DefaultFetchService.getInstance();

    private filterService: FilterService;

    constructor() {
        super();
        this.apiService = this.injector.get("insightsService");

        const $location: ILocationService = this.injector.get("$location");
        const $timeout: ITimeoutService = this.injector.get("$timeout");
        const params: any = this.injector.get("swNavigator").getParams();

        this.filterService = new FilterService(
            this.injector.get("swNavigator"),
            $location,
            $timeout,
        );

        const initialFilterValues: IInitialFilterOptions = this.filterService.getInitialFilters();

        const _selectedTypeId: string[] =
            params && params.types && params.types.length ? params.types.split(",") : [];
        const _maxReportsToZip: number =
            swSettings.components.DeepInsights.resources.MaxReportsToZip;
        const types: any[] = this.insightsHomeService.getTypes();

        this.tableOptions = {
            showTotalCount: false,
            tableSelectionTrackingParam: "Name",
        };

        this.initLocalization();

        this.state = {
            isErrorAlertVisible: false,
            defaultTableData: { Records: [] },
            filteredTableData: { Records: [] },
            tableData: { Records: [] },
            page: 1,
            sorting: {
                field: "DeliveryDate",
                sortDirection: "desc",
            },
            reportsTypes: types,
            filterCriteria: {
                selectedTypeId: _selectedTypeId,
                skipExamples: initialFilterValues.skipExamples,
                period: initialFilterValues.period,
                deliveryDate: {
                    shiftValue: null,
                    shiftType: "",
                },
            },
            reportsCount: 0,
            allReportsCount: 0,
            isFiltersApplied: false,
            isLoading: true,
            bulkFileDownload: {
                ids: [],
                isInProgress: false,
            },
            filterOptions: {
                from: initialFilterValues.period.from,
                to: initialFilterValues.period.to,
                selectedTypeId: initialFilterValues.selectedTypeId,
                skipExamples: initialFilterValues.skipExamples,
                deliveryType: initialFilterValues.deliveryType,
                searchText: initialFilterValues.searchText,
            },
            selectedReports: [],
            isAllChecked: false,
            permission: { areActionsAvailable: false },
            maxReportsToZip: _maxReportsToZip,
        };

        const _tableColumns: any = this.getColumns();
        this.tableColumns = _tableColumns.map((i) => column(i));
        this.tableColumns[0].cell = {
            selected: false,
        };

        this.updateTableData = this.updateTableData.bind(this);
        this.gotoPageDebounced = this.gotoPageDebounced.bind(this);
        this.onApplyFilters = this.onApplyFilters.bind(this);
        this.onSort = this.onSort.bind(this);
        this.areActionsAvailable = this.areActionsAvailable.bind(this);
        this.loadData();
    }

    private initLocalization = () => {
        this.localizationTexts = new DeepInsightsTexts();
        this.localizationTexts.actionsBlockedMessage = this.i18n(
            "DeepInsights.ContactYourAdministrator.Tooltip",
        );
        this.localizationTexts.downloadErrorMessage = this.i18n(
            "DeepInsights.ReportsPage.DownloadErrorMessage",
        );
    };

    public async loadData(): Promise<void> {
        await this.apiService.getAllReports().then((response) => {
            this.initData(response);
        });
    }

    private initData = (response) => {
        let Records: IInsightReport[] = response.Reports;
        if (!Records) {
            Records = new Array<IInsightReport>();
        }
        const { selectedTypeId, to, from, deliveryType, searchText } = this.state.filterOptions;
        let { skipExamples } = this.state.filterOptions;
        const { filterCriteria } = this.state;
        const isSkipExamplesDefined: boolean = skipExamples !== undefined;
        let newSkipExamples = false;
        const period: IPeriod = this.getPeriod(Records);
        Records.forEach((r) => {
            r.ReportTypeName = this.getReportName(r.ReportType);
            if (r.Tags && r.Tags.length && r.Tags.indexOf(this.exampleTag) !== -1) {
                r.DeliveryDate = new Date().toISOString();
                newSkipExamples = true;
            }
        });
        Records = Records.filter((r) => r.ReportTypeName);
        Records = this.sortItems(this.defaultSortField, Records);

        skipExamples = isSkipExamplesDefined ? skipExamples : newSkipExamples;
        filterCriteria.skipExamples = skipExamples;
        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    defaultTableData: { Records },
                    filteredTableData: { Records },
                    allReportsCount: Records.length,
                    permission: { areActionsAvailable: true },
                    isLoading: false,
                    filterCriteria,
                    filterOptions: {
                        from: period.from,
                        to: period.to,
                        selectedTypeId,
                        skipExamples,
                        deliveryType,
                        searchText,
                    },
                };
            },
            () => {
                this.swFilters.setDurationRange(from || period.from, to || period.to, from && to);
                this.filter();
            },
        );
    };

    private getReportName = (key: string) => {
        const report: any = this.state.reportsTypes.filter((r) => {
            return r.Key === key;
        });
        return !report[0] ? null : report[0].Name;
    };

    private getPeriod = (records: IInsightReport[]) => {
        let mPeriodFrom = dayjs();

        records.forEach((e: IInsightReport) => {
            if (e.PeriodFrom) {
                const fromDayjs = dayjs(e.PeriodFrom);
                mPeriodFrom = mPeriodFrom.isAfter(fromDayjs) ? fromDayjs : mPeriodFrom;
            }
        });

        return {
            from: mPeriodFrom,
            to: dayjs(), // the delivery date of the example report will be set as today. (mPeriodTo)
        };
    };

    private getDownloadUrl = (reportId) => {
        const timestamp: string = dayjs().unix().toString();
        return `/api/deep-insights/direct-download?rid=${encodeURIComponent(
            reportId,
        )}&timestamp=${timestamp}`;
    };

    private directDownloadReport = async (reportId) => {
        const serviceUrl = this.getDownloadUrl(reportId);
        try {
            const res = await this.fetchService.get<{ downloadUrl: string }>(serviceUrl);
            if (res) {
                const { downloadUrl } = res;
                window.location.href = downloadUrl;
            }
        } catch (ex) {
            return;
        }
    };

    private gotoPageDebounced = (page) => {
        SwTrack.all.trackEvent("Pagination", "click", `Table/next/${page}`);
        const pageNumber: number = page || this.state.page;

        this.setState((prevState) => {
            return {
                ...prevState,
                page: pageNumber,
            };
        });

        if (this.state.filteredTableData.Records) {
            const records: IInsightReport[] = this.state.filteredTableData.Records;
            this.updateTableData(records, page);
        }
    };

    private updateTableData = (records, page = 1) => {
        const offset: number = (page - 1) * this.pageSize;

        const endIndex: number =
            offset + this.pageSize > records.length ? records.length : offset + this.pageSize;
        const recordsToShow: IInsightReport[] = records.slice(offset, endIndex);

        this.setState((prevState) => {
            return {
                ...prevState,
                filteredTableData: { Records: records },
                tableData: { Records: recordsToShow },
                reportsCount: records.length,
            };
        });
    };

    private onApplyFilters = (filters) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                filterCriteria: filters,
            };
        }, this.filter);
    };

    private filter = () => {
        const _filterByTypeFunc: (item: IInsightReport, types: string[]) => boolean = this
            .filterByTypeDeletage;
        const _searchFunc: (item: IInsightReport, searchText: string) => boolean = this
            .searchDelegate;
        const _filterByPeriodFunc: (item: IInsightReport, period: IPeriod) => boolean = this
            .filterByPeriodDeletage;
        const _filterByDeliveryDate: (
            item: IInsightReport,
            shiftValue: any,
            shiftType: string,
        ) => boolean = this.filterByDeliveryDate;
        const _filterCriteria: IFilter = this.state.filterCriteria;

        const isFiltersApplied: boolean =
            _filterCriteria.selectedTypeId ||
            _filterCriteria.skipExamples ||
            _filterCriteria.searchText ||
            !this.state.filterOptions.from.isSame(_filterCriteria.period.from) ||
            !this.state.filterOptions.to.isSame(_filterCriteria.period.to) ||
            (_filterCriteria.deliveryDate && _filterCriteria.deliveryDate.shiftValue);

        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    isFiltersApplied,
                };
            },
            () => this.filterService.updateFiltersQuery(_filterCriteria),
        );

        const reports: IInsightReport[] = this.state.defaultTableData.Records.filter(
            (i: IInsightReport) => {
                return (
                    (_filterCriteria.selectedTypeId && _filterCriteria.selectedTypeId.length > 0
                        ? _filterByTypeFunc(i, _filterCriteria.selectedTypeId)
                        : true) &&
                    (_filterCriteria.searchText
                        ? _searchFunc(i, _filterCriteria.searchText)
                        : true) &&
                    (_filterCriteria.period.from
                        ? _filterByPeriodFunc(i, _filterCriteria.period)
                        : true) &&
                    (_filterCriteria.deliveryDate && _filterCriteria.deliveryDate.shiftValue
                        ? _filterByDeliveryDate(
                              i,
                              _filterCriteria.deliveryDate.shiftValue,
                              _filterCriteria.deliveryDate.shiftType,
                          )
                        : true) &&
                    (_filterCriteria.skipExamples ? this.filterByTag("example", i) : true)
                );
            },
        );

        this.updateTableData(reports);
    };

    private filterByPeriodDeletage = (item: IInsightReport, duration: IPeriod) => {
        const periodTo: any = item.PeriodTo || item.PeriodFrom;
        return (
            (dayjs(item.PeriodFrom).isAfter(duration.from, "date") ||
                dayjs(item.PeriodFrom).isSame(duration.from, "date")) &&
            (!periodTo ||
                dayjs(periodTo).isBefore(duration.to, "date") ||
                dayjs(periodTo).isSame(duration.to, "date"))
        );
    };

    private filterByTypeDeletage = (item: IInsightReport, selectedTypeId: string[]) => {
        return selectedTypeId.indexOf(item.ReportType) !== -1;
    };

    private filterByDeliveryDate = (item: IInsightReport, shiftValue, shiftType) => {
        let startDayjs = dayjs();
        if (shiftType === "M") {
            startDayjs = dayjs().subtract(dayjs().date(), "d");
        }
        return (
            !dayjs(item.DeliveryDate).isAfter(startDayjs) &&
            (startDayjs.subtract(shiftValue, shiftType).isBefore(item.DeliveryDate) ||
                startDayjs.subtract(shiftValue, shiftType).isSame(item.DeliveryDate))
        );
    };

    public filterByTag = (tag: string, item: IInsightReport): boolean => {
        const itemTags: string[] = item.Tags;
        return !_.some(itemTags, (x) => x === tag);
    };

    private searchDelegate = (item: IInsightReport, searchText: string) => {
        return (
            item.Name.search(new RegExp(searchText, "i")) !== -1 ||
            (item.Description && item.Description.search(new RegExp(searchText, "i")) !== -1) ||
            (item.ReportType && item.ReportType.search(new RegExp(searchText, "i")) !== -1) ||
            (item.DeliveryDate &&
                item.DeliveryDate.toString().search(new RegExp(searchText, "i")) !== -1) ||
            (item.PeriodFrom &&
                item.PeriodFrom.toString().search(new RegExp(searchText, "i")) !== -1) ||
            (item.PeriodTo && item.PeriodTo.toString().search(new RegExp(searchText, "i")) !== -1)
        );
    };

    private onClearAll = (filters) => {
        const allRecords: IInsightReport[] = this.state.defaultTableData.Records;

        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    filterCriteria: filters,

                    isFiltersApplied: false,
                };
            },
            () => {
                this.filterService.resetFilterQuery();
                this.updateTableData(allRecords, 1);
            },
        );
    };

    private setLoadingState = (ids, isDownloading, isBulk = false) => {
        if (ids.length === 1 && !isBulk) {
            const id: number = ids[0];
            const records: IInsightReport[] = this.state.tableData.Records;
            const currentItem: IInsightReport[] = records.filter((item: IInsightReport) => {
                return item.Id === id;
            });
            if (currentItem.length) {
                currentItem[0].isLoading = isDownloading;
            }

            this.setState((prevState) => {
                return {
                    ...prevState,
                    tableData: { Records: records },
                };
            });
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    bulkFileDownload: { ids, isInProgress: isDownloading },
                };
            });
        }
    };

    private hanldeErrorDownloadingFiles = (cookieKey) => {
        const reports: any = this.cookieManager.getCookie(cookieKey);
        this.cookieManager.deleteCookie(cookieKey);
        if (reports) {
            this.showErrorAlert();
        }
    };

    private onSort = (cell) => {
        let sortDirection: string;
        if (this.state.sorting.field == cell.field) {
            sortDirection =
                this.state.sorting.sortDirection === "asc"
                    ? "desc"
                    : this.state.sorting.sortDirection === "desc"
                    ? ""
                    : "asc";
        } else {
            sortDirection = cell.sortDirection = "asc";
        }
        const sorting: any = this.state.sorting;
        sorting.field = cell.field;
        sorting.sortDirection = sortDirection;

        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    sorting,
                };
            },
            () => {
                const sortedRecords: IInsightReport[] = this.sortItems(cell.field);
                this.updateTableData(sortedRecords);
            },
        );
    };

    private sortItems = (fieldName, recordsToSort = null, sortDirection = null) => {
        if (!recordsToSort) {
            recordsToSort = this.state.filteredTableData.Records;
        }

        if (!sortDirection) {
            sortDirection = this.state.sorting.sortDirection;
        }

        const customValueGetter =
            fieldName.toLowerCase() === "period" ? this.getValueOfPeriodColumn : null;
        const sortedRecords: IInsightReport[] = this.regularSort(
            recordsToSort,
            sortDirection,
            fieldName,
            customValueGetter,
        );

        return sortedRecords;
    };

    private getValueOfPeriodColumn = (obj) => {
        return obj.PeriodFrom + (obj.PeriodTo ? " - " + obj.PeriodTo : "");
    };

    private regularSort = (recordsToSort, sortDirection, fieldName, customValueGetter = null) => {
        let sortedRecords: IInsightReport[] = null;

        const getValue: (object: any) => string = !!customValueGetter
            ? customValueGetter
            : (object) => {
                  return object[fieldName].toLowerCase();
              };

        sortedRecords = recordsToSort.sort((a, b) => {
            const valueA: any = getValue(a),
                valueB: any = getValue(b);

            if (valueA < valueB) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });

        return sortedRecords;
    };

    public areActionsAvailable = () => {
        return this.state.permission.areActionsAvailable;
    };

    private renderFieldNameContent = (props, name) => {
        const iconClass: string = "report-icon icon-" + props.row.Mimetype;
        const hasTag: boolean = props.row.Tags && props.row.Tags.length;
        const midIndex: number = Math.ceil(name.length / 2);
        const firstName: string = name.substring(0, midIndex);
        const lastName: string = name.substring(midIndex, name.length);
        return (
            <div className="inner-cell-container">
                <div className={hasTag ? "cell contains-tag" : "cell"}>
                    <div className={iconClass}></div>

                    <div>
                        <div className="report-name-first-part">
                            <div>{firstName}</div>
                        </div>
                        <div className="report-name-second-part">
                            <span>{lastName}</span>
                        </div>
                    </div>
                </div>

                {hasTag ? (
                    props.row.Tags.map((tag, index) => {
                        const _tag: string = tag.toLowerCase();
                        return (
                            <div
                                className={"di-report-tag di-report-tag-" + _tag}
                                key={index}
                            ></div>
                        );
                    })
                ) : (
                    <span />
                )}
            </div>
        );
    };

    private getHeaderCellClass = (name) => {
        return `swReactTableHeaderCell swTable-headerCell di-header-cell-${name}`;
    };

    private requestReport = () => {
        SwTrack.all.trackEvent("Pop Up", "open", "ContactUs/Deep Insights");
    };

    private closeAlert = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isErrorAlertVisible: false,
            };
        });
    };

    private showErrorAlert = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isErrorAlertVisible: true,
            };
        });
    };

    private getColumns = () => {
        const _areActionsAvailable: () => any = this.areActionsAvailable;
        const _actionsBlockedMessage: string = this.localizationTexts.actionsBlockedMessage;
        const _downloadTooltip: string = this.i18n("DeepInsights.Reports.Action.Download");

        const tableColumns: any = [
            {
                field: "Name",
                trackingName: "Name",
                displayName: "DeepInsights.Reports.Fields.Name",
                width: "40%",
                sortable: true,
                headerCellClass: this.getHeaderCellClass("Name"),
                cellComponent: (props) => {
                    const cellComponent = (
                        <div className="um-inputCell">
                            <PlainTooltip
                                placement={"right"}
                                cssClass="plainTooltip-element plainTooltip-content-di-report-details"
                                text={
                                    !props.row.Description
                                        ? props.value
                                        : `${props.value} ${props.row.Description}`
                                }
                            >
                                {this.renderFieldNameContent(props, props.value)}
                            </PlainTooltip>
                        </div>
                    );
                    return cellComponent;
                },
            },

            {
                field: "ReportTypeName",
                trackingName: "Report Type",
                displayName: "DeepInsights.Reports.Fields.ReportType",
                width: "18%",
                sortable: true,
                headerCellClass: this.getHeaderCellClass("ReportTypeName"),
                cellComponent(props) {
                    return <DefaultApiCell {...props} />;
                },
            },
            {
                field: "Period",
                headerCellClass: this.getHeaderCellClass("Period"),
                displayName: "DeepInsights.Reports.Fields.Period",
                width: "14%",
                sortable: true,
                cellComponent: (props) => {
                    const date: string = this.getValueOfPeriodColumn(props.row);
                    const cellComponent = <DefaultApiCell value={date} />;
                    return cellComponent;
                },
            },
            {
                field: "DeliveryDate",
                trackingName: "Delivery Date",
                displayName: "DeepInsights.Reports.Fields.DeliveryDate",
                width: "14%",
                sortable: true,
                headerCellClass: this.getHeaderCellClass("DeliveryDate"),
                cellComponent(props) {
                    const isoDate = `${props.value}Z`;
                    const formatDate = `${dayjs(isoDate).format("YYYY-MM-DD")}`;
                    return <DefaultApiCell value={formatDate} />;
                },
            },
            {
                field: "Actions",
                trackingName: "Actions",
                displayName: "DeepInsights.Reports.Fields.Actions",
                width: "9%",
                cellComponent: (props) => {
                    const cellComponent = (
                        <div className="um-inputCell">
                            {props.row.isLoading ? (
                                <div className="loader" />
                            ) : _areActionsAvailable() ? (
                                <a
                                    className="download-btn"
                                    title={_downloadTooltip}
                                    download
                                    onClick={this.directDownloadReport.bind(null, props.row.Id)}
                                ></a>
                            ) : (
                                <PlainTooltip
                                    placement={"left"}
                                    text={_actionsBlockedMessage}
                                    cssClass="plainTooltip-element plainTooltip-content-di-report-actions"
                                >
                                    <div className="download-btn locked"></div>
                                </PlainTooltip>
                            )}
                        </div>
                    );

                    return cellComponent;
                },
            },
        ];

        return tableColumns;
    };

    public render(): JSX.Element {
        const { disabled } = this.props;
        let pages = 1;
        if (this.state.filteredTableData.Records) {
            pages = Math.ceil(this.state.filteredTableData.Records.length / this.pageSize);
        }

        const swTableSelectionClassName = `${
            !this.state.maxReportsToZip
                ? ""
                : this.state.selectedReports.length < this.state.maxReportsToZip
                ? ""
                : " swTable-selection-disabled"
        } di-header-sorted-cell-${this.state.sorting.field} ${this.state.sorting.sortDirection}`;

        return (
            <div>
                {this.state.isErrorAlertVisible ? (
                    <Alert onClose={this.closeAlert}>
                        {this.localizationTexts.downloadErrorMessage}
                    </Alert>
                ) : (
                    <span />
                )}

                <div className="deep-insights">
                    <div className="di-header">
                        <h1 className="page-title">
                            <I18n>DeepInsights.ReportsPage.Title</I18n>
                        </h1>
                        <ContactUsButton label="Deep Insights">
                            {i18nFilter()("DeepInsights.ReportsPage.RequestReport.ButtonText")}
                        </ContactUsButton>
                    </div>

                    <section className="umTable-container">
                        <div className="swTable swTable--border">
                            <div className="generated-reportsContainer">
                                <div className="generated-reports-section-header">
                                    <h3 className="reports-subtitle">
                                        <span className="title-text">
                                            {this.state.isFiltersApplied ? (
                                                <span>
                                                    <span className="reports-count">
                                                        {this.state.reportsCount}
                                                    </span>
                                                    <I18n>pager.of</I18n>
                                                    <span className="second-reports-count reports-count">
                                                        {this.state.allReportsCount}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="reports-count">
                                                    {this.state.allReportsCount}
                                                </span>
                                            )}
                                            <I18n>DeepInsights.Reports.GeneratedReports</I18n>
                                        </span>
                                    </h3>
                                </div>

                                {this.state.isLoading ? (
                                    <div className="big-loader"></div>
                                ) : (
                                    <div>
                                        <div className="filters-container">
                                            <div className="filters">
                                                <SWFilters
                                                    onApplyFilters={this.onApplyFilters}
                                                    onClearAll={this.onClearAll}
                                                    ref={(instance) => {
                                                        this.swFilters = instance;
                                                    }}
                                                    filterOptions={this.state.filterOptions}
                                                    reportsTypes={this.state.reportsTypes}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                "umTable-container reports-container" +
                                                swTableSelectionClassName
                                            }
                                        >
                                            <SWReactTable
                                                type={"regular"}
                                                tableData={this.state.tableData}
                                                tableColumns={this.tableColumns}
                                                tableOptions={this.tableOptions}
                                                onSort={this.onSort}
                                            />
                                        </div>

                                        <div className="NewTablePager">
                                            <TablePaginator
                                                page={this.state.page}
                                                pages={pages}
                                                disabled={disabled}
                                                gotoPage={this.gotoPageDebounced}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}
