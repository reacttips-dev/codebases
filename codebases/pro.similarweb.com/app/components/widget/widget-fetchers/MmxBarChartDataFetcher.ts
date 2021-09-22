import { swSettings } from "common/services/swSettings";
import DurationService from "services/DurationService";
import { DefaultDataFetcher } from "./DefaultDataFetcher";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "../../../services/fetchService";

function getTotalVisits(data) {
    return Object.entries<number>(data).reduce((sum: number, [source, val]) => sum + val, 0);
}

const getMmxBarChartDataFetcher = (category, widget) => {
    category = category || {};
    const swNavigator = Injector.get<any>("swNavigator");
    const mmxFetcher = Injector.instantiate(DefaultDataFetcher, { widget }) as any;
    return {
        async fetch(options?) {
            const fetchService = DefaultFetchService.getInstance();
            const { duration, comparedDuration } = swNavigator.getParams();
            const barChartParams = { ...widget.apiParams };

            if (comparedDuration) {
                const durationData = DurationService.getDurationData(
                    duration,
                    comparedDuration,
                    swSettings.current.componentId,
                );
                const { compareFrom, compareTo } = durationData.forAPI;

                Object.assign(barChartParams, { compareFrom, compareTo });
            }

            let industryDataPromise = Promise.resolve({});
            if (category.id && !comparedDuration) {
                const industryKey = "$" + category.id;
                const params = {
                    ...widget.apiParams,
                    keys: industryKey,
                    metric: "TrafficSourcesOverviewAverage",
                };
                industryDataPromise = fetchService
                    .get(`/api/WidgetKpis/${params.metric}/GetPieChartData`, params)
                    .then((industryResponse: any) => industryResponse.Data[industryKey]);
            }
            try {
                if (comparedDuration) {
                    const mmXDataPromise = mmxFetcher.fetch(barChartParams);
                    const mmxData = await mmXDataPromise;

                    return {
                        Data: {
                            Data: mmxData.Data,
                            ComparedData: mmxData.ComparedData.Data,
                        },
                    };
                } else {
                    const mmXDataPromise = mmxFetcher.fetch(barChartParams).then((res) => res.Data);
                    const [mmXTrafficSources, industryTrafficSources] = await Promise.all([
                        mmXDataPromise,
                        industryDataPromise,
                    ]);
                    const sitesDataWithTotalVisits = Object.entries(mmXTrafficSources).reduce(
                        (newDataObject, [domain, trafficSources]) => {
                            trafficSources = trafficSources || {};
                            return {
                                ...newDataObject,
                                [domain]: {
                                    trafficSources: trafficSources,
                                    totalVisits: getTotalVisits(trafficSources),
                                },
                            };
                        },
                        {},
                    );
                    return {
                        Data: {
                            ...sitesDataWithTotalVisits,
                            category: {
                                ...category,
                                trafficSources: industryTrafficSources,
                                totalVisits: getTotalVisits(industryTrafficSources),
                            },
                        },
                    };
                }
            } catch (e) {
                return null;
            }
        },
        destroy() {},
    };
};
export default {
    create: (category, widget) => getMmxBarChartDataFetcher(category, widget),
};
