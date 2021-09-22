import spring, { toString } from "css-spring";
import styled, { keyframes } from "styled-components";

const showOverlay = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const SearchTooltipOverlay = styled.div`
    position: fixed;
    z-index: 1019;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    animation: ${showOverlay} 0.2s ease forwards;
`;

const springKeyframes = toString(
    spring({ translateY: "31px", opacity: 0 }, { translateY: "0px", opacity: 1 }),
    (property, value) => {
        if (property === "translateY") {
            return `transform:${property}(${value});`;
        }
        return `${property}:${value};`;
    },
);

const showContent = keyframes`
  ${springKeyframes}
`;

export const SearchTooltipContent = styled.div`
    opacity: 0;
    position: absolute;
    z-index: 1019;
    box-sizing: border-box;
    width: 292px;
    top: 100%;
    left: 0;
    margin-top: 8px;
    padding: 16px 40px 16px 16px;
    background: #4f8df9;
    border-radius: 0 16px 16px 16px;
    box-shadow: 0 2px 8px 0 rgba(42, 62, 82, 0.4);
    color: #fff;
    animation: ${showContent} 0.3s linear 0.18s forwards;
`;

export const SearchTooltipTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
`;

export const SearchTooltipText = styled.div`
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.33;
`;

export const SearchTooltipClose = styled.div`
    position: absolute;
    display: flex;
    top: 12px;
    right: 12px;
    padding: 4px;
    cursor: pointer;
    line-height: 1;
    path {
        fill: #fff;
    }
`;
