import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Switcher } from "@similarweb/ui-components/dist/switcher";
import { Tab } from "@similarweb/ui-components/dist/tabs/src/..";
import { TabPanel } from "@similarweb/ui-components/dist/tabs/src/..";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";

const getMaxMediaScreenSize = (legendsAmount) => {
    return legendsAmount < 4 ? "1300px" : "1600px";
};

export const ChartContainer = styled.div`
    padding: 0 24px 10px 24px;
`;
export const CheckboxesContainer = styled(FlexRow)`
    grid-column: 1;
    grid-row: 1;
    ${({ legendsAmount }) => `
        @media (max-width: ${getMaxMediaScreenSize(legendsAmount)}) {
        grid-row: 2;
        }
    `}
`;

export const ButtonsContainer = styled.div<{ legendsAmount: number }>`
    grid-column: 2;
    display: flex;
    justify-content: flex-end;
    ${({ legendsAmount }) => `
        @media (max-width: ${getMaxMediaScreenSize(legendsAmount)}) {
        grid-column: 1;
        }
    `}
`;

export const UtilitiesContainer = styled.div<{ legendsAmount: number }>`
    align-items: center;
    display: grid;
    justify-content: space-between;
    padding: 16px 24px;
    grid-template-columns: auto auto;
    ${({ legendsAmount }) => `
        @media (max-width: ${getMaxMediaScreenSize(legendsAmount)}) {
            grid-template-columns: 100%;
            grid-row: 2;
        }
    `}
`;
export const IsThisYourWebsiteButton = styled(Button)`
    ${ButtonLabel} {
        color: ${colorsPalettes.orange[400]};
        line-height: normal;
        text-transform: none;
        text-decoration: underline;
        font-weight: normal;
        ${setFont({ $size: 16 })};
    }
    &:hover {
        background-color: ${colorsPalettes.carbon[50]};
    }
    background-color: white;
    margin-right: 5px;
`;

export const FlexRowWithSpace = styled(FlexRow)`
    justify-content: space-between;
    width: 170px;
`;

export const StyledFlexRow = styled(FlexRowWithSpace)`
    width: 160px;
    margin-top: 10px;
`;

export const StyledSWReactIcons = styled(SWReactIcons)<{ color?: string }>`
    ${({ color }) =>
        color &&
        `
        svg {
            path {
                fill: ${color}
            }
        }
    `}
`;

export const GraphTypeSwitcherContainer = styled(Switcher)`
    border-right: 1px solid ${colorsPalettes.carbon[50]};
    margin-right: 20px;
    height: fit-content;
`;

export const Bullet = styled(ClosableItemColorMarker)<{ background: string }>`
    position: static;
    background-color: ${({ background }) => background};
    margin: 0 8px 0 0;
    flex-shrink: 0;
`;

export const Text = styled.label<{ color?: string; size?: number; opacity?: number }>`
    cursor: inherit;
    margin-right: 20px;
    ${({ size = 14, opacity = 1 }) => setFont({ $size: size, $opacity: opacity })};
    ${({ color }) => `color:${color};`};
`;

export const Pill = styled(StyledPill)<{ isBeta?: boolean }>`
    background-color: #4fc3a0;
    margin-left: 5px;
`;

export const TableCell = styled.div`
    padding: 2px 1px 2px 8px;
`;
export const TableCellStyle = styled.div<{ isFlex?: boolean; textAlign?: string }>`
    width: 64px;
    padding: 4px 16px 4px 16px;
    ${(props) =>
        props.isFlex &&
        css`
            display: flex;
            align-items: center;
        `}

    &:nth-child(1) {
        width: 112px;
    }

    &:nth-child(2),
    &:nth-child(3) {
        text-align: ${(p) => p.textAlign};
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }

    &:nth-child(4) {
        width: 68px;
    }

    .ChangeValue {
        display: block;
        line-height: 24px;

        div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
`;

export const TableCellDomainMarker = styled(ClosableItemColorMarker)<{ background: string }>`
    position: static;
    background-color: ${(p) => p.background};
    margin: 0 8px 0 0;
    flex-shrink: 0;
`;

export const TableCellDomainName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const TableHeadersStyle = styled.div`
    display: flex;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    font-weight: 400;
    opacity: 0.8;
`;
export const TableRowStyle = styled.div`
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: 0.6px;
    line-height: 24px;
    display: flex;
`;

export const Hr = styled.hr`
    margin: 0;
`;

export const BoldText = styled(Text)`
    font-weight: 500;
`;

export const GridBox = styled.div`
    width: 290px;
    display: grid;
    grid-template-columns: 30% 23% 23% 23%;
    grid-row-gap: 10px;
`;
export const Line = styled.hr`
    grid-column: 1 / -1;
    margin: 0;
`;

export const CompareTab = styled(Tab)`
    ${setFont({ $size: 14 })}
    height: 80px;
    @media (max-width: 1380px) {
        ${setFont({ $size: 12 })}
        padding: 4px 5px;
    }
`;
export const Icon = styled(SWReactIcons)`
    margin-right: 15px;
`;

export const TabsContainer = styled.div`
    margin-left: 15px;
    margin-right: 15px;
`;

export const TrafficAndEngagementContainer = styled.div`
    background-color: white;
    height: fit-content;
    min-height: 500px;
`;

export const TooltipContainer = styled.div`
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 6px 6px 0 ${colorsPalettes.carbon[400]};
`;

export const TooltipPartialText = styled.div`
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    font-weight: 400;
    background: ${colorsPalettes.carbon["50"]};
    border-radius: 4px;
    margin-top: 8px;
`;

export const TabPanelStyled = styled(TabPanel)`
    padding-top: 10px;
`;

export const PngHeaderContentContainer = styled.div`
    align-items: baseline;
    display: flex;
    padding-bottom: 30px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
`;

export const PngHeaderContainer = styled.div`
    display: none;
    @media print {
        display: block;
    }
`;
