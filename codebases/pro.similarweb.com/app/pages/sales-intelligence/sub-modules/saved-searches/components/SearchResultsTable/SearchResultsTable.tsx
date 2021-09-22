import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { usePrevious } from "components/hooks/usePrevious";
import { useTranslation } from "components/WithTranslation/src/I18n";
import SearchResultsLegacyTableWrapper from "./SearchResultsLegacyTableWrapper";
import {
    NotSavedSearchType,
    SavedSearchType,
    SearchTableDataParams,
    SearchTableExcelDownloadParams,
} from "../../types";
import { RootState, ThunkDispatchCommon } from "store/types";
import { StyledSearchResultsTable } from "./styles";
import {
    selectAllUniqueWebsites,
    selectOpportunityListUpdating,
    selectSortedOpportunityLists,
} from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import withToastActions, {
    WithToastActionsProps,
} from "pages/sales-intelligence/hoc/withToastActions";
import { selectTableExcelDownloading, selectTableExcelDownloadError } from "../../store/selectors";
import {
    downloadSearchTableExcelThunk,
    fetchUpdateListOpportunitiesThunk,
} from "../../store/effects";
import { setSearchTableResultsCount } from "pages/sales-intelligence/sub-modules/saved-searches/store/action-creators";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { ExcelQuota } from "pages/sales-intelligence/sub-modules/common/types";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { getQuotaModalInfo } from "pages/sales-intelligence/helpers/quotaModal/helpers";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

type SearchResultsTableProps = WithToastActionsProps & {
    opportunityLists: OpportunityListType[];
    searchObject: NotSavedSearchType | SavedSearchType;
    withExcelExport?: boolean;
    downloadingTableExcel: boolean;
    downloadingTableExcelError?: string;
    downloadTableExcel(dto: SearchTableExcelDownloadParams): void;
    onExcelDownloadSuccess?(): void;
    setSearchTableResultsCount(count: number): void;
    updateOpportunitiesList(
        queryId: string,
        runId: string,
        params: SearchTableDataParams,
        list: OpportunityListType,
        opportunities: string[] | number,
    ): void;
    opportunitiesListUpdating: boolean;
    usedLeadsLimit: number;
    excelQuota: ExcelQuota;
    activePanel: TypeOfSelectors;
    setMultiSelectorPanelByDefault(): void;
};

const SearchResultsTable = (props: SearchResultsTableProps) => {
    const translate = useTranslation();
    const {
        searchObject,
        opportunityLists,
        showErrorToast,
        showSuccessToast,
        downloadTableExcel,
        downloadingTableExcel,
        downloadingTableExcelError,
        withExcelExport = false,
        setSearchTableResultsCount,
        updateOpportunitiesList,
        opportunitiesListUpdating,
        onExcelDownloadSuccess = handleSuccessfulExcelDownload,
        usedLeadsLimit,
        excelQuota,
        activePanel,
        setMultiSelectorPanelByDefault,
    } = props;
    const prevDownloading = usePrevious(downloadingTableExcel);
    const leadsLimit = useSalesSettingsHelper().getQuotaLimit();
    const [isOpenModal, toggleModal] = React.useState(false);

    const onTableDataFetchCallback = React.useCallback(
        (data: { filteredResultCount: number }) => {
            setSearchTableResultsCount(data.filteredResultCount);
        },
        [setSearchTableResultsCount],
    );

    React.useEffect(() => {
        if (
            typeof prevDownloading !== "undefined" &&
            prevDownloading !== downloadingTableExcel &&
            !downloadingTableExcel
        ) {
            if (!downloadingTableExcelError) {
                onExcelDownloadSuccess();
            }
        }
    }, [downloadingTableExcel]);

    function handleSuccessfulExcelDownload() {
        showSuccessToast(translate("si.pages.dynamic_list.successful_list_export_toast"));
    }

    const quotaLimit = () => {
        return activePanel === TypeOfSelectors.ACCOUNT
            ? leadsLimit - usedLeadsLimit
            : excelQuota.remaining;
    };

    const { title, contentText } = getQuotaModalInfo(
        activePanel,
        excelQuota.total,
        leadsLimit,
        translate,
    );

    const handleClickOutOfMaxSelected = () => toggleModal(true);

    const onCloseModalLimit = () => toggleModal(false);

    return (
        <StyledSearchResultsTable>
            <SearchResultsLegacyTableWrapper
                withExcelExport={withExcelExport}
                filters={{
                    ...searchObject.queryDefinition.filters,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    order_by: searchObject.queryDefinition.order_by,
                }}
                searchObject={searchObject}
                showErrorToast={showErrorToast}
                opportunityLists={opportunityLists}
                onTableDataFetchCallback={onTableDataFetchCallback}
                downloadingTableExcel={downloadingTableExcel}
                downloadTableExcel={downloadTableExcel}
                updateOpportunitiesList={updateOpportunitiesList}
                opportunitiesListUpdating={opportunitiesListUpdating}
                maxSelectedRows={quotaLimit()}
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
                setMultiSelectorPanelByDefault={setMultiSelectorPanelByDefault}
            />
            <OutOfLimitModal
                title={title}
                contentText={contentText}
                onClose={onCloseModalLimit}
                isOpen={isOpenModal}
            />
        </StyledSearchResultsTable>
    );
};

const mapStateToProps = (state: RootState) => ({
    opportunitiesListUpdating: selectOpportunityListUpdating(state),
    opportunityLists: selectSortedOpportunityLists(state),
    downloadingTableExcel: selectTableExcelDownloading(state),
    downloadingTableExcelError: selectTableExcelDownloadError(state),
    usedLeadsLimit: selectAllUniqueWebsites(state).length,
    excelQuota: selectExcelQuota(state),
    activePanel: selectActiveSelectorPanel(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            downloadTableExcel: downloadSearchTableExcelThunk,
            setSearchTableResultsCount,
            updateOpportunitiesList: fetchUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

export default withToastActions(
    connect(mapStateToProps, mapDispatchToProps)(SearchResultsTable),
) as React.FC<{
    searchObject: NotSavedSearchType | SavedSearchType;
    withExcelExport?: boolean;
    onExcelDownloadSuccess?(): void;
}>;
