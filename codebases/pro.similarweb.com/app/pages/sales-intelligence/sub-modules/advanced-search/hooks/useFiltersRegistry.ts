import React from "react";
import { SupportedFilterKey } from "../types/filters";

const useFiltersRegistry = () => {
    const [filtersKeys, setFiltersKeys] = React.useState<SupportedFilterKey[]>([]);

    const registerFilter = (key: SupportedFilterKey) => {
        setFiltersKeys((keys) => keys.concat(key));
    };

    return React.useMemo(() => {
        return {
            filtersKeys,
            registerFilter,
        };
    }, [filtersKeys]);
};

export default useFiltersRegistry;
