import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledBottomTrialBannerSubtitle = styled.p`
    line-height: 1.57;
    margin: 0;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
`;

export const StyledBottomTrialBannerTitle = styled.h3`
    line-height: 40px;
    margin: 0;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 30, $weight: 700 })};
`;

export const StyledBottomTrialBannerImage = styled.div`
    flex-shrink: 0;
    margin-right: 6.6%;
`;

export const StyledBottomTrialBanner = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    display: flex;
    padding: 24px 6.9% 32px;
`;

export const StyledTopTrialBannerButton = styled.div`
    flex-shrink: 0;
`;

export const StyledTopTrialBannerSubtitle = styled.p`
    line-height: 24px;
    margin: 0;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16 })};
`;

export const StyledTopTrialBannerTitle = styled.h3`
    line-height: 24px;
    margin: 0;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16, $weight: 700 })};
`;

export const StyledTopTrialBannerInfo = styled.div`
    flex-grow: 1;
    margin-right: 16px;
`;

export const StyledTopTrialBannerImage = styled.div`
    flex-shrink: 0;
    margin-right: 16px;
`;

export const StyledTopTrialBanner = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.navigation["NAV_BACKGROUND"]};
    border-radius: 6px;
    display: flex;
    margin-bottom: 16px;
    padding: 24px 28px;
`;
