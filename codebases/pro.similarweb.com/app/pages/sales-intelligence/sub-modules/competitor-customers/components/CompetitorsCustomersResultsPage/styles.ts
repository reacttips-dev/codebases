import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledExcelExportButton = styled.div`
    margin-left: 9px;
`;

export const StyledSearchSection = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-top: 1px solid ${colorsPalettes.navigation["BORDER_DARK_1"]};
    display: flex;
    height: 40px;
    padding: 8px 24px 8px 0;

    .SearchInput-container {
        flex-grow: 1;
    }

    .SearchInput {
        height: 34px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;

export const StyledResultsPage = styled.div`
    padding-bottom: 100px;
`;
