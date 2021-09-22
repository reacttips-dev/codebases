import {
    SET_LEAD_GENERATOR_REPORTS,
    LOAD_LEAD_GENERATOR_REPORTS_DATA,
    SET_LEAD_GENERATOR_REPORTS_DATA,
    UPDATE_LEAD_GENERATOR_REPORT_NAME,
    ARCHIVE_LEAD_GENERATOR_REPORT,
    UNARCHIVE_LEAD_GENERATOR_REPORT,
    LOAD_LEAD_GENERATOR_REPORT_NAME,
} from "../../action_types/leadGenerator_action_types";
import { navObj } from "../../pages/lead-generator/leadGeneratorNavObj";

const DEFAULT_LEAD_GENERATOR_STATE = {
    reports: [],
    navList: [],
    reportsData: [],
    reportsDataLoading: false,
    reportNameLoading: "",
};

export default function (state = DEFAULT_LEAD_GENERATOR_STATE, action) {
    let updatedReports;
    switch (action.type) {
        case SET_LEAD_GENERATOR_REPORTS:
            updatedReports = formatReportsFromServer(action.reports);
            return {
                ...state,
                reports: updatedReports,
                navList: navObj(updatedReports),
            };
        case LOAD_LEAD_GENERATOR_REPORTS_DATA:
            return {
                ...state,
                reportsDataLoading: true,
            };
        case SET_LEAD_GENERATOR_REPORTS_DATA:
            return {
                ...state,
                reportsData: action.reportsData,
                reportsDataLoading: false,
            };
        case LOAD_LEAD_GENERATOR_REPORT_NAME:
            return {
                ...state,
                reportNameLoading: action.reportId,
            };
        case UPDATE_LEAD_GENERATOR_REPORT_NAME:
            updatedReports = updateReportAfterRename(state.reports, action.report);
            return {
                ...state,
                reports: updatedReports,
                navList: navObj(updatedReports),
                reportsData: updateReportDataAfterRename(state.reportsData, action.report),
                reportNameLoading: "",
            };
        case ARCHIVE_LEAD_GENERATOR_REPORT:
            updatedReports = updateReportAfterArchive(state.reports, action.reportId, 1);
            const updatedReportsData = updateReportDataAfterArchive(
                state.reportsData,
                action.reportId,
                1,
            );
            return {
                ...state,
                reports: updatedReports,
                navList: navObj(updatedReports),
                reportsData: updatedReportsData,
            };
        case UNARCHIVE_LEAD_GENERATOR_REPORT:
            updatedReports = updateReportAfterArchive(state.reports, action.reportId, 0);
            return {
                ...state,
                reports: updatedReports,
                navList: navObj(updatedReports),
                reportsData: updateReportDataAfterArchive(state.reportsData, action.reportId, 0),
            };
        default:
            return {
                ...state,
            };
    }
}

function formatReportsFromServer(reports) {
    return reports.map(({ queryName, reportId, lastRunId: runId, status }) => ({
        title: queryName,
        name: queryName,
        state: "leadGenerator.exist",
        reportId,
        runId,
        status,
    }));
}

function updateReportDataAfterRename(allReports, updateReport) {
    return allReports.map((crr) => {
        if (crr.queryDefinition.id === updateReport.reportId) {
            return {
                ...crr,
                queryDefinition: {
                    ...crr.queryDefinition,
                    name: updateReport.reportName,
                },
            };
        }
        return { ...crr };
    });
}

function updateReportAfterRename(allReports, updateReport) {
    return allReports.map((crr) => {
        if (crr.reportId === updateReport.reportId) {
            return { ...crr, name: updateReport.reportName, title: updateReport.reportName };
        }
        return { ...crr };
    });
}

function updateReportAfterArchive(allReports, archivedReportId, newStatus) {
    return allReports.map((crr) => {
        if (crr.reportId === archivedReportId) {
            return { ...crr, status: newStatus };
        }
        return { ...crr };
    });
}

function updateReportDataAfterArchive(allReports, archivedReportId, newStatus) {
    return allReports.map((crr) => {
        if (crr.queryDefinition.id === archivedReportId) {
            return {
                ...crr,
                queryDefinition: {
                    ...crr.queryDefinition,
                    status: newStatus,
                },
            };
        }
        return { ...crr };
    });
}
