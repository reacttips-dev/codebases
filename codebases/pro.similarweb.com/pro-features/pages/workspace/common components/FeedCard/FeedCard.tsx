import { IconButton } from "@similarweb/ui-components/dist/button";
import React from "react";
import { Component } from "react";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FEED_FEEDBACK_NEGATIVE } from "../../../../../app/pages/workspace/common/consts";
import {
    IWebsiteFeedItem,
    IWebsiteMmxFeedItem,
} from "../../../../../app/pages/workspace/common/types";
import { WorkspaceContext, workspaceContextType } from "../WorkspaceContext";
import {
    CardBodyContainer,
    FeedCardContainer,
    FeedCardHeader,
    FeedCardLink,
    FeedCardLinkContainer,
    FeedCardTitle,
    FeedCardWrapper,
} from "./elements";
import { FeedCardBadges } from "./FeedCardBadges";
import { FeedCardFeedback } from "./FeedCardFeedback";
import { getCardDates, getMetricDetailsMMx, getMetricDetailsMonthlyVisits } from "./FeedCardUtils";
import { formatChange } from "./utils";

interface IFeedCardState {
    seen: boolean;
}

export class FeedCard extends Component<IWebsiteFeedItem | IWebsiteMmxFeedItem, IFeedCardState> {
    constructor(props) {
        super(props);
        this.state = {
            seen: !!props.LastSeenDate,
        };
    }

    public render() {
        const {
            Country,
            Change,
            Channel = null,
            WebSource,
            Site,
            FeedbackItemFeedback,
            Id,
            DataDate,
            Metric,
        } = this.props as IWebsiteMmxFeedItem;
        const cardHasFeedback = !!(FeedbackItemFeedback && FeedbackItemFeedback.Type);
        const cardVisible =
            !FeedbackItemFeedback ||
            !FeedbackItemFeedback.Type ||
            FeedbackItemFeedback.Type !== FEED_FEEDBACK_NEGATIVE;
        const trackMcClick = () => {
            allTrackers.trackEvent("Internal link", "click", "Marketing channels");

            TrackWithGuidService.trackWithGuid(
                "workspace_sales_feed_tab_click_analyze_traffic_engagement_from_right_bar",
                "click",
                {
                    domain: this.props.Site,
                    alertType: this.props.Metric,
                },
            );
        };
        return (
            <WorkspaceContext.Consumer>
                {({
                    getCountryById,
                    translate,
                    getTeLink,
                    getMcLink,
                    isRightBarOpen,
                }: workspaceContextType) => {
                    const country = getCountryById(Country);
                    if (!isRightBarOpen && !this.state.seen) {
                        setTimeout(() => {
                            this.setState({ seen: true });
                        }, 300);
                    }
                    let cardLink, cardDetails;
                    switch (Metric) {
                        case "monthly_total_visits_change":
                            cardLink = getTeLink;
                            cardDetails = getMetricDetailsMonthlyVisits(Change);
                            break;
                        case "desktop_mmx_outlier_change":
                            cardLink = getMcLink;
                            cardDetails = getMetricDetailsMMx(Change, Channel);
                            break;
                    }
                    const { cardTitle, cardText, cardButton } = cardDetails;
                    const { fromMonth, toMonth } = getCardDates(DataDate);
                    return (
                        <FeedCardWrapper visible={cardVisible}>
                            <FeedCardContainer
                                seen={this.state.seen}
                                hasFeedback={cardHasFeedback}
                                visible={cardVisible}
                            >
                                <FeedCardHeader>
                                    <FeedCardTitle>{translate(cardTitle)}</FeedCardTitle>
                                    <FeedCardFeedback
                                        feedbackItem={FeedbackItemFeedback}
                                        id={Id}
                                        site={Site}
                                        country={country}
                                        change={Change}
                                        webSource={WebSource}
                                        cardTitle={cardTitle}
                                        cardText={cardText}
                                        fromMonth={fromMonth}
                                        toMonth={toMonth}
                                    />
                                </FeedCardHeader>
                                <FeedCardBadges
                                    country={country}
                                    change={Change}
                                    webSource={WebSource}
                                />
                                <CardBodyContainer>
                                    {translate(cardText, {
                                        change: formatChange(Change),
                                        from_month: fromMonth,
                                        to_month: toMonth,
                                    })}
                                </CardBodyContainer>
                                <FeedCardLinkContainer>
                                    <IconButton
                                        type="flat"
                                        iconName="arrow-right"
                                        placement="right"
                                    >
                                        <FeedCardLink
                                            href={cardLink(Site, Country)}
                                            target="_blank"
                                            onClick={trackMcClick}
                                        >
                                            <span>{translate(cardButton)}</span>
                                        </FeedCardLink>
                                    </IconButton>
                                </FeedCardLinkContainer>
                            </FeedCardContainer>
                        </FeedCardWrapper>
                    );
                }}
            </WorkspaceContext.Consumer>
        );
    }
}
