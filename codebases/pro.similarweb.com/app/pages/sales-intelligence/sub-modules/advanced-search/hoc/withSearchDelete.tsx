import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteSearchThunk } from "../store/effects";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSearchDeleteError, selectSearchIsDeleting } from "../store/selectors";

const mapStateToProps = (state: RootState) => ({
    searchDeleting: selectSearchIsDeleting(state),
    searchDeleteError: selectSearchDeleteError(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            deleteSearch: deleteSearchThunk,
        },
        dispatch,
    );
};

const withSearchDelete = <PROPS extends WithSearchDeleteProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithSearchDelete(props: PROPS) {
        return <ConsumerComponent {...props} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSearchDelete) as React.ComponentType<Omit<PROPS, keyof WithSearchDeleteProps>>;
};

export type WithSearchDeleteProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withSearchDelete;
