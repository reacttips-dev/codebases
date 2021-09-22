import * as React from "react";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { StatelessComponent } from "react";

let injector;
const getInjectionsForComponent = (Component) => {
    const { $inject = injector.annotate(Component) || [] } = Component;
    return $inject.reduce((allInjections, injectable) => {
        if (injector.has(injectable)) {
            allInjections[injectable] = injector.get(injectable);
        }
        return allInjections;
    }, {});
};
export default (Component) => {
    const ReactInject: StatelessComponent<any> = (props) => {
        injector = Injector;
        const injectionProps = getInjectionsForComponent(Component);
        return <Component {...{ ...props, ...injectionProps }} />;
    };

    return ReactInject;
};
