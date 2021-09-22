import React from "react";
import { StyledFeedsGroup } from "./styles";
import { StyledFeedGroupTitle } from "../styles";
import { INewsFeedItem } from "pages/workspace/common/types";
import { AdNetworksFeed, Feed, FeedMetric } from "../../types/feed";
import { FeedCardNews } from "pages/workspace/common components/FeedCard/FeedCardNews";
import { FeedCard } from "pages/workspace/common components/FeedCard/FeedCard";
import LegacyAdNetworkFeed from "../LegacyAdNetwork/AdNetworkFeed";

// TODO: Refactor
// this component for now only displays news
export type FeedsGroupProps = {
    title: string;
    feeds: Feed[];
    enabledNews: boolean;
};

const FeedsGroup = ({ title, enabledNews, feeds }: FeedsGroupProps) => {
    /**
     * @deprecated
     */
    function renderFeedByMetric(feed: Feed) {
        switch (feed.metric) {
            case FeedMetric.NEWS:
                return <FeedCardNews key={feed.id} {...(feed as any)} noCloseButton={true} />;
            case FeedMetric.DESKTOP_MMX_OUTLIER:
            case FeedMetric.MONTHLY_TOTAL_VISITS:
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                return <FeedCard key={feed.Id} {...feed} />;
            case FeedMetric.AD_NETWORK:
                return <LegacyAdNetworkFeed key={feed.id} feed={feed as AdNetworksFeed} />;
            default:
                return null;
        }
    }

    const renderTitle = () => {
        if (!title) {
            return null;
        }

        return (
            <StyledFeedGroupTitle>
                <span>{title}</span>
            </StyledFeedGroupTitle>
        );
    };

    const renderOnlyNews = (feeds) => {
        //FIXME @Denis Kulinich
        // if (!enabledNews) {
        //     return null;
        // }

        const onlyNews = feeds.filter((feed) => feed.metric === FeedMetric.NEWS);

        if (onlyNews.length === 0) {
            return null;
        }
        //TODO for now title is not correctly generated because of not sufficient back end data
        return (
            <>
                {renderTitle()}
                {onlyNews.map((feed: Feed) => (
                    <FeedCardNews key={feed.id} {...(feed as any)} noCloseButton />
                ))}
            </>
        );
    };

    return <StyledFeedsGroup>{renderOnlyNews(feeds)}</StyledFeedsGroup>;
};

export default React.memo(FeedsGroup);
