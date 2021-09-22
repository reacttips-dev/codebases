import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import EmailSubscribe from "./EmailSubscribe";
import { bindActionCreators } from "redux";

const mapStateToProps = (state: RootState) => ({
    impersonated: state.impersonation.impersonateMode,
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({}, dispatch);
};

const EmailSubscribeContainer = connect(mapStateToProps, mapDispatchToProps)(EmailSubscribe);

export type EmailSubscribeContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default EmailSubscribeContainer;
