import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatchCommon } from "store/types";
import { fetchWorkspacesThunk } from "../sub-modules/common/store/effects";

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchWorkspaces: fetchWorkspacesThunk,
        },
        dispatch,
    );
};

/**
 * The HOC to use in all root pages to fetch legacy workspaces.
 * @param Component
 */
const withLegacyWorkspacesFetch = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    function WrappedWithLegacyWorkspacesFetch(props: PROPS & WithLegacyWorkspacesFetchProps) {
        React.useEffect(() => {
            props.fetchWorkspaces();
        }, []);

        return <Component {...(props as PROPS)} />;
    }

    return connect(null, mapDispatchToProps)(WrappedWithLegacyWorkspacesFetch);
};

export type WithLegacyWorkspacesFetchProps = ReturnType<typeof mapDispatchToProps>;
export default withLegacyWorkspacesFetch;
