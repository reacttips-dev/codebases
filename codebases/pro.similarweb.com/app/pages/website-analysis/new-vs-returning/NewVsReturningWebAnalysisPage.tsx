import React, { useMemo } from "react";
import { NewVsReturningWebAnalysisCompare } from "pages/website-analysis/new-vs-returning/NewVsReturningWebAnalysisCompare";
import { NewVsReturningWebAnalysisSingle } from "pages/website-analysis/new-vs-returning/NewVsReturningWebAnalysisSingle";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import { useLoading } from "custom-hooks/loadingHook";
import NewVsReturningApiService from "pages/website-analysis/new-vs-returning/NewVsReturningApiService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { IBaseSingleRequestParams } from "services/segments/segmentsApiService";
import DurationService from "services/DurationService";

const NewVsReturningWebAnalysisPage = (props: any) => {
    const { params } = props;
    const { key, duration } = params;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const competitors = key.split(",");
    const isCompare = competitors.length > 1;
    const { newVsReturningApiService } = React.useMemo(
        () => ({
            newVsReturningApiService: new NewVsReturningApiService(),
        }),
        [],
    );
    const [newVsReturningGraphChartData, newVsReturningGraphDataOps] = useLoading();
    const durationObject = useMemo(() => DurationService.getDurationData(duration, undefined), [
        duration,
        undefined,
    ]);
    const apiParams = swNavigator.getApiParams(params);

    const excelUrl: string = useMemo(() => {
        const excelFileName = `NewVsReturning - ${params.key} - (${params.country}) - (${durationObject.forAPI.from}) - (${durationObject.forAPI.to})`;
        return newVsReturningApiService.getDomainsNewVsReturningGraphExcelUrl({
            ...apiParams,
            keys: key,
            webSource: "Desktop",
            timeGranularity: "Monthly",
            includeSubDomains: true,
            FileName: excelFileName,
        } as IBaseSingleRequestParams);
    }, [params]);

    React.useEffect(() => {
        const apiParams = swNavigator.getApiParams(params);
        newVsReturningGraphDataOps.load(() =>
            newVsReturningApiService.getDomainsNewVsReturning(apiParams),
        );
    }, [params]);

    const isGraphChartDataLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        newVsReturningGraphChartData.state,
    );
    return (
        <>
            {isCompare ? (
                <NewVsReturningWebAnalysisCompare
                    excelUrl={excelUrl}
                    params={params}
                    isLoading={isGraphChartDataLoading}
                    data={newVsReturningGraphChartData.data}
                />
            ) : (
                <NewVsReturningWebAnalysisSingle
                    excelUrl={excelUrl}
                    params={params}
                    isLoading={isGraphChartDataLoading}
                    data={newVsReturningGraphChartData.data}
                />
            )}
        </>
    );
};

function mapStateToProps(store) {
    const { params } = store.routing;
    return {
        params,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(NewVsReturningWebAnalysisPage),
    "NewVsReturningWebAnalysisPage",
);
