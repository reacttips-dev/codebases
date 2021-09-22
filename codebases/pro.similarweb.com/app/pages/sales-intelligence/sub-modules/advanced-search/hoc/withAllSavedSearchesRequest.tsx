import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatchCommon } from "store/types";
import { fetchSavedSearchesThunk } from "../store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchAllSavedSearches: fetchSavedSearchesThunk,
        },
        dispatch,
    );
};

const withAllSavedSearchesRequest = <PROPS extends {}>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithAllSavedSearchesRequest(
        props: PROPS & ReturnType<typeof mapDispatchToProps>,
    ) {
        const { fetchAllSavedSearches, ...rest } = props;

        React.useEffect(() => {
            fetchAllSavedSearches();
        }, []);

        return <ConsumerComponent {...((rest as unknown) as PROPS)} />;
    }

    return connect(
        null,
        mapDispatchToProps,
    )(WrappedWithAllSavedSearchesRequest) as React.ComponentType<PROPS>;
};

export default withAllSavedSearchesRequest;
