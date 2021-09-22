import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { setSecondaryBarType, toggleSecondaryBar } from "actions/secondaryBarActions";

const mapStateToProps = (state: RootState) => ({
    secondaryBarType: state.secondaryBar.secondaryBarType,
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleSecondaryBar,
            setSecondaryBarType,
        },
        dispatch,
    );
};

const withSecondaryBarSet = (type: SecondaryBarType) => <PROPS extends {}>(
    Component: React.ComponentType<PROPS>,
) => {
    function WrappedWithSecondaryBarReset(props: PROPS & WithSecondaryBarSetProps) {
        const { setSecondaryBarType, secondaryBarType, toggleSecondaryBar, ...rest } = props;

        React.useEffect(() => {
            if (secondaryBarType !== type) {
                setSecondaryBarType(type);
            }

            toggleSecondaryBar(false);
        }, [secondaryBarType]);

        return <Component {...((rest as unknown) as PROPS)} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSecondaryBarReset) as React.ComponentType<PROPS>;
};

export type WithSecondaryBarSetProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withSecondaryBarSet;
