import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { SupportedFilterType } from "../types/filters";
import { selectFiltersInBothStatesThatMatchKeys } from "../store/selectors";
import { WithFiltersKeysProp } from "../types/common";

type ConsumerProps = WithFiltersKeysProp & {
    filters: SupportedFilterType[];
};

const mapStateToProps = <PROPS extends WithFiltersKeysProp>(state: RootState, props: PROPS) => ({
    filters: selectFiltersInBothStatesThatMatchKeys(state, props),
});

/**
 * This HOC receives names of the filters as "filtersKeys" prop
 * Then it passes filters instances that match those names to the wrapped component
 * @param ConsumerComponent
 */
const withMatchedFiltersInReadyState = <PROPS extends ConsumerProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    const WrappedWithFiltersInstances = (props: PROPS & ReturnType<typeof mapStateToProps>) => {
        return <ConsumerComponent {...props} />;
    };

    return connect(mapStateToProps)(WrappedWithFiltersInstances) as React.ComponentType<
        Omit<PROPS & ReturnType<typeof mapStateToProps>, "filters">
    >;
};

export default withMatchedFiltersInReadyState;
