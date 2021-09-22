import React from "react";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import useLeaderboardService from "../../hooks/useLeaderboardService";
import LeaderboardBanner from "./LeaderboardBanner";

const LeaderboardBannerContainer = () => {
    const { isLoading } = React.useContext(BenchmarkItemContext);
    const leaderboardService = useLeaderboardService();

    return (
        <LeaderboardBanner
            isLoading={isLoading}
            iconSrc={leaderboardService.icon}
            primaryText={leaderboardService.primaryText}
            secondaryText={leaderboardService.secondaryText}
        />
    );
};

export default LeaderboardBannerContainer;
