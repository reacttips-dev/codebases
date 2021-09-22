import React from "react";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const withSWNavigator = <PROPS extends WithSWNavigatorProps>(
    Component: React.ComponentType<PROPS>,
) => {
    function WrappedWithSWNavigator(props: Omit<PROPS, keyof WithSWNavigatorProps>) {
        const navigator = React.useMemo(() => Injector.get<SwNavigator>("swNavigator"), []);

        return <Component {...(props as PROPS)} navigator={navigator} />;
    }

    return WrappedWithSWNavigator;
};

export type WithSWNavigatorProps = { navigator: SwNavigator };
export default withSWNavigator;
