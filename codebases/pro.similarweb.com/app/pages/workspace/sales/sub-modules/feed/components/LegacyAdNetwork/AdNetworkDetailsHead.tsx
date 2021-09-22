import React from "react";
import * as s from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledAdNetworkColumnTitle } from "../AdNetworkFeed/styles";
import {
    FEED_AD_NETWORKS_COUNTRY_COLUMN,
    FEED_AD_NETWORKS_SHARE_COLUMN,
    FEED_AD_NETWORKS_VISITS_COLUMN,
} from "../../constants";

//TODO: Add to refactoring

const AdNetworkDetailsHead = () => {
    const t = useTranslation();

    return (
        <s.StyledCountryRow key="head">
            <s.StyledCountryColumn>
                <StyledAdNetworkColumnTitle>
                    {t(FEED_AD_NETWORKS_COUNTRY_COLUMN)}
                </StyledAdNetworkColumnTitle>
            </s.StyledCountryColumn>
            <s.StyledSimpleColumnHead>
                <StyledAdNetworkColumnTitle>
                    {t(FEED_AD_NETWORKS_SHARE_COLUMN)}
                </StyledAdNetworkColumnTitle>
            </s.StyledSimpleColumnHead>
            <s.StyledSimpleColumnHead>
                <StyledAdNetworkColumnTitle>
                    {t(FEED_AD_NETWORKS_VISITS_COLUMN)}
                </StyledAdNetworkColumnTitle>
            </s.StyledSimpleColumnHead>
        </s.StyledCountryRow>
    );
};

export default AdNetworkDetailsHead;
