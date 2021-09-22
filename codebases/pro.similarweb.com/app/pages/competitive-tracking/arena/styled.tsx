import styled from "styled-components";
import { PageContentContainer } from "pages/competitive-tracking/common/styles/CompetitiveTrackingStyles";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";

export const ButtonsContainer = styled.div`
    display: flex;
    grid-column-gap: 10px;
`;

export const TeaserContainer = styled(PageContentContainer)`
    height: 463px;
    width: 787px;
`;

export const AffiliatesIcon = styled(SWReactIcons)`
    width: 48px;
    height: 48px;
`;

export const TeaseSubtitle = styled.span`
    font-size: 16px;
    max-width: 550px;
    color: ${colorsPalettes.carbon[400]};
    font-weight: 400;
    text-align: center;
    line-height: 24px;
    margin-bottom: 36px;
`;
