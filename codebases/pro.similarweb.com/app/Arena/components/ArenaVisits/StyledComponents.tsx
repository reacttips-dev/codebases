import { colorsPalettes } from "@similarweb/styles";
import { LoaderContainer } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { ChartLoaderContainer } from "../../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/StyledComponents";

export const ContentContainer: any = styled.div`
    box-sizing: border-box;
    display: flex;
    padding-top: 25px;
    flex-wrap: wrap;
    ${LoaderContainer} {
        width: 100%;
    }
`;
ContentContainer.displayName = "ContentContainer";

export const SitesChartLoaderContainer: any = styled(ChartLoaderContainer)`
    width: 100%;
    box-sizing: border-box;
`;
SitesChartLoaderContainer.displayName = "SitesChartLoaderContainer";

export const ChartContainer: any = styled.div`
    box-sizing: border-box;
    padding-top: 20px;
    width: 100%;
    height: 300px;
`;
ChartContainer.displayName = "ChartContainer";

export const StyledUtilsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
`;
StyledUtilsContainer.displayName = "StyledUtilsContainer";

export const StyledSwitchersContainer = styled.div`
    display: flex;
    height: 100%;
`;
StyledSwitchersContainer.displayName = "StyledSwitchersContainer";

export const StyledSwitcherDivider = styled.div`
    width: 1px;
    height: 100%;
    margin: 0 16px;
    background-color: ${colorsPalettes.carbon[50]};
`;
StyledSwitcherDivider.displayName = "StyledSwitcherDivider";
