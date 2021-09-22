import React from "react";

const withFallbackRoute = (route: string) => <PROPS extends {}>(
    Component: React.ComponentType<PROPS & WithFallbackRouteProps>,
) => {
    return function WrappedWithFallbackRoute(props: PROPS) {
        return <Component fallbackRoute={route} {...props} />;
    };
};

export type WithFallbackRouteProps = { fallbackRoute: string };
export default withFallbackRoute;
