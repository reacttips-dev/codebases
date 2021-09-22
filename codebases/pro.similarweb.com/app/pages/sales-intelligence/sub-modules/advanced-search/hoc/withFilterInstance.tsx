import React from "react";
import useFiltersManager from "../hooks/useFiltersManager";
import { FilterContainerProps, WithFilterKeyProp } from "../types/common";

type ExpectedConsumerPropsType = Pick<FilterContainerProps, "filter" | "onRegister"> &
    WithFilterKeyProp;

const withFilterInstance = <PROPS extends ExpectedConsumerPropsType>(
    FilterComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithFilterInstance(props: PROPS) {
        const validInstance = useFiltersManager().getFilterInstance(props.filterKey);

        if (!validInstance) {
            return null;
        }

        return <FilterComponent {...props} filter={validInstance} />;
    }

    return WrappedWithFilterInstance as React.ComponentType<Omit<PROPS, "filter">>;
};

export default withFilterInstance;
