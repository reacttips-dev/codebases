import React from "react";
import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSavedSearches } from "../store/selectors";
import { WithSWNavigatorProps } from "../../../hoc/withSWNavigator";
import { QueryDefinition, NotSavedSearchType, SavedSearchType } from "../types";
import { searchHasQueryId } from "../helpers";
import { bindActionCreators } from "redux";
import { fetchWorkspacesThunk } from "../../common/store/effects";
import useActionAfterFlagChange from "pages/sales-intelligence/hooks/useActionAfterFlagChange";
import { selectLegacyWorkspacesFetching } from "../../common/store/selectors";
import { WithFallbackRouteProps } from "pages/sales-intelligence/hoc/withFallbackRoute";
import { MY_LISTS_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    searches: selectSavedSearches(state),
    workspacesFetching: selectLegacyWorkspacesFetching(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ fetchWorkspaces: fetchWorkspacesThunk }, dispatch);
};

const withNotFoundSearchGuard = (
    Component: React.ComponentType<
        WithSWNavigatorProps & {
            searchObject: SavedSearchType | NotSavedSearchType;
            savedSearches: SavedSearchType[];
        }
    >,
) => {
    const WrappedWithNotFoundSearchGuard = (
        props: WithSWNavigatorProps & WithNotFoundSearchGuardProps & WithFallbackRouteProps,
    ) => {
        const { navigator, fetchWorkspaces, workspacesFetching, searches } = props;
        const { id } = navigator.getParams();
        const searchObject = getFromSavedSearches(id);
        const [ready, setReady] = React.useState(Boolean(searchObject));

        // Fetch workspaces if the search was not found
        React.useEffect(() => {
            if (!ready) {
                fetchWorkspaces();
            }
        }, []);

        // React to workspaces being fetched
        useActionAfterFlagChange(workspacesFetching, () => {
            if (!searchObject) {
                // We haven't found a search. Redirect to home.
                navigator.go(MY_LISTS_PAGE_ROUTE, {}, { location: "replace" });
            } else {
                // Search object was found. Render page.
                setReady(true);
            }
        });

        function getFromSavedSearches(id: QueryDefinition["id"]) {
            return searches.find(searchHasQueryId(id));
        }

        if (!ready) {
            // TODO: The loading should be shown. Ask designer to prepare.
            return null;
        }

        return (
            <Component navigator={navigator} savedSearches={searches} searchObject={searchObject} />
        );
    };

    return connect(mapStateToProps, mapDispatchToProps)(WrappedWithNotFoundSearchGuard);
};

export type WithNotFoundSearchGuardProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withNotFoundSearchGuard;
