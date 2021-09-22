import React, { useEffect } from "react";

type OptionsScrollToType = {
    left: number;
    right: number;
};

export const useScrollTo = (scroll: boolean, options?: OptionsScrollToType) => {
    const { left, right } = options || { left: 0, right: 0 };
    const ref = React.useRef(null);

    useEffect(() => {
        if (scroll === true) {
            ref?.current?.scrollTo(left, right);
        }
    }, [scroll]);

    return ref;
};
