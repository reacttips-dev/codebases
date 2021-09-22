import { webSourceTextSlimFilter } from "filters/ngFilters";
import * as _ from "lodash";

export function adaptCompareSingleData(data) {
    const sourceFilter = webSourceTextSlimFilter()("Total"); // we have data just for total traffic
    const allValues = {};
    const regularData = _.get(data, "BreakDown", null);
    const comparedData = _.get(data, "comparedData.Data.BreakDown", null);

    if (!regularData || !comparedData) return data;

    const allComparedChannels = Object.keys(
        Object.keys(comparedData).reduce((channels, date) => {
            return { ...channels, ...comparedData[date] };
        }, {}),
    );

    const allRegularChannels = Object.keys(
        Object.keys(regularData).reduce((channels, date) => {
            return { ...channels, ...regularData[date] };
        }, {}),
    );

    const allChannels = Array.from(new Set(allComparedChannels.concat(allRegularChannels)));

    allChannels.forEach((channel) => {
        const channelValues = [];
        const regularValues = [];
        const comparedValues = [];

        let i;

        Object.keys(regularData).forEach((date) => {
            regularValues.push({
                Key: date,
                Value: _.get(regularData, `${date}.${channel}`, 0),
            });
        });

        Object.keys(comparedData).forEach((date) => {
            const value = _.get(comparedData, `${date}.${channel}`, 0);
            comparedValues.push({
                Key: date,
                Value: value ? value : 0,
            });
        });

        for (i = 0; i < regularValues.length && i < comparedValues.length; ++i) {
            const change =
                comparedValues[i].Value === 0 || !comparedValues[i].Value
                    ? [0]
                    : [regularValues[i].Value / comparedValues[i].Value - 1];

            channelValues.push({
                Values: [regularValues[i], comparedValues[i]],
                Change: change,
            });
        }

        allValues[channel] = {
            [sourceFilter]: channelValues,
        };
    });

    return allValues;
}
