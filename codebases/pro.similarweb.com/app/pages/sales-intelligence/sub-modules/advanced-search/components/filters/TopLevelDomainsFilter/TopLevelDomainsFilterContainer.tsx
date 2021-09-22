import React from "react";
import { compose } from "redux";
import { ChipContainer, SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FilterContainerProps } from "../../../types/common";
import { CommonTopLevelDomainsFilter } from "../../../filters/top-level-domains/types";
import useFilterState from "../../../hooks/useFilterState";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import { StyledBaseFilterContainer } from "../../styles";
import {
    StyledRadioContainer,
    StyledDomainsContainer,
    StyledTextInput,
    StyledInputTip,
    StyledChipsContainer,
} from "./styles";

const TopLevelDomainsFilterContainer = (
    props: FilterContainerProps<CommonTopLevelDomainsFilter>,
) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    const handleRadioSelect = (type: string) => {
        updateFilterAndLocalState({ ...value, type });
    };

    const handleExtensionAdd = (ext: string) => {
        updateFilterAndLocalState({ ...value, domains: value.domains.concat(ext) });
    };

    const handleExtensionRemove = (ext: string) => {
        updateFilterAndLocalState({ ...value, domains: value.domains.filter((e) => e !== ext) });
    };

    return (
        <StyledBaseFilterContainer>
            <StyledRadioContainer
                selected={value.type}
                onSelect={handleRadioSelect}
                items={filter.radioOptions.map((value) => ({
                    id: value,
                    text: translate(`si.lead_gen_filters.${filter.key}.type.${value}`),
                }))}
            />
            <StyledDomainsContainer>
                {value.domains.length > 0 && (
                    <StyledChipsContainer>
                        <ChipContainer itemsComponent={SimpleChipItem}>
                            {value.domains.map((ext) => ({
                                id: ext,
                                text: ext,
                                key: `${ext}-extension-chip`,
                                onCloseItem() {
                                    handleExtensionRemove(ext);
                                },
                            }))}
                        </ChipContainer>
                    </StyledChipsContainer>
                )}
                <StyledTextInput
                    iconName="globe"
                    onAdd={handleExtensionAdd}
                    hasChips={value.domains.length > 0}
                    dataAutomation="top-level-domains-extension-input"
                    placeholder={translate(`si.lead_gen_filters.${filter.key}.input_placeholder`)}
                />
                <StyledInputTip>
                    {translate(`si.lead_gen_filters.${filter.key}.input_tip.${value.type}`)}
                </StyledInputTip>
            </StyledDomainsContainer>
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(TopLevelDomainsFilterContainer);
