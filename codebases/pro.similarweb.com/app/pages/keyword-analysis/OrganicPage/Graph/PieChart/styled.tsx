import styled from "styled-components";
import { OTHERS_DOMAIN_NAME } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";

export const PieChartContainer = styled.div`
    display: grid;
    grid-template-columns: 75% 25%;
    height: 100%;
    &:hover {
        .${OTHERS_DOMAIN_NAME} {
            fill: #e6e6e6;
        }
    }
`;

export const ChartContainer = styled.div`
    height: 220px;
    width: 220px;
`;

export const LegendsContainer = styled.div``;

export const LoaderContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
