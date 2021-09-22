import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";
import { LegendItems } from "../../../../Legends/src/ComparePeriodsLegend/StyledComponents";

export const ChartLegendContainer: any = styled.div`
    ${LegendItems} {
        margin-bottom: 20px;
    }
`;
ChartLegendContainer.displayName = "ChartLegendContainer";

export const ChartContainer: any = styled.div``;
ChartContainer.displayName = "ChartContainer";
