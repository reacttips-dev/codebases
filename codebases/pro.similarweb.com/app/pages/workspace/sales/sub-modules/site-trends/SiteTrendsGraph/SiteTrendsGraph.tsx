import React from "react";
import ResponsiveChart from "components/Chart/src/ResponsiveChart";
import { SalesRightBarWithHoverEvents } from "components/Chart/src/components/SalesRightBarWithHoverEvents.tsx";
import { StyledGraphWrapper } from "pages/workspace/sales/sub-modules/site-trends/SiteTrendsGraph/styles";
import SiteTrendsGraphHeader from "./SiteTrendsGraphHeader";
import { Trend } from "../types";
import siteTrendsGraphHelper from "../services/siteTrendsGraphHelper";
import { offsetMonth } from "../constants";
import { setGraphData } from "../helpers";

type SiteTrendsGraphProps = {
    unites?: string;
    data: Trend[];
};

const SiteTrendsGraph: React.FC<SiteTrendsGraphProps> = (props) => {
    const { data, unites } = props;

    if (!data) {
        return null;
    }
    const type = "area";
    const graphData = setGraphData(data);

    const config = React.useMemo(() => {
        return siteTrendsGraphHelper.getConfig(
            new Date(data[data.length - offsetMonth].date).getTime(),
            unites,
        );
    }, [data]);

    const endDate = React.useMemo(() => data[data.length - 1].date, [data]);

    return (
        <StyledGraphWrapper data-automation="sidebar-graph">
            <SalesRightBarWithHoverEvents type={type} config={config}>
                {({ config, selectedPointIndex, afterRender }) => (
                    <>
                        <SiteTrendsGraphHeader
                            unites={unites}
                            currentData={
                                data[selectedPointIndex] || data[data.length - offsetMonth]
                            }
                            endDate={endDate}
                        />
                        <ResponsiveChart
                            type={type}
                            config={config}
                            data={graphData}
                            afterRender={afterRender}
                        />
                    </>
                )}
            </SalesRightBarWithHoverEvents>
        </StyledGraphWrapper>
    );
};

export default React.memo(SiteTrendsGraph);
