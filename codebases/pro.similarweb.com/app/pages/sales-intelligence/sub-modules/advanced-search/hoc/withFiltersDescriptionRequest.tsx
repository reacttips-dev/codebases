import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchFiltersConfigThunk } from "../store/effects";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectFiltersConfigFetched, selectFiltersConfigFetching } from "../store/selectors";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    filtersConfigFetched: selectFiltersConfigFetched(state),
    filtersConfigFetching: selectFiltersConfigFetching(state),
});
/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchInitialFiltersConfig: fetchFiltersConfigThunk,
        },
        dispatch,
    );
};
/**
 * @param Component
 */
const withFiltersDescriptionRequest = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    function WrappedWithFiltersDescriptionRequest(
        props: PROPS & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
    ) {
        const {
            filtersConfigFetching,
            filtersConfigFetched,
            fetchInitialFiltersConfig,
            ...rest
        } = props;

        React.useEffect(() => {
            if (!filtersConfigFetched) {
                fetchInitialFiltersConfig();
            }
        }, []);

        if (filtersConfigFetching) {
            // TODO: Loading screen
            return null;
        }

        return <Component {...((rest as unknown) as PROPS)} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithFiltersDescriptionRequest) as React.ComponentType<PROPS>;
};

export default withFiltersDescriptionRequest;
