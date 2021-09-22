import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";
import { StyledHeaderTitle } from "../../../../.pro-features/pages/conversion/components/benchmarkOvertime/StyledComponents";
import { TitleContainer } from "../../../../.pro-features/pages/conversion/components/ConversionScatterChart/StyledComponents";
import { PrimaryBoxTitle } from "../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import {
    FlexColumn,
    FlexRow,
} from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { DownloadButtonMenu } from "../../../components/React/DownloadButtonMenu/DownloadButtonMenu";
import { abbrNumberVisitsFilter, i18nFilter, percentageFilter } from "../../../filters/ngFilters";
import { getPieConfig } from "./chartConfig";
import { IIncomingTrafficPageData } from "./compare/IncomingTrafficCompare";

import { SubTitleReferrals } from "./StyledComponents";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import { swSettings } from "common/services/swSettings";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

const StyledBox = styled(Box).attrs<{ height: number; width: number | string }>(
    ({ width, height }) => ({
        width,
        height,
    }),
)<{ height: string; width: string }>`
    display: flex;
    flex-direction: column;
`;

const Marker = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 8px;
`;

const LegendContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
`;
const DomainContainer = styled.div`
    display: flex;
    align-items: center;
`;
const ValueContainer = styled.div`
    text-align: right;
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    display: flex;
`;

const ValueNumber = styled.div`
    margin-right: 8px;
`;

const ValuePercent = styled.div``;

const FlexRowStyled = styled(FlexRow)`
    justify-content: space-between;
`;

const PieLegend = styled(FlexColumn)<{ itemsCount: number }>`
    min-height: ${({ itemsCount }) => itemsCount * 30}px;
    justify-content: space-evenly;
`;

const MMXAlertWrapper = styled.div`
    align-self: center;
    margin-top: 2px;
    margin-left: 2px;
`;

interface IIncomingTrafficPieChartProps {
    data: [
        {
            color: string;
            displayName: string;
            name: string;
            percent: number;
            y: number;
            searchTotal: number;
        },
    ];
    webSource: string;
    from: Dayjs;
    to: Dayjs;
    afterRender?: (chart) => {};
    onExport?: () => void;
}

export const IncomingTrafficPieChart: FunctionComponent<IIncomingTrafficPieChartProps> = ({
    data,
    webSource,
    from,
    to,
    afterRender,
    onExport,
}) => {
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
                format: "MMMM YYYY",
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const title = i18nFilter()("analysis.compare.trafficsource.overview.share");
    const pieChartData = [
        {
            data,
            showInLegend: true,
            type: "pie",
        },
    ];
    const newMMXAlgoStartData = swSettings.current.resources.NewAlgoMMX;
    const isShowMMXAlertBell =
        webSource !== devicesTypes.DESKTOP &&
        from.isBefore(dayjs(newMMXAlgoStartData)) &&
        to.isAfter(dayjs(newMMXAlgoStartData));

    return (
        <div className="span4">
            <StyledBox width="100%" height="340px">
                <TitleContainer>
                    <FlexRowStyled>
                        <FlexColumn>
                            <StyledHeaderTitle>
                                <FlexRow>
                                    <PrimaryBoxTitle
                                        customElement={
                                            isShowMMXAlertBell && (
                                                <MMXAlertWrapper>
                                                    <MMXAlertWithPlainTooltip />
                                                </MMXAlertWrapper>
                                            )
                                        }
                                    >
                                        {title}
                                    </PrimaryBoxTitle>
                                </FlexRow>
                                <SubTitleReferrals>
                                    <BoxSubtitle filters={subTitleFilters} />
                                </SubTitleReferrals>
                            </StyledHeaderTitle>
                        </FlexColumn>
                        <FlexColumn>
                            <DownloadButtonMenu exportFunction={onExport} PNG={true} />
                        </FlexColumn>
                    </FlexRowStyled>
                </TitleContainer>
                <Chart
                    type={"pie"}
                    config={getPieConfig({ type: "pie", filter: [abbrNumberVisitsFilter, 1] })}
                    data={pieChartData}
                    domProps={{ style: { height: "auto", flexGrow: 1 } }}
                    afterRender={afterRender}
                />
                <PieLegend itemsCount={data.length}>
                    {data.map((domainData, index) => {
                        return (
                            <LegendContainer key={`legend-${index}`}>
                                <DomainContainer>
                                    <Marker color={domainData.color} />
                                    {domainData.name}
                                </DomainContainer>
                                <ValueContainer>
                                    <ValueNumber>
                                        {abbrNumberVisitsFilter()(domainData.searchTotal)}
                                    </ValueNumber>
                                    <ValuePercent>({domainData.percent}%)</ValuePercent>
                                </ValueContainer>
                            </LegendContainer>
                        );
                    })}
                </PieLegend>
            </StyledBox>
        </div>
    );
};

IncomingTrafficPieChart.displayName = "IncomingTrafficPieChart";
IncomingTrafficPieChart.defaultProps = {
    onExport: () => null,
};

export const IncomingTrafficPieChartDataTransformer = (
    data: IIncomingTrafficPageData,
    chosenSites,
) => {
    const total = Object.entries(data.dictionary).reduce((total, [domain, domainData]) => {
        return (total += domainData.SearchTotal);
    }, 0);
    return {
        pieChartData: Object.entries(data.dictionary).map(([domain, domainData], index) => {
            return {
                color: chosenSites.getSiteColor(domain),
                percent: percentageFilter()(domainData.SearchTotal / total, 2),
                y: domainData.SearchTotal / total,
                searchTotal: domainData.SearchTotal,
                name: domain,
                showInLegend: true,
            };
        }),
    };
};
