import styled from "styled-components";

export const ChartStyleProvider = styled.div`
    @media print {
        .mobileweb-algorithm-marker {
            position: relative;
            top: 20px;
        }
        .mobile-algorithm-text {
            white-space: pre-wrap;
        }
        .highcharts-container {
            height: 500px !important;
        }
    }
`;
