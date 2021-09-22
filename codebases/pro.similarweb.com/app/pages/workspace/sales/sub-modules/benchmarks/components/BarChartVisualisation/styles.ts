import styled from "styled-components";
import { StyledProspectItem } from "../BenchmarkCompetitorsList/styles";
import { StyledAddWebsiteButton } from "../EditableCompetitor/styles";

export const StyledWebsitesListContainer = styled.div`
    flex-shrink: 1;
    margin-right: 16px;
    min-width: 135px;
    padding-top: 8px;

    ${StyledProspectItem} {
        margin-bottom: 14px;
    }

    ${StyledAddWebsiteButton} {
        margin-bottom: 17px;
    }
`;

export const StyledBarChartVisualisationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px 9px 0;
    margin-bottom: 40px;
`;
