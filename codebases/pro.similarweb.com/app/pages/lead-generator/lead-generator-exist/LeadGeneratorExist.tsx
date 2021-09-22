import swLog from "@similarweb/sw-log";
import { IUpdateReport, updateLeadGeneratorReportName } from "actions/leadGeneratorActions";
import autobind from "autobind-decorator";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import ContactUsLink from "components/React/ContactUs/ContactUsLink";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { Component } from "react";
import { connect } from "react-redux";
import { customRangeFormat } from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import UnlockCountryModal from "../../../../.pro-features/styled components/StyledModals/src/UnlockCountryModal";
import SWReactTableWrapper from "../../../components/React/Table/SWReactTableWrapper";
import LeadGeneratorPageError from "../components/LeadGeneratorPageError";
import LeadGeneratorPageNoData from "../components/LeadGeneratorPageNoData";
import LeadGeneratorReturnLink from "../components/LeadGeneratorReturnLink";
import LeadGeneratorUtils from "../LeadGeneratorUtils";
import { LeadGeneratorExistWrapper } from "./components/elements";
import ReportHeader from "./components/ReportHeader";
import ReportTableTop from "./components/ReportTableTop";
import { getTableColumns, getTableToggleGroups } from "./leadGeneratorExistConfig";

enum dataStates {
    LOADING,
    LOADED,
    ERROR_METADATA,
    ERROR_DATA,
    NO_DATA,
}

@SWReactRootComponent
export class LeadGeneratorExist extends Component<any, any> {
    private _fetchService = DefaultFetchService.getInstance();
    private _swNavigator = Injector.get("swNavigator") as any;
    private _reportId;
    private _runId;
    private _allTableColumns: any = [];
    private _tableColumns: any = [];
    private _tableToggleGroups: any = [];

    constructor(props) {
        super(props);

        const { reportId, runId } = this._swNavigator.getParams();
        this._reportId = reportId;
        this._runId = runId;

        this.state = {
            reportName: "",
            top: 0,
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: "",
            reportFilters: {
                countries: [],
                categories: [],
            },
            reportRuns: [],
            isFirstRun: false,
            selectedRun: { [this._runId]: true },
            requestTime: "",
            dataState: this._runId ? dataStates.LOADING : dataStates.NO_DATA,
            isCountryModalOpen: false,
        };
    }

    public async UNSAFE_componentWillMount() {
        try {
            const { queryDefinition, runs } = (await this._fetchService.get(
                `/api/lead-generator/query/${this._reportId}`,
            )) as any;
            // eslint-disable-next-line @typescript-eslint/camelcase
            const { name: reportName, top, order_by, filters: reportFilters } = queryDefinition;
            const reportRuns = runs.sort((a, b) => {
                if (new Date(b.requestTime) < new Date(a.requestTime)) {
                    return -1;
                }
                return 1;
            });
            const crrRun = reportRuns.find((run) => run.id === this._runId);
            const isDesktopOnlyReport = reportFilters.device === "Desktop";
            this._allTableColumns = this.getAllTableColumns(crrRun, isDesktopOnlyReport);
            this._tableColumns = this.getVisibleColumns();
            this._tableToggleGroups = this.getTableToggleGroups(isDesktopOnlyReport);

            this.setState({
                reportName,
                top,
                // eslint-disable-next-line @typescript-eslint/camelcase
                order_by,
                reportFilters,
                reportRuns,
                requestTime: crrRun ? crrRun.requestTime : "",
                isFirstRun:
                    crrRun && crrRun.requestTime === reportRuns[reportRuns.length - 1].requestTime,
                dataState: this._runId ? dataStates.LOADED : dataStates.NO_DATA,
                isDesktopOnlyReport,
            });
        } catch (err) {
            swLog.error("ERROR fetching Lead Generator exist report data", err);
            this.setState({ dataState: dataStates.ERROR_METADATA });
        }
    }

    private getCategoriesOptions() {
        const allItems = LeadGeneratorUtils.getComponentCategories();
        const crrValue = this.state.reportFilters.categories;
        return allItems.filter((val) =>
            crrValue.find((item) => {
                if (item === "ALL") {
                    return "All" === val.id;
                }
                const formattedItem = item.replace("/", "~");
                let foundChildren = false;
                if (val.children) {
                    val.children.forEach((child) => {
                        if (formattedItem === child.id) {
                            foundChildren = true;
                        }
                    });
                }
                return foundChildren || formattedItem === val.id;
            }),
        );
    }

    private getCountriesOptions() {
        const allItems = LeadGeneratorUtils.getComponentCountries();
        const crrValue = this.state.reportFilters.countries;
        return allItems.filter((val) =>
            crrValue.find((item) => {
                return item === val.id;
            }),
        );
    }

    private onClickReportRun = ({ id: runId, text, requestTime }) => {
        allTrackers.trackEvent("Drop down", "click", `Table/dates list/${text}`);
        this.setState({ selectedRun: { [runId]: true }, requestTime }, () => {
            this._swNavigator.updateParams({ runId });
        });
    };

    private isColumnAvailableForReport(col, runObject = {} as any) {
        const { beginTime = new Date(null) /* null initialised to 1/1/1970 */ } = runObject;
        return col.startDate.valueOf() <= dayjs.utc(beginTime).valueOf();
    }

    private getAllTableColumns(runObject, isDesktopOnlyReport) {
        return getTableColumns(isDesktopOnlyReport).map((column: any) => {
            const available = this.isColumnAvailableForReport(column, runObject);
            return {
                ...column,
                available,
            };
        });
    }

    private getVisibleColumns() {
        return this._allTableColumns.reduce((availableColumns, column: any) => {
            if (column.available) {
                return [
                    ...availableColumns,
                    {
                        ...column,
                        visible: column.fixed || column.visible,
                    },
                ];
            }
            return availableColumns;
        }, []);
    }

    private getTableToggleGroups(isDesktopOnlyReport) {
        return getTableToggleGroups(isDesktopOnlyReport).reduce((all, group) => {
            const columnsInGroup = this._tableColumns.filter((col) => col.groupKey === group.key);
            const groupCount = columnsInGroup.length;
            const available = groupCount > 0;
            const allColumnsInSection = this._allTableColumns.filter(
                (col) => col.groupKey === group.key,
            );
            const availableSince = _.minBy(allColumnsInSection, (col: any) =>
                col.startDate.valueOf(),
            ).startDate;
            return [
                ...all,
                {
                    ...group,
                    displayName: i18nFilter()(group.displayName, {
                        num: available
                            ? groupCount.toString()
                            : allColumnsInSection.length.toString(),
                    }),
                    disabled: group.disabled || !available,
                    disabledText: group.disabled
                        ? group.disabledText
                        : available &&
                          i18nFilter()("grow.lead_generator.exist.table.toggle.feature.startdate", {
                              availablesince: availableSince.format("MMMM Do YYYY"),
                          }),
                },
            ];
        }, []);
    }

    @autobind
    private transformData(data) {
        const reportMonth = dayjs(this.state.requestTime).format(customRangeFormat);
        return {
            ...data,
            records: data.records.map((record) => {
                const params = {
                    key: record.site,
                    country: record.country,
                    duration: `${reportMonth}-${reportMonth}`,
                    webSource: "Total",
                    isWWW: "*",
                };
                if (!swSettings.allowedCountry(record.country, "WebAnalysis")) {
                    return {
                        ...record,
                        onNavigate: (e) => {
                            e.preventDefault();
                            this.setState({
                                isCountryModalOpen: true,
                                countryModalName: record.country,
                                countryModalLink: this._swNavigator.href(
                                    "websites-worldwideOverview",
                                    {
                                        ...params,
                                        country: 999,
                                    },
                                ),
                            });
                        },
                    };
                }
                return {
                    ...record,
                    url: this._swNavigator.href("websites-worldwideOverview", params),
                };
            }),
        };
    }

    private onDataError = () => {
        this.setState({ dataState: dataStates.ERROR_DATA });
    };

    private onClickRefresh = () => {
        this._swNavigator.reload("leadGenerator.exist");
    };

    private getDataCallback = (data) => {
        if (data.totalResultCount === 0) {
            this.setState({ dataState: dataStates.NO_DATA });
        }
    };

    private createPageContent() {
        if (
            this.state.dataState === dataStates.ERROR_METADATA ||
            this.state.dataState === dataStates.ERROR_DATA
        ) {
            return <LeadGeneratorPageError onClickRefresh={this.onClickRefresh} />;
        }
        if (this.state.dataState === dataStates.NO_DATA) {
            return (
                <LeadGeneratorPageNoData
                    href={this._swNavigator.href("leadGenerator.edit", {
                        reportId: this._reportId,
                    })}
                />
            );
        }
        const { reportId, runId, ...filters } = this._swNavigator.getParams();
        return (
            <SWReactTableWrapper
                serverApi={`/api/lead-generator/report/query/${this._reportId}/run/${this._runId}/table`}
                tableColumns={this._tableColumns}
                initialFilters={filters}
                fetchServerPages={9}
                tableOptions={{ showCompanySidebar: true }}
                transformData={this.transformData}
                totalRecordsField="filteredResultCount"
                onDataError={this.onDataError}
                getDataCallback={this.getDataCallback}
            >
                {(topComponentProps) => (
                    <ReportTableTop
                        {...topComponentProps}
                        tableToggleGroups={this._tableToggleGroups}
                        categoriesOptions={this.getCategoriesOptions()}
                        countriesOptions={this.getCountriesOptions()}
                        excelApi={`/api/lead-generator/report/query/${this._reportId}/run/${this._runId}/excel`}
                        isFirstRun={this.state.isFirstRun}
                    />
                )}
            </SWReactTableWrapper>
        );
    }

    private setNewReportName = async (newName) => {
        this.props.updateReportName({
            reportId: this._reportId,
            reportName: newName,
        });
        this.setState({ reportName: newName });
        allTrackers.trackEvent(
            "report Settings",
            "submit-ok",
            `${this._reportId}/rename/${newName}`,
        );
    };

    public render() {
        return (
            <LeadGeneratorExistWrapper>
                <LeadGeneratorReturnLink
                    text="grow.lead_generator.page.my_reports"
                    link={this._swNavigator.href("leadGenerator.all")}
                />
                {this.state.dataState !== dataStates.ERROR_METADATA && (
                    <ReportHeader
                        onClickReportRun={this.onClickReportRun}
                        onChangeReportName={this.setNewReportName}
                        copyLink={this._swNavigator.href("leadGenerator.edit", {
                            reportId: this._reportId,
                        })}
                        reportName={this.state.reportName}
                        top={this.state.top}
                        order_by={this.state.order_by}
                        reportFilters={this.state.reportFilters}
                        reportRuns={this.state.reportRuns}
                        selectedRun={this.state.selectedRun}
                        requestTime={this.state.requestTime}
                        isDesktopOnlyReport={this.state.isDesktopOnlyReport}
                    />
                )}
                {this.createPageContent()}
                <UnlockCountryModal
                    isOpen={this.state.isCountryModalOpen}
                    onClickAction={() => this.setState({ isCountryModalOpen: false })}
                    countryName={this.state.countryModalName}
                    fallbackName={i18nFilter()(
                        "grow.lead_generator.modal.unlock_country.fallback_name",
                    )}
                    fallbackLink={this.state.countryModalLink}
                    translate={i18nFilter()}
                >
                    <ContactUsLink label="Access Countries Modal/Request additional countries">
                        {i18nFilter()("modal.unlock_country.purchase")}
                    </ContactUsLink>
                </UnlockCountryModal>
            </LeadGeneratorExistWrapper>
        );
    }
}

function mapStateToProps(store) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        updateReportName: (report: IUpdateReport) => {
            dispatch(updateLeadGeneratorReportName(report));
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(LeadGeneratorExist),
    "LeadGeneratorExist",
);
