import React from "react";
import FeedsGroup from "../FeedsGroup/FeedsGroup";
import { StyledFeedsListContainer } from "./styles";
import { AboutCards } from "../AboutCards/AboutCards";
import { NewsFeedCardTitle } from "../../../../../../../../.pro-features/pages/workspace/common components/FeedCard/elements";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ABOUT_COMPANY_NEWS_TITLE, ABOUT_COMPANY_NO_NEWS_TITLE } from "../../constants";
import { GroupedFeedsContainerProps } from "../../types/feed";
import EmptyState from "../../../benchmarks/components/BenchmarksEmptyState/BenchmarksEmptyState";

const GroupedFeedsContainer = ({
    feedsGroup,
    topCountries,
    adNetworks,
    siteInfo,
    linkToTrends,
    linkToBenchmarks,
    accountReviewLink,
    news,
    enabledNews,
    topic,
    benchmarksQuota,
    benchmarksAreEmpty,
    technologies,
    activeWebsite,
    isSales,
}: GroupedFeedsContainerProps) => {
    const translate = useTranslation();

    const renderFeeds = () => {
        if (!news.length && enabledNews) {
            return (
                <EmptyState
                    className="emptyFeed"
                    title={translate(ABOUT_COMPANY_NO_NEWS_TITLE)}
                    iconName={"no-data-lab"}
                />
            );
        }

        return (
            <>
                {Object.keys(feedsGroup).map((date) => (
                    <FeedsGroup
                        enabledNews={enabledNews}
                        key={date}
                        title={date}
                        feeds={feedsGroup[date]}
                    />
                ))}
            </>
        );
    };

    return (
        <StyledFeedsListContainer>
            <AboutCards
                benchmarksAreEmpty={benchmarksAreEmpty}
                benchmarksQuota={benchmarksQuota}
                linkToTrends={linkToTrends}
                linkToBenchmarks={linkToBenchmarks}
                topCountries={topCountries}
                adNetworks={adNetworks}
                siteInfo={siteInfo}
                topic={topic}
                accountReviewLink={accountReviewLink}
                technologies={technologies}
                activeWebsite={activeWebsite}
                isSales={isSales}
            />
            {enabledNews && (
                <NewsFeedCardTitle>{translate(ABOUT_COMPANY_NEWS_TITLE)}</NewsFeedCardTitle>
            )}
            {renderFeeds()}
        </StyledFeedsListContainer>
    );
};

export default GroupedFeedsContainer;
