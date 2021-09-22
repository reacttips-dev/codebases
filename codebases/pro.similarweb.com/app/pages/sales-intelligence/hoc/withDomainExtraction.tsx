import React from "react";
import { WithSWNavigatorProps } from "../hoc/withSWNavigator";

const withDomainExtraction = <PROPS extends { domain: string } & WithSWNavigatorProps>(
    Component: React.ComponentType<PROPS>,
) => {
    return function WrappedWithDomainExtraction(props: Omit<PROPS, "domain">) {
        const { navigator } = props;
        // For "Find leads" pages where the "key" URL param corresponds to the website domain
        const { key } = navigator.getParams();

        return <Component {...(props as PROPS)} domain={key} />;
    };
};

export default withDomainExtraction;
