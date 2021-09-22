import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import swLog from "@similarweb/sw-log";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import SWReactRootComponent from "decorators/SWReactRootComponent";

import { DefaultFetchService } from "services/fetchService";
import { AdSpendGraphContainer, TabContentStyle } from "./Components/StyledComponents";
import { GraphTabHeader } from "./Components/GraphTabHeader";
import { AdSpendGraph } from "./Metrics/AdSpendGraph";
import { ErrorComponent, NoDataComponent } from "./Components/EmptyState";
import AdSpendFeedbackSurvey from "./Components/AdSpendFeedbackSurvey";
import { transformData } from "./Helpers/AdSpendGraphDataParsers";

const AdSpendPage: FunctionComponent<void> = () => {
    const [rawData, setRawData] = useState<object>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const fetchService = DefaultFetchService.getInstance();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const chosenSitesService = Injector.get("chosenSites") as any;
    const isSingle = !chosenSitesService.isCompare();
    const mode = chosenSitesService.isCompare() ? "compare" : "single";
    const { country, webSource, key, duration, isWWW } = swNavigator.getParams();
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const selectedChannel = "Usd Spend"; // part of hhtp response structure,
    const rawDataMetricName = "Ad Spend";
    const queryParams = useMemo(
        () => ({
            appMode: mode,
            country,
            from,
            includeSubDomains: isWWW === "*",
            isWindow,
            keys: key,
            timeGranularity: "Monthly",
            to,
            webSource,
        }),
        [mode, country, isWWW, isWindow, key, webSource, from, to],
    );
    ///////////// API methods //////////////////
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await fetchService.get<{ Data: object[] }>(
                "widgetApi/AdSpend/AdSpend/BarChart",
                queryParams,
            );
            const data = response.Data ? response.Data : {};
            setRawData(transformData({ isSingle, key, data }));
        } catch (error) {
            swLog.error(error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [from, to, isWindow, country, webSource, key]);

    const isNoData = () => {
        if (isLoading) {
            return false;
        }
        return isSingle
            ? !rawData?.["Ad Spend"]?.Data?.Total["Paid Visits"] ||
                  rawData?.["Ad Spend"]?.Data?.Total["Paid Visits"] < 5000
            : Object.values(rawData?.["Ad Spend"]?.["Paid Visits"]?.Total ?? {}).every(
                  (paidVisitsTotal) => paidVisitsTotal < 5000,
              );
    };
    const emptyState: React.ReactElement | null = isError ? (
        <ErrorComponent />
    ) : isNoData() ? (
        <NoDataComponent isSingle={isSingle} />
    ) : null;

    return (
        <>
            <AdSpendFeedbackSurvey />
            <AdSpendGraphContainer>
                <GraphTabHeader
                    webSource={webSource}
                    country={country}
                    duration={duration}
                    durationObject={durationObject}
                    metricName={rawDataMetricName}
                    queryParams={queryParams}
                />
                <TabContentStyle>
                    <AdSpendGraph
                        data={rawData}
                        duration={duration}
                        isWindow={isWindow}
                        isSingle={isSingle}
                        getSiteColor={chosenSitesService.getSiteColor}
                        chosenSites={chosenSitesService.get()}
                        selectedChannel={selectedChannel}
                        rawDataMetricName={rawDataMetricName}
                        isLoading={isLoading}
                        emptyState={emptyState}
                    />
                </TabContentStyle>
            </AdSpendGraphContainer>
        </>
    );
};

export default SWReactRootComponent(AdSpendPage, "AdSpendPage");
