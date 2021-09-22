import React from "react";
import { FilterContainerProps } from "../types/common";

/**
 * Takes responsibility to register given filter
 * @param FilterComponent
 */
const withFilterAutoRegister = <PROPS extends Pick<FilterContainerProps, "filter" | "onRegister">>(
    FilterComponent: React.ComponentType<PROPS>,
) => {
    return function WrappedWithFilterAutoRegister(props: PROPS) {
        React.useEffect(() => {
            if (typeof props.onRegister === "function") {
                props.onRegister(props.filter.key);
            }
        }, []);

        return <FilterComponent {...props} />;
    };
};

export default withFilterAutoRegister;
