import React from "react";
import { SupportedFilterType } from "../../../types/filters";
import { WithFiltersKeysProp } from "../../../types/common";
import withFiltersGroupRegistry from "../../../hoc/withFiltersGroupRegistry";
import withMatchedFiltersInReadyState from "../../../hoc/withMatchedFiltersInReadyState";
import FiltersGroup, { FiltersGroupProps } from "./FiltersGroup";

type FiltersGroupContainerProps = Omit<FiltersGroupProps, "hasValue"> &
    WithFiltersKeysProp & {
        filters: SupportedFilterType[];
    };

const FiltersGroupContainer = (props: FiltersGroupContainerProps) => {
    const { filters, filtersKeys, ...rest } = props;

    return <FiltersGroup {...rest} hasValue={filters.length > 0} />;
};

export default withFiltersGroupRegistry(withMatchedFiltersInReadyState(FiltersGroupContainer));
