import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import FiltersPanel from "./FiltersPanel";
import { resetFiltersAction, toggleFiltersPanelAction } from "../../../store/action-creators";
import {
    selectCurrentSearchObject,
    selectFiltersConfigFetching,
    selectFiltersPanelExpanded,
    selectNumberOfFiltersInDirtyState,
    selectSearchByIdFetching,
} from "../../../store/selectors";

type ConnectedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const FiltersPanelContainer = (props: ConnectedProps) => {
    const {
        filtersConfigFetching,
        filtersPanelExpanded,
        numberOfFiltersInDirtyState,
        onPanelExpandToggle,
        onFiltersReset,
        searchByIdFetching,
        currentSearchObject,
    } = props;

    return (
        <FiltersPanel
            onFiltersReset={onFiltersReset}
            isExpanded={filtersPanelExpanded}
            onExpandToggle={onPanelExpandToggle}
            isLoading={filtersConfigFetching || searchByIdFetching}
            numberOfFiltersInDirtyState={numberOfFiltersInDirtyState}
            isFirstCategoryInitiallyExpanded={currentSearchObject === null}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    searchByIdFetching: selectSearchByIdFetching(state),
    currentSearchObject: selectCurrentSearchObject(state),
    filtersPanelExpanded: selectFiltersPanelExpanded(state),
    filtersConfigFetching: selectFiltersConfigFetching(state),
    numberOfFiltersInDirtyState: selectNumberOfFiltersInDirtyState(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            onFiltersReset: resetFiltersAction,
            onPanelExpandToggle: toggleFiltersPanelAction,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FiltersPanelContainer) as React.ComponentType<{}>;
