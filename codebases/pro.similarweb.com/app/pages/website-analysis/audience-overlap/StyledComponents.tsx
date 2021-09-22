import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { colorsPalettes } from "@similarweb/styles";

export const OverLapContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const BannerContainer = styled.div`
    width: 100%;
    margin-bottom: 26px;
`;

export const BoxContainer = styled(Box)`
    width: 100%;
    height: auto;
    border-radius: 6px;
`;
BoxContainer.displayName = "BoxContainer";

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    padding: 24px 24px 12px 24px;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const StyledHeaderTitle = styled(Title)`
    font-size: 20px;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const ContentContainer = styled(FlexRow)`
    padding: 12px;
    height: 326px;
    justify-content: center;
`;

export const ChartContainer = styled.div`
    display: flex;
    background-color: ${colorsPalettes.carbon["25"]};
    width: 100%;
    height: 326px;
    justify-content: center;
    border-radius: 4px;
`;

export const Disclaimer = styled.div`
    padding: 10px;
    background-color: ${colorsPalettes.sky[100]};
    color: ${colorsPalettes.carbon[400]};
    border-radius: 6px;
    display: flex;
    align-items: center;
    margin: 12px 12px 0px;
`;
export const TextWrapper = styled.div`
    margin-left: 4px;
`;

export const TooltipContainer = styled.div`
    width: 218px;
    background-color: white;
    border-width: 0;
    border-radius: 6px;
    box-shadow: 0 6px 6px 0 ${colorsPalettes.carbon[200]};
    padding: 16px;
`;

export const LegendsTitle = styled.span`
    font-weight: 500;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
`;

export const LegendContainer = styled.div`
    width: 315px;
    padding: 28px;
`;

export const OverlapLegendWrapper = styled.span`
    width: 100%;
    height: 24px;
`;

export const LegendDivider = styled.div`
    width: 100%;
    height: 1px;
    margin-top: 16px;
    background-color: ${colorsPalettes.carbon["100"]};
`;

export const SumOfLegendsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 8px;
    justify-content: space-between;
    color: ${colorsPalettes.midnight["400"]};
    font-size: 14px;
    align-items: center;
`;

export const ChartLoaderContainer = styled.div`
    display: flex;
    background-color: ${colorsPalettes.carbon["25"]};
    width: 100%;
    height: 326px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
`;

export const CircleLoaderContainer = styled.div<{
    width?: number;
    height?: number;
    marginRight?: number;
    marginTop?: number;
}>`
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    border-radius: 50%;
    width: ${({ width }) => (width ? `${width}px` : "175px")};
    height: ${({ height }) => (height ? `${height}px` : "175px")};
    margin-right: ${({ marginRight }) => (marginRight ? `${marginRight}px` : "0px")};
    margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : "0px")};
    border: solid 1px #ffffff;
`;

export const LegendsLineLoaders = styled.div`
    margin: 12px 0 12px 0;
`;
