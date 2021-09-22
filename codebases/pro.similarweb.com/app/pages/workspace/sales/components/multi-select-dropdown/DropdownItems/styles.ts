import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledPercent = styled.div`
    flex: 1 1 auto;
    text-align: right;
    padding-right: 20px;
`;

interface ContainerProps {
    showIcon?: boolean;
    active?: boolean;
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    height: 48px;
    font-family: Roboto;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    letter-spacing: 0.2px;
    align-items: center;
    padding: 0 11px 0 16px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }
    ${({ active }) =>
        active &&
        css`
            background-color: rgba(42, 62, 82, 0.05);
        `}
    font-weight: ${({ showIcon }) => (showIcon ? 400 : 500)};
`;

export const StyledDomain = styled.span`
    display: inline-block;
    padding: 0 10px;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
