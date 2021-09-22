import React from "react";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { IndustryItem } from "./IndustryLeadItem/IndustryItem";
import { SearchWrapper, StyledWrapperUseCaseHomepage } from "../styles";
import {
    INDUSTRY_SEARCH_PLACHOLDER,
    INDUSTRY_SUBTITLE,
    INDUSTRY_TITLE,
    INDUSTRY_BODY_TEXT,
} from "../../constants/industryLeads";
import { TIndustryLeadsProps } from "../../interfaces/industryLeads";
import { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import { LEAD_ROUTES } from "../../constants/routes";
import { ICategory } from "common/services/categoryService.types";
import { defaultConfigIndustry } from "./IndustyResult/configs/allConfigs";
import { RecentIndustryArgs } from "pages/sales-intelligence/types";
import { useRecent } from "custom-hooks/useRecentHook";
import { configureRecentIndustry, resolveItemIcon } from "./utils";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";

export function IndustryLeadsComponent({
    navigator,
}: TIndustryLeadsProps & WithSWNavigatorProps): JSX.Element {
    const translate = useTranslation();

    const recentIndustry = useRecent("industry");

    const configedRecentIndustry = configureRecentIndustry(recentIndustry, 10);

    const handleClick = ({ forUrl }: ICategory) => {
        navigator.go(`${LEAD_ROUTES.INDUSTRY_RESULT}-TopWebsites`, {
            category: forUrl,
            ...defaultConfigIndustry,
        });
    };

    const handleClickBack = () => navigator.go(LEAD_ROUTES.ROOT);

    const handleClickRecently = ({
        category,
        duration,
        country,
        webSource,
    }: RecentIndustryArgs) => () => {
        navigator.go(`${LEAD_ROUTES.INDUSTRY_RESULT}-TopWebsites`, {
            ...defaultConfigIndustry,
            category,
            duration,
            country,
            webSource,
        });
    };

    const renderData = configedRecentIndustry.map(({ text, data, icon }, idx) => {
        const { duration, country, webSource, category } = data;
        return (
            <IndustryItem
                onClick={handleClickRecently({ category, duration, country, webSource })}
                key={idx}
                text={text}
                icon={icon}
            />
        );
    });

    return (
        <>
            <FindLeadsByCriteriaPageHeader step={0} onBackClick={handleClickBack} />
            <StyledWrapperUseCaseHomepage>
                <UseCaseHomepage
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                    searchComponents={
                        <SearchWrapper>
                            <AutocompleteWebCategories
                                customResolveItemIcon={resolveItemIcon}
                                showOnlyCategories={true}
                                onClick={handleClick}
                                autocompleteProps={{
                                    placeholder: translate(INDUSTRY_SEARCH_PLACHOLDER),
                                }}
                            />
                        </SearchWrapper>
                    }
                    titlePosition="left-aligned"
                    paddingBottom="28px"
                    subtitle={translate(INDUSTRY_SUBTITLE)}
                    title={translate(INDUSTRY_TITLE)}
                    listItems={renderData}
                    bodyText={translate(INDUSTRY_BODY_TEXT)}
                />
            </StyledWrapperUseCaseHomepage>
        </>
    );
}
