import React from "react";
import { compose } from "redux";
import useFilterState from "../../../hooks/useFilterState";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import SearchTextBox from "../../common/SearchTextBox/SearchTextBox";
import { CommonTextSearchFilter } from "../../../filters/text-search/types";
import { FilterContainerProps } from "../../../types/common";
import { StyledBaseFilterContainer } from "../../styles";

const TextSearchFilterContainer = (props: FilterContainerProps<CommonTextSearchFilter>) => {
    const { filter, onUpdate } = props;
    const { value, updateLocalState, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    const handleChange = (searchText: string) => {
        if (searchText.length === 0) {
            onUpdate(filter.reset());

            return updateLocalState(filter.getInitialValue());
        }

        updateFilterAndLocalState(searchText);
    };

    return (
        <StyledBaseFilterContainer>
            <SearchTextBox
                searchText={value}
                onChange={handleChange}
                placeholder={filter.placeholder}
            />
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(TextSearchFilterContainer);
