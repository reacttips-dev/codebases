import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import AdvancedSearchPage from "./AdvancedSearchPage";
import { SavedSearchDto } from "../../../types/common";
import { RootState, ThunkDispatchCommon } from "store/types";
import withSearchByIdRequest from "../../../hoc/withSearchByIdRequest";
import withCurrentSavedSearch from "../../../hoc/withCurrentSavedSearch";
import withFiltersFromSavedSearchInit from "../../../hoc/withFiltersFromSavedSearchInit";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import { fetchSearchResultsThunk } from "../../../store/effects";
import { selectFiltersInReadyState, selectTableFilters } from "../../../store/selectors";

type SavedSearchPageContainerProps = WithSWNavigatorProps & {
    searchId: string;
    savedSearch: SavedSearchDto | null;
    clearCurrentSearch(): void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const SavedSearchPageContainer = (props: SavedSearchPageContainerProps & ConnectedProps) => {
    const {
        navigator,
        clearCurrentSearch,
        savedSearch,
        tableFilters,
        fetchSearchResults,
        filtersInReadyState,
    } = props;

    React.useEffect(() => {
        if (savedSearch !== null) {
            fetchSearchResults(filtersInReadyState, tableFilters);
        }
    }, [filtersInReadyState, tableFilters]);

    React.useEffect(() => {
        return () => {
            if (typeof clearCurrentSearch === "function") {
                clearCurrentSearch();
            }
        };
    }, []);

    return <AdvancedSearchPage navigator={navigator} />;
};

const mapStateToProps = (state: RootState) => ({
    tableFilters: selectTableFilters(state),
    filtersInReadyState: selectFiltersInReadyState(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchSearchResults: fetchSearchResultsThunk,
        },
        dispatch,
    );
};

export default compose(
    withSearchByIdRequest,
    withCurrentSavedSearch,
    withFiltersFromSavedSearchInit,
)(
    connect(mapStateToProps, mapDispatchToProps)(SavedSearchPageContainer) as React.ComponentType<
        SavedSearchPageContainerProps
    >,
);
