import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import { IconButton } from "@similarweb/ui-components/dist/button";
import * as utils from "components/filters-bar/utils";
import { swSettings } from "common/services/swSettings";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    LinkWrapper,
    StyledStartPageAutoCompleteWrap,
    StyledStartPageCountryContainer,
} from "./StyledComponents";
import styled from "styled-components";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { Text } from "pages/digital-marketing/KeywordResearchTopKeywords";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { ICategory, IFlattenedCategory } from "common/services/categoryService.types";
import categoryService from "common/services/categoryService";
import { FindAffiliateHomePageIllustrationComponent } from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateHomePageIllustrationComponent";
import {
    byIndustryArtworkConfig,
    byIndustryLinkExample1,
    byIndustryLinkExample2,
} from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliatesHomePageConfiguration";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

interface IFindAffiliateByIndustryHomePageProps {
    visitTrafficChannels: ({ category: string, country: number }) => void;
}

const FindAffiliateByIndustryHomePageWrapper = styled(FlexColumn)`
    height: 100%;
    &:first-child {
        height: auto;
    }
`;

const StyledAutocompleteWebCategories = styled.div`
    min-width: 370px;
`;

const StyledIconButton = styled(IconButton)`
    min-width: 170px;
`;

export const FindAffiliateByIndustryHomePage: FunctionComponent<IFindAffiliateByIndustryHomePageProps> = ({
    visitTrafficChannels,
}) => {
    const i18n = i18nFilter();
    const [selectedCategory, setSelectedCategory] = useState<ICategory>(null);
    const allCategories: IFlattenedCategory[] = categoryService.getFlattenedCategoriesList();

    const onClickCategory = (category: ICategory) => {
        setSelectedCategory(category);
    };

    const availableIndustryCountries = utils.getCountries(
        false,
        swSettings.components.IndustryAnalysisTopKeywords,
    );

    const [selectedCountryId, setSelectedCountryId] = useState(availableIndustryCountries[0].id);

    const onClearSearch = () => {
        setSelectedCategory(null);
    };

    const onExampleClick = (example) => {
        setSelectedCategory(allCategories.filter((cat) => cat.id === example.id)[0]);
    };

    const changeCountry = (selectedCountry) => {
        setSelectedCountryId(selectedCountry.id);
    };

    const onClickVisitTopKeywords = () => {
        TrackWithGuidService.trackWithGuid(
            "affiliate.research.homepage.find.affiliates.by.industry.button.click",
            "click",
            {
                input: selectedCategory.id,
            },
        );
        visitTrafficChannels({
            category: selectedCategory.forUrl,
            country: selectedCountryId,
        });
    };

    return (
        <FindAffiliateByIndustryHomePageWrapper data-automation="find-affiliates-by-industry">
            <UseCaseHomePage
                showSearchComponentsInTheBody={true}
                paddingBottom="23px"
                title={i18n("aquisitionintelligence.findaffiliates.byindustry.title")}
                titlePosition="centered"
                subtitle={i18n("aquisitionintelligence.findaffiliates.byindustry.subtitle")}
                bodyMaxWidth={740}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
                searchComponents={
                    <div>
                        <StyledStartPageAutoCompleteWrap>
                            <StyledAutocompleteWebCategories>
                                <AutocompleteWebCategories
                                    selectedValue={selectedCategory}
                                    onClick={onClickCategory}
                                    autocompleteProps={{
                                        placeholder: i18n(
                                            "aquisitionintelligence.findaffiliates.byindustry.search.searchPlaceHolder",
                                        ),
                                    }}
                                    onClearSearch={onClearSearch}
                                />
                            </StyledAutocompleteWebCategories>
                            <StyledStartPageCountryContainer>
                                <CountryFilter
                                    width={200}
                                    height={40}
                                    availableCountries={availableIndustryCountries}
                                    changeCountry={changeCountry}
                                    selectedCountryIds={{
                                        [selectedCountryId]: true,
                                    }}
                                    dropdownPopupPlacement={"ontop-left"}
                                    dropdownPopupWidth={243}
                                />
                            </StyledStartPageCountryContainer>
                            <StyledIconButton
                                iconName="arrow-right"
                                type="primary"
                                onClick={onClickVisitTopKeywords}
                                isDisabled={!selectedCategory}
                            >
                                {i18n("aquisitionintelligence.affiliateResearch.homepage.cta")}
                            </StyledIconButton>
                        </StyledStartPageAutoCompleteWrap>
                        <LinkWrapper>
                            <Text>
                                {i18n(
                                    "aquisitionintelligence.findaffiliates.bykeywords.link.title",
                                )}
                                &nbsp;
                                <a onClick={() => onExampleClick(byIndustryLinkExample1)}>
                                    {byIndustryLinkExample1.text}
                                </a>
                                &nbsp;
                                {i18n("aquisitionintelligence.findaffiliates.bykeywords.or")}
                                &nbsp;
                                <a onClick={() => onExampleClick(byIndustryLinkExample2)}>
                                    {byIndustryLinkExample2.text}
                                </a>
                            </Text>
                        </LinkWrapper>
                    </div>
                }
            />
            <FindAffiliateHomePageIllustrationComponent artworkConfig={byIndustryArtworkConfig} />
        </FindAffiliateByIndustryHomePageWrapper>
    );
};
