import React from "react";
import { LoaderListBullets } from "components/Loaders/src/LoaderListItems";
import { ICategoryShareServices } from "pages/industry-analysis/category-share/CategoryShareTypes";
import {
    GraphContentContainer,
    LoaderContainer,
} from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphStyles";
import { CategoryShareGraphPngHeader } from "./components/CategoryShareGraphPngHeader";
import { Legends } from "components/React/Legends/Legends";
import Chart from "components/Chart/src/Chart";
import {
    ICategoryShareAdaptedGraphData,
    ICategoryShareGraphLegend,
} from "./CategoryShareGraphTypes";
import { ChartStyleProvider } from "pages/industry-analysis/category-share/CategoryShareGraph/styled";

export const CategoryShareGraphBody = (props: {
    isLoading: boolean;
    params: any;
    services: ICategoryShareServices;
    graphLegend: ICategoryShareGraphLegend[];
    graphData: ICategoryShareAdaptedGraphData[];
    graphConfig: any;
    onSetGraphRef: (ref) => void;
    onToggleGraphLegend: (legendItem: { name: string }) => void;
}) => {
    const {
        isLoading,
        onSetGraphRef,
        onToggleGraphLegend,
        params,
        services,
        graphData,
        graphLegend,
        graphConfig,
    } = props;
    if (isLoading)
        return (
            <LoaderContainer>
                <LoaderListBullets />
            </LoaderContainer>
        );

    // Upon rendering the graph content, we also render a PNG header.
    // this is an invisible element, that will appear only when exporting the graph to PNG.
    return (
        <GraphContentContainer ref={onSetGraphRef}>
            <CategoryShareGraphPngHeader params={params} services={services} />
            <Legends legendItems={graphLegend} toggleSeries={onToggleGraphLegend} />
            <ChartStyleProvider>
                <Chart isPureConfig={false} type="area" data={graphData} config={graphConfig} />
            </ChartStyleProvider>
        </GraphContentContainer>
    );
};
