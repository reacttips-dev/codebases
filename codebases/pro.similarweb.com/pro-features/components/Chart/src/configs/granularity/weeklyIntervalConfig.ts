import combineConfigs from "../../combineConfigs";
import monthlyIntervalConfig from "./monthlyIntervalConfig";

export default ({ type }) => {
    const interval = 24 * 3600 * 1000 * 7;
    return combineConfigs({ type }, [
        monthlyIntervalConfig,
        {
            xAxis: {
                tickInterval: interval,
            },
            plotOptions: {
                series: {
                    pointInterval: interval,
                },
            },
        },
    ]);
};
