import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { selectLegacyWorkspaceId } from "../sub-modules/common/store/selectors";

const mapStateToProps = (state: RootState) => ({
    workspaceId: selectLegacyWorkspaceId(state),
});

const withLegacyWorkspaceId = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    return connect(mapStateToProps, null)(Component);
};

export type WithLegacyWorkspaceIdProps = ReturnType<typeof mapStateToProps>;
export default withLegacyWorkspaceId;
