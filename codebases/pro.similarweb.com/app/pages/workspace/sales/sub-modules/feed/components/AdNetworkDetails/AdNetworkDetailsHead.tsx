import React from "react";
import * as s from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledAdNetworkColumnTitle } from "../AdNetworkFeed/styles";
import {
    FEED_AD_NETWORKS_COUNTRY_COLUMN,
    FEED_AD_NETWORKS_VISITS_COLUMN,
    FEED_AD_NETWORKS_SHARE_COLUMN,
    FEED_AD_NETWORKS_SHARE_COLUMN_TOOLTIP,
} from "../../constants";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";

const AdNetworkDetailsHead: React.FC = () => {
    const translate = useTranslation();

    return (
        <s.StyledCountryRow key="head">
            <s.StyledCountryColumn>
                <StyledAdNetworkColumnTitle>
                    {translate(FEED_AD_NETWORKS_COUNTRY_COLUMN)}
                </StyledAdNetworkColumnTitle>
            </s.StyledCountryColumn>
            <StyledAdNetworkColumnTitle className="innerTitle">
                {translate(FEED_AD_NETWORKS_VISITS_COLUMN)}
            </StyledAdNetworkColumnTitle>
            <s.StyledCountryColumn>
                <StyledAdNetworkColumnTitle className="innerTitle">
                    {translate(FEED_AD_NETWORKS_SHARE_COLUMN)}
                    <PlainTooltip
                        placement="top"
                        tooltipContent={translate(FEED_AD_NETWORKS_SHARE_COLUMN_TOOLTIP)}
                    >
                        <div>
                            <InfoIcon iconName="info" />
                        </div>
                    </PlainTooltip>
                </StyledAdNetworkColumnTitle>
            </s.StyledCountryColumn>
        </s.StyledCountryRow>
    );
};

export default AdNetworkDetailsHead;
