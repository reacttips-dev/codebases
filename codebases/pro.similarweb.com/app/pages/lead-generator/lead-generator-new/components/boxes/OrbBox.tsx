import React from "react";
import FiltersBox, { IFiltersBoxProps } from "./FiltersBox";
import {
    isZipCodeFilter,
    isCountryCodeListFilter,
} from "pages/lead-generator/lead-generator-new/helpers";

const OrbBox: React.FC<IFiltersBoxProps> = (props) => {
    const updatedFilters = props.filters.map((crrFilter) => {
        if (isZipCodeFilter(crrFilter)) {
            const countryFilter = props.filters.find(isCountryCodeListFilter);

            return {
                ...crrFilter,
                disabled: !countryFilter.getValue(),
            };
        }

        return crrFilter;
    });

    return <FiltersBox {...props} filters={updatedFilters} />;
};

export default OrbBox;
