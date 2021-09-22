import React from "react";
import classNames from "classnames";
import { compose } from "redux";
import { AdNetwork } from "../../types/adNetwork";
import { AdNetworksFeed } from "../../types/feed";
import {
    FEED_AD_NETWORKS_NAME_COLUMN,
    FEED_AD_NETWORKS_GLOBAL_VISITS_COLUMN,
    FEED_AD_NETWORKS_TITLE,
} from "../../constants";
import {
    StyledAdNetworksListContainer,
    StyledAdNetworksListHead,
    StyledAdNetworksListBody,
    StyledAdNetworkColumnTitle,
    StyledAdNetworkFeedContainer,
} from "../AdNetworkFeed/styles";
import { StyledFeedTitle } from "../styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getWorldwideAdNetworks, sortAdNetworksByVisits } from "../../helpers";
import AdNetworkFeedListItem from "./LegacyAdListItem";

type AdNetworkFeedProps = {
    feed: AdNetworksFeed;
};

// FIXME whole this folder can be removed later
// TODO: Add to refactoring

const LegacyAdNetworkFeed: React.FC<AdNetworkFeedProps> = ({ feed }) => {
    const t = useTranslation();
    const [expandedAdNetwork, setExpandedAdNetwork] = React.useState<AdNetwork["id"] | null>(null);

    const sortedWorldwideNetworks = React.useMemo(() => {
        return compose(sortAdNetworksByVisits, getWorldwideAdNetworks)(feed.ad_networks);
    }, [feed.ad_networks]);

    const onlyOneWorldwideNetwork = sortedWorldwideNetworks.length === 1;

    return (
        <StyledAdNetworkFeedContainer
            data-automation="feed-type-ad-networks"
            className={classNames({ "no-bottom-padding": onlyOneWorldwideNetwork })}
        >
            <StyledFeedTitle>
                <span>{t(FEED_AD_NETWORKS_TITLE)}</span>
            </StyledFeedTitle>
            <StyledAdNetworksListContainer>
                <StyledAdNetworksListHead>
                    <StyledAdNetworkColumnTitle>
                        {t(FEED_AD_NETWORKS_NAME_COLUMN)}
                    </StyledAdNetworkColumnTitle>
                    <StyledAdNetworkColumnTitle>
                        {t(FEED_AD_NETWORKS_GLOBAL_VISITS_COLUMN)}
                    </StyledAdNetworkColumnTitle>
                </StyledAdNetworksListHead>
                <StyledAdNetworksListBody>
                    {sortedWorldwideNetworks.map((an, index) => (
                        <AdNetworkFeedListItem
                            key={an.id}
                            index={index}
                            adNetworkWorldwide={an}
                            adNetworks={feed.ad_networks}
                            onToggle={setExpandedAdNetwork}
                            isSingle={onlyOneWorldwideNetwork}
                            expanded={expandedAdNetwork === an.id}
                        />
                    ))}
                </StyledAdNetworksListBody>
            </StyledAdNetworksListContainer>
        </StyledAdNetworkFeedContainer>
    );
};

export default React.memo(LegacyAdNetworkFeed);
