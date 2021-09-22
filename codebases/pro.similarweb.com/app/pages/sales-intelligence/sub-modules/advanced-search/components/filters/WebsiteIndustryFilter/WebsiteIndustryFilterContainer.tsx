import React from "react";
import { compose } from "redux";
import { FilterContainerProps } from "../../../types/common";
import { ICategory } from "common/services/categoryService.types";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CategoryChipItem } from "@similarweb/ui-components/dist/chip";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import useFilterState from "../../../hooks/useFilterState";
import CategoriesDropdown from "../../common/CategoriesDropdown/CategoriesDropdown";
import ChipItemsContainer from "../../common/ChipItemsContainer/ChipItemsContainer";
import { StyledHorizontalRadioSelect } from "../../styles";
import { StyledFilterContainer, StyledChipItemsContainer, StyledDDContainer } from "./styles";
import {
    CommonWebsiteIndustryFilter,
    WebsiteIndustryFilterValueType,
} from "../../../filters/website-industry/types";

const WebsiteIndustryFilterContainer = (
    props: FilterContainerProps<CommonWebsiteIndustryFilter>,
) => {
    const id = "si-website-industry-dropdown";
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const { value, updateLocalState, updateFilterAndLocalState } = useFilterState(filter, onUpdate);
    /** Whether the dropdown is visible */
    const isDDVisible = value.type !== filter.getInitialValue().type;
    /** Whether the chip items are visible */
    const areSelectedItemsVisible = value.ids.length > 0;
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
    /**
     * Handle category dropdown selection
     * @param category
     */
    const handleCategorySelect = (category: ICategory) => {
        if (value.ids.includes(category.id)) {
            const ids = value.ids.filter((id) => id !== category.id);
            const newValue: WebsiteIndustryFilterValueType = {
                ...value,
                ids,
            };

            return updateFilterAndLocalState(newValue);
        }

        const ids = value.ids.concat(category.id);
        const newValue: WebsiteIndustryFilterValueType = {
            ...value,
            ids,
        };

        updateFilterAndLocalState(newValue);
    };
    /**
     * Handle chip item remove
     * @param itemId
     */
    const handleRemove = (itemId: string) => {
        updateFilterAndLocalState({ ...value, ids: value.ids.filter((id) => id !== itemId) });
    };
    /** Selected categories as chip objects */
    const chipItems = value.ids
        .map((id) => {
            const category = filter.items.find((c) => c.id === id);

            if (!category) {
                return null;
            }

            return {
                id,
                text: category.text,
                icon: category.icon,
                onCloseItem() {
                    handleRemove(id);
                },
            };
        })
        .filter(Boolean);

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
                    {/* FIXME: Remove after ui-components update */}
                    {/* @ts-ignore */}
                    <ChipItemsContainer ChipComponent={CategoryChipItem} items={chipItems} />
                </StyledChipItemsContainer>
            )}
            {isDDVisible && (
                <StyledDDContainer id={id}>
                    <CategoriesDropdown
                        appendTo={`#${id}`}
                        items={filter.items}
                        selectedItems={value.ids}
                        onSelect={handleCategorySelect}
                        buttonText={translate(`si.lead_gen_filters.${filter.key}.dd_button_text`)}
                        searchPlaceholder={translate(
                            `si.lead_gen_filters.${filter.key}.dd_placeholder`,
                        )}
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
)(WebsiteIndustryFilterContainer);
