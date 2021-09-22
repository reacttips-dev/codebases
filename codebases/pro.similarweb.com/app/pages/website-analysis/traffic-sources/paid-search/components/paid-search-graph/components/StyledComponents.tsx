import { colorsPalettes, rgba } from "@similarweb/styles";
import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { ChartLoaderContainer } from "components/Loaders/src/ExpandedTableRowLoader/StyledComponents";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { TitleContainer } from "pages/conversion/components/benchmarkOvertime/StyledComponents";

export const PaidSearchGraphContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    margin-bottom: 1.4rem;
    border-radius: 6px;
    min-height: 560px;
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon[500])};
`;

export const Title = styled(TitleContainer)`
    padding: 16px 16px 24px 24px;
`;

export const ButtonsContainer = styled(FlexRow)<{
    isSingle: boolean;
}>`
    padding-bottom: 24px;
    padding-top: 24px;
    justify-content: ${({ isSingle }) => (isSingle ? "flex-end" : "space-between")};
`;

export const SitesChartLoaderContainer = styled(ChartLoaderContainer)`
    width: 100%;
    box-sizing: border-box;
`;

const maxMediaScreenSize = "1440px";

export const SwitchersContainer = styled(FlexRow)`
    grid-column: 2;
    justify-content: space-between;
    padding-top: 8px;
    @media (max-width: ${maxMediaScreenSize}) {
        grid-column: 1;
    }
`;

export const StyledHeader = styled(FlexColumn)`
    height: 70px;
    padding-top: 24px;
    padding-left: 24px;
`;

export const ChartContainer = styled.div`
    box-sizing: border-box;
`;

export const StyledBox = styled(Box)`
    width: 100%;
    height: 554px;
`;

export const PaidSearchGraphHeaderStyle = styled(FlexRow)<{
    marginBottom: string;
    isSingle: boolean;
}>`
    justify-content: space-between;
    ${({ isSingle }) =>
        isSingle &&
        `
            border-bottom: 1px solid ${colorsPalettes.carbon[50]};
        `};
    height: 86px;
    box-sizing: border-box;
    padding: 24px;
    ${({ marginBottom }) => `margin-bottom:${marginBottom}`};
`;

export const ChipDownContainer = styled.div`
    width: auto;
    display: inline-flex;
    margin-right: 8px;
`;

export const TabsContainer = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    .sitesVsCategory {
        text-transform: uppercase;
        padding-bottom: 9px;
        border-bottom: 1px solid ${colorsPalettes.carbon["100"]};
    }
`;

export const TabContentStyle = styled.div`
    padding: 0 24px;
    box-sizing: border-box;
    flex-grow: 1;
    height: 398px;
`;

export const StyledHeaderTitle = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 20px;
    padding: 19px 24px;
    display: flex;
    align-items: center;
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const MTDToggleContainer = styled.div`
    align-self: center;
    padding: 2px 20px 0px 20px;
`;
