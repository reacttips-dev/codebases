import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { StartPageBox } from "components/React/StartPageBox/StartPageBox";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { iconTypes } from "UtilitiesAndConstants/Constants/IconTypes";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

const links = [
    {
        icon: iconTypes.ICON_LIGHT_BULB,
        title: "find.keywords.home.page.keyword.generator.title",
        text: "find.keywords.home.page.keyword.generator.text",
        state: "findkeywords_KeywordGenerator_home",
        marginRight: "24px",
        trackName: "Keyword Generator",
        infoText: "find.keywords.home.page.keyword.generator.new.pages.text",
        infoBadgeText: "NEW",
    },
    {
        icon: iconTypes.KEYWORD_GAP,
        title: "find.keywords.home.page.keyword.gap.title",
        text: "find.keywords.home.page.keyword.gap.text",
        state: "findkeywords_KeywordGap_home",
        trackName: "Keyword Gap",
    },
    {
        icon: "seasonal-brella",
        title: "find.keywords.home.page.keyword.seasonality.title",
        text: "find.keywords.home.page.keyword.seasonality.text",
        state: "findkeywords_SeasonalKeywords_home",
        marginRight: "24px",
        trackName: "Seasonal Keywords",
    },
    {
        icon: "keyword-industry",
        title: "find.keywords.home.page.keyword.industry.title",
        text: "find.keywords.home.page.keyword.industry.text",
        state: "findkeywords_TopKeywords_home",
        trackName: "keyword industry",
    },
];
const StartPageTitleSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 104px 164px 0 164px;
`;

const StartPageTitle = styled.div`
    width: 210px;
    ${setFont({ $size: 32, $weight: 500, $color: colorsPalettes.carbon[500] })};
    line-height: 40px;
    margin-bottom: 16px;
`;

const StartPageSubTitle = styled.div`
    width: 440px;
    ${setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[400] })};
    line-height: 20px;
    margin-bottom: 42px;
`;

const StartPageTableSection = styled(FlexRow)`
    flex-wrap: wrap;
    margin-bottom: 24px;
    width: 670px;
`;

const onLinkClick = (state, trackName) => {
    TrackWithGuidService.trackWithGuid("digital.marketing.find.keywords.home.page", "click", {
        pageName: trackName,
    });
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    swNavigator.go(state);
};

const FindKeywordsHomePage = () => {
    return (
        <>
            <StartPageTitleSection>
                <StartPageTitle>{i18nFilter()("find.keywords.home.page.title")}</StartPageTitle>
                <StartPageSubTitle>
                    {i18nFilter()("find.keywords.home.page.subTitle")}
                </StartPageSubTitle>
                <StartPageTableSection>
                    {links.map((link, index) => (
                        <StartPageBox key={index} link={link} onLinkClick={onLinkClick} />
                    ))}
                </StartPageTableSection>
            </StartPageTitleSection>
        </>
    );
};

SWReactRootComponent(FindKeywordsHomePage, "FindKeywordsHomePage");
