import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatchCommon } from "store/types";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import { fetchSearchByIdThunk } from "../store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchSearchById: fetchSearchByIdThunk,
        },
        dispatch,
    );
};

const withSearchByIdRequest = <PROPS extends { searchId: string } & WithSWNavigatorProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithSearchByIdRequest(props: PROPS & ReturnType<typeof mapDispatchToProps>) {
        const { fetchSearchById, ...rest } = props;

        React.useEffect(() => {
            fetchSearchById(rest.searchId);
        }, []);

        return <ConsumerComponent {...((rest as unknown) as PROPS)} />;
    }

    return connect(null, mapDispatchToProps)(WrappedWithSearchByIdRequest) as React.ComponentType<
        PROPS
    >;
};

export default withSearchByIdRequest;
