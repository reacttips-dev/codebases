import React from "react";
import {
    StyledSiteTrendsItemHeader,
    StyledSiteTrendsItemHeaderTitle,
    StyledSiteTrendsItemHeaderSubTitle,
    StyledCountryIcon,
    StyledSiteTrendsSubtitle,
} from "./styles";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";

const SiteTrendsItemHeader = (props: any) => {
    const { title, countryCode, countryName, webSource } = props;

    return (
        <StyledSiteTrendsItemHeader>
            <StyledSiteTrendsItemHeaderTitle>{title}</StyledSiteTrendsItemHeaderTitle>
            <StyledSiteTrendsItemHeaderSubTitle>
                <StyledSiteTrendsSubtitle>
                    <StyledCountryIcon className={`country-icon-${countryCode}`} />
                    <span>{countryName}</span>
                </StyledSiteTrendsSubtitle>
                <StyledSiteTrendsSubtitle>
                    <SiteTrendsWebSources webSource={webSource} />
                </StyledSiteTrendsSubtitle>
            </StyledSiteTrendsItemHeaderSubTitle>
        </StyledSiteTrendsItemHeader>
    );
};

export default SiteTrendsItemHeader;

type SiteTrendsWebSourcesProps = {
    webSource: string;
};

const SiteTrendsWebSources: React.FC<SiteTrendsWebSourcesProps> = ({ webSource }) => {
    const translate = useTranslation();
    const webSourceIcons = { total: "combined", mobileweb: "mobile-web", desktop: "desktop" };
    const webSourceName = webSource.toLowerCase();
    return (
        <>
            <SWReactIcons iconName={`${webSourceIcons[webSourceName]}`} size="sm" />
            <span>{translate(`websources.${webSourceName}`)}</span>
        </>
    );
};
