import combineConfigs from "../../combineConfigs";
import dailyIntervalConfig from "./dailyIntervalConfig";

export default ({ type }) => {
    const interval = 24 * 3600 * 1000 * 2;
    return combineConfigs({ type }, [
        dailyIntervalConfig,
        {
            plotOptions: {
                series: {
                    pointInterval: interval,
                },
            },
        },
    ]);
};
