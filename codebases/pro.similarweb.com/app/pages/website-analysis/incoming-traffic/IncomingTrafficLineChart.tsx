import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import dayjs, { Dayjs } from "dayjs";
import { FunctionComponent } from "react";
import styled from "styled-components";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";
import { StyledHeaderTitle } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { TitleContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { CircularLoader } from "components/React/CircularLoader";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { minVisitsAbbrFilter } from "filters/ngFilters";
import { dateToUTC, getChartConfig } from "./chartConfig";
import { IIncomingTrafficPageData } from "./compare/IncomingTrafficCompare";
import { SubTitleReferrals } from "./StyledComponents";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { swSettings } from "common/services/swSettings";

const StyledBox = styled(Box).attrs<{ height: number; width: number | string }>((props) => ({
    width: props.width,
}))`
    height: ${({ height }) => height}px;
    display: flex;
    flex-direction: column;
`;

const FlexRowStyled = styled(FlexRow)`
    justify-content: space-between;
`;

const LoaderContainer = styled.div`
    height: 230px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MMXAlertWrapper = styled.div`
    align-self: center;
    margin-top: 2px;
    margin-left: 2px;
`;

interface IIncomingTrafficLineChartProps {
    data: any;
    webSource: string;
    from: Dayjs;
    to: Dayjs;
    isDaily: boolean;
    isSingle?: boolean;
    afterRender?: (chart) => {};
    onExport?: () => void;
    title: string;
    titleTooltip: string;
    isLoading?: boolean;
    is28d?: boolean;
}

export const IncomingTrafficLineChart: FunctionComponent<IIncomingTrafficLineChartProps> = ({
    data,
    webSource,
    from,
    to,
    isDaily,
    isSingle,
    afterRender,
    onExport,
    title,
    titleTooltip,
    isLoading = false,
    is28d = false,
}) => {
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from: from.valueOf(),
                to: to.valueOf(),
                useRangeDisplay: !is28d && from.format("YYYY-MM") !== to.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const newMMXAlgoStartData = swSettings.current.resources.NewAlgoMMX;
    const isShowMMXAlertBell =
        webSource !== devicesTypes.DESKTOP &&
        from.isBefore(dayjs(newMMXAlgoStartData)) &&
        to.isAfter(dayjs(newMMXAlgoStartData));

    return (
        <div className="span8 sw-trend-panel sw-cmp-panel">
            <StyledBox width="100%" height="340">
                <TitleContainer>
                    <FlexRowStyled>
                        <FlexColumn>
                            <StyledHeaderTitle>
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
                {isLoading ? (
                    <LoaderContainer>
                        <CircularLoader
                            options={{ svg: { stroke: colorsPalettes.carbon["200"] } }}
                        />
                    </LoaderContainer>
                ) : (
                    <Chart
                        type={isSingle ? "area" : "line"}
                        config={getChartConfig({
                            type: isSingle ? "area" : "line",
                            filter: [minVisitsAbbrFilter, 1],
                            isDaily,
                            isSingle,
                            data,
                            webSource,
                            from,
                        })}
                        data={data}
                        domProps={{ style: { height: "366px" } }}
                        afterRender={afterRender}
                    />
                )}
            </StyledBox>
        </div>
    );
};

export const IncomingTrafficLineChartDataTransformer = (
    data: IIncomingTrafficPageData,
    chosenSites,
    isSingle = false,
) => {
    return {
        lineChartData: Object.entries(data.dictionary).map(([domain, domainData], index) => {
            return {
                color: isSingle ? colorsPalettes.blue[400] : chosenSites.getSiteColor(domain),
                data: domainData.Dates.map((date, index) => {
                    return {
                        x: dateToUTC(date),
                        y: domainData.Volumes[index][0],
                    };
                }),
                name: domain,
                tooltipIndex: index,
                // marker enabled in compare mode or when there is one point of data
                marker: { enabled: !isSingle || domainData.Dates.length == 1, symbol: "circle" },
            };
        }),
    };
};
