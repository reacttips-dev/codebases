import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
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
import { FindAffiliateHomePageIllustrationComponent } from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateHomePageIllustrationComponent";
import {
    byKeywordsArtworkConfig,
    byKeywordsLinkExample1,
    byKeywordsLinkExample2,
} from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliatesHomePageConfiguration";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

interface IFindAffiliateByKeywordsHomePageProps {
    kwgLoading: boolean;
    visitAffiliateOpportunities: ({ keyword: string, country: number }) => void;
}

const FindAffiliateByKeywordsHomePageWrapper = styled(FlexColumn)`
    height: 100%;
    &:first-child {
        height: auto;
    }
`;

const StyledAutocompleteKeywordGroups = styled.div`
    min-width: 370px;
`;

const StyledIconButton = styled(IconButton)`
    min-width: 170px;
`;

export const FindAffiliateByKeywordsHomePage: FunctionComponent<IFindAffiliateByKeywordsHomePageProps> = ({
    kwgLoading,
    visitAffiliateOpportunities,
}) => {
    const i18n = i18nFilter();
    const [seedKeyword, setSeedKeyword] = useState("");
    const availableKeywordCountries = utils.getCountries(
        false,
        swSettings.components.KeywordsGenerator,
    );
    const [selectedKeywordCountryId, setSelectedKeywordCountryId] = useState(
        availableKeywordCountries[0].id,
    );

    const handleSeedKeywordChange = (keyword) => {
        setSeedKeyword(keyword);
    };

    const changeKeywordCountry = (selectedCountry) => {
        setSelectedKeywordCountryId(selectedCountry.id);
    };

    const onExampleClick = (example) => {
        setSeedKeyword(example.text);
    };

    const onClearSeedKeywordSearch = () => {
        setSeedKeyword("");
    };

    const onClickVisitAffiliateOpportunities = () => {
        TrackWithGuidService.trackWithGuid(
            "affiliate.research.homepage.find.affiliates.by.keywords.button.click",
            "click",
            {
                input: seedKeyword,
            },
        );
        visitAffiliateOpportunities({ keyword: seedKeyword, country: selectedKeywordCountryId });
    };

    return (
        <FindAffiliateByKeywordsHomePageWrapper data-automation="find-affiliates-by-keywords">
            <UseCaseHomePage
                showSearchComponentsInTheBody={true}
                paddingBottom="23px"
                title={i18n("aquisitionintelligence.findaffiliates.bykeywords.title")}
                titlePosition="centered"
                subtitle={i18n("aquisitionintelligence.findaffiliates.bykeywords.subtitle")}
                bodyMaxWidth={740}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
                searchComponents={
                    <div>
                        <StyledStartPageAutoCompleteWrap>
                            <StyledAutocompleteKeywordGroups>
                                <AutocompleteKeywordGroups
                                    autocompleteProps={{
                                        placeholder: i18n(
                                            "aquisitionintelligence.keywordResearch.homepage.seed.searchPlaceHolder",
                                        ),
                                    }}
                                    selectedValue={
                                        seedKeyword.startsWith("*")
                                            ? KeywordsGroupUtilities.getGroupNameById(
                                                  seedKeyword.substring(1),
                                              )
                                            : seedKeyword
                                    }
                                    onValueChange={handleSeedKeywordChange}
                                    onClick={(keywordsObj: any) => {
                                        const isGroupContext = keywordsObj.hasOwnProperty(
                                            "GroupHash",
                                        );
                                        handleSeedKeywordChange(
                                            isGroupContext
                                                ? "*" + keywordsObj.Id
                                                : keywordsObj.name,
                                        );
                                    }}
                                    onClearSearch={onClearSeedKeywordSearch}
                                />
                            </StyledAutocompleteKeywordGroups>
                            <StyledStartPageCountryContainer>
                                <CountryFilter
                                    width={200}
                                    height={40}
                                    availableCountries={availableKeywordCountries}
                                    changeCountry={changeKeywordCountry}
                                    selectedCountryIds={{
                                        [selectedKeywordCountryId]: true,
                                    }}
                                    dropdownPopupPlacement={"ontop-left"}
                                    dropdownPopupWidth={243}
                                />
                            </StyledStartPageCountryContainer>
                            <StyledIconButton
                                iconName="arrow-right"
                                type="primary"
                                onClick={onClickVisitAffiliateOpportunities}
                                isLoading={kwgLoading}
                                isDisabled={kwgLoading || !seedKeyword}
                            >
                                {i18n(
                                    kwgLoading
                                        ? "aquisitionintelligence.affiliateResearch.homepage.seed.cta.loading"
                                        : "aquisitionintelligence.affiliateResearch.homepage.cta",
                                )}
                            </StyledIconButton>
                        </StyledStartPageAutoCompleteWrap>
                        <LinkWrapper>
                            <Text>
                                {i18n(
                                    "aquisitionintelligence.findaffiliates.bykeywords.link.title",
                                )}
                                &nbsp;
                                <a onClick={() => onExampleClick(byKeywordsLinkExample1)}>
                                    {byKeywordsLinkExample1.text}
                                </a>
                                &nbsp;
                                {i18n("aquisitionintelligence.findaffiliates.bykeywords.or")}
                                &nbsp;
                                <a onClick={() => onExampleClick(byKeywordsLinkExample2)}>
                                    {byKeywordsLinkExample2.text}
                                </a>
                            </Text>
                        </LinkWrapper>
                    </div>
                }
            />
            <FindAffiliateHomePageIllustrationComponent artworkConfig={byKeywordsArtworkConfig} />
        </FindAffiliateByKeywordsHomePageWrapper>
    );
};
