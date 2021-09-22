import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const HEADER_HEIGHT = 60;
export const HEADER_BOTTOM_MARGIN = 24;

export const StyledBackContainer = styled.div`
    align-items: center;
    border-right: 1px solid ${colorsPalettes.carbon["50"]};
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    height: ${HEADER_HEIGHT}px;
    justify-content: center;
    width: ${HEADER_HEIGHT}px;
`;

export const StyledPageHeader = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    box-sizing: border-box;
    display: flex;
    height: ${HEADER_HEIGHT}px;
    margin-bottom: ${HEADER_BOTTOM_MARGIN}px;
`;

export const StyledPageInnerContent = styled.div`
    display: flex;
    height: 100%;
`;

export const StyledPageContent = styled.div`
    height: calc(100vh - ${HEADER_HEIGHT + HEADER_BOTTOM_MARGIN}px);
`;

export const StyledAdvancedSearchPage = styled.div`
    height: 100vh;
`;
