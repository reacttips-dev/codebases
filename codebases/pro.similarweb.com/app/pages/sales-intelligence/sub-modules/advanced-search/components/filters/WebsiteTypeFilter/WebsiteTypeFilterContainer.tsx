import React from "react";
import { compose } from "redux";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useFilterState from "../../../hooks/useFilterState";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import { CommonWebsiteTypeFilter } from "../../../filters/website-type/types";
import { FilterContainerProps } from "../../../types/common";
import { StyledBaseFilterContainer } from "../../styles";
import { StyledRadioSelect } from "./styles";

const WebsiteTypeFilterContainer = (props: FilterContainerProps<CommonWebsiteTypeFilter>) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    return (
        <StyledBaseFilterContainer>
            <StyledRadioSelect
                selected={value}
                onSelect={updateFilterAndLocalState}
                items={filter.possibleValues.map((name) => ({
                    id: name,
                    text: translate(`si.lead_gen_filters.${filter.key}.${name}`),
                    tooltip:
                        name === filter.getInitialValue()
                            ? ""
                            : translate(`si.lead_gen_filters.${filter.key}.${name}.tooltip`),
                }))}
            />
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(WebsiteTypeFilterContainer);
