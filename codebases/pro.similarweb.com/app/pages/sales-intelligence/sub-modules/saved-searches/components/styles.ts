import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledSavedSearchSettings = styled.div`
    margin-left: 30px;
`;

export const StyledSavedSearchInfoSection = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-top: 19px;
    padding: 0 24px;
`;

export const StyledSearchActionButton = styled.div``;

export const StyledSearchResultsTitle = styled.div`
    span {
        ${mixins.setFont({ $color: rgba(colorsPalettes.carbon["500"], 0.8), $size: 24 })};
    }
`;

export const StyledSearchResultHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
`;

export const StyledSearchResultPageContainer = styled.div`
    box-sizing: border-box;
    padding: 40px 48px;
`;
