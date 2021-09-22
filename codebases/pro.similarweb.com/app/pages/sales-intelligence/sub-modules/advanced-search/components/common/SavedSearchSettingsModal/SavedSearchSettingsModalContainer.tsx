import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { SavedSearchDto } from "../../../types/common";
import useActionAfterFlagChange from "pages/sales-intelligence/hooks/useActionAfterFlagChange";
import withSearchUpdate, { WithSearchUpdateProps } from "../../../hoc/withSearchUpdate";
import withSearchDelete, { WithSearchDeleteProps } from "../../../hoc/withSearchDelete";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import SavedSearchSettingsModal from "./SavedSearchSettingsModal";
import { toggleSavedSearchSettingsModalAction } from "../../../store/action-creators";
import {
    selectCurrentSearchObject,
    selectIsSavedSearchSettingsModalOpened,
} from "../../../store/selectors";
import { FIND_LEADS_SEARCH_ROUTE } from "pages/sales-intelligence/constants/routes";

type SavedSearchSettingsModalContainerProps = WithSearchUpdateProps &
    WithSearchDeleteProps &
    WithSWNavigatorProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

const SavedSearchSettingsModalContainer = (props: SavedSearchSettingsModalContainerProps) => {
    const {
        isOpened,
        navigator,
        toggleModal,
        currentSavedSearch,
        searchUpdating,
        searchUpdateError,
        searchDeleting,
        searchDeleteError,
        updateSearch,
        deleteSearch,
    } = props;
    const closeModal = () => toggleModal(false);

    const handleUpdate = (name: SavedSearchDto["name"]) => {
        updateSearch(name);
    };

    const handleDelete = () => {
        deleteSearch(currentSavedSearch.searchId);
    };

    useActionAfterFlagChange(searchUpdating, closeModal, typeof searchUpdateError === "undefined");
    useActionAfterFlagChange(
        searchDeleting,
        () => {
            closeModal();
            setTimeout(() => {
                navigator.go(FIND_LEADS_SEARCH_ROUTE, {}, { location: "replace" });
            }, 0);
        },
        typeof searchDeleteError === "undefined",
    );

    return (
        <SavedSearchSettingsModal
            isOpened={isOpened}
            onClose={closeModal}
            onSave={handleUpdate}
            onDelete={handleDelete}
            savedSearch={currentSavedSearch}
            updating={searchUpdating}
            deleting={searchDeleting}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    isOpened: selectIsSavedSearchSettingsModalOpened(state),
    currentSavedSearch: selectCurrentSearchObject(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleModal: toggleSavedSearchSettingsModalAction,
        },
        dispatch,
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSearchUpdate,
    withSearchDelete,
    withSWNavigator,
)(SavedSearchSettingsModalContainer) as React.ComponentType;
