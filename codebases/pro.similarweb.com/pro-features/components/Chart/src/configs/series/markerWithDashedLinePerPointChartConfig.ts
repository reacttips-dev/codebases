import { colorsPalettes } from "@similarweb/styles";
import * as _ from "lodash";

export default ({ data, color = colorsPalettes.blue[400], isDataSingleSeries = false }) => {
    const zones = data
        ? data.map((dataPoint) => {
              return {
                  value: _.get(dataPoint, "[0]", null),
                  dashStyle: _.get(dataPoint, "[2].partial", null) ? "Dash" : "solid",
                  confidenceLevel: _.get(dataPoint, "[2].confidenceLevel", null),
              };
          })
        : [];
    const dataWithMarkers = data
        ? data.map((dataPoint) => {
              const confidence = _.get(dataPoint, "[2].confidenceLevel", null);
              return {
                  y: confidence > 0 && confidence < 1 ? dataPoint[1] : null,
                  x: dataPoint[0],
                  confidence,
                  marker: {
                      fillColor: _.get(dataPoint, "[2].hallowMarker", null) ? "#FFFFFF" : null,
                      lineWidth: _.get(dataPoint, "[2].hallowMarker", null) ? 2 : 0,
                      symbol: "circle",
                      lineColor: color,
                      states: {
                          hover: {
                              radius: 5,
                              lineColor: color,
                          },
                      },
                  },
              };
          })
        : [];
    const singleSeriesData = {
        data: dataWithMarkers,
        zoneAxis: "x",
        zones,
    };
    return isDataSingleSeries
        ? singleSeriesData
        : {
              series: [singleSeriesData],
          };
};
