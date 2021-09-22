import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SavedSearchSettingsModal from "./SavedSearchSettingsModal";
import { RootState, ThunkDispatchCommon } from "store/types";
import { usePrevious } from "components/hooks/usePrevious";
import { SavedSearchType } from "pages/sales-intelligence/sub-modules/saved-searches/types";
import { getSearchId, updateSavedSearchName, getSearchAutoRerunEnabled } from "../../helpers";
import {
    toggleSavedSearchSettingsModal,
    removeSavedSearchAction,
} from "../../store/action-creators";
import {
    selectSavedSearchSettingsModalOpen,
    selectSearchDeleteError,
    selectSearchDeleting,
    selectSearchUpdating,
} from "../../store/selectors";
import { deleteSavedSearchThunk, updateSavedSearchThunk } from "../../store/effects";

type SavedSearchSettingsModalContainerProps = {
    savedSearch: SavedSearchType;
    onSavedSearchDelete(): void;
};

type SavedSearchSettingsModalConnectedProps = {
    savedSearchSettingsModalOpen: boolean;
    searchUpdating: boolean;
    searchDeleting: boolean;
    searchDeleteError?: string;
    toggleSettingsModal(open: boolean): void;
    removeSavedSearch(...args: Parameters<typeof removeSavedSearchAction>): void;
    deleteSavedSearch(...args: Parameters<typeof deleteSavedSearchThunk>): void;
    updateSavedSearch(...args: Parameters<typeof updateSavedSearchThunk>): void;
};

const SavedSearchSettingsModalContainer = (
    props: SavedSearchSettingsModalContainerProps & SavedSearchSettingsModalConnectedProps,
) => {
    const {
        savedSearch,
        savedSearchSettingsModalOpen,
        searchUpdating,
        searchDeleting,
        searchDeleteError,
        updateSavedSearch,
        deleteSavedSearch,
        toggleSettingsModal,
        removeSavedSearch,
        onSavedSearchDelete,
    } = props;
    const id = getSearchId(savedSearch);
    const prevUpdating = usePrevious(searchUpdating);
    const prevDeleting = usePrevious(searchDeleting);
    const closeModal = React.useCallback(() => toggleSettingsModal(false), [toggleSettingsModal]);
    const handleDelete = React.useCallback(() => {
        deleteSavedSearch(id);
    }, [savedSearch, deleteSavedSearch]);
    const handleUpdate = React.useCallback(
        (name: string) => {
            updateSavedSearch(
                updateSavedSearchName(name, savedSearch),
                getSearchAutoRerunEnabled(savedSearch),
            );
        },
        [savedSearch, updateSavedSearch],
    );

    // Reacting to update has been finished
    React.useEffect(() => {
        if (
            typeof prevUpdating !== "undefined" &&
            prevUpdating !== searchUpdating &&
            !searchUpdating
        ) {
            if (savedSearchSettingsModalOpen) {
                closeModal();
            }
        }
    }, [searchUpdating, savedSearchSettingsModalOpen]);

    // Reacting to delete has been finished
    React.useEffect(() => {
        if (
            typeof prevDeleting !== "undefined" &&
            prevDeleting !== searchDeleting &&
            !searchDeleting
        ) {
            if (!searchDeleteError) {
                closeModal();
                onSavedSearchDelete();

                // Schedule object removal from store
                setTimeout(() => {
                    removeSavedSearch(id);
                }, 0);
            }
        }
    }, [searchDeleting, searchDeleteError, onSavedSearchDelete]);

    return (
        <SavedSearchSettingsModal
            onClose={closeModal}
            onSave={handleUpdate}
            onDelete={handleDelete}
            savedSearch={savedSearch}
            updating={searchUpdating}
            deleting={searchDeleting}
            isOpen={savedSearchSettingsModalOpen}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    searchUpdating: selectSearchUpdating(state),
    searchDeleting: selectSearchDeleting(state),
    searchDeleteError: selectSearchDeleteError(state),
    savedSearchSettingsModalOpen: selectSavedSearchSettingsModalOpen(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            updateSavedSearch: updateSavedSearchThunk,
            deleteSavedSearch: deleteSavedSearchThunk,
            toggleSettingsModal: toggleSavedSearchSettingsModal,
            removeSavedSearch: removeSavedSearchAction,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SavedSearchSettingsModalContainer) as React.FC<SavedSearchSettingsModalContainerProps>;
