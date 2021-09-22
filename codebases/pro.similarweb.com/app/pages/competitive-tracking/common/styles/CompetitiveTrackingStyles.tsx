import styled, { css, keyframes } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const PageWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const PageContentContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 6px;
    box-shadow: 0px 3px 6px rgba(14, 30, 62, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${fadeIn} ease 800ms;
`;
