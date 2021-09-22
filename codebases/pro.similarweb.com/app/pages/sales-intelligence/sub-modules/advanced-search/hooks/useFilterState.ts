import { useEffect, useState } from "react";
import { AdvancedSearchFilter } from "../types/filters";

/**
 * This hook is responsible for updating both local component state and given filter instance.
 * @param filter
 * @param update
 */
const useFilterState = <F extends AdvancedSearchFilter<ReturnType<F["getValue"]>>>(
    filter: F,
    update: (filter: F) => void,
) => {
    const [value, setValue] = useState(filter.getValue());

    const updateFilterAndLocalState = (value: ReturnType<F["getValue"]>) => {
        update(filter.setValue(value));
        setValue(value);
    };

    useEffect(() => {
        setValue(filter.getValue());
    }, [filter.getValue()]);

    return {
        value,
        updateFilterAndLocalState,
        updateLocalState: setValue,
    };
};

export default useFilterState;
