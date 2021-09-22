import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { saveNewSearchThunk } from "../store/effects";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectSearchCreateError, selectSearchIsCreating } from "../store/selectors";

const mapStateToProps = (state: RootState) => ({
    searchCreating: selectSearchIsCreating(state),
    searchCreateError: selectSearchCreateError(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            createSearch: saveNewSearchThunk,
        },
        dispatch,
    );
};

const withSearchCreate = <PROPS extends WithSearchCreateProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithSearchCreate(props: PROPS) {
        return <ConsumerComponent {...props} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSearchCreate) as React.ComponentType<Omit<PROPS, keyof WithSearchCreateProps>>;
};

export type WithSearchCreateProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withSearchCreate;
