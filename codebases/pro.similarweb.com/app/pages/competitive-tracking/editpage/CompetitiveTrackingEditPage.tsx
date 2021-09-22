import React, { useEffect, useMemo, useState } from "react";
import {
    ButtonsContainer,
    EditPageButton,
    CategoryFilterContainer,
    CompetitorAssetsContainer,
    CountryFilterContainer,
    CountryFilterWrapper,
    EditPageContainer,
    LoaderContainer,
    MainPropertyContainer,
    SectionTitle,
    TrackerNameContainer,
    InfoIconContainer,
    TitleWithTooltipContainer,
    EditPageContentContainer,
    TrackerPropertiesContainer,
    CompetitorsSectionTitleContainer,
    CounterTextContainer,
} from "./CompetitiveTrackingEditPageStyles";
import { validateTrackerName } from "pages/competitive-tracking/wizard/wizardHelper";
import { AutocompleteTrackerWizard } from "components/AutocompleteTrackerWizard/AutocompleteTrackerWizard";
import { AutocompleteTrackerWizardMultiSelect } from "components/AutocompleteTrackerWizard/AutocompleteTrackerWizardMultiSelect";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { ICategory } from "common/services/categoryService.types";
import { ICompetitiveTrackingEditPageProps } from "./CompetitiveTrackingEditPageTypes";
import {
    adaptTrackerDataForEditPage,
    buildUpdatedTrackerFromEdit,
} from "./handlers/TrackerDataAdapter";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { TrackerNameInput } from "../common/components/TrackerNameInput/TrackerNameInput";
import { InfoTooltip } from "components/React/Tooltip/InfoTooltip/InfoTooltip";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";

export const CompetitiveTrackingEditPage: React.FunctionComponent<ICompetitiveTrackingEditPageProps> = (
    props,
) => {
    const {
        tracker,
        services,
        metaData,
        onEditSubmit,
        onEditCancel,
        maxSupportedCompetitors,
        isLoading,
    } = props;

    const [trackerName, setTrackerName] = useState(tracker?.name);
    const [hasErrorWithTrackerName, setHasErrorWithTrackerName] = useState(false);
    const [trackerNameErrorMsg, setTrackerNameErrorMsg] = useState("");

    const [mainProperty, setMainProperty] = useState<ITrackerAsset>(null);
    const [competitorAssets, setCompetitorAssets] = useState<ITrackerAsset[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<ICountry>(metaData.countries[0]);
    const [selectedIndustry, setSelectedIndustry] = useState<ICategory>(null);

    const isSaveButtonEnabled = useMemo(() => {
        const hasMainProperty = Boolean(mainProperty);
        const hasCompetitors = Boolean(competitorAssets) && competitorAssets.length > 0;
        const isTrackerNameValid = !hasErrorWithTrackerName;
        return hasMainProperty && hasCompetitors && isTrackerNameValid;
    }, [mainProperty, competitorAssets, hasErrorWithTrackerName]);

    useEffect(() => {
        if (isLoading) return;
        const trackerDetails = adaptTrackerDataForEditPage(tracker, metaData);
        setTrackerName(trackerDetails.name);
        setSelectedCountry(trackerDetails.country);
        setSelectedIndustry(trackerDetails.industry);
        setMainProperty(trackerDetails.mainProperty);
        setCompetitorAssets(trackerDetails.competitors);
    }, [tracker, metaData, isLoading]);

    const handleTrackerNameChange = (updatedName: string) => {
        setTrackerName(updatedName);
        const validationResult = validateTrackerName(updatedName, tracker?.id);
        setHasErrorWithTrackerName(!validationResult.isValid);
        setTrackerNameErrorMsg(validationResult.errorMessage);
    };

    const handleEditSave = () => {
        const updatedTracker = buildUpdatedTrackerFromEdit(
            tracker,
            trackerName,
            selectedIndustry,
            selectedCountry,
            mainProperty,
            competitorAssets,
        );

        onEditSubmit(updatedTracker);
    };
    return (
        <EditPageContainer>
            {isLoading ? (
                <LoaderContainer>
                    <LoadingSpinner top="0" />
                </LoaderContainer>
            ) : (
                <>
                    <EditPageContentContainer>
                        <TrackerNameContainer>
                            <TrackerNameInput
                                hasError={hasErrorWithTrackerName}
                                errorMessage={trackerNameErrorMsg}
                                placeHolder={services.translate(
                                    "competitive.tracker.wizard.tracker.name",
                                )}
                                onChange={handleTrackerNameChange}
                                defaultValue={trackerName}
                            />
                        </TrackerNameContainer>
                        <TrackerPropertiesContainer>
                            <MainPropertyContainer>
                                <SectionTitle>
                                    {services.translate(
                                        "competitive.tracker.edit.primary.property",
                                    )}
                                </SectionTitle>
                                <AutocompleteTrackerWizard
                                    selectedValue={mainProperty}
                                    onSelect={(asset) => setMainProperty(asset)}
                                    excludeItems={competitorAssets}
                                />
                            </MainPropertyContainer>

                            <CompetitorAssetsContainer>
                                <CompetitorsSectionTitleContainer>
                                    <SectionTitle style={{ width: "60%" }}>
                                        {services.translate(
                                            "competitive.tracker.edit.competitor.assets",
                                        )}
                                    </SectionTitle>
                                    <CounterTextContainer>
                                        {`${
                                            competitorAssets.length
                                        }/${maxSupportedCompetitors} ${services.translate(
                                            "common.competitors",
                                        )}`}
                                    </CounterTextContainer>
                                </CompetitorsSectionTitleContainer>
                                <AutocompleteTrackerWizardMultiSelect
                                    selectedAsset={mainProperty}
                                    selectedValues={competitorAssets}
                                    onSelect={(assets) => setCompetitorAssets(assets)}
                                    maxSupportedCompetitors={maxSupportedCompetitors}
                                />
                            </CompetitorAssetsContainer>

                            <CountryFilterContainer>
                                <SectionTitle>
                                    {services.translate("competitive.tracker.edit.country")}
                                </SectionTitle>
                                <CountryFilterWrapper>
                                    <CountryFilter
                                        dropdownPopupPlacement={"ontop-left"}
                                        width={"100%"}
                                        height={40}
                                        dropdownPopupWidth={520}
                                        availableCountries={metaData.countries}
                                        selectedCountryIds={{ [selectedCountry?.id]: true }}
                                        changeCountry={(country: any) =>
                                            setSelectedCountry(country)
                                        }
                                    />
                                </CountryFilterWrapper>
                            </CountryFilterContainer>

                            <CategoryFilterContainer>
                                <TitleWithTooltipContainer>
                                    <SectionTitle>
                                        {services.translate("competitive.tracker.edit.industry")}
                                    </SectionTitle>
                                    <InfoTooltip
                                        infoText={services.translate(
                                            "competitive.tracker.wizard.industry.tooltip",
                                        )}
                                        enabled={true}
                                        infoIconContainer={InfoIconContainer}
                                    />
                                </TitleWithTooltipContainer>
                                <AutocompleteWebCategories
                                    showOnlyCategories={true}
                                    selectedValue={selectedIndustry}
                                    onClick={(industry) => setSelectedIndustry(industry)}
                                    autocompleteProps={{
                                        placeholder: services.translate(
                                            "competitive.tracker.wizard.industry.autocomplete",
                                        ),
                                        searchIcon: "market",
                                        autoSelectInputOnFocus: true,
                                    }}
                                    onClearSearch={() => setSelectedIndustry(null)}
                                />
                            </CategoryFilterContainer>
                        </TrackerPropertiesContainer>
                    </EditPageContentContainer>
                    <ButtonsContainer>
                        <EditPageButton type="flat" onClick={onEditCancel} marginRight={4}>
                            {services.translate("competitive.tracker.edit.cancel")}
                        </EditPageButton>
                        <EditPageButton
                            type="primary"
                            onClick={handleEditSave}
                            isDisabled={!isSaveButtonEnabled}
                            marginLeft={4}
                        >
                            {services.translate("competitive.tracker.edit.done")}
                        </EditPageButton>
                    </ButtonsContainer>
                </>
            )}
        </EditPageContainer>
    );
};
