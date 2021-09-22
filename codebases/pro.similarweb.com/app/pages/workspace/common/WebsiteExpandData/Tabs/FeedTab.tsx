import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { FeedCardsList } from "pages/workspace/common components/FeedCard/FeedCardsList";
import { RecommendationsEmptyState } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsEmptyState";
import {
    RecommendationsSidebarEmptyStateBoldTitle,
    RecommendationsSidebarEmptyStateTitle,
} from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { CircularLoader } from "../../../../../components/React/CircularLoader";
import { FEED_FEEDBACK_NEGATIVE } from "../../consts";
import { selectActiveOpportunityList } from "../../selectors";
import { IOpportunityListItem, IWebsiteFeedItem } from "../../types";
import {
    circularLoaderOptions,
    FeedEmptyStateImageAndText,
    LoadingFeed,
    TabWrapper,
} from "./StyledComponents";

interface IFeedTabProps {
    activeWorkspaceId: string;
    activeOpportunitiesList: IOpportunityListItem;
    feedData: IWebsiteFeedItem[];
    domain: string;
    country: number;
    isFeedDataLoading: boolean;

    editOpportunityList(workspaceId, list, editFeedGeos?, selectedTab?): void;
}

const FeedTabContent = ({
    activeWorkspaceId,
    activeOpportunitiesList,
    feedData,
    domain,
    country,
    isFeedDataLoading,
}: IFeedTabProps) => {
    const visibleCards = feedData.filter(
        (card) =>
            !card.FeedbackItemFeedback ||
            !card.FeedbackItemFeedback.Type ||
            card.FeedbackItemFeedback.Type !== FEED_FEEDBACK_NEGATIVE,
    );
    return (
        <TabWrapper>
            {isFeedDataLoading ? (
                <LoadingFeed>
                    <CircularLoader options={circularLoaderOptions} />
                </LoadingFeed>
            ) : (
                <>
                    {visibleCards.length > 0 ? (
                        <FeedCardsList cards={feedData} />
                    ) : (
                        <FeedEmptyStateImageAndText>
                            {RecommendationsEmptyState}
                            <RecommendationsSidebarEmptyStateBoldTitle>
                                {i18nFilter()("workspace.feed_sidebar.empty_state.title")}
                            </RecommendationsSidebarEmptyStateBoldTitle>
                            <RecommendationsSidebarEmptyStateTitle>
                                {i18nFilter()("workspace.feed_sidebar.empty_state")}
                            </RecommendationsSidebarEmptyStateTitle>
                        </FeedEmptyStateImageAndText>
                    )}
                </>
            )}
        </TabWrapper>
    );
};

const mapStateToProps = ({ commonWorkspace }) => {
    const activeOpportunitiesList = selectActiveOpportunityList(commonWorkspace);
    return {
        ...commonWorkspace,
        activeWorkspaceId: commonWorkspace.activeWorkspaceId,
        activeOpportunitiesList,
        feedData: _.get(commonWorkspace, "selectedDomain.feedData", {}),
        domain: _.get(commonWorkspace, "selectedDomain.domain", ""),
        country: activeOpportunitiesList ? activeOpportunitiesList.country : 0,
    };
};

export const FeedTab = connect(mapStateToProps)(FeedTabContent);
