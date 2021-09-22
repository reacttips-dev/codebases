import { connect } from "react-redux";
import { ThunkDispatchCommon } from "single-spa/store/types";
import { bindActionCreators } from "redux";
import { TechnologiesComponent } from "./Technologies";
import { TechnologiesProps } from "../../types";
import { setTechnologiesCategory } from "../../../../store/action-creators";
import { RootState } from "single-spa/store/types";
import { selectPreviousCategory } from "../../../../store/selectors";
import { selectTopicFromSettings } from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            setCategory: setTechnologiesCategory,
        },
        dispatch,
    );
};
const mapStateToProps = (state: RootState) => ({
    defaultCategory: selectPreviousCategory(state),
    topic: selectTopicFromSettings(state),
});

export type TechnologiesConnectedProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    TechnologiesProps;

export const Technologies = connect(mapStateToProps, mapDispatchToProps)(TechnologiesComponent);
