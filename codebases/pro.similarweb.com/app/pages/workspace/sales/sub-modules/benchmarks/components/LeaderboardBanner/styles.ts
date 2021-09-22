import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledLeaderboardBannerText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    line-height: 20px;
    margin: 0;
    text-align: center;
    max-width: 200px;
    white-space: break-spaces;
`;

export const StyledBannerImageContainer = styled.div`
    height: 84px;
    width: 84px;
`;

export const StyledLeaderboardBanner = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 245px;
    padding: 18px;

    ${StyledLeaderboardBannerText}:last-child {
        margin-top: 15px;
    }
`;

export const StyledWatermark = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 8px;
`;
