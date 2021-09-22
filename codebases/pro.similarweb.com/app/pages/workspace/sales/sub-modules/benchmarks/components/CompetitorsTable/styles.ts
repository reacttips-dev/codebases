import styled from "styled-components";

export const StyledBenchmarkTable = styled.div`
    flex-direction: column;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    margin-left: 9px;

    @media only screen and (max-width: 530px) {
        flex-wrap: wrap;
    }
    & .competitor-table-change-column {
        white-space: nowrap;
    }
`;

export const StyledWatermark = styled.div`
    margin-left: auto;
    margin-top: 8px;
`;
