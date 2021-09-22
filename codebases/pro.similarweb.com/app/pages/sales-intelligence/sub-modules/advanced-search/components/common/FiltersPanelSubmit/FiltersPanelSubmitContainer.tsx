import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import withCurrentSavedSearch, {
    WithCurrentSavedSearchProps,
} from "../../../hoc/withCurrentSavedSearch";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { RootState } from "store/types";
import withToastActions from "pages/sales-intelligence/hoc/withToastActions";
import withSearchCreate from "../../../hoc/withSearchCreate";
import withSearchUpdate from "../../../hoc/withSearchUpdate";
import FiltersPanelSubmit, { FiltersPanelSubmitProps } from "./FiltersPanelSubmit";
import {
    selectNumberOfFiltersInBothStates,
    selectRecentlyCreatedSearchId,
} from "../../../store/selectors";

const FiltersPanelSubmitContainer = (
    props: FiltersPanelSubmitProps &
        WithCurrentSavedSearchProps &
        WithSWNavigatorProps &
        ReturnType<typeof mapStateToProps>,
) => {
    const { savedSearch, ...rest } = props;

    return <FiltersPanelSubmit {...rest} mode={savedSearch === null ? "create" : "update"} />;
};

const mapStateToProps = (state: RootState) => ({
    recentlyCreatedSearchId: selectRecentlyCreatedSearchId(state),
    numberOfFiltersInBothStates: selectNumberOfFiltersInBothStates(state),
});

export default compose(
    withCurrentSavedSearch,
    withSearchUpdate,
    withSearchCreate,
    withToastActions,
    withSWNavigator,
    connect(mapStateToProps),
)(FiltersPanelSubmitContainer) as React.ComponentType<{
    isClearButtonDisabled: boolean;
    onFiltersClear(): void;
}>;
