import styled from "styled-components";

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

export const EditButtonContainer = styled.div`
    margin-left: 12px;
    flex-shrink: 0;
    flex-grow: 0;
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
