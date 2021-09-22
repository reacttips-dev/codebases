import React, { useCallback } from "react";
import { Banner } from "@similarweb/ui-components/dist/banner";
import SimilarSitesService from "services/GetSimilarSitesService";
import { useLoading } from "custom-hooks/loadingHook";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const WebsiteName = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[400], $size: 14 })};
    margin-right: 20px;
    margin-left: 7px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 14vw;
    @media (max-width: 1400px) {
        max-width: 9vw;
    }
`;

const BannerContainer = styled.div`
    width: 100%;
    margin-bottom: 26px;
    > div {
        border-radius: 6px;
        box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    }
`;

export const StyledSWReactIcons = styled(SWReactIcons)`
    height: 56.9px;
    width: 56.9px;
`;

const IconWrapper = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${colorsPalettes.carbon[0]};
    border: 1px solid ${colorsPalettes.midnight[50]};
    box-shadow: 0 2px 4px 0 rgba(${colorsPalettes.carbon[200]}, 0.2);
    position: relative;

    img {
        margin: 0;
    }
`;

const SimilarSitesWrapper = styled(FlexRow)`
    margin-top: 7px;
`;

export const CompareBanner = ({ domain, applyUpdateParams, i18n }) => {
    const [similarSitesData, similarSitesOps, isSimilarSiteLoading] = useLoading();

    React.useEffect(() => {
        const similarSitesService = SimilarSitesService.getInstance();
        similarSitesOps.load(() => similarSitesService.fetchSimilarSites(domain, 4));
    }, [domain]);

    const websitesArray = React.useMemo(() => {
        if (!isSimilarSiteLoading && similarSitesData.data) {
            return similarSitesData.data.map((site) => {
                return {
                    name: site.Domain,
                    icon: site.Favicon,
                };
            });
        }
        return [];
    }, [domain, similarSitesData]);

    const onCompareClicked = useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.comparebanner",
            "click",
        );
        applyUpdateParams({
            key: `${domain},${websitesArray.map((w) => w.name).toString()}`,
        });
    }, [domain, websitesArray]);

    const getSimilarSitesComponent = () => {
        return (
            <SimilarSitesWrapper>
                {websitesArray.map((website, index) => (
                    <WebsiteTooltip
                        domain={website.name}
                        placement="bottom-left"
                        debounce={500}
                        key={index}
                    >
                        <div>
                            <FlexRow>
                                <IconWrapper>
                                    <img src={website.icon} />
                                </IconWrapper>
                                <WebsiteName>{website.name}</WebsiteName>
                            </FlexRow>
                        </div>
                    </WebsiteTooltip>
                ))}
            </SimilarSitesWrapper>
        );
    };

    return (
        websitesArray &&
        websitesArray.length > 2 && (
            <BannerContainer>
                <Banner
                    title={i18n(
                        "website-analysis.traffic-sources.paid-search-overview.compare-banner.title",
                    )}
                    subtitle={getSimilarSitesComponent()}
                    buttonType="primary"
                    CustomIcon={<StyledSWReactIcons iconName="new-paid-search" />}
                    onButtonClick={onCompareClicked}
                    buttonText={i18n(
                        "website-analysis.traffic-sources.paid-search-overview.compare-banner.button.title",
                    )}
                />
            </BannerContainer>
        )
    );
};
