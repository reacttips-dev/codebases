import { colorsPalettes } from "@similarweb/styles";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import * as React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export interface IChartTitleProps {
    titleText: string;
    onExportChartPngClick?: () => void;
}

const ChartTitleContainer = styled.div`
    height: 40px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    h2 {
        font-size: 16px;
        color: ${colorsPalettes.carbon[500]};
        font-weight: 500;
    }
`;

export function DemographicsChartTitleBar(props: IChartTitleProps) {
    const { titleText, onExportChartPngClick } = props;
    const hasExportButton = typeof onExportChartPngClick !== "undefined";

    return (
        <FlexRow>
            <ChartTitleContainer>
                <h2>{titleText}</h2>
            </ChartTitleContainer>
            <DownloadButtonMenu PNG={hasExportButton} exportFunction={onExportChartPngClick} />
        </FlexRow>
    );
}
