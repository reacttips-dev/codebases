import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSavedSearches } from "../store/selectors";
import { updateSavedSearchThunk } from "../store/effects";
import { getSearchesWithAutoRerunEnabled } from "../helpers";
import { useSalesSettingsHelper } from "../../../services/salesSettingsHelper";

const mapStateToProps = (state: RootState) => ({
    savedSearches: selectSavedSearches(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ toggleAutoReRun: updateSavedSearchThunk }, dispatch);
};

const withSearchAutoRerun = <PROPS extends WithSearchAutoRerunProps>(
    Component: React.ComponentType<PROPS>,
) => {
    const WrappedWithSearchAutoRerun = (props: WithSearchAutoRerunProps) => {
        const { savedSearches } = props;
        const autoRerunLimitCount = useSalesSettingsHelper().getNumberOfAllowedSavedSearches();
        const autoRerunAvailable = React.useMemo(() => {
            return getSearchesWithAutoRerunEnabled(savedSearches).length < autoRerunLimitCount;
        }, [savedSearches, autoRerunLimitCount]);

        return (
            <Component
                {...(props as PROPS)}
                autoRerunLimit={autoRerunLimitCount}
                autoRerunAvailable={autoRerunAvailable}
            />
        );
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSearchAutoRerun) as React.ComponentType<
        Omit<PROPS, keyof WithSearchAutoRerunProps>
    >;
};

export type WithSearchAutoRerunProps = {
    autoRerunLimit: number;
    autoRerunAvailable: boolean;
} & ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withSearchAutoRerun;
