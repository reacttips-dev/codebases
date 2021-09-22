import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import ABService from "services/ABService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { LeftIcon, QuickLinkContainer } from "styled components/Workspace/src/StyledQuickLink";
import styled from "styled-components";

interface ISuggestionsProps {
    showSuggestions?: boolean;
}
const SuggestionsContainer = styled.div`
    padding: 20px 16px 15px 23px;
    ${({ showSuggestions }: ISuggestionsProps) =>
        showSuggestions
            ? `
    background-color: ${colorsPalettes.carbon[0]};
    `
            : ` padding-bottom: 0px; `};
    position: relative;
    top: -32px;
`;
const Title = styled.span`
    text-align: left;
    margin-bottom: 19px;
`;
const Text = styled.div`
    color: ${colorsPalettes.midnight[600]};
    font-size: 14px;
    font-family: Roboto;
    font-weight: 400;
    @media (max-width: 1280px) {
        font-size: 12px;
    }
`;
const HideButton = styled.div`
    position: absolute;
    right: 20px;
    top: 8px;
`;
const Suggestion = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding-right: 55px;
    ${({ showSuggestions }: ISuggestionsProps) =>
        showSuggestions
            ? `
    margin-top: 19px `
            : null};
`;
const QuickLinkBox = styled(QuickLinkContainer)`
    height: 80px;
    width: 25%;
    border-radius: 6px;
    cursor: pointer;
    background-color: ${rgba(colorsPalettes.carbon[500], 0.04)};
    box-sizing: border-box;
    overflow: hidden;
    margin-right: 16px;
    :hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.1)};
    }
`;
const quickLinks = (chosenSite, duration, country) => [
    {
        text: i18nFilter()("wwo.navigation.traffic.search.phrases", { chosenSite }),
        state: "websites-trafficSearch-phrases",
        iconComponent: "suggestions-phrases",
        trackID: "trafficSearch",
        params: {
            key: chosenSite,
            isWWW: "*",
            country,
            duration,
            webSource: "Total",
        },
    },
    {
        text: i18nFilter()("wwo.navigation.traffic.overview", { chosenSite }),
        state: "websites-trafficOverview",
        category: "no-category",
        iconComponent: "suggestons-mmx",
        trackID: "trafficOverview",
        params: {
            key: chosenSite,
            isWWW: "*",
            country,
            duration,
            webSource: "Total",
            category: "no-category",
        },
    },
    {
        text: i18nFilter()("wwo.navigation.audience.interests", { chosenSite }),
        state: "websites-audienceInterests",
        iconComponent: "suggestions-audience",
        trackID: "audienceInterests",
        params: {
            key: chosenSite,
            isWWW: "*",
            country,
            duration,
            webSource: "Total",
        },
    },
    {
        text: i18nFilter()("wwo.navigation.traffic.referrals", { chosenSite }),
        state: "websites-trafficReferrals",
        iconComponent: "suggestions-Incoming",
        trackID: "trafficReferrals",
        params: {
            key: chosenSite,
            isWWW: "*",
            country,
            duration,
            webSource: "Total",
        },
    },
];
const Suggestions = (props) => {
    const isCompare = props?.params?.key?.split(",").length > 1;
    const isFroUser = swSettings.user.isFro;
    if (!isFroUser || isCompare) {
        return null;
    }

    const [showSuggestions, setShowSuggestions] = useState(true);
    const chosenSite = props.params.key;
    const duration = props.params.duration;
    const country = props.params.country;
    const SuggestionsLinks = quickLinks(chosenSite, duration, country);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const vwoSuggestionsWidget = ABService.getFlag("vwoSuggestionsWidget");
    const onClick = (link) => () => {
        TrackWithGuidService.trackWithGuid("wwo.suggestions.bar", "click", {
            navigation: link.trackID,
        });
    };
    const onToggle = () => {
        setShowSuggestions(!showSuggestions);
    };
    const SuggestionsLink = SuggestionsLinks.map((link, index) => {
        const url = swNavigator.href(link.state, link.params);
        return (
            <QuickLinkBox key={index} onClick={onClick(link)} href={url} target="_self">
                <LeftIcon>
                    <SWReactIcons iconName={link.iconComponent} size="md" />
                </LeftIcon>
                <Text>{link.text}</Text>
            </QuickLinkBox>
        );
    });
    return (
        vwoSuggestionsWidget && (
            <SuggestionsContainer
                showSuggestions={showSuggestions}
                data-sw-vwo-website-analysis-suggestions
            >
                <Title>
                    {i18nFilter()("wwo.navigation.title")}
                    <strong>{chosenSite}</strong>?
                </Title>
                <HideButton>
                    <IconButton
                        iconName={showSuggestions ? "chev-up" : "chev-down"}
                        type="flat"
                        iconSize="xs"
                        onClick={onToggle}
                    >
                        {i18nFilter()(
                            showSuggestions
                                ? "wwo.navigation.button.hide"
                                : "wwo.navigation.button.show",
                        )}
                    </IconButton>
                </HideButton>
                <Suggestion showSuggestions={showSuggestions}>
                    {showSuggestions && SuggestionsLink}
                </Suggestion>
            </SuggestionsContainer>
        )
    );
};

const mapStateToProps = ({ routing: { params } }) => {
    return {
        params,
    };
};

const connected = connect(mapStateToProps)(Suggestions);

SWReactRootComponent(connected, "Suggestions");
