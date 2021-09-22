import styled from "styled-components";
import { GranularitySwitcher } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/GranularitySwitcher";
import { ExcelDownload } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/ExcelDownload";
import { AddToDashboard } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/AddToDashboard";
import { PngDownload } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/PngDownload";
import { Legends } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/Legends";
import React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";

const FiltersContainer = styled(FlexRow)`
    justify-content: space-between;
    padding: 10px 0px;
`;

const ActionItemsContainer = styled(FlexRow)<{ width: string }>`
    @media print {
        display: none;
    }
    ${({ width }) => `width: ${width};`};
    justify-content: flex-end;
`;

export const FiltersAndActionItems = () => {
    const { shouldRenderLegends } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    return (
        <FiltersContainer>
            {shouldRenderLegends && <Legends />}
            <ActionItemsContainer width={shouldRenderLegends ? "60%" : "100%"}>
                <GranularitySwitcher />
                <ExcelDownload />
                <PngDownload />
                <AddToDashboard />
            </ActionItemsContainer>
        </FiltersContainer>
    );
};
