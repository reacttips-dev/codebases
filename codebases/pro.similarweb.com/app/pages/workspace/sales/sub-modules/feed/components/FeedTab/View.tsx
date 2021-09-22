import React, { useEffect, useState } from "react";
import { CircularLoader } from "components/React/CircularLoader";
import { circularLoaderOptions } from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";
import { StyledTabContainer } from "../styles";
import { StyledFeedLoadingContainer } from "./styles";
import { FeedTabContainerProps } from "./FeedTab";
import GroupedFeedsContainer from "../GroupedFeedsContainer/GroupedFeedsContainer";
import { FeedTabPropsType } from "../../types/feed";

export const View = ({
    feedsFetching,
    feedsGroupedByMonth,
    topCountries,
    adNetworks,
    siteInfo,
    linkToTrends,
    linkToBenchmarks,
    settings,
    enabledNews,
    accountReviewLink,
    benchmarksQuota,
    benchmarksAreEmpty,
    technologies,
    activeWebsite,
    news,
    clearTechnologies,
}: FeedTabContainerProps & FeedTabPropsType): JSX.Element => {
    const { topic } = settings;

    useEffect(() => {
        return () => {
            if (typeof clearTechnologies === "function") {
                clearTechnologies();
            }
        };
    }, []);

    function renderContent() {
        if (feedsFetching) {
            return (
                <StyledFeedLoadingContainer>
                    <CircularLoader options={circularLoaderOptions} />
                </StyledFeedLoadingContainer>
            );
        }

        const render = (
            <GroupedFeedsContainer
                benchmarksAreEmpty={benchmarksAreEmpty}
                benchmarksQuota={benchmarksQuota}
                topCountries={topCountries}
                feedsGroup={feedsGroupedByMonth}
                adNetworks={adNetworks}
                siteInfo={siteInfo}
                linkToTrends={linkToTrends}
                linkToBenchmarks={linkToBenchmarks}
                news={news}
                topic={topic}
                enabledNews={enabledNews}
                accountReviewLink={accountReviewLink}
                technologies={technologies}
                activeWebsite={activeWebsite?.domain}
                isSales={!!activeWebsite}
            />
        );

        return render;
    }

    return <StyledTabContainer>{renderContent()}</StyledTabContainer>;
};
