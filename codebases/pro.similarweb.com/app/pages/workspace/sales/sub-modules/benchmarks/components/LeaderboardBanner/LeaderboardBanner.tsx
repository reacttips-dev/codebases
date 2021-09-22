import React from "react";
import LeaderboardBannerLoader from "../LeaderboardBannerLoader/LeaderboardBannerLoader";
import {
    StyledLeaderboardBanner,
    StyledLeaderboardBannerText,
    StyledBannerImageContainer,
    StyledWatermark,
} from "./styles";
import Watermark from "pages/sales-intelligence/common-components/Watermark/Watermark";

type LeaderboardBannerProps = {
    iconSrc: string;
    isLoading: boolean;
    primaryText: string;
    secondaryText?: string;
};

const LeaderboardBanner = (props: LeaderboardBannerProps) => {
    const { iconSrc, isLoading, primaryText, secondaryText } = props;

    const renderContent = () => {
        if (isLoading) {
            return <LeaderboardBannerLoader />;
        }

        return (
            <>
                <StyledBannerImageContainer>
                    <img src={iconSrc} alt="leaderboard" />
                </StyledBannerImageContainer>
                <StyledLeaderboardBannerText
                    dangerouslySetInnerHTML={{
                        __html: primaryText,
                    }}
                />
                {secondaryText && (
                    <StyledLeaderboardBannerText
                        dangerouslySetInnerHTML={{
                            __html: secondaryText,
                        }}
                    />
                )}
            </>
        );
    };

    return (
        <>
            <StyledLeaderboardBanner>{renderContent()}</StyledLeaderboardBanner>
            <StyledWatermark>
                <Watermark />
            </StyledWatermark>
        </>
    );
};

export default LeaderboardBanner;
