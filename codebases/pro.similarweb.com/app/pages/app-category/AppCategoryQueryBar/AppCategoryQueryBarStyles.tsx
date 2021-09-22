import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const QueryBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
`;

export const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

export const CategoryItemWrapper = styled.div`
    display: flex;
    max-width: 320px;
    min-width: 128px;
    flex-shrink: 1;
    margin-left: 13px;
    line-height: normal;
`;

export const CategoryLoaderContainer = styled.div`
    width: 150px;
    height: 40px;
    background-color: ${colorsPalettes.carbon[25]};
    border-radius: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 4px;
    margin-left: 13px;
`;

export const CategorySearchContainer = styled.div`
    position: absolute;
    width: 420px;
    z-index: 100;
    top: 0;

    .input-container {
        height: 43px;
    }
`;
