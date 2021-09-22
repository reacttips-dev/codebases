import { createStructuredSelector } from "reselect";
import { RootState } from "store/types";
import {
    selectAllUniqueWebsites,
    selectOpportunityListUpdating,
} from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";

// tableData
const selectTotalData = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.totalTable;

const selectOrganicData = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.organicTable;

const selectPaidData = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.paidTable;

const selectMobileData = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.mobileTable;

// isFetching
const selectTotalTableFetching = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.totalTableFetching;

const selectOrganicTableFetching = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.organicTableFetching;

const selectPaidTableFetching = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.paidTableFetching;

const selectMobileTableFetching = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.mobileTableFetching;

// categories
const selectTotalCategories = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.totalCategories;

const selectPaidCategories = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.paidCategories;

const selectOrganicCategories = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.organicCategories;

const selectMobileCategories = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.mobileCategories;

// filters
const selectTotalExcelDownloading = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.totalTableExcelDownloading;

const selectPaidExcelDownloading = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.paidTableExcelDownloading;

const selectOrganicExcelDownloading = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.organicTableExcelDownloading;

const selectMobileExcelDownloading = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.mobileTableExcelDownloading;

// isExcelDownloading
const selectTotalFilters = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.totalTableFilters;

const selectPaidFilters = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.paidTableFilters;

const selectOrganicFilters = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.organicTableFilters;

const selectMobileFilters = ({ salesIntelligence }: RootState) =>
    salesIntelligence.keywordLeads.mobileTableFilters;

const usedLeadsLimit = (state: RootState) => selectAllUniqueWebsites(state).length;

const excelQuota = (state: RootState) => selectExcelQuota(state);

const activePanel = (state: RootState) => selectActiveSelectorPanel(state);

// Structured Selectors
export const totalMapStateToProps = createStructuredSelector({
    excelQuota,
    activePanel,
    usedLeadsLimit,
    tableData: selectTotalData,
    tableFilters: selectTotalFilters,
    categories: selectTotalCategories,
    isFetching: selectTotalTableFetching,
    listUpdating: selectOpportunityListUpdating,
    excelDownloading: selectTotalExcelDownloading,
});
export const organicMapStateToProps = createStructuredSelector({
    excelQuota,
    activePanel,
    usedLeadsLimit,
    tableData: selectOrganicData,
    tableFilters: selectOrganicFilters,
    categories: selectOrganicCategories,
    isFetching: selectOrganicTableFetching,
    listUpdating: selectOpportunityListUpdating,
    excelDownloading: selectOrganicExcelDownloading,
});
export const paidMapStateToProps = createStructuredSelector({
    excelQuota,
    activePanel,
    usedLeadsLimit,
    tableData: selectPaidData,
    tableFilters: selectPaidFilters,
    categories: selectPaidCategories,
    isFetching: selectPaidTableFetching,
    listUpdating: selectOpportunityListUpdating,
    excelDownloading: selectPaidExcelDownloading,
});
export const mobileMapStateToProps = createStructuredSelector({
    excelQuota,
    activePanel,
    usedLeadsLimit,
    tableData: selectMobileData,
    tableFilters: selectMobileFilters,
    categories: selectMobileCategories,
    isFetching: selectMobileTableFetching,
    listUpdating: selectOpportunityListUpdating,
    excelDownloading: selectMobileExcelDownloading,
});
