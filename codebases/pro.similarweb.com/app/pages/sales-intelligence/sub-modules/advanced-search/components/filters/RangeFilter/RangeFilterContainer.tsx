import React from "react";
import { compose } from "redux";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CommonRangeFilter } from "../../../filters/range/types";
import { StyledRangeFilterContainer } from "./styles";
import { FilterContainerProps } from "../../../types/common";
import RangeFilterComponent from "./RangeFilter";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";

const RangeFilterContainer = (props: FilterContainerProps<CommonRangeFilter>) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;

    const handleChange = (value: number[]) => {
        onUpdate(filter.setValue(value));
    };

    const renderValue = (value: number[]) => {
        return filter.getDisplayedValue(value);
    };

    return (
        <StyledRangeFilterContainer>
            <RangeFilterComponent
                values={filter.options}
                renderValue={renderValue}
                onAfterChange={handleChange}
                currentValue={filter.getValue()}
                initialValue={filter.getInitialValue()}
                name={
                    filter.hasName ? translate(`si.lead_gen_filters.${filter.key}.name`) : undefined
                }
            />
        </StyledRangeFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(RangeFilterContainer);
