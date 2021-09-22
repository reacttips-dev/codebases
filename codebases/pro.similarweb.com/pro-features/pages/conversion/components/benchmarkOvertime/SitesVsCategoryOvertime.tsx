import * as React from "react";
import { BenchmarkOvertime, IBenchmarkOvertimeProps } from "./benchmarkOvertime";

export const SitesVsCategoryOvertime: React.SFC<IBenchmarkOvertimeProps> = (props) => {
    // const renderLegend = (selectedChartData) => {
    //     const segmentData = ConversionSegmentsUtils.getSegmentById(props.segmentsData, props.filters.sid);
    //     const segmentDomain = segmentData && segmentData.domain;
    //
    //     return (<LegendsContainer>
    //
    //     </LegendsContainer>);
    // }

    return <BenchmarkOvertime {...props} />;
};
