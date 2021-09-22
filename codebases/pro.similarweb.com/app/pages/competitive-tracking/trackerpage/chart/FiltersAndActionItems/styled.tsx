import styled from "styled-components";

export const FiltersAndActionItemsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 0px;
`;

export const LegendsContainer = styled.div<{ clientWidthThreshold: number }>`
    float: right;
    width: 170px;
    padding: 10px;
    .legends-container {
        display: grid;
        ${({ clientWidthThreshold }) =>
            `@media (min-width: ${clientWidthThreshold}px) {
            grid-row-gap: 8px;
        }`}
    }
`;
