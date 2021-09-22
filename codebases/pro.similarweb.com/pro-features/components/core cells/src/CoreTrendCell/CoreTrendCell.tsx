import { colorsPalettes } from "@similarweb/styles";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import Chart from "../../../Chart/src/Chart";
import combineConfigs from "../../../Chart/src/combineConfigs";
import noAnimationConfig from "../../../Chart/src/configs/animation/noAnimationConfig";
import gradientConfig from "../../../Chart/src/configs/gradient/gradientConfig";
import noMarginConfig from "../../../Chart/src/configs/margin/noMarginConfig";
import noMarkerConfig from "../../../Chart/src/configs/marker/noMarkerConfig";
import trendConfig from "../../../Chart/src/configs/trendConfig";
import noXAxisConfig from "../../../Chart/src/configs/xAxis/noXAxisConfig";

const CoreTrendCell: StatelessComponent<ICoreTrendCellProps> = ({ data, config, params }) => {
    const type = "area";
    const gradientParams = {
        stop1Color: "rgb(233, 241, 253)",
        stop2Color: "rgba(233, 241, 253, 0.2)",
        fillColor: colorsPalettes.blue["400"],
    };
    const backgroundConfig = {
        chart: {
            backgroundColor: "transparent",
        },
    };
    const configObj = combineConfigs({ type, ...gradientParams, ...params }, [
        trendConfig,
        gradientConfig,
        noXAxisConfig,
        noMarkerConfig,
        noMarginConfig,
        noAnimationConfig,
        backgroundConfig,
        config,
    ]);
    return <Chart type={type} data={data} config={configObj} />;
};
CoreTrendCell.displayName = "CoreTrendCell";

CoreTrendCell.propTypes = {
    data: PropTypes.array.isRequired,
    config: PropTypes.object,
    params: PropTypes.object,
};

interface ICoreTrendCellProps {
    data: any[];
    config?: object;
    params?: object;
}

export default CoreTrendCell;
