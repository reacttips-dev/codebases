import { Injector } from "common/ioc/Injector";
import * as React from "react";
import { FunctionComponent } from "react";
import { DefaultFetchService } from "services/fetchService";
import { granularities } from "../../../../../.pro-features/utils";
import FolderAnalysisBase from "./FolderAnalysisBase";

export const FolderAnalysisExpanded: FunctionComponent = (props: any) => {
    const fetchService = DefaultFetchService.getInstance();
    const params = (Injector.get("swNavigator") as any).getApiParams();
    const timeGran = params.isWindow ? granularities[0] : granularities[2];
    const fetchFolderAnalysis = () => {
        return fetchService.get("/widgetApi/TrafficAndEngagement/FolderEngagement/Data", {
            country: params.country,
            from: params.from,
            includeSubDomains: !params.isWWW,
            isWindow: params.isWindow,
            keys: props.row.Folder,
            timeGranularity: timeGran,
            to: params.to,
            webSource: params.webSource,
        });
    };

    const transformGraphData = (dataItem: any) => {
        if (dataItem === undefined) {
            return [];
        }
        return [new Date(dataItem.Key).getTime(), dataItem.Value.Value];
    };

    const render = () => {
        return (
            <FolderAnalysisBase
                {...props}
                transformGraphData={transformGraphData}
                timeGranularity={timeGran}
                fetchData={fetchFolderAnalysis}
                isWindow={params.isWindow}
            />
        );
    };
    return render();
};
