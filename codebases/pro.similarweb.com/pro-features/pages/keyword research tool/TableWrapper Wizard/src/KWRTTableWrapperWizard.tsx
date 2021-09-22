import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { ICountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import {
    WebSourceFilter,
    IWebSourceFilterItem,
} from "@similarweb/ui-components/dist/responsive-filters-bar";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import { i18nFilter } from "filters/ngFilters";
import * as propTypes from "prop-types";
import * as React from "react";
import { FC } from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { CountryFilter } from "../../../../../app/components/filters-bar/country-filter/CountryFilter";
import { IKeywordsAutocompleteProps } from "../../../../components/KeywordsAutocompleteStateless/src/KeywordsAutocompleteStateless";
import I18n from "../../../../components/WithTranslation/src/I18n";
import {
    ButtonContainer,
    Container,
    CountryContainer,
    InputContainer,
    SelectedKeywordOrGroupWithIndicatorContainer,
    StyledIcon,
    StyledIconButton,
    StyledIconButtonContainer,
    Text,
    WebSourceWrapper,
} from "./StyledComponent";

export interface IKWRTTableWrapperWizardProps
    extends Pick<IKeywordsAutocompleteProps, "getListItems"> {
    availableCountries: ICountryDropdownItem[];
    changeCountry: (itemId: number) => void;
    selectedCountryIds: object;
    onRun: () => void;
    items: IWebSourceFilterItem[];
    onChange: (itemId: number) => void;
    selectedIds: Record<string, boolean>;
    durationSelectorComponent: React.ReactNode;
    selectedKeyword?: string;
    isGroupContext: boolean;
    isButtonDisabled: boolean;
    fastEnterFunc?: (e: string) => void;
    onBlur?: (e) => void;
    onKeyUp?: (e: string) => void;
    onCountryFilterToggle?: (isOpen: boolean) => void;
    onWebSourceFilterToggle?: (isOpen: boolean) => void;
    onKeywordOrGroupChange: (
        selectedKeyword: string,
        isFromSuggestionWidget: boolean,
        isGroupContext: boolean,
    ) => () => void;
}

const SelectedKeywordOrGroupWithIndicator = ({
    onKeywordOrGroupChange,
    selectedKeyword,
    isGroupContext,
}) => {
    const iconName = isGroupContext
        ? KeywordsGroupUtilities.getKeywordsGroupDefaultIcon()
        : KeywordsGroupUtilities.getKeywordsDefaultIcon();
    const onClose = () => onKeywordOrGroupChange(undefined, false, false)();
    return (
        <SelectedKeywordOrGroupWithIndicatorContainer>
            <FlexRow>
                <StyledIcon iconName={iconName} />
                <div>
                    <Text>{selectedKeyword}</Text>
                </div>
            </FlexRow>
            <StyledIconButtonContainer onClick={onClose}>
                <StyledIconButton type="flat" iconName="close" />
            </StyledIconButtonContainer>
        </SelectedKeywordOrGroupWithIndicatorContainer>
    );
};

export const KWRTTableWrapperWizard: FC<IKWRTTableWrapperWizardProps> = ({
    onKeywordOrGroupChange,
    onCountryFilterToggle,
    onWebSourceFilterToggle,
    onRun,
    availableCountries,
    changeCountry,
    selectedCountryIds,
    isButtonDisabled,
    items,
    onChange,
    selectedIds,
    durationSelectorComponent,
    selectedKeyword,
    isGroupContext,
}) => {
    const i18n = i18nFilter();
    return (
        <Container className="KWRTTableWrapperWizard">
            <InputContainer>
                {selectedKeyword ? (
                    <SelectedKeywordOrGroupWithIndicator
                        onKeywordOrGroupChange={onKeywordOrGroupChange}
                        isGroupContext={isGroupContext}
                        selectedKeyword={selectedKeyword}
                    />
                ) : (
                    <AutocompleteKeywordGroups
                        autocompleteProps={{
                            placeholder: i18n("kwresearchtool.miniwizard.search"),
                        }}
                        selectedValue={selectedKeyword}
                        onClick={(keywordsObj: any) => {
                            const isGroupContext = keywordsObj.hasOwnProperty("GroupHash");
                            onKeywordOrGroupChange(
                                isGroupContext ? keywordsObj.Name : keywordsObj.name,
                                false,
                                isGroupContext,
                            )();
                        }}
                    />
                )}
            </InputContainer>
            <CountryContainer>
                <CountryFilter
                    onToggle={onCountryFilterToggle}
                    appendTo={".KWRTTableWrapperWizard"}
                    width={178}
                    height={40}
                    availableCountries={availableCountries}
                    changeCountry={changeCountry}
                    selectedCountryIds={selectedCountryIds}
                    dropdownPopupWidth={190}
                    dropdownPopupPlacement={"ontop-left"}
                />
            </CountryContainer>
            {durationSelectorComponent}
            <WebSourceWrapper>
                <WebSourceFilter
                    onToggle={onWebSourceFilterToggle}
                    height={40}
                    width={190}
                    items={items}
                    onChange={onChange}
                    selectedIds={selectedIds}
                    dropdownPopupPlacement={"ontop-left"}
                    appendTo={".KWRTTableWrapperWizard"}
                    dropdownPopupWidth={190}
                />
            </WebSourceWrapper>
            <ButtonContainer
                isDisabled={isButtonDisabled}
                onClick={onRun}
                width={102}
                label={
                    <ButtonLabel>
                        <I18n>KWResearchTool.miniWizard.button</I18n>
                    </ButtonLabel>
                }
            />
        </Container>
    );
};

KWRTTableWrapperWizard.displayName = "KWRTTableWrapperWizard";
KWRTTableWrapperWizard.contextTypes = {
    track: propTypes.func,
    translate: propTypes.func,
};
