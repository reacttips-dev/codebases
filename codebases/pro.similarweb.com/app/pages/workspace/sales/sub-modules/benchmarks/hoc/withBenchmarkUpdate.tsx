import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectBenchmarkIdUpdating } from "../store/selectors";
import {
    addCompetitorInABenchmarkThunkAction,
    removeCompetitorInABenchmarkThunkAction,
    updateCompetitorInABenchmarkThunkAction,
} from "../store/effects";
import { fetchSimilarWebsitesCustomThunkAction } from "../../opportunities-lists/store/effects";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    updatingId: selectBenchmarkIdUpdating(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) =>
    bindActionCreators(
        {
            fetchSimilarWebsites: fetchSimilarWebsitesCustomThunkAction,
            updateCompetitorInABenchmark: updateCompetitorInABenchmarkThunkAction,
            removeCompetitorInABenchmark: removeCompetitorInABenchmarkThunkAction,
            addCompetitorInABenchmark: addCompetitorInABenchmarkThunkAction,
        },
        dispatch,
    );

const withBenchmarkUpdate = <PROPS extends WithBenchmarkUpdateProps>(
    Component: React.ComponentType<PROPS>,
) => {
    const WrappedWithBenchmarkUpdate = (props: WithBenchmarkUpdateProps) => {
        return <Component {...(props as PROPS)} />;
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithBenchmarkUpdate) as React.ComponentType<
        Omit<PROPS, keyof WithBenchmarkUpdateProps>
    >;
};

export type WithBenchmarkUpdateProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default withBenchmarkUpdate;
