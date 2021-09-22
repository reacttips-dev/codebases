// [InvestorsSeparation] Copy of the original file. Will be removed soon.
import {
    ARCHIVE_LEAD_GENERATOR_REPORT,
    LOAD_LEAD_GENERATOR_REPORT_NAME,
    LOAD_LEAD_GENERATOR_REPORTS_DATA,
    SET_LEAD_GENERATOR_REPORTS,
    SET_LEAD_GENERATOR_REPORTS_DATA,
    UNARCHIVE_LEAD_GENERATOR_REPORT,
    UPDATE_LEAD_GENERATOR_REPORT_NAME,
} from "action_types/leadGenerator_action_types";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { i18nFilter } from "filters/ngFilters";
import {
    WORKSPACE_SALES_ADD_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_REMOVE_LEADS_GENERATOR_REPORT,
    WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_SET_LEADS_GENERATOR_REPORT,
    WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
} from "pages/workspace/common/action_types/actionTypes";
import { DefaultFetchService } from "services/fetchService";
import { showErrorToast, showSuccessToast } from "./toast_actions";
import { ThunkDispatchCommon } from "store/types";

const setReports = (reports = []) => ({
    type: SET_LEAD_GENERATOR_REPORTS,
    reports,
});

export interface ILeadGeneratorReportMetadata {
    queryName: string;
    reportId: string;
    lastRunId: string;
    status: number; // {Active:0, Archived: 1, Deleted: 2}
}

export const fetchLeadGeneratorReports = () => {
    const fetchService = DefaultFetchService.getInstance();
    return async (dispatch) => {
        const leadGeneratorReports = (await fetchService.get(
            "/api/lead-generator/query/metadata",
        )) as ILeadGeneratorReportMetadata[];
        dispatch(setReports(leadGeneratorReports));
    };
};

export const loadReportsData = () => ({
    type: LOAD_LEAD_GENERATOR_REPORTS_DATA,
});

const setReportsData = (reportsData = []) => ({
    type: SET_LEAD_GENERATOR_REPORTS_DATA,
    reportsData,
});

export interface ILeadGeneratorReportsData {
    newDataAvailable: boolean;
    queryDefinition: any;
    runs: any[];
}

export const fetchLeadGeneratorReportsData = () => {
    const fetchService = DefaultFetchService.getInstance();
    return async (dispatch) => {
        dispatch(loadReportsData());
        const leadGeneratorReportsData = (await fetchService.get(
            "/api/lead-generator/query",
        )) as ILeadGeneratorReportsData[];
        dispatch(setReportsData(leadGeneratorReportsData));
    };
};

export const loadReportName = (reportId) => ({
    type: LOAD_LEAD_GENERATOR_REPORT_NAME,
    reportId,
});

const updateReport = (report) => ({
    type: UPDATE_LEAD_GENERATOR_REPORT_NAME,
    report,
});

export interface IUpdateReport {
    reportId: string;
    reportName: string;
}

export interface ILeadGeneratorRenameResult {
    newName: string;
    queryId: string;
}

export interface ILeadGeneratorRename {
    result: ILeadGeneratorRenameResult;
}

export const updateLeadGeneratorReportName = (report: IUpdateReport) => {
    const fetchService = DefaultFetchService.getInstance();
    return async (dispatch: ThunkDispatchCommon) => {
        dispatch(loadReportName(report.reportId));

        const renamedReport = (await fetchService.post(
            `/api/lead-generator/query/${report.reportId}/rename`,
            { new_name: report.reportName },
        )) as ILeadGeneratorRename;

        dispatch(
            updateReport({
                reportId: renamedReport.result.queryId,
                reportName: renamedReport.result.newName,
            }),
        );
    };
};

const archiveReport = (reportId: any) => ({
    type: ARCHIVE_LEAD_GENERATOR_REPORT,
    reportId,
});

export const archiveLeadGeneratorReport = ({ reportId, reportName }: any) => {
    const fetchService = DefaultFetchService.getInstance();
    return async (dispatch: ThunkDispatchCommon) => {
        try {
            await fetchService.post(`/api/lead-generator/query/${reportId}/archive`, {});
            dispatch(archiveReport(reportId));
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text: i18nFilter()("grow.lead_generator.all.report.archive.success", {
                            report_name: reportName,
                        }),
                        onClick: () =>
                            dispatch(unarchiveLeadGeneratorReport({ reportId, reportName })),
                        linkText: i18nFilter()("grow.lead_generator.all.report.archive.undo"),
                    }),
                ),
            );
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()("grow.lead_generator.all.report.archive.fail", {
                        report_name: reportName,
                    }),
                ),
            );
        }
    };
};

const unarchiveReport = (reportId) => ({
    type: UNARCHIVE_LEAD_GENERATOR_REPORT,
    reportId,
});

export const unarchiveLeadGeneratorReport = ({ reportId, reportName }) => {
    const fetchService = DefaultFetchService.getInstance();
    return async (dispatch) => {
        try {
            await fetchService.post(`/api/lead-generator/query/${reportId}/unarchive`, {});
            dispatch(unarchiveReport(reportId));
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text: i18nFilter()("grow.lead_generator.all.report.unarchive.success", {
                            report_name: reportName,
                        }),
                        onClick: () =>
                            dispatch(archiveLeadGeneratorReport({ reportId, reportName })),
                        linkText: i18nFilter()("grow.lead_generator.all.report.unarchive.undo"),
                    }),
                ),
            );
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()("grow.lead_generator.all.report.unarchive.fail", {
                        report_name: reportName,
                    }),
                ),
            );
        }
    };
};

export interface ISaveSalesReportQuery {
    workspaceId?: string;
    name: string;
    autoRerunActivated: boolean;
}

export const saveSearchList = (params: ISaveSalesReportQuery, queryId: string) => {
    const fetchService = DefaultFetchService.getInstance();
    const { name, workspaceId, autoRerunActivated } = params;

    return async (dispatch: ThunkDispatchCommon) => {
        try {
            const swNavigator = Injector.get<SwNavigator>("swNavigator");

            const { queryDefinition, lastRun } = await fetchService.post(
                `/api/sales-leads-generator/report/query/${queryId}`,
                {
                    name,
                    autoRerunActivated,
                },
            );

            dispatch({
                type: WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST,
                searchId: queryDefinition?.id,
                queryParams: {
                    order_by: queryDefinition?.order_by,
                    filters: queryDefinition?.filters,
                    queryId: queryDefinition?.id,
                    runId: lastRun?.id,
                },
            });

            dispatch({
                type: WORKSPACE_SALES_ADD_SAVED_SEARCH_LIST,
                workspaceId,
                queryDefinition,
                lastRun,
            });

            swNavigator.applyUpdateParams({
                workspaceId,
                searchId: queryDefinition.id,
            });

            dispatch(
                showSuccessToast(
                    i18nFilter()("workspace.sales.leadgenerator.results-page.save.query.success", {
                        name,
                    }),
                ),
            );
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()("workspace.sales.leadgenerator.results-page.save.query.error", {
                        name,
                    }),
                ),
            );
        }
    };
};

export const updateSearchList = (params: ISaveSalesReportQuery, queryId: string) => {
    const fetchService = DefaultFetchService.getInstance();
    const { autoRerunActivated, workspaceId, name } = params;

    return async (dispatch: ThunkDispatchCommon) => {
        try {
            const { queryDefinition, lastRun } = await fetchService.post(
                `/api/sales-leads-generator/report/query/${queryId}`,
                {
                    name,
                    autoRerunActivated,
                },
            );

            dispatch({
                type: WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
                workspaceId,
                queryDefinition,
                lastRun,
            });

            dispatch(
                showSuccessToast(
                    i18nFilter()(
                        "workspace.sales.leadgenerator.results-page.saved.search.updated.success",
                    ),
                ),
            );
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()(
                        "workspace.sales.leadgenerator.results-page.saved.search.updated.error",
                    ),
                ),
            );
        }
    };
};

export const runAutoRerun = (params: ISaveSalesReportQuery, queryId: string) => {
    const fetchService = DefaultFetchService.getInstance();
    const { autoRerunActivated, workspaceId, name } = params;

    return async (dispatch) => {
        try {
            const { queryDefinition, lastRun } = await fetchService.post(
                `/api/sales-leads-generator/report/query/${queryId}`,
                {
                    name,
                    autoRerunActivated,
                },
            );

            dispatch({
                type: WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
                workspaceId,
                queryDefinition,
                lastRun,
            });

            const toastMessage = autoRerunActivated
                ? "workspace.sales.leadgenerator.results-page.save.rerun.query.on"
                : "workspace.sales.leadgenerator.results-page.save.rerun.query.off";

            dispatch(showSuccessToast(i18nFilter()(toastMessage)));
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()("workspace.sales.leadgenerator.results-page.save.query.error"),
                ),
            );
        }
    };
};

export const setLeadsGeneratorReport = (queryId, runId) => {
    return async (dispatch) => {
        dispatch({
            type: WORKSPACE_SALES_SET_LEADS_GENERATOR_REPORT,
            queryId,
            runId,
        });
    };
};

export const removeLeadsGeneratorReport = () => {
    return async (dispatch) => {
        dispatch({
            type: WORKSPACE_SALES_REMOVE_LEADS_GENERATOR_REPORT,
        });
    };
};

export const deleteSearchList = (nameSearchList: string, queryId: string) => {
    const fetchService = DefaultFetchService.getInstance();

    return async (dispatch) => {
        try {
            await fetchService.delete(`/api/sales-leads-generator/report/query/${queryId}`);

            dispatch(
                showSuccessToast(
                    i18nFilter()(
                        "workspace.sales.leadgenerator.results-page.delete.query.success",
                        { name: nameSearchList },
                    ),
                ),
            );
        } catch (e) {
            dispatch(
                showErrorToast(
                    i18nFilter()("workspace.sales.leadgenerator.results-page.delete.query.error", {
                        name: nameSearchList,
                    }),
                ),
            );
        }
    };
};
