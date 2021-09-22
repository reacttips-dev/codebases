import * as React from "react";
import { BenchmarkOvertime, IBenchmarkOvertimeProps } from "./benchmarkOvertime";

export const SegmentsVsGroupOvertime: React.SFC<IBenchmarkOvertimeProps> = (props) => {
    return <BenchmarkOvertime {...props} />;
};
