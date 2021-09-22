import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import MySavedSearchesModal from "./MySavedSearchesModal";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { selectIsSavedSearchesModalOpened, selectAllSavedSearches } from "../../../store/selectors";
import { toggleSavedSearchesModalAction } from "../../../store/action-creators";
import { FIND_LEADS_SAVED_SEARCH_ROUTE } from "pages/sales-intelligence/constants/routes";

type MySavedSearchesModalContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;

const MySavedSearchesModalContainer = (props: MySavedSearchesModalContainerProps) => {
    const { isOpened, toggleModal, navigator, savedSearches } = props;

    const handleClose = () => {
        toggleModal(false);
    };

    const handleExistingSearchClick = (id: string) => {
        toggleModal(false);
        navigator.go(FIND_LEADS_SAVED_SEARCH_ROUTE, { id });
    };

    return (
        <MySavedSearchesModal
            isOpened={isOpened}
            onClose={handleClose}
            savedSearches={savedSearches}
            onExistingSearchClick={handleExistingSearchClick}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    isOpened: selectIsSavedSearchesModalOpened(state),
    savedSearches: selectAllSavedSearches(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleModal: toggleSavedSearchesModalAction,
        },
        dispatch,
    );
};

export default withSWNavigator(
    connect(mapStateToProps, mapDispatchToProps)(MySavedSearchesModalContainer),
) as React.ComponentType<{}>;
