import styled from "styled-components";
import { BENCHMARK_COMPETITORS_MAX_COUNT } from "../../constants";
import { StyledProspectItem } from "../BenchmarkCompetitorsList/styles";
import { StyledAddWebsiteButton } from "../EditableCompetitor/styles";

export const StyledWebsitesListContainer = styled.div`
    flex-shrink: 1;
    min-width: 135px;
    padding-top: 45px;

    ${StyledProspectItem} {
        margin-bottom: 8px;
    }

    ${StyledAddWebsiteButton} {
        margin-bottom: 12px;
    }
`;

export const StyledTableVisualisationContainer = styled.div<{ numberOfCompetitors: number }>`
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 0;
    padding: 15px 9px
        ${({ numberOfCompetitors }) =>
            numberOfCompetitors === BENCHMARK_COMPETITORS_MAX_COUNT ? 23 : 10}px;
`;
