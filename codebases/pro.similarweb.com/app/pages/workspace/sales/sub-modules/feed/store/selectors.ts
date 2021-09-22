import { createSelector } from "reselect";
import {
    compareAsDatesDescending,
    formatFeedDate,
    groupByMonth,
    removeWithNegativeFeedback,
} from "../helpers";
import { selectFeedSlice } from "../../../store/selectors";
import { AD_NETWORKS_MOST_USED_COUNT } from "../constants";
import { createStatePropertySelector } from "../../../helpers";
import { getUseStatisticsToMostUsedIdsTransformer } from "../../usage-statistics/helpers";
import { selectOpportunitiesListIdFromProps } from "../../opportunities-lists/store/selectors";
import _ from "lodash";
import { compose } from "redux";
import { Feed, FeedsByDate } from "../types/feed";

const select = createStatePropertySelector(selectFeedSlice);
const transformToMostUsedAdNetworkIds = getUseStatisticsToMostUsedIdsTransformer(
    AD_NETWORKS_MOST_USED_COUNT,
);
// cards
export const selectFeeds = select("feeds");
export const selectAdNetworks = select("adNetworks");
export const selectTopCountries = select("topCountries");
export const selectTechnologies = select("technologies");
export const selectSiteInfo = select("siteInfo");
// loading states
export const selectFetchingFeeds = select("fetchingFeeds");
export const selectFetchingFeedsError = select("fetchingFeedsError");
// props
export const selectSiteInfoFavicon = createSelector(selectSiteInfo, ({ favIcon }) => favIcon);
export const selectAdNetworksUseStatistics = select("adNetworksUseStatistics");

export const selectFeedsWithoutNegativeFeedback = createSelector(
    selectFeeds,
    removeWithNegativeFeedback,
);

export const selectPreviousCategory = createSelector(
    selectTechnologies,
    (technologiesData) => technologiesData.selectedTechnology,
);

export const selectNewsByMonth = createSelector(
    selectFeedsWithoutNegativeFeedback,
    compose(groupByMonth, (items) => items.filter((item) => item.Metric === "news")),
);

export const selectAdNetworksUseStatisticsForCurrentList = createSelector(
    [selectAdNetworksUseStatistics, selectOpportunitiesListIdFromProps],
    (useStatisticsByList, listId) => {
        return useStatisticsByList[listId] || {};
    },
);

export const selectAdNetworksMostUsedIds = createSelector(
    selectAdNetworksUseStatisticsForCurrentList,
    transformToMostUsedAdNetworkIds,
);

export const selectGroupedFeeds = createSelector(
    selectFeedsWithoutNegativeFeedback,
    (feed: Feed[]): FeedsByDate => {
        const sortedNews = [...feed].sort((a, b) =>
            compareAsDatesDescending(a.dataDate, b.dataDate),
        );
        const resultNews = sortedNews.reduce((acc, item) => {
            const date = formatFeedDate(item?.dataDate);
            if (acc[date]) {
                acc[date].push(item);
                return acc;
            }
            acc[date] = [item];

            return acc;
        }, {});
        return resultNews;
    },
);

export const selectNews = createSelector(selectGroupedFeeds, (news) => Object.values(news).flat());
