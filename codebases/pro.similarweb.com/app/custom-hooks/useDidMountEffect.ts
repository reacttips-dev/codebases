import React from "react";

/*
this hook is good in the case of wanting to execute some effect only when one of the dependencies has changed and not on the initial render;
currently doesn't support the cleanup function
 */

export const useDidMountEffect = (func: () => any, dependencies: any[]) => {
    const componentDidMount = React.useRef<boolean>(false);
    React.useEffect(() => {
        if (!componentDidMount.current) {
            componentDidMount.current = true;
            return;
        }
        func();
    }, dependencies);
};
