import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatchCommon } from "store/types";
import { showSuccessToast, showErrorToast } from "actions/toast_actions";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ showSuccessToast, showErrorToast }, dispatch);
};

const withToastActions = <PROPS extends WithToastActionsProps>(
    Component: React.ComponentType<PROPS>,
): React.ComponentType<Omit<PROPS, keyof WithToastActionsProps>> => {
    return connect(null, mapDispatchToProps)(Component);
};

export type WithToastActionsProps = {
    showErrorToast(text?: string): void;
    showSuccessToast(text?: string): void;
};
export default withToastActions;
