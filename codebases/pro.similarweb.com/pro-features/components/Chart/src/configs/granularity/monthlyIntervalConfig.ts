import combineConfigs from "../../combineConfigs";
import dailyIntervalConfig from "./dailyIntervalConfig";

export default ({ type }) => {
    const interval = 24 * 3600 * 1000 * 30;
    return combineConfigs({ type }, [
        dailyIntervalConfig,
        {
            xAxis: {
                tickInterval: interval,
            },
            plotOptions: {
                [type]: {
                    marker: {
                        enabled: true,
                    },
                },
                series: {
                    pointInterval: interval,
                },
            },
        },
    ]);
};
