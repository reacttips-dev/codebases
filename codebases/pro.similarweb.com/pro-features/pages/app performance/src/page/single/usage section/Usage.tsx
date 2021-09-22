import dayjs from "dayjs";
import isNumber from "lodash/isNumber";
import numeral from "numeral";
import styled from "styled-components";
import PointValueAndChange from "../../../../../../components/Chart/src/components/PointValueAndChange";
import SmallAreaGradientChartWithInfo from "../../../common components/SmallAreaGradientChartWithInfo";
import UsageCard from "./UsageCard";

const CustomPointStyle = styled.div``;

const CustomPoint = ({ point }) => <CustomPointStyle>{point}</CustomPointStyle>;
const formatChange = (point1, point2) => {
    if (isNumber(point1.value) && isNumber(point2.value)) {
        const change = point2.value !== 0 ? (point1.value - point2.value) / point2.value : 0;
        return change !== 0 ? numeral(change).format("0.[00]%") : () => <CustomPoint point="-" />;
    } else {
        // eslint-disable-next-line react/display-name
        return () => <CustomPoint point="NA" />;
    }
};
const isDecrease = (point1, point2) => point1.value > point2.value;

const getValueSubtitle = (point) => point.date && `in ${dayjs.utc(point.date).format("MMM YY")}`;
const getChangeSubtitle = (point) => point.date && `vs. ${dayjs.utc(point.date).format("MMM YY")}`;

const Usage: any = ({
    title,
    data,
    gradientProps,
    formatValue,
    TitleComponent,
    xAxisTickLabelFormat = "MMM",
    initialSelectedPoint,
    FallbackChildren,
}) => {
    const ContentComponent = () => {
        return (
            <SmallAreaGradientChartWithInfo
                data={data.slice(1)}
                gradientProps={gradientProps}
                initialSelectedPoint={initialSelectedPoint}
                xAxisTickLabelFormat={xAxisTickLabelFormat}
            >
                {(point, pointIndex) => {
                    if (!point && !pointIndex) {
                        return FallbackChildren;
                    }
                    const previousPoint = data[pointIndex] || {}; // we compare to the previous data point from
                    // the original 'data' which its size is always larger by 1.
                    return (
                        <PointValueAndChange
                            value={formatValue(point)}
                            valueSubtitle={getValueSubtitle(point)}
                            change={formatChange(point, previousPoint)}
                            changeSubtitle={getChangeSubtitle(previousPoint)}
                            isDecrease={isDecrease(previousPoint, point)}
                        />
                    );
                }}
            </SmallAreaGradientChartWithInfo>
        );
    };

    return (
        <UsageCard
            title={title}
            TitleComponent={TitleComponent}
            Content={ContentComponent}
            data={data}
        />
    );
};
export default Usage;
