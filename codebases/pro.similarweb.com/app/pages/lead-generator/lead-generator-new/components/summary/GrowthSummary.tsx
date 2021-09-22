import React from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FilterDescription, FilterTitle, SummaryFilterContainer } from "../elements";
import { ChangeStyle, FilterDescription as Description } from "../filters/VisitsFilter";
import { getClientValueGrowth } from "../filters/GrowthFilters";

const Summary = styled(SummaryFilterContainer)`
    ${ChangeStyle} {
        font-weight: 400;
    }
`;

const MetricDescription = styled(FilterDescription)`
    text-transform: none;
`;

export function GrowthSummary({ filter }) {
    const availableMetrics = filter.availableMetrics;
    const selectedGrowthFilters = getClientValueGrowth(filter.getValue());
    const filters = selectedGrowthFilters.map((selectMetric) => {
        const { [selectMetric.name]: metric } = availableMetrics;
        return {
            ...metric,
            ...selectMetric,
        };
    });
    return (
        <SummaryFilterContainer>
            {filters.map(({ name, title, trend, value, period }, index) => (
                <Summary key={name}>
                    <FilterTitle>Growth Filter {index + 1}</FilterTitle>
                    <MetricDescription>
                        <Description
                            title={title}
                            trend={trend}
                            value={value}
                            period={period}
                            isActive={false}
                        />
                    </MetricDescription>
                </Summary>
            ))}
        </SummaryFilterContainer>
    );
}
