import React from "react";
import { compose } from "redux";
import { IDropDownItem } from "@similarweb/ui-components/dist/dropdown";
import { SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useFilterState from "../../../hooks/useFilterState";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import { FilterContainerProps } from "../../../types/common";
import { AudienceFilterValueType, CommonAudienceFilter } from "../../../filters/audience/types";
import AudienceDropdown from "../../common/AudienceDropdown/AudienceDropdown";
import ChipItemsContainer from "../../common/ChipItemsContainer/ChipItemsContainer";
import { StyledFilterContainer, StyledChipItemsContainer, StyledDDContainer } from "./styles";
import { StyledHorizontalRadioSelect } from "../../styles";

const AudienceFilterContainer = (props: FilterContainerProps<CommonAudienceFilter>) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const { value, updateLocalState, updateFilterAndLocalState } = useFilterState(filter, onUpdate);
    /** Whether the dropdown is visible */
    const isDDVisible = value.type !== filter.getInitialValue().type;
    /** Whether the chip items are visible */
    const areSelectedItemsVisible = value.ids.length > 0;
    /**
     * Handle dropdown selection
     * @param item
     */
    const handleSelect = (item: Omit<IDropDownItem, "id"> & { id: string; tooltip: string }) => {
        if (value.ids.includes(item.id)) {
            const filtered = value.ids.filter((id) => id !== item.id);
            const newValue: AudienceFilterValueType = { ...value, ids: filtered };

            return updateFilterAndLocalState(newValue);
        }

        const newValue: AudienceFilterValueType = { ...value, ids: value.ids.concat(item.id) };

        updateFilterAndLocalState(newValue);
    };
    /**
     * Handle chip item remove
     * @param itemId
     */
    const handleRemove = (itemId: string) => {
        updateFilterAndLocalState({ ...value, ids: value.ids.filter((id) => id !== itemId) });
    };
    /**
     * Handle radio buttons selection
     * @param type
     */
    const handleRadioSelect = (type: string) => {
        if (type === filter.getInitialValue().type) {
            onUpdate(filter.reset());

            return updateLocalState(filter.getInitialValue());
        }

        updateFilterAndLocalState({ ...value, type });
    };

    return (
        <StyledFilterContainer
            isDDVisible={isDDVisible}
            areSelectedItemsVisible={areSelectedItemsVisible}
        >
            <StyledHorizontalRadioSelect
                items={filter.radioOptions.map((name) => ({
                    id: name,
                    text: translate(`si.lead_gen_filters.${filter.key}.type.${name}`),
                }))}
                selected={value.type}
                onSelect={handleRadioSelect}
            />
            {areSelectedItemsVisible && (
                <StyledChipItemsContainer>
                    <ChipItemsContainer
                        ChipComponent={SimpleChipItem}
                        items={value.ids.map((id) => ({
                            id,
                            icon: "",
                            text: translate(`si.lead_gen_filters.${filter.key}.${id}`),
                            onCloseItem(_: React.MouseEvent<HTMLSpanElement>) {
                                handleRemove(id);
                            },
                        }))}
                    />
                </StyledChipItemsContainer>
            )}
            {isDDVisible && (
                <StyledDDContainer>
                    <AudienceDropdown
                        onSelect={handleSelect}
                        id={`${filter.key}-dd-anchor`}
                        selectedItems={filter.getValue().ids}
                        items={filter.items.map((id) => ({
                            id,
                            text: translate(`si.lead_gen_filters.${filter.key}.${id}`),
                            tooltip: translate(`si.lead_gen_filters.${filter.key}.${id}.tooltip`),
                        }))}
                        buttonText={translate(`si.lead_gen_filters.${filter.key}.button.text`)}
                    />
                </StyledDDContainer>
            )}
        </StyledFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(AudienceFilterContainer);
