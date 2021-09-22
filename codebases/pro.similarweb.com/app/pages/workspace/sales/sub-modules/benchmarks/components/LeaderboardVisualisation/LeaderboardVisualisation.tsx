import React from "react";
import {
    StyledLeaderboardVisualisation,
    StyledBannerContainer,
    StyledWebsitesList,
} from "./styles";
import LeaderboardListContainer from "../LeaderboardList/LeaderboardListContainer";
import LeaderboardBannerContainer from "../LeaderboardBanner/LeaderboardBannerContainer";

const LeaderboardVisualisation = (): JSX.Element => {
    return (
        <StyledLeaderboardVisualisation>
            <StyledWebsitesList>
                <LeaderboardListContainer />
            </StyledWebsitesList>
            <StyledBannerContainer>
                <LeaderboardBannerContainer />
            </StyledBannerContainer>
        </StyledLeaderboardVisualisation>
    );
};

export default LeaderboardVisualisation;
