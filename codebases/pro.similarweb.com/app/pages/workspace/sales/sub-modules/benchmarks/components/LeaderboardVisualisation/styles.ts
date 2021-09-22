import styled from "styled-components";

export const StyledBannerContainer = styled.div`
    flex: 0 0 auto;
    margin-bottom: 9px;
    flex: 2;
`;

export const StyledWebsitesList = styled.div`
    margin-right: 4px;
    flex: 1;
`;

export const StyledLeaderboardVisualisation = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 32px 9px 0;

    @media only screen and (max-width: 530px) {
        flex-wrap: wrap;
    }
`;
