import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledSearchField = styled.div`
    border-top-left-radius: 6px;
    flex-grow: 1;

    & > div,
    & .input-container {
        border-top-left-radius: 6px;
        height: 100%;
    }

    & .input-container[disabled] {
        background-color: ${colorsPalettes.carbon["0"]};
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export const StyledSearchSection = styled.div`
    display: flex;
    height: 53px;
`;

export const StyledSimilarSitesPanelMain = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon["500"], 0.08)};
    flex-grow: 1;
    margin: 17px 24px 24px;
`;
