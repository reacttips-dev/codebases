import React from "react";
import { TrafficType } from "../types";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";

const withTrafficTypeFromUrl = <PROPS extends WithSWNavigatorProps & { trafficType: TrafficType }>(
    Component: React.ComponentType<PROPS>,
) => {
    return function WrappedWithTrafficTypeFromUrl(props: WithSWNavigatorProps) {
        const { navigator } = props;
        const { url } = navigator.current();
        const trafficType: TrafficType = (url as string).match(/outgoing/g)
            ? "outgoing"
            : "incoming";

        return <Component {...(props as PROPS)} trafficType={trafficType} />;
    };
};

export default withTrafficTypeFromUrl;
