import React from "react";
import { AdNetworkFeedEmptyStateStyled } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    FEED_AD_NETWORKS_NEW_EMPTY_STATE,
    FEED_AD_NETWORKS_TOP_EMPTY_STATE,
} from "../../constants";

type AdNetworkFeedEmptyStateProps = {
    currentTabIdx: number;
};

const AdNetworkFeedEmptyState: React.FC<AdNetworkFeedEmptyStateProps> = ({ currentTabIdx }) => {
    const translate = useTranslation();

    const getLabel = () => {
        return currentTabIdx === 1
            ? FEED_AD_NETWORKS_NEW_EMPTY_STATE
            : FEED_AD_NETWORKS_TOP_EMPTY_STATE;
    };

    return <AdNetworkFeedEmptyStateStyled>{translate(getLabel())}</AdNetworkFeedEmptyStateStyled>;
};

export default AdNetworkFeedEmptyState;
