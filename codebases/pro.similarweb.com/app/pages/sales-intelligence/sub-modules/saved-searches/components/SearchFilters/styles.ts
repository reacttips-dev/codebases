import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledSaveSearchButton = styled.div`
    flex-shrink: 0;
    margin: 4px 4px 4px 84px;
`;

export const StyledSearchFilters = styled.div`
    align-items: center;
    background-color: ${rgba(colorsPalettes.carbon["500"], 0.06)};
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 8px;
`;
