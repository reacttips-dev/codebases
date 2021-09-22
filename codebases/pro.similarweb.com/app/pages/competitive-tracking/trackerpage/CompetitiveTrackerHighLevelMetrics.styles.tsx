import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { AssetsService } from "services/AssetsService";

export const TrackerOverviewContainer = styled.div`
    padding-top: 16px;
    display: flex;
`;
export const TrackerHeaderContainer = styled.div`
    display: flex;
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    padding-left: 2px;
    .SWReactIcons {
        width: 30px;
        height: 30px;
    }
`;

export const Vs = styled.div`
    margin-right: 15px;
    ${setFont({ $size: 14, weight: 700, $color: colorsPalettes.carbon["500"] })};
`;

export const HighLevelMetricsContainer = styled.div`
    margin: 0 auto;
    padding: 0 60px 60px;
`;

export const TrackerName = styled.span`
    ${setFont({ $size: 24, $color: colorsPalettes.carbon[500] })};
    display: flex;
    align-items: center;
    font-weight: 500;
    margin-right: 5px;
`;
export const PageHeaderContainer = styled.div`
    background: url(${AssetsService.assetUrl("/images/light-background.png")}) top no-repeat;
    background-size: 100% 800px;
`;
