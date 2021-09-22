import Chart from "components/Chart/src/Chart";
import { Loader } from "pages/keyword-analysis/OrganicPage/Graph/Loader";
import { NoData } from "pages/keyword-analysis/OrganicPage/Graph/NoData";
import React from "react";
import { LoaderContainer } from "./styledComponents";

export const GraphContent: React.FC<{
    isLoading: boolean;
    graphData: Array<object>;
    graphConfig: object;
    afterRender?: (chart?) => {};
}> = ({ isLoading, graphData, graphConfig, afterRender }) => {
    if (isLoading)
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        );
    if (graphData.length === 0) return <NoData />;
    return (
        <Chart
            isPureConfig={false}
            type="area"
            data={graphData}
            config={graphConfig}
            afterRender={afterRender}
        />
    );
};
