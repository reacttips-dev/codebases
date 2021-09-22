import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const TableTopContainer = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

export const TableFilterContainer = styled.div`
    padding: 10px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    box-sizing: border-box;
    width: 100%;
`;

export const TableInputContainer = styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 0;
    height: 40px;
    flex-grow: 1;
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
        margin-bottom: 0px;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;

export const ButtonsContainer = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
`;

export const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;
