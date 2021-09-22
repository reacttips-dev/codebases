/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from "react";
import { i18nFilter } from "filters/ngFilters";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FEED_FEEDBACK_NEGATIVE } from "../../../../../app/pages/workspace/common/consts";
import { INewsFeedItem } from "../../../../../app/pages/workspace/common/types";
import { WorkspaceContext, workspaceContextType } from "../WorkspaceContext";
import {
    CardNewsSummary,
    DismissCard,
    FeedCardLink,
    FeedCardLinkContainer,
    FeedCardWrapper,
    NewsCardBody,
    NewsFeedCardContainer,
    NewsFeedCardHeader,
    NewsFeedCardTitle,
    NewsItemPublisher,
    NewsLinkButton,
    PublishedImage,
} from "./elements";
import { NewsCardBadges } from "./FeedCardBadges";

interface IFeedCardState {
    seen: boolean;
}

export class FeedCardNews extends Component<INewsFeedItem, IFeedCardState> {
    public static contextType = WorkspaceContext;

    constructor(props) {
        super(props);
        this.state = {
            seen: !!props.LastSeenDate,
        };
    }

    public closeCard = (e) => {
        this.context.setFeedback(this.props.Id, FEED_FEEDBACK_NEGATIVE, "not useful");
        TrackWithGuidService.trackWithGuid("workspace_sales_feed_news_remove_item", "click");
    };

    public render() {
        const {
            dataDate,
            DataDate,
            Site,
            grand_parent_category,
            title,
            summary,
            FeedbackItemFeedback,
            link,
            publisher,
            image_url,
            noCloseButton,
        } = this.props;
        const cardHasFeedback = !!(FeedbackItemFeedback && FeedbackItemFeedback.Type);
        const cardVisible =
            !FeedbackItemFeedback ||
            !FeedbackItemFeedback.Type ||
            FeedbackItemFeedback.Type !== FEED_FEEDBACK_NEGATIVE;
        const trackMcClick = () => {
            TrackWithGuidService.trackWithGuid("workspace_sales_feed_news_visit_article", "click", {
                site: Site,
            });
            allTrackers.trackEvent("Outgoing link", "click", "Company news");

            const index = this.context?.selectedDomain?.feedData.findIndex(
                (item) => this.props.Id === item.Id,
            );
            if (Number.isInteger(index)) {
                TrackWithGuidService.trackWithGuid(
                    "workspace_sales_feed_tab_click_read_more_from_right_bar",
                    "click",
                    {
                        domain: this.props.Site,
                        placeInList: index + 1,
                    },
                );
            }
        };
        return (
            <WorkspaceContext.Consumer>
                {({ isRightBarOpen }: workspaceContextType) => {
                    if (!isRightBarOpen && !this.state.seen) {
                        setTimeout(() => {
                            this.setState({ seen: true });
                        }, 300);
                    }
                    return (
                        <FeedCardWrapper visible={cardVisible}>
                            <NewsFeedCardContainer
                                seen={this.state.seen}
                                hasFeedback={cardHasFeedback}
                                visible={cardVisible}
                            >
                                <NewsFeedCardHeader>
                                    <NewsFeedCardTitle>{title}</NewsFeedCardTitle>
                                    {!noCloseButton && (
                                        <DismissCard onClick={this.closeCard}>
                                            <SWReactIcons iconName="close" iconSize="xs" />
                                        </DismissCard>
                                    )}
                                </NewsFeedCardHeader>
                                <NewsItemPublisher>{publisher}</NewsItemPublisher>
                                <NewsCardBadges
                                    site={Site}
                                    category={grand_parent_category}
                                    publishDate={DataDate || dataDate}
                                />
                                <NewsCardBody>
                                    <PublishedImage data-url={image_url} />
                                    <CardNewsSummary>{summary || title}</CardNewsSummary>
                                </NewsCardBody>
                                <FeedCardLinkContainer>
                                    <PlainTooltip
                                        enabled={!link}
                                        tooltipContent={i18nFilter()(
                                            "workspaces.feed.card.news.no_link",
                                        )}
                                    >
                                        <span>
                                            <NewsLinkButton
                                                type="flat"
                                                iconName="arrow-right"
                                                placement="right"
                                                isDisabled={!link}
                                            >
                                                <FeedCardLink
                                                    href={link}
                                                    target="_blank"
                                                    onClick={trackMcClick}
                                                >
                                                    <span>{"Read More"}</span>
                                                </FeedCardLink>
                                            </NewsLinkButton>
                                        </span>
                                    </PlainTooltip>
                                </FeedCardLinkContainer>
                            </NewsFeedCardContainer>
                        </FeedCardWrapper>
                    );
                }}
            </WorkspaceContext.Consumer>
        );
    }
}
