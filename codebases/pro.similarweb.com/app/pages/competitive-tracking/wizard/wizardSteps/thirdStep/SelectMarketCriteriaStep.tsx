import { ICategory } from "common/services/categoryService.types";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import React, { FC, useContext, useMemo } from "react";
import { ContentContainer, TopContainer } from "../WizardStepStyles";
import { CompetitiveTrackingWizardContext } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardContext";
import {
    CountriesAutocompleteContainer,
    InputContainer,
    InputLabel,
    InputSectionContainer,
} from "./SelectMarketCriteriaStepStyles";
import { WizardNextButton, WizardStepHeader, InfoIconContainer } from "../stepCommonComponents";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import { InfoTooltip } from "components/React/Tooltip/InfoTooltip/InfoTooltip";
import { ITrackerWizardServices } from "../../CompetitiveTrackingWizardTypes";

interface ISelectMarketCriteriaStepProps {
    selectedIndustry?: ICategory;
    onSelectIndustry: (industry: ICategory) => void;

    availableCountries: any;
    selectedCountry: ICountry;
    onSelectCountry: (country) => void;

    services: ITrackerWizardServices;
}

export const SelectMarketCriteriaStep: FC<ISelectMarketCriteriaStepProps> = (props) => {
    const {
        availableCountries,
        selectedCountry,
        selectedIndustry,
        onSelectCountry,
        onSelectIndustry,
        services,
    } = props;

    const { onNextStepClick } = useContext(CompetitiveTrackingWizardContext);

    const headerTexts = useMemo(() => {
        return {
            title: services.translate("competitive.tracker.wizard.industry.select.market.criteria"),
            subtitle: services.translate(
                "competitive.tracker.wizard.industry.select.market.criteria.subtitle",
            ),
        };
    }, [services]);

    const clearSelectedIndustry = () => onSelectIndustry(undefined);

    return (
        <ContentContainer minHeight={314} minWidth={670}>
            <TopContainer>
                <WizardStepHeader
                    titleText={headerTexts.title}
                    subtitleText={headerTexts.subtitle}
                    maxWidth={600}
                />
            </TopContainer>
            <InputSectionContainer>
                <InputContainer>
                    <FlexRow>
                        <InputLabel>
                            {services.translate("competitive.tracker.wizard.industry")}
                        </InputLabel>
                        <InfoTooltip
                            infoText={services.translate(
                                "competitive.tracker.wizard.industry.tooltip",
                            )}
                            enabled={true}
                            infoIconContainer={InfoIconContainer}
                        />
                    </FlexRow>
                    <AutocompleteWebCategories
                        showOnlyCategories={true}
                        selectedValue={selectedIndustry}
                        onClick={onSelectIndustry}
                        autocompleteProps={{
                            placeholder: services.translate(
                                "competitive.tracker.wizard.industry.autocomplete",
                            ),
                            searchIcon: "market",
                            autoSelectInputOnFocus: true,
                        }}
                        onClearSearch={clearSelectedIndustry}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>
                        {services.translate("competitive.tracker.wizard.country")}
                    </InputLabel>
                    <CountriesAutocompleteContainer>
                        <CountryFilter
                            dropdownPopupPlacement={"ontop-left"}
                            width={520}
                            height={40}
                            dropdownPopupWidth={520}
                            availableCountries={availableCountries}
                            selectedCountryIds={{ [selectedCountry.id]: true }}
                            changeCountry={onSelectCountry}
                        />
                    </CountriesAutocompleteContainer>
                </InputContainer>
            </InputSectionContainer>
            <WizardNextButton
                text={services.translate("common.next")}
                isDisabled={false}
                onNextStepClick={onNextStepClick}
                icon={"arrow-right"}
            />
        </ContentContainer>
    );
};
