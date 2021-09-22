import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { usePrevious } from "components/hooks/usePrevious";
import { RootState, ThunkDispatchCommon } from "store/types";
import { MY_LISTS_PAGE_ROUTE } from "../../../constants/routes";
import { WithSWNavigatorProps } from "../../../hoc/withSWNavigator";
import { OpportunityListType } from "../../../sub-modules/opportunities/types";
import { opportunityListHasId } from "../../../sub-modules/opportunities/helpers";
import { fetchWorkspacesThunk } from "../../../sub-modules/common/store/effects";
import { selectSortedOpportunityLists } from "../../../sub-modules/opportunities/store/selectors";
import { selectLegacyWorkspacesFetching } from "../../../sub-modules/common/store/selectors";
import { toggleNotFoundListModalOpen } from "../../../sub-modules/common/store/action-creators";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    opportunityLists: selectSortedOpportunityLists(state),
    workspacesFetching: selectLegacyWorkspacesFetching(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        { fetchWorkspaces: fetchWorkspacesThunk, toggleNotFoundListModalOpen },
        dispatch,
    );
};

/**
 * A HOC that handles redirection in case of not existing opportunity list
 * @param Component
 */
const withNotFoundListGuard = (
    Component: React.ComponentType<
        { list: OpportunityListType; lists: OpportunityListType[] } & WithSWNavigatorProps
    >,
) => {
    const WrappedWithNotFoundListGuard: React.FC<
        WithSWNavigatorProps & WithNotFoundListGuardProps
    > = (props) => {
        const {
            navigator,
            opportunityLists,
            workspacesFetching,
            fetchWorkspaces,
            toggleNotFoundListModalOpen,
        } = props;
        const { id } = navigator.getParams();
        const foundList = opportunityLists.find(opportunityListHasId(id));
        const [ready, setReady] = React.useState(Boolean(foundList));
        const previousWorkspacesFetching = usePrevious(workspacesFetching);

        // Fetch workspaces if the list was not found
        React.useEffect(() => {
            if (!ready) {
                fetchWorkspaces();
            }
        }, []);

        // React to workspaces being fetched
        React.useEffect(() => {
            if (
                typeof previousWorkspacesFetching !== "undefined" &&
                previousWorkspacesFetching !== workspacesFetching &&
                !workspacesFetching
            ) {
                if (!foundList) {
                    // We haven't found a list. Redirect to home.
                    navigator.go(MY_LISTS_PAGE_ROUTE, {}, { location: "replace" });
                    toggleNotFoundListModalOpen(true);
                } else {
                    // List was found. Render it.
                    setReady(true);
                }
            }
        }, [workspacesFetching]);

        if (!ready) {
            // TODO: The loading should be shown
            return null;
        }

        return <Component navigator={navigator} list={foundList} lists={opportunityLists} />;
    };

    return connect(mapStateToProps, mapDispatchToProps)(WrappedWithNotFoundListGuard);
};

export type WithNotFoundListGuardProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withNotFoundListGuard;
