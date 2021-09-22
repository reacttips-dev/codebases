import React from "react";
import styled from "styled-components";
import { NoData as NoDataInner } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";

const EmptySelectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0px;
`;

export const NoData = () => (
    <EmptySelectionContainer>
        <NoDataInner
            noDataTitleKey="keywordanalysis.chart.sot.no.traffic.data.title"
            noDataSubTitleKey="keywordanalysis.chart.sot.no.traffic.data.text"
        />
    </EmptySelectionContainer>
);
