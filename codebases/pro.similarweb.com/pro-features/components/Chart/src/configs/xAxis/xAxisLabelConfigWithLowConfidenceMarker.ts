import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";

export default ({ data, xAxisFormatter }) => {
    const plotLines = data
        ? data.map((dataPoint, index) => {
              const confLevel = _.get(dataPoint, "[2].confidenceLevel", null);
              if (confLevel !== 0 && confLevel < 1) {
                  return {};
              }
              return {
                  color: null,
                  width: 0,
                  dashStyle: "Dash",
                  value: _.get(dataPoint, "[0]", null),
                  id: "",
                  className: "segments-low-confidence",
                  left: 11,
                  label: {
                      text: `<div class="segments-low-confidence-marker">
                        <div id="custom-tooltip" class="PlainTooltip-element top ${
                            index === 0 ? "first" : index === data.length - 1 ? "last" : ""
                        }">
                            <div class="Popup-content PlainTooltip-content">
                                <div style="white-space: nowrap">${i18nFilter()(
                                    "segments.low.confidence.message.text",
                                )}</div>
                            </div>
                        </div>
                    </div>`,
                      useHTML: true,
                      x: -8,
                      y: 225,
                      rotation: 0,
                  },
              };
          })
        : [];
    return {
        xAxis: {
            labels: {
                formatter: function () {
                    return xAxisFormatter(this);
                },
            },
            plotLines,
        },
    };
};
