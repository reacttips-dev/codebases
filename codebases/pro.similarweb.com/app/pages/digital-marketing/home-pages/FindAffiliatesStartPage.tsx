import React from "react";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StartPageBox } from "components/React/StartPageBox/StartPageBox";

const links = [
    {
        icon: "affiliates-keyword",
        title: "find.affiliates.page.affiliates.keyword.title",
        text: "find.affiliates.page.affiliates.keyword.text",
        state: "findaffiliates_bykeywords_homepage",
        marginRight: "24px",
        trackName: "Affiliates Keyword",
    },
    {
        icon: "affiliates-competitive-gap",
        title: "find.affiliates.page.affiliates.competitive.gap.title",
        text: "find.affiliates.page.affiliates.competitive.gap.text",
        state: "findaffiliates_byindustry_homepage",
        trackName: "Affiliates Competitive Gap",
    },
    {
        icon: "affiliates-competition",
        title: "find.affiliates.page.affiliates.competition.title",
        text: "find.affiliates.page.affiliates.competition.text",
        state: "findaffiliates_bycompetition_homepage",
        marginRight: "24px",
        trackName: "Affiliates Competition",
    },
];

const i18n = i18nFilter();

const StartPageSection = styled.div`
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

const StartPageTilesSection = styled(FlexRow)`
    flex-wrap: wrap;
    margin-bottom: 24px;
    width: 670px;
`;

const onLinkClick = (state, trackName) => {
    TrackWithGuidService.trackWithGuid("digital.marketing.find.affiliates.page", "click", {
        pageName: trackName,
    });
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    swNavigator.go(state);
};

export const FindAffiliatesStartPage = () => {
    return (
        <StartPageSection data-automation="find-affiliates-page">
            <StartPageTitle>{i18n("find.affiliates.page.title")}</StartPageTitle>
            <StartPageSubTitle>{i18n("find.affiliates.page.subTitle")}</StartPageSubTitle>
            <StartPageTilesSection>
                {links.map((link, index) => (
                    <StartPageBox key={index} link={link} onLinkClick={onLinkClick} />
                ))}
            </StartPageTilesSection>
        </StartPageSection>
    );
};

SWReactRootComponent(FindAffiliatesStartPage, "FindAffiliatesStartPage");
