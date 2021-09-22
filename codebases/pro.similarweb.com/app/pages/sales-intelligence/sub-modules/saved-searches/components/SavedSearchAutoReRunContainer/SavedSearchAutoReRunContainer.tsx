import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "store/types";
import SavedSearchAutoReRun from "./SavedSearchAutoReRun";
import withToastActions, { WithToastActionsProps } from "../../../../hoc/withToastActions";
import withSearchAutoRerun, { WithSearchAutoRerunProps } from "../../hoc/withSearchAutoRerun";
import { selectSearchUpdateError, selectSearchUpdating } from "../../store/selectors";
import { SavedSearchType } from "../../types";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    searchUpdating: selectSearchUpdating(state),
    searchUpdateError: selectSearchUpdateError(state),
});

const SavedSearchAutoReRunContainer = compose(
    connect(mapStateToProps, null),
    withToastActions,
    withSearchAutoRerun,
)(SavedSearchAutoReRun);

export type SavedSearchAutoReRunContainerProps = ReturnType<typeof mapStateToProps> &
    WithToastActionsProps &
    WithSearchAutoRerunProps;
export default SavedSearchAutoReRunContainer as React.FC<{
    savedSearches: SavedSearchType[];
    currentSavedSearch: SavedSearchType;
}>;
