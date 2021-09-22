import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Button } from "@similarweb/ui-components/dist/button";
import { setMarketingWorkspaceSetRecommendationEngine } from "actions/marketingWorkspaceActions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { BenchmarkToArenaItem } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import { BenchmarkToArenaModal } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaModal";
import { i18nFilter } from "filters/ngFilters";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import * as React from "react";
import { useState } from "react";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    Content,
    LeftIcon,
    LinkText,
    LinkTitle,
    QuickLinkContainer,
} from "styled components/Workspace/src/StyledQuickLink";
import styled from "styled-components";

const SuggestionsContainer = styled.div`
    padding: 16px 16px 15px 23px;
    position: relative;
`;
const Title = styled.div`
    text-align: left;
    margin-bottom: 12px;
    font-family: roboto;
    font-size: 14px;
`;
const HideButton = styled.div`
    position: absolute;
    right: 20px;
    top: 8px;
`;
const Suggestion = styled.div`
    display: flex;
    justify-content: space-evenly;
`;
const QuickLinkBox = styled.div`
    width: 50%;
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-sizing: border-box;
    overflow: hidden;
    margin-right: 16px;
    font-weight: bold;
    padding: 13px 16px 16px 13px;
    display: flex;
    justify-content: space-evenly;
  }
`;

const KWLinkTitle = styled(LinkTitle)`
    margin: 0px;
    font-family: Roboto;
    line-height: 24px;
`;

const KWLinkText = styled.div`
    width: 386px;
    color: ${colorsPalettes.carbon["200"]};
    font-family: Roboto;
    font-size: 14px;
    line-height: 20px;
    font-weight: normal;
    @media (max-width: 1650px) {
        width: 100%;
    }
`;

const ButtonWrapper = styled.div`
    width: 347px;
    margin: auto;
    padding-left: 16px;
    @media (min-width: 1350px) and (max-width: 1439px) {
        width: 380px;
    }
    @media (min-width: 1280px) and (max-width: 1349px) {
        width: 412px;
    }
`;

const quickLinks = () => [
    {
        title: i18nFilter()("workspace.marketing.suggestions.keyword.title"),
        text: i18nFilter()("workspace.marketing.suggestions.keyword.text"),
        buttonText: i18nFilter()("workspace.marketing.suggestions.keyword.button"),
        name: "keyword",
        iconComponent: "suggestions-phrases",
    },
    {
        title: i18nFilter()("workspace.marketing.suggestions.partner.title"),
        text: i18nFilter()("workspace.marketing.suggestions.partner.text"),
        buttonText: i18nFilter()("workspace.marketing.suggestions.partner.button"),
        name: "partner",
        iconComponent: "suggestions-Incoming",
    },
];

export const KWSuggestions = (props) => {
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [showRecommendation, setShowRecommendation] = useState(false);

    const SuggestionsLinks = quickLinks();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const param = swNavigator.getParams();
    const onClick = (link) => () => {
        TrackWithGuidService.trackWithGuid("marketing_workspace.KW.suggestions.widget", "click", {
            navigation: link.name,
        });
        if (link.name === "keyword") {
            props.hideTopNav();
            swNavigator.go("marketingWorkspace-keywordGeneratorTool");
        } else if (link.name === "partner") {
            setShowRecommendation(!showRecommendation);
        }
    };
    const getArenas = () => {
        const arenas = props.arenas.map((arena, index) => {
            const countryObj = CountryService.getCountryById(arena.country);
            return (
                <BenchmarkToArenaItem
                    key={`arena-${index}`}
                    country={countryObj}
                    title={arena.friendlyName}
                    competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                    mainDomain={arena.allies[0]}
                    onClick={onWebsiteGroupRecommendationEngine(arena)}
                />
            );
        });
        if (arenas.length === 0) {
            return null;
        }
        return arenas;
    };
    const onWebsiteGroupRecommendationEngine = (arena) => () => {
        setShowRecommendation(!showRecommendation);
        setMarketingWorkspaceSetRecommendationEngine(arena.id);
        const params = {
            ...param,
            arenaId: arena.id,
        };
        marketingWorkspaceGo("marketingWorkspace-websiteGroupRecommendation", params);
    };
    const onToggle = () => {
        TrackWithGuidService.trackWithGuid(
            "marketing_workspace.KW.suggestions.widget.close",
            "click",
        );
        props.removeSuggestionBar();
        setShowSuggestions(!showSuggestions);
    };
    const onshowRecommendationClose = () => {
        setShowRecommendation(!showRecommendation);
    };
    const SuggestionsLink = SuggestionsLinks.map((link, index) => {
        return (
            <QuickLinkBox key={index}>
                <LeftIcon>
                    <SWReactIcons iconName={link.iconComponent} size="md" />
                </LeftIcon>
                <Content>
                    <KWLinkTitle>{link.title}</KWLinkTitle>
                    <KWLinkText>{link.text}</KWLinkText>
                </Content>
                <ButtonWrapper>
                    <Button label={link.buttonText} onClick={onClick(link)} />
                </ButtonWrapper>
            </QuickLinkBox>
        );
    });
    return (
        <div>
            {props.isOpen && showSuggestions && (
                <SuggestionsContainer ref={props.ref}>
                    <Title>
                        {i18nFilter()("workspace.marketing.suggestions.title_1")}
                        <strong>{i18nFilter()("workspace.marketing.suggestions.title_2")}</strong>
                    </Title>
                    <HideButton>
                        <IconButton
                            iconName="clear-circle"
                            type="flat"
                            iconSize="sm"
                            onClick={onToggle}
                        />
                    </HideButton>
                    <Suggestion>{SuggestionsLink}</Suggestion>
                </SuggestionsContainer>
            )}
            <BenchmarkToArenaModal
                isOpen={showRecommendation}
                title={i18nFilter()("workspaces.marketing.websitegroup.recommendation.modal.title")}
                subTitle={i18nFilter()(
                    "workspaces.marketing.websitegroup.recommendation.modal.subtitle",
                )}
                onCloseClick={onshowRecommendationClose}
            >
                {getArenas()}
            </BenchmarkToArenaModal>
        </div>
    );
};

KWSuggestions.defaultProps = {
    isOpen: true,
};
