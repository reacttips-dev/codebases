import React from "react";
import { useScrollTo } from "components/hooks/useScrollTo";
import {
    StyledContainerWrapperRightBar,
    StyledScrollWrapperRightBar,
} from "pages/workspace/sales/components/RightBar/styles";
import { FeedTab } from "pages/workspace/sales/sub-modules/feed/components/FeedTab/FeedTab";
import { AboutTabContainerProps } from "./AboutTabContainer";
import {
    hasActiveListEnabledNews,
    opportunityListHasId,
} from "pages/sales-intelligence/sub-modules/opportunities/helpers";

type RightBarTabWrapperFeedProps = {
    isActiveTab?: boolean;
    linkToTrends?: () => void;
    linkToBenchmarks?: () => void;
};
const DEFAULT_PARAMS = { isWWW: "*", duration: "3m", webSource: "Total" };

export const AboutTab = (props: RightBarTabWrapperFeedProps & AboutTabContainerProps) => {
    const {
        isActiveTab,
        linkToTrends,
        linkToBenchmarks,
        selectedWebsite,
        selectedCountry,
        opportunityLists,
        navigator,
    } = props;

    const { id, key } = navigator.getParams();

    const activeList = opportunityLists.find(opportunityListHasId(id));
    const enabledNews = hasActiveListEnabledNews(activeList);

    const ref = useScrollTo(isActiveTab);

    const accountReviewLink = React.useMemo(() => {
        const rootUrl = navigator.isWorkSpace()
            ? "websites-worldwideOverview"
            : "accountreview_website_overview_websiteperformance";

        const currentKey = selectedWebsite?.domain || key;
        const country = activeList?.country || selectedCountry?.id;

        return navigator.href(rootUrl, {
            key: currentKey,
            country,
            ...DEFAULT_PARAMS,
        });
    }, [activeList, selectedWebsite]);

    return (
        <StyledContainerWrapperRightBar>
            <StyledScrollWrapperRightBar ref={ref}>
                <FeedTab
                    enabledNews={enabledNews}
                    linkToTrends={linkToTrends}
                    linkToBenchmarks={linkToBenchmarks}
                    accountReviewLink={accountReviewLink}
                />
            </StyledScrollWrapperRightBar>
        </StyledContainerWrapperRightBar>
    );
};
