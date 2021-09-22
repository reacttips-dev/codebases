import React from "react";
import { compose } from "redux";
import { ICountryObject } from "services/CountryService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CountryChipItem, SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import InclusionDropdown, {
    InclusionEnum,
} from "pages/sales-intelligence/common-components/dropdown/InclusionDropdown/InclusionDropdown";
import {
    CommonHeadquartersFilter,
    HeadquartersFilterValueType,
} from "../../../filters/headquarters/types";
import { FilterContainerProps } from "../../../types/common";
import useFilterState from "../../../hooks/useFilterState";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import CountriesDropdown from "../../common/CountriesDropdown/CountriesDropdown";
import InteractiveTextInput from "../../common/InteractiveTextInput/InteractiveTextInput";
import ChipItemsContainer from "../../common/ChipItemsContainer/ChipItemsContainer";
import { StyledBaseFilterContainer } from "../../styles";
import {
    StyledInclusionDDContainer,
    StyledMainDDContainer,
    StyledRadioContainer,
    StyledTopContainer,
    StyledChipsContainer,
    StyledZipCodeContainer,
    StyledZipCodeChipsContainer,
} from "./styles";

const HeadquartersFilterContainer = (props: FilterContainerProps<CommonHeadquartersFilter>) => {
    const id = "si-headquarters-dropdown";
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const { value, updateLocalState, updateFilterAndLocalState } = useFilterState(filter, onUpdate);
    /**
     * Handle inclusion DD select
     * @param inclusion
     */
    const handleInclusionSelect = (inclusion: InclusionEnum) => {
        updateFilterAndLocalState({ ...value, inclusion });
    };
    /**
     * Handle radio select
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
     * Handle country DD select
     * @param country
     */
    const handleCountrySelect = (country: ICountryObject) => {
        if (value.codes.includes(country.id)) {
            const countryIds = value.codes.filter((id) => id !== country.id);
            const newValue: HeadquartersFilterValueType = {
                ...value,
                codes: countryIds,
                zip: countryIds.length === 0 ? [] : value.zip,
            };

            return updateFilterAndLocalState(newValue);
        }

        const countryIds = value.codes.concat(country.id);
        const newValue: HeadquartersFilterValueType = {
            ...value,
            codes: countryIds,
            zip: countryIds.length > 1 ? [] : value.zip,
        };

        updateFilterAndLocalState(newValue);
    };
    /**
     * Handle adding of postal codes
     * @param code
     */
    const handleZipCodeAdd = (code: string) => {
        if (!value.zip.includes(code)) {
            const zip = value.zip.concat(code);

            updateFilterAndLocalState({ ...value, zip });
        }
    };
    /**
     * Handle the postal codes removing
     * @param code
     */
    const handleZipCodeRemove = (code: string) => {
        updateFilterAndLocalState({ ...value, zip: value.zip.filter((c) => c !== code) });
    };
    /**
     * Built country chip items
     */
    const chipsItems = value.codes
        .map((id) => {
            const countryObject = filter.countries.find((c) => c.id === id);

            if (!countryObject) {
                return null;
            }

            return {
                id: countryObject.id,
                text: countryObject.text,
                onCloseItem() {
                    handleCountrySelect(countryObject);
                },
            };
        })
        .filter(Boolean);

    return (
        <StyledBaseFilterContainer>
            <StyledTopContainer>
                <StyledRadioContainer
                    items={filter.radioOptions.map((value) => ({
                        id: value,
                        text: translate(`si.lead_gen_filters.${filter.key}.type.${value}`),
                    }))}
                    selected={value.type}
                    onSelect={handleRadioSelect}
                />
                <StyledInclusionDDContainer id="inclusion-dd-anchor">
                    <InclusionDropdown
                        selected={value.inclusion}
                        appendTo="#inclusion-dd-anchor"
                        onSelect={handleInclusionSelect}
                        isDisabled={value.type === filter.getInitialValue().type}
                    />
                </StyledInclusionDDContainer>
            </StyledTopContainer>
            {value.type !== filter.getInitialValue().type && (
                <>
                    <StyledMainDDContainer id={id}>
                        {chipsItems.length > 0 && (
                            <StyledChipsContainer>
                                <ChipItemsContainer
                                    items={chipsItems}
                                    ChipComponent={CountryChipItem}
                                />
                            </StyledChipsContainer>
                        )}
                        <CountriesDropdown
                            appendTo={`#${id}`}
                            items={filter.countries}
                            onSelect={handleCountrySelect}
                            selectedItems={value.codes}
                            dropdownPopupHeight={48 * 6}
                            dropdownPopupPlacement="ontop-left"
                            placeholder={translate(
                                `si.lead_gen_filters.${filter.key}.dd_placeholder`,
                            )}
                        />
                    </StyledMainDDContainer>
                    {value.codes.length === 1 && (
                        <StyledZipCodeContainer>
                            {value.zip.length > 0 && (
                                <StyledZipCodeChipsContainer>
                                    <ChipItemsContainer
                                        items={value.zip.map((code) => ({
                                            id: code,
                                            icon: "",
                                            text: code,
                                            onCloseItem(_: React.MouseEvent<HTMLSpanElement>) {
                                                handleZipCodeRemove(code);
                                            },
                                        }))}
                                        ChipComponent={SimpleChipItem}
                                    />
                                </StyledZipCodeChipsContainer>
                            )}
                            <InteractiveTextInput
                                placeholder={translate(
                                    `si.lead_gen_filters.${filter.key}.zip_placeholder`,
                                )}
                                dataAutomation="headquarters-postal-code-input"
                                onAdd={handleZipCodeAdd}
                            />
                        </StyledZipCodeContainer>
                    )}
                </>
            )}
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(HeadquartersFilterContainer);
