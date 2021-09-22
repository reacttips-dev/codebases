import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyledMainDropdown } from "./styles";
import { RootState, ThunkDispatchCommon } from "single-spa/store/types";
import { SignalsMainDropdownProps } from "./SignalsMainDropdown";
import { setSignalsActiveTabAction } from "../../store/action-creators";
import {
    selectNonZeroSignals,
    selectActiveSignalsTab,
    selectRestCountriesNonZeroSignals,
    selectCurrentCountrySignalsTotal,
    selectRestCountriesSignalsTotal,
} from "../../store/selectors";

const mapStateToProps = (state: RootState) => ({
    signals: selectNonZeroSignals(state),
    selectedTab: selectActiveSignalsTab(state),
    currentCountrySignalsTotal: selectCurrentCountrySignalsTotal(state),
    restCountriesSignalsTotal: selectRestCountriesSignalsTotal(state),
    restCountriesSignals: selectRestCountriesNonZeroSignals(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) =>
    bindActionCreators(
        {
            selectTab: setSignalsActiveTabAction,
        },
        dispatch,
    );

export type SignalsMainDropdownContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(StyledMainDropdown) as React.FC<
    SignalsMainDropdownProps
>;
