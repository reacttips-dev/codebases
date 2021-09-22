import * as HighcharttInner from "highcharts";
import * as ReactHighchartsInner from "react-highcharts";
import * as ReactHighmapsInner from "react-highcharts/ReactHighmaps";

export const ReactHighcharts = ReactHighchartsInner.withHighcharts(HighcharttInner);
export const Highcharts = HighcharttInner;
export const ReactHighmaps = ReactHighmapsInner.withHighcharts(Highcharts);

// this is only required by highcharts-ng and will be removed!
// never read Highcharts from the window
window["Highcharts"] = Highcharts;

require("highcharts/highcharts-more")(Highcharts);

require("highcharts/modules/exporting")(Highcharts);

require("highcharts/modules/map")(Highcharts);

require("highcharts/modules/no-data-to-display")(Highcharts);

require("highcharts/modules/pattern-fill")(Highcharts);

require("highcharts/modules/venn")(Highcharts);

require("highcharts/modules/annotations")(Highcharts);

/**
 * Fix $.highcharts() broken when Highmaps is initialized
 * Register Highcharts as a plugin in jQuery
 */
if (window["jQuery"]) {
    window["jQuery"].fn.highcharts = function () {
        if (this[0]) {
            // this[0] is the renderTo div

            // When called without parameters or with the return argument,
            // return an existing chart
            return Highcharts.charts[this.attr("data-highcharts-chart")];
        }
    };
}
