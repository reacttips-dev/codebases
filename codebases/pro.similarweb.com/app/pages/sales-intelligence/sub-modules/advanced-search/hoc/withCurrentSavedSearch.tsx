import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectCurrentSearchObject } from "../store/selectors";
import { clearCurrentSearchAction } from "../store/action-creators";

const mapStateToProps = (state: RootState) => ({
    savedSearch: selectCurrentSearchObject(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ clearCurrentSearch: clearCurrentSearchAction }, dispatch);
};

const withCurrentSavedSearch = <PROPS extends WithCurrentSavedSearchProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithCurrentSavedSearch(props: PROPS) {
        return <ConsumerComponent {...props} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithCurrentSavedSearch) as React.ComponentType<
        Omit<PROPS, keyof WithCurrentSavedSearchProps>
    >;
};

export type WithCurrentSavedSearchProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default withCurrentSavedSearch;
