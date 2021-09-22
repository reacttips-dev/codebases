import { connect } from "react-redux";
import { hideToast } from "actions/toast_actions.ts";

import Toasts, { StateProps, DispatchProps } from "./Toasts";
import SWReactRootComponent from "decorators/SWReactRootComponent.ts";

const mapStateToProps = ({ ui: { toasts } }): StateProps => ({ toasts });

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    hideToast: (toast) => dispatch(hideToast(toast)),
});

export default SWReactRootComponent(
    connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Toasts),
    "Toasts",
);
