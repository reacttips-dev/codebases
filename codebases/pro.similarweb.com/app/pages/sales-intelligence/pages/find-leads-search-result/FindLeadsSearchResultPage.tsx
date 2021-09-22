import React from "react";
import { FindLeadsSearchResultPageContainerProps } from "./FindLeadsSearchResultPageContainer";
import SearchResultsPage from "../../sub-modules/saved-searches/components/SearchResultsPage/SearchResultsPage";
import SavedSearchExportModalContainer from "../../sub-modules/saved-searches/components/SavedSearchExportModal/SavedSearchExportModalContainer";

const FindLeadsSearchResultPage = (props: FindLeadsSearchResultPageContainerProps) => {
    const { toggleSaveSearchModal } = props;
    const [exportModalOpen, setExportModalOpen] = React.useState(false);
    const closeModal = React.useCallback(() => setExportModalOpen(false), []);
    const handleConfirm = React.useCallback(() => {
        closeModal();
        toggleSaveSearchModal(true);
    }, [toggleSaveSearchModal]);
    const onExcelDownloadSuccess = React.useCallback(() => {
        setExportModalOpen(true);
    }, []);

    return (
        <div>
            <SearchResultsPage
                {...props}
                withExcelExport
                onExcelDownloadSuccess={onExcelDownloadSuccess}
            />
            <SavedSearchExportModalContainer
                isOpen={exportModalOpen}
                onCancel={closeModal}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default FindLeadsSearchResultPage;
