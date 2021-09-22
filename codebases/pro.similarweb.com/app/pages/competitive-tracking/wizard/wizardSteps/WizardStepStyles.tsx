import { colorsPalettes } from "@similarweb/styles";
import styled, { css } from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";

export const ContentContainer = styled.div<{ minHeight?: number; minWidth?: number }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 700px;
    ${({ minHeight }) =>
        minHeight &&
        css`
            min-height: ${minHeight}px;
        `}
    ${({ minWidth }) =>
        minWidth &&
        css`
            min-width: ${minWidth}px;
        `}
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

export const Title = styled.span<{ maxWidth?: number }>`
    color: ${colorsPalettes.carbon[500]};
    ${setFont({ $size: 34, $weight: 500, $family: "DM Sans" })};
    margin-bottom: 16px;
    max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "472px")};
    text-align: center;
    line-height: 40px;
`;

export const Subtitle = styled.span<{ maxWidth?: number }>`
    font-size: 16px;
    max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "500px")};
    color: ${colorsPalettes.carbon[400]};
    font-weight: 400;
    text-align: center;
    line-height: 24px;
    margin-bottom: 32px;
`;

export const CounterTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    font-size: 12px;
    color: ${colorsPalettes.carbon[300]};
    font-weight: 400;
    margin-bottom: 30px;
    padding-top: 4px;
`;

export const NextButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding-right: 32px;
    padding-bottom: 32px;
    box-sizing: border-box;
`;
