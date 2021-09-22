import _ from "lodash";
import dayjs from "dayjs";
import styled from "styled-components";
import PointValueAndChange from "../../../../../../components/Chart/src/components/PointValueAndChange";
import Header from "../../../common components/Header";
import SmallAreaGradientChartWithInfo from "../../../common components/SmallAreaGradientChartWithInfo";
import StoreIntellegenceCard from "./StoreIntellegenceCard";

const CustomPointStyle = styled.div``;

const CustomPoint = ({ point }) => <CustomPointStyle>{point}</CustomPointStyle>;

const formatRank = ({ value }) => `${_.isNumber(value) ? `#${value}` : "NA"}`;
const formatRankChange = (point1, point2) => {
    if (_.isNumber(point1.value) && _.isNumber(point2.value)) {
        const change = Math.abs(point1.value - point2.value);
        return change > 0 ? change : () => <CustomPoint point="-" />;
    } else {
        return () => <CustomPoint point="NA" />;
    }
};
const isDecrease = (point1, point2) => point2.value > point1.value;

const getValueSubtitle = (point) => dayjs.utc(point.date, "YYYY-MM-DD").format("MMM. Do");
const getChangeSubtitle = (point) => point.date && `vs. previous day`;

const Rank: any = ({ data, isLoading, gradientProps, title, tooltip, subtitleFilters }) => {
    const TitleComponent = () => (
        <Header
            loading={isLoading}
            title={title}
            tooltip={tooltip}
            subtitleFilters={subtitleFilters}
        />
    );

    const ContentComponent = () => {
        const rankConfig = {
            yAxis: {
                reversed: false,
                max: Math.max(...data.map(({ value }) => value)),
            },
            plotOptions: {
                series: {
                    threshold: Infinity,
                },
            },
        };
        return (
            <SmallAreaGradientChartWithInfo
                data={data}
                gradientProps={gradientProps}
                graphConfig={rankConfig}
                xAxisTickLabelFormat="MMM.DD"
            >
                {(point, pointIndex) => {
                    const previousPoint = data[pointIndex - 1] || {};
                    return (
                        <PointValueAndChange
                            value={formatRank(point)}
                            valueSubtitle={getValueSubtitle(point)}
                            change={formatRankChange(point, previousPoint)}
                            changeSubtitle={getChangeSubtitle(previousPoint)}
                            isDecrease={isDecrease(previousPoint, point)}
                        />
                    );
                }}
            </SmallAreaGradientChartWithInfo>
        );
    };
    return (
        <StoreIntellegenceCard
            title={title}
            Title={TitleComponent}
            Content={ContentComponent}
            isLoading={isLoading}
            data={data}
        />
    );
};
export default Rank;
