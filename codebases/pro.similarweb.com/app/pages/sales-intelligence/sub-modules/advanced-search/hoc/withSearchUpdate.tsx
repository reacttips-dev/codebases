import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSearchThunk } from "../store/effects";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSearchIsUpdating, selectSearchUpdateError } from "../store/selectors";

const mapStateToProps = (state: RootState) => ({
    searchUpdating: selectSearchIsUpdating(state),
    searchUpdateError: selectSearchUpdateError(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            updateSearch: updateSearchThunk,
        },
        dispatch,
    );
};

const withSearchUpdate = <PROPS extends WithSearchUpdateProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithSearchUpdate(props: PROPS) {
        return <ConsumerComponent {...props} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSearchUpdate) as React.ComponentType<Omit<PROPS, keyof WithSearchUpdateProps>>;
};

export type WithSearchUpdateProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withSearchUpdate;
