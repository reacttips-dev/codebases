import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { fetchSearchResultsThunk } from "../store/effects";
import { selectFiltersInReadyState, selectTableFilters } from "../store/selectors";

type ConnectedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootState) => ({
    tableFilters: selectTableFilters(state),
    filtersInReadyState: selectFiltersInReadyState(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchSearchResults: fetchSearchResultsThunk,
        },
        dispatch,
    );
};

const withSearchResultsRequest = <PROPS extends object>(Component: React.ComponentType<PROPS>) => {
    const WrappedWithSearchResultsRequest = (props: PROPS & ConnectedProps) => {
        const { tableFilters, filtersInReadyState, fetchSearchResults, ...rest } = props;

        React.useEffect(() => {
            fetchSearchResults(filtersInReadyState, tableFilters);
        }, [filtersInReadyState, tableFilters]);

        return <Component {...(rest as PROPS)} />;
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithSearchResultsRequest) as React.ComponentType<PROPS>;
};

export default withSearchResultsRequest;
