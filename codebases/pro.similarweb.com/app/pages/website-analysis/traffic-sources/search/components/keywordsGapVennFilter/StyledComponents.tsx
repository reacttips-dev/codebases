import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

export const Container = styled.div`
    display: flex;
`;

export const ChartContainer = styled.div`
    height: 320px;
    padding: 10px;
`;

export const FilterSectionTitle = styled.div`
    background-color: ${colorsPalettes.carbon[25]};
    ${setFont({ $size: 14, $weight: 500, $color: colorsPalettes.black[0] })};
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-top: none
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 16px;
`;

export const FilterContainer = styled.div<{ withLeftBorder?: boolean }>`
    cursor: pointer;
    padding: 10px 16px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-top: none;
    ${({ withLeftBorder }) =>
        withLeftBorder &&
        `
        border-left: 3px solid ${colorsPalettes.navigation.ACTIVE_BLUE};
         padding: 10px 14px;
    `}
    &:hover {
        background-color: ${colorsPalettes.carbon[25]};
    }
`;

export const FilterTitle = styled.div`
    ${setFont({ $size: 14, $weight: 700, $color: colorsPalettes.navigation.ACTIVE_BLUE })};
    text-transform: uppercase;
`;
export const FilterSubTitle = styled.div`
    opacity: 0.7;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[400] })};
`;

export const DotsLoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 50px;
`;

export const HorizontalCenter = styled.div`
    display: flex;
    justify-content: center;
`;

export const VerticalCenter = styled(HorizontalCenter)`
    flex-direction: column;
    height: 100%;
`;

export const LegendsContainer = styled.div`
    padding: 10px 20px;
`;

export const FiltersFooterContainer = styled.div`
    height: 23px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-top: none;
    padding: 20px;
    display: flex;
    .venn-footer--SWReactIconsWrapper {
        align-self: center;
        margin-left: 4px;
    }
`;

export const FiltersFooterTitle = styled.div`
    ${setFont({ $size: 14, $weight: 500, $color: colorsPalettes.carbon[500] })};
    padding-right: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
export const FiltersFooterSubtitle = styled.div`
    opacity: 0.7;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const Circle = styled.span<{ color: string }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin: 0px 4px;
    ${({ color }) => `background-color:${color};`};
`;
export const FiltersContainer = styled.div`
    width: 40%;
    @media (max-width: 1400px) {
        width: 45%;
    }
`;

export const ChartAndLegendsContainer = styled.div`
    width: 60%;
    @media (max-width: 1400px) {
        width: 55%;
    }
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const TooltipHeader = styled.div`
    ${setFont({ $size: 14, $weight: 500, $color: colorsPalettes.carbon[500] })};
    padding-bottom: 12px;
`;

export const TooltipHeaderWithSites = styled(TooltipHeader)`
    word-wrap: break-word;
    white-space: normal;
`;

export const TooltipRow = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    padding-top: 4px;
`;

export const TooltipContainer = styled.div`
    width: 218px;
    background-color: white;
    border-width: 0;
    border-radius: 6px;
    box-shadow: 0 6px 6px 0 ${colorsPalettes.carbon[200]};
    padding: 16px;
`;
