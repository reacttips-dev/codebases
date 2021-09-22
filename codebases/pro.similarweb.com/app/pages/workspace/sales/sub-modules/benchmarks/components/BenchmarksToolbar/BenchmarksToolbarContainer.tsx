import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatchCommon } from "store/types";
import { updateBenchmarkSettingsThunkAction } from "../../store/effects";
import BenchmarksToolbar from "./BenchmarksToolbar";
import { mapStateToProps } from "./selectors";
import { BenchmarksToolbarProps } from "./types";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            updateBenchmarkSettings: updateBenchmarkSettingsThunkAction,
        },
        dispatch,
    );
};

export type MultiSelectorsDropdownContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarksToolbar) as React.FC<
    BenchmarksToolbarProps
>;
