import React from "react";
import { compose } from "redux";
import { SWReactIcons } from "@similarweb/icons";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { CommonCheckboxFilter } from "../../../filters/checkbox/types";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import useFilterState from "../../../hooks/useFilterState";
import { FilterContainerProps } from "../../../types/common";
import { StyledCustomFilterContainer, StyledCheckboxContainer, StyledInfoIcon } from "./styles";

const CheckboxFilterContainer = (props: FilterContainerProps<CommonCheckboxFilter>) => {
    const { filter, onUpdate } = props;
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    const handleSelection = () => {
        updateFilterAndLocalState(!value);
    };

    return (
        <StyledCustomFilterContainer>
            <StyledCheckboxContainer>
                <Checkbox selected={value} label={filter.name} onClick={handleSelection} />
                <PlainTooltip tooltipContent={filter.tooltip}>
                    <StyledInfoIcon>
                        <SWReactIcons iconName="info" size="xs" />
                    </StyledInfoIcon>
                </PlainTooltip>
            </StyledCheckboxContainer>
        </StyledCustomFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(CheckboxFilterContainer);
