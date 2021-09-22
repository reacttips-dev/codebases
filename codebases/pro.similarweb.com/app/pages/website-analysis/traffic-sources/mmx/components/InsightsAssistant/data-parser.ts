import dayjs from "dayjs";
import { IInsightPointData } from "insights-assistant/insights-types";
import { swSettings } from "common/services/swSettings";
export interface IDataForInsights {
    channel: string;
    data: IInsightPointData[];
    total: number;
    domain?: {
        icon: string;
        name: string;
        color: string;
    };
}

const granularity = {
    Weekly: "WeeklyData",
    Monthly: "MonthlyData",
};

const channels = [
    "Direct",
    "Display Ads",
    "Email",
    "Organic Search",
    "Paid Search",
    "Referrals",
    "Social",
];

export const REQUIRED_POINTS = 3;

export const parseData = (
    data,
    selectedGranularity,
    metric,
    isMTDActive,
    mtdEndDate,
    chosenSites,
) => {
    return chosenSites.count() === 1
        ? parseSingleData(data, selectedGranularity, metric, isMTDActive, mtdEndDate)
        : parseCompareData(data, selectedGranularity, metric, isMTDActive, mtdEndDate, chosenSites);
};

export const parseSingleData = (
    data,
    selectedGranularity,
    metric,
    isMTDActive,
    mtdEndDate,
): IDataForInsights[] => {
    const parsedData = [];

    channels.forEach((channel) => {
        const dataByGran = data[granularity[selectedGranularity]][metric]?.Data;
        if (dataByGran) {
            // use dates in the last places of the array
            const dates = granularityCheck(
                selectedGranularity,
                isMTDActive,
                mtdEndDate,
                Object.keys(dataByGran.BreakDown).sort(),
            );
            const channelPoints = dates.map((date: string) => {
                return {
                    date: date,
                    value: dataByGran.BreakDown[date][channel],
                };
            });
            parsedData.push({
                channel: channel,
                data: channelPoints,
                total: dataByGran.Total[channel],
            });
        }
    });
    return parsedData;
};

export const parseCompareData = (
    data,
    selectedGranularity,
    metric,
    isMTDActive,
    mtdEndDate,
    chosenSites,
): IDataForInsights[] => {
    const parsedData = [];
    const dataByGran = data[granularity[selectedGranularity]][metric];

    if (dataByGran) {
        Object.entries(dataByGran)?.forEach(([channel, info]) => {
            const dates = granularityCheck(
                selectedGranularity,
                isMTDActive,
                mtdEndDate,
                Object.keys(info["BreakDown"]).sort(),
            );

            for (const [name, data] of Object.entries(chosenSites.listInfo)) {
                const channelPoints = dates.map((date: string) => {
                    return {
                        date: date,
                        value: info["BreakDown"][date][name],
                    };
                });
                parsedData.push({
                    channel,
                    data: channelPoints,
                    total: info["Total"][name],
                    domain: {
                        icon: data["icon"],
                        name: name,
                        color: chosenSites.getSiteColor(name),
                    },
                });
            }
        });
    }

    return parsedData;
};

const granularityCheck = (selectedGranularity, isMTDActive, mtdEndDate, dates) => {
    const datesCopy = [...dates];
    // check if the last date is partial for weekly granularity only
    if (selectedGranularity !== "Daily") {
        const from = dayjs.utc(datesCopy[datesCopy.length - 1]);
        const to = from.clone();
        let toWeek = to.add(6, "days");

        if (isMTDActive) {
            toWeek = mtdEndDate;
        } else {
            if (from.month() !== toWeek.month()) {
                toWeek = from.clone().endOf("month").startOf("day").utc();
            }
        }
        const isPartial =
            selectedGranularity === "Weekly"
                ? !toWeek.isSame(to, "day")
                : !isMTDActive
                ? false
                : dayjs.utc(mtdEndDate).isAfter(swSettings.current.endDate);
        if (isPartial) {
            datesCopy.pop();
        }
    }
    return datesCopy.slice(Math.max(datesCopy.length - REQUIRED_POINTS, 0));
};
