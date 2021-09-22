import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyledSignalsContainer } from "./styles";
import {
    selectNonZeroSignals,
    selectSignalsFetching,
    selectMostUsedSignalsKeys,
    selectActiveSignalFilter,
    selectActiveSignalSubFilterId,
    selectRestCountriesNonZeroSignals,
} from "../store/selectors";
import * as e from "../store/effects";
import * as a from "../store/action-creators";
import { SignalsContainerProps } from "./SignalsContainerComponent";
import { RootState, ThunkDispatchCommon } from "single-spa/store/types";

/**
 * @param state
 * @param props
 */
const mapStateToProps = <P extends { opportunitiesListId: string }>(
    state: RootState,
    props: P,
) => ({
    signals: selectNonZeroSignals(state),
    restCountriesSignals: selectRestCountriesNonZeroSignals(state),
    selectedSignal: selectActiveSignalFilter(state),
    selectedSubFilterId: selectActiveSignalSubFilterId(state),
    isSignalsFetching: selectSignalsFetching(state),
    mostUsedSignalsKeys: selectMostUsedSignalsKeys(state, props),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchSignals: e.fetchSignalsForCountryThunkAction,
            fetchSignalsForAllOrInverse: e.fetchSignalsForAllOrInverseThunkAction,
            getSignalUse: e.getSignalsUseThunkAction,
            syncSignalUse: e.syncSignalsUseThunkAction,
            updateSignalsUse: a.updateSignalsUseAction,
            selectSignal: a.setActiveSignalFilterAction,
            selectSignalSubFilter: a.setActiveSignalSubFilterAction,
            selectTab: a.setSignalsActiveTabAction,
        },
        dispatch,
    );
};

export type SignalsContainerConnectedProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(StyledSignalsContainer) as React.FC<
    SignalsContainerProps
>;
