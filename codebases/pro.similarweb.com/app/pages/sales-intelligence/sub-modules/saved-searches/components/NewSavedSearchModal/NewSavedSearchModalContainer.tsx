import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NewSavedSearchModal from "./NewSavedSearchModal";
import { usePrevious } from "components/hooks/usePrevious";
import { NotSavedSearchType, QueryDefinition, SaveSearchDto } from "../../types";
import withSearchAutoRerun, { WithSearchAutoRerunProps } from "../../hoc/withSearchAutoRerun";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSaveSearchModalOpen, selectSearchSaving } from "../../store/selectors";
import { saveSearchThunk } from "../../store/effects";
import { resetReportResult, toggleSaveSearchModal } from "../../store/action-creators";
import { getSearchId } from "../../helpers";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { DYNAMIC_LIST_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";

type NewSavedSearchModalContainerProps = {
    searchObject: NotSavedSearchType;
};

type ConnectedNewSavedSearchModalProps = WithSWNavigatorProps &
    WithSearchAutoRerunProps & {
        searchSaving: boolean;
        saveSearchModalOpen: boolean;
        resetReportResult(): void;
        toggleSaveSearchModal(open: boolean): void;
        saveSearch(queryId: QueryDefinition["id"], dto: SaveSearchDto): void;
    };

const NewSavedSearchModalContainer = (
    props: NewSavedSearchModalContainerProps & ConnectedNewSavedSearchModalProps,
) => {
    const {
        searchObject,
        saveSearch,
        searchSaving,
        saveSearchModalOpen,
        autoRerunAvailable,
        resetReportResult,
        toggleSaveSearchModal,
        navigator,
    } = props;
    const queryId = getSearchId(searchObject);
    const prevSaving = usePrevious(searchSaving);
    const closeModal = React.useCallback(() => toggleSaveSearchModal(false), [
        toggleSaveSearchModal,
    ]);
    const handleSearchSaving = React.useCallback(
        (name: string, autoRerunActivated: boolean) => {
            saveSearch(queryId, {
                name,
                autoRerunActivated,
            });
        },
        [saveSearch, searchObject],
    );

    React.useEffect(() => {
        if (typeof prevSaving !== "undefined" && prevSaving !== searchSaving && !searchSaving) {
            closeModal();
            resetReportResult();
            navigator.go(DYNAMIC_LIST_PAGE_ROUTE, { id: queryId }, { location: "replace" });
        }
    }, [searchSaving]);

    return (
        <NewSavedSearchModal
            onClose={closeModal}
            loading={searchSaving}
            onSave={handleSearchSaving}
            isOpen={saveSearchModalOpen}
            autoRerunAvailable={autoRerunAvailable}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    searchSaving: selectSearchSaving(state),
    saveSearchModalOpen: selectSaveSearchModalOpen(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            saveSearch: saveSearchThunk,
            resetReportResult,
            toggleSaveSearchModal,
        },
        dispatch,
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSearchAutoRerun,
    withSWNavigator,
)(NewSavedSearchModalContainer) as React.FC<NewSavedSearchModalContainerProps>;
