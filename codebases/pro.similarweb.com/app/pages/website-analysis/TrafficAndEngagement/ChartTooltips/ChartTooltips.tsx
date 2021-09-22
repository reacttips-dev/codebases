import { colorsPalettes } from "@similarweb/styles";
import { swSettings } from "common/services/swSettings";
import { setFont } from "@similarweb/styles/src/mixins";
import { Injector } from "common/ioc/Injector";
import dayjs from "dayjs";
import {
    BoldText,
    GridBox,
    Line,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { webSourceDisplayName } from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { formatDate } from "utils";
import { PoPCompareChangeTooltip } from "components/PoPCompareChangeTooltip/PoPCompareChangeTooltip";

export const TooltipPartialText = styled.div`
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    font-weight: 400;
    background: ${colorsPalettes.carbon["50"]};
    border-radius: 4px;
    margin-top: 8px;
`;

export const PopTooltip = (props) => (
    <PoPCompareChangeTooltip
        headersList={[
            "Domain",
            formatDate(props.pointsData[0].point.values[1].Key),
            formatDate(props.pointsData[0].point.values[0].Key),
            "Growth",
        ]}
        {...props}
    />
);

const Text = styled.label<{ color?: string }>`
            cursor: inherit;
            ${setFont({ $size: 13 })}
           color: ${colorsPalettes.carbon[200]};
            ${({ color }) => color && `color:${color};`};
`;

export const PopTooltipSingleDefault = (props) => {
    const { pointsData, yFormatter, date, compareToDate } = props;
    const { webSource } = (Injector.get("swNavigator") as any).getParams();
    const isMTDPartialData = pointsData[0]?.point?.isPartial;
    return (
        <>
            <GridBox>
                <span />
                <BoldText color={pointsData[1].color}>{date}</BoldText>
                <BoldText color={pointsData[0].color}>
                    {compareToDate}
                    {isMTDPartialData && "*"}
                </BoldText>
                <BoldText color={colorsPalettes.carbon[500]}>Change</BoldText>
                <Line />
            </GridBox>
            <PopTooltipSingleDefaultRow
                yFormatter={yFormatter}
                pointZero={pointsData[0].y}
                pointOne={pointsData[1].y}
                webSource={webSource}
            />
            {isMTDPartialData && (
                <TooltipPartialText>
                    {i18nFilter()("wa.traffic.engagement.over.time.single.pop.partial", {
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        last_supported_day: dayjs(swSettings.current.lastSupportedDailyDate).format(
                            "MMM DD",
                        ),
                        month: compareToDate,
                    })}
                </TooltipPartialText>
            )}
        </>
    );
};
const PopTooltipSingleDefaultRow = ({ yFormatter, webSource, pointZero, pointOne }) => {
    const dateValue = yFormatter({ value: pointOne });
    const compareToDateValue = yFormatter({ value: pointZero });
    const change = pointZero / pointOne - 1;
    const changeColor = change > 0 ? colorsPalettes.green.s100 : colorsPalettes.red.s100;
    return (
        <GridBox>
            <Text>
                {webSourceDisplayName[webSource] ? webSourceDisplayName[webSource] : webSource}
            </Text>
            <Text>{dateValue}</Text>
            <Text>{compareToDateValue}</Text>
            <Text color={changeColor}>{percentageSignFilter()(change, 2)}</Text>
        </GridBox>
    );
};
const PopTooltipSingleCombined = (props) => {
    const { pointsData, yFormatter, date, compareToDate } = props;
    return (
        <>
            <GridBox>
                <span />
                <BoldText color={pointsData[1].color}>{date}</BoldText>
                <BoldText color={pointsData[0].color}>{compareToDate}</BoldText>
                <BoldText color={colorsPalettes.carbon[500]}>Change</BoldText>
                <Line />
            </GridBox>
            <PopTooltipSingleDefaultRow
                yFormatter={yFormatter}
                pointZero={pointsData[0].y}
                pointOne={pointsData[1].y}
                webSource={webSourceDisplayName.Desktop}
            />
            <PopTooltipSingleDefaultRow
                yFormatter={yFormatter}
                pointZero={pointsData[2].y}
                pointOne={pointsData[3].y}
                webSource={webSourceDisplayName.MobileWeb}
            />
            <PopTooltipSingleDefaultRow
                yFormatter={yFormatter}
                pointZero={pointsData[0].y + pointsData[2].y}
                pointOne={pointsData[1].y + pointsData[3].y}
                webSource={webSourceDisplayName.Total}
            />
        </>
    );
};

// two point for default state and four points for combined state
export const PopTooltipSingle = (props) => {
    const date = formatDate(props.pointsData[0].point.values[1].Key);
    const compareToDate = formatDate(props.pointsData[0].point.values[0].Key);
    if (props.pointsData.length === 2) {
        return <PopTooltipSingleDefault {...props} date={date} compareToDate={compareToDate} />;
    }
    return <PopTooltipSingleCombined {...props} date={date} compareToDate={compareToDate} />;
};
