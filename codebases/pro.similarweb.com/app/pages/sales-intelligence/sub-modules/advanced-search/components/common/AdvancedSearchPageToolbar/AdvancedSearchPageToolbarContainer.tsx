import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import AdvancedSearchPageToolbar from "./AdvancedSearchPageToolbar";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { selectCurrentSearchObject, selectNumberOfSavedSearches } from "../../../store/selectors";
import NewSearchModalContainer from "../NewSearchModal/NewSearchModalContainer";
import MySavedSearchesModalContainer from "../MySavedSearchesModal/MySavedSearchesModalContainer";
import SavedSearchSettingsModalContainer from "../SavedSearchSettingsModal/SavedSearchSettingsModalContainer";
import {
    toggleNewSearchModalAction,
    toggleSavedSearchesModalAction,
    toggleSavedSearchSettingsModalAction,
} from "../../../store/action-creators";

const AdvancedSearchPageToolbarContainer = (
    props: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
) => {
    const translate = useTranslation();
    const {
        currentSearchObject,
        numberOfSavedSearches,
        toggleSavedSearchesModal,
        toggleNewSearchModal,
        toggleSettingsModal,
    } = props;
    const title = currentSearchObject?.name ?? translate("si.pages.lead_gen.title");

    return (
        <>
            {currentSearchObject !== null && <SavedSearchSettingsModalContainer />}
            <MySavedSearchesModalContainer />
            <NewSearchModalContainer />
            <AdvancedSearchPageToolbar
                title={title}
                isSavedSearchesButtonDisabled={numberOfSavedSearches === 0}
                onSettingsClick={
                    currentSearchObject !== null ? () => toggleSettingsModal(true) : undefined
                }
                onNewSearchClick={() => toggleNewSearchModal(true)}
                onManageSavedSearchesClick={() => toggleSavedSearchesModal(true)}
            />
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    currentSearchObject: selectCurrentSearchObject(state),
    numberOfSavedSearches: selectNumberOfSavedSearches(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleSavedSearchesModal: toggleSavedSearchesModalAction,
            toggleNewSearchModal: toggleNewSearchModalAction,
            toggleSettingsModal: toggleSavedSearchSettingsModalAction,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdvancedSearchPageToolbarContainer) as React.ComponentType<{}>;
