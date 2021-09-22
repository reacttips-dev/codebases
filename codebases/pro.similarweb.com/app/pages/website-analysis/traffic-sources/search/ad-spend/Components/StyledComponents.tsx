import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

import { TitleContainer } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { ChartLoaderContainer } from "components/Loaders/src/ExpandedTableRowLoader/StyledComponents";

export const AdSpendGraphContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    margin-bottom: 1.4rem;
    border-radius: 6px;
`;

export const TabContentStyle = styled.div`
    padding: 0 16px;
    box-sizing: border-box;
    flex-grow: 1;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const ChartContainer = styled.div`
    box-sizing: border-box;
    padding: 0px 0px 8px 0px;
`;

export const Title = styled(TitleContainer)`
    padding: 16px 16px 24px 24px;
`;

export const HeaderFlexColumn = styled(FlexColumn)`
    width: 100%;
`;

export const HeaderFlexRow = styled(FlexRow)`
    justify-content: space-between;
`;

export const FiltersRowContainer = styled(FlexRow)`
    justify-content: space-between;
    margin-bottom: 16px;
`;

export const AdSpendChartLoaderContainer = styled(ChartLoaderContainer)`
    width: 100%;
    box-sizing: border-box;
`;
