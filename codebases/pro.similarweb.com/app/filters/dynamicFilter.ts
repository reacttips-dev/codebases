import * as ngFilters from "./ngFilters";

export const dynamicFilterFilter = () => {
    return (val, filter: string, undefinedSign = "N/A") => {
        if (!val) {
            return undefinedSign;
        }

        if (!filter) {
            return val;
        }

        const filterSplit = filter.split(":");
        const filterName = filterSplit.shift();
        const filterArgs = filterSplit;
        const filterFullName = filterName + "Filter";

        // check if the filter exists before using it
        if (ngFilters[filterFullName]) {
            const filterFn = ngFilters[filterFullName]();
            return filterFn(val, ...filterArgs);
        } else {
            return val;
        }
    };
};
