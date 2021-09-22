import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const defaultColor = colorsPalettes.carbon[500];
const defaultBackgroundColor = colorsPalettes.carbon[100];

export const TooltipWrapper = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
`;

export const LegendContainer = styled.div`
    padding: 8px 0 0 24px;
    > div {
        margin-bottom: 8px;
    }
`;

export const ChartContainer = styled.div`
    width: calc(100% - 180px);
    height: 170px;
`;

export const ChartSection = styled.div`
    width: 100%;
    padding: 10px 0px;
`;

export const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
        width: 64px;
    }
    height: 64px;
`;

export const Container = styled.div`
    height: 240px;
    padding: 0 12px 16px 24px;
    border-top: 1px solid ${defaultBackgroundColor};
`;

// tooltip styles

const ChangeContainer = styled.div<{ isNan: boolean; rowHeight: string }>`
    display: flex;
    height: ${({ rowHeight }) => rowHeight}px;
    justify-content: flex-end;
    align-items: baseline;
`;

const FlexColumn: any = styled.div`
    display: flex;
    flex-direction: column;
`;
FlexColumn.displayName = "FlexColumn";

const ChangeTooltipContainer = styled.div<{ width?: string }>`
    padding: 12px 16px;
    width: ${({ width }) => (width ? width : "366px")};
`;

const Text = styled.label<{
    isBold?: boolean;
    maxWidth?: string;
    opacity?: number;
    color?: string;
    size?: number;
}>`
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: inherit;
    width: fit-content;
    ${({ isBold }) => isBold && `font-weight: 700`};
    ${({ maxWidth = "125px" }) => `max-width:${maxWidth};`};
    ${({ opacity = 1, size = 14, color = defaultColor }) =>
        setFont({ $size: size, $color: rgba(color, opacity) })};
`;

const BreakLineText = styled.label<{
    isBold?: boolean;
    maxWidth?: string;
    opacity?: number;
    color?: string;
    size?: number;
}>`
    word-break: normal;
    ${({ isBold }) => isBold && `font-weight: 600`};
    ${({ maxWidth }) => maxWidth && `max-width:${maxWidth};`};
    ${({ opacity = 1, size = 15, color = defaultColor }) =>
        setFont({ $size: size, $color: rgba(color, opacity) })}
`;

const Bullet = styled.div<{ bulletSize?: string; color?: string }>`
    display: inline-flex;
    border-radius: 50%;
    margin-right: 5px;
    margin-top: 6px;
    ${({ bulletSize = "7px" }) => `width: ${bulletSize}; height: ${bulletSize};`};
    ${({ color }) => `background-color:${color};`};
`;
const Icon = styled(SWReactIcons)<{ color?: string }>`
    padding-top: 2px;
    width: 15px;
    ${({ color }) =>
        `svg {
            path{
                fill: ${color};
            }
        }
    `}
`;

const ZeroChangeContainer = styled.div<{ rowHeight?: string; hasSubtitle?: boolean }>`
    display: flex;
    height: ${({ rowHeight }) => rowHeight}px;
    align-items: ${({ hasSubtitle }) => (hasSubtitle ? "baseline" : "center")};
    justify-content: center;
`;

const Dash = styled.div<{ hasSubtitle?: boolean }>`
    ${({ hasSubtitle }) => (hasSubtitle ? "margin-top: 8px" : "")};
    background-color: ${defaultBackgroundColor};
    width: 20px;
    height: 1px;
`;

const HeaderContainer = styled.span`
    display: inline-block;
    margin-bottom: 8px;
`;

// styles for the multi-column change tooltip
const HeadersContainerGrid = styled.div<{
    equalColumns: number;
}>`
    display: grid;
    ${({ equalColumns }) =>
        css`
            grid-template-columns: 30% repeat(${equalColumns}, 1fr);
        `};
    padding-bottom: 9px;
`;
HeadersContainerGrid.displayName = "HeadersContainerGrid";

const RowContainerGrid = styled.div<{ rowHeight?: string; equalColumns: number }>`
    height: ${({ rowHeight }) => rowHeight}px;
    display: grid;
    ${({ equalColumns }) =>
        css`
            grid-template-columns: 30% repeat(${equalColumns}, 1fr);
        `};
    ${Bullet} {
        min-width: 7px;
        max-width: 7px;
    }
`;

const TextGridChild = styled(Text)<{ justifySelf: boolean }>`
    ${({ justifySelf }) => justifySelf && `justify-self: end`};
`;

const BreakLineTextContainerGrid = styled.div`
    text-align: end;
`;

const BottomSectionContainer = styled.div`
    margin-top: 8px;
    padding: 8px 0 0 0;
    border-top: 1px solid ${defaultBackgroundColor};
`;

const Separator = styled.div`
    margin: 8px 0;
    border-bottom: 1px solid ${defaultBackgroundColor};
`;

export {
    Icon,
    Bullet,
    Text,
    FlexColumn,
    ChangeTooltipContainer,
    ChangeContainer,
    BreakLineText,
    ZeroChangeContainer,
    Dash,
    HeaderContainer,
    HeadersContainerGrid,
    RowContainerGrid,
    TextGridChild,
    BreakLineTextContainerGrid,
    BottomSectionContainer,
    Separator,
};
