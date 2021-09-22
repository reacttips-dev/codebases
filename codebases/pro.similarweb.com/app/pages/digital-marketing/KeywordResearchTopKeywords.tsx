import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import * as utils from "components/filters-bar/utils";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { useState } from "react";
import * as React from "react";
import styled from "styled-components";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { ICategory } from "common/services/categoryService.types";
import { mixins, rgba, colorsPalettes } from "@similarweb/styles/";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const translate = i18nFilter();
const TopComponentWrapper = styled.div`
    display: flex;
`;
export const StartPageAutoCompleteWrap = styled.div`
    display: flex;
    width: 74%;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 16px 0;
`;

const LinkWrapper = styled.div`
    a {
        color: currentColor;
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const Text = styled.div`
    ${mixins.setFont({ $size: 14, $weight: 400, $color: rgba(colorsPalettes.carbon[400]) })};
    line-height: 23px;
`;

const ButtonWrapper = styled.div`
    margin-top: 2px;
`;

const KeywordResearchTopKeywordsHomepage = (props: {
    section: string;
    title: string;
    subTitle: string;
}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { section, title, subTitle } = props;
    const example1 =
        section === "SeasonalTrends"
            ? "digitalMarketing.findKeywords.SeasonalTrends.link.1"
            : "digitalMarketing.findKeywords.topKeywords.link.1";
    const example2 =
        section === "SeasonalTrends"
            ? "digitalMarketing.findKeywords.SeasonalTrends.link.2"
            : "digitalMarketing.findKeywords.topKeywords.link.2";
    const [selectedCategory, setSelectedCategory] = useState<ICategory>(null);
    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);

    const onClickCategory = (category: ICategory) => {
        setSelectedCategory(category);
    };
    const availableIndustryCountries = utils.getCountries(
        false,
        swSettings.components.IndustryAnalysisTopKeywords,
    );

    const visitKeywordGenerator = ({ category }) => {
        swNavigator.go(
            section === "SeasonalTrends"
                ? "findkeywords_byindustry_SeasonalKeywords"
                : "findkeywords_byindustry_TopKeywords",
            {
                category,
                webSource: "Desktop",
                country: availableIndustryCountries[0].id,
            },
        );
    };

    const onClickVisitKeywordGenerator = () => {
        const isCustomCategory = selectedCategory.isCustomCategory;
        const groupName = selectedCategory.isCustomCategory && selectedCategory.text;
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.by",
            "click",
            { section: "keyword", search: isCustomCategory ? groupName : selectedCategory.id },
        );
        visitKeywordGenerator({ category: selectedCategory.forUrl });
    };

    const onExample1Click = () => {
        const category = categoryService.getCategory(
            section === "SeasonalTrends" ? "Lifestyle~Fashion_and_Apparel" : "Lifestyle",
        );
        setSelectedCategory(category);
    };

    const onExample2Click = () => {
        const category = categoryService.getCategory(
            section === "SeasonalTrends" ? "Home_and_Garden~Gardening" : "Travel_and_Tourism",
        );
        setSelectedCategory(category);
    };

    const onClearSearch = () => {
        setSelectedCategory(null);
    };

    const onKeyDown = (event) => {
        const { keyCode } = event;
        const ENTER_KEY_CODE = 13;
        if (keyCode === ENTER_KEY_CODE) {
            const category = categoryService.getCategory(event.target.value, "text");
            const isCustomCategory = UserCustomCategoryService.getCustomCategories().filter(
                (category) => category.text === event.target.value,
            );
            if (category || isCustomCategory.length > 0) {
                setSelectedCategory(event.target.value);
                onClickVisitKeywordGenerator();
            }
        }
    };

    return (
        <>
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => {
                    setShowCustomCategoriesWizard(false);
                }}
                wizardProps={{
                    stayOnPage: true,
                    onSave: () => {
                        setShowCustomCategoriesWizard(false);
                    },
                }}
            />
            <UseCaseHomePage
                icon={{
                    name: section === "SeasonalTrends" ? "seasonal-brella" : "keyword-industry",
                    size: "xxl",
                }}
                title={translate(title)}
                paddingBottom={"0"}
                titlePosition="centered"
                subtitle={translate(subTitle)}
                showSearchComponentsInTheBody={true}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
                searchComponents={
                    <div>
                        <TopComponentWrapper>
                            <StartPageAutoCompleteWrap onKeyDown={onKeyDown}>
                                <AutocompleteWebCategories
                                    showCustomCategoryEmptyState={true}
                                    selectedValue={selectedCategory}
                                    onClick={onClickCategory}
                                    autocompleteProps={{
                                        placeholder: i18nFilter()(
                                            "digitalMarketing.findKeywords.topKeyword.searchPlaceHolder",
                                        ),
                                    }}
                                    onClearSearch={onClearSearch}
                                    onCreateCustomCategoryClick={() => {
                                        setShowCustomCategoriesWizard(true);
                                    }}
                                />
                            </StartPageAutoCompleteWrap>
                            <ButtonWrapper>
                                <IconButton
                                    iconName="arrow-right"
                                    onClick={onClickVisitKeywordGenerator}
                                >
                                    {i18nFilter()(
                                        "aquisitionintelligence.keywordResearch.homepage.seed.cta",
                                    )}
                                </IconButton>
                            </ButtonWrapper>
                        </TopComponentWrapper>
                        <LinkWrapper>
                            <Text>
                                {i18nFilter()(
                                    "digitalMarketing.findKeywords.keywordGenerator.link.title",
                                )}
                                &nbsp;<a onClick={onExample1Click}>{i18nFilter()(example1)}</a>
                                &nbsp;
                                {i18nFilter()("digitalMarketing.findKeywords.topKeywords.link.or")}
                                &nbsp;
                                <a onClick={onExample2Click}>{i18nFilter()(example2)}</a>
                            </Text>
                        </LinkWrapper>
                    </div>
                }
            />
        </>
    );
};

SWReactRootComponent(KeywordResearchTopKeywordsHomepage, "KeywordResearchTopKeywordsHomepage");
