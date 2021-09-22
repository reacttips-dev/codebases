import dayjs from "dayjs";
import ReactDOMServer from "react-dom/server";
import { TrafficOverTimeChartToolTip } from "pages/website-analysis/incoming-traffic/StyledComponents";
import {
    CommonChangeOverTimeChartTooltipContent,
    getChange,
} from "pages/website-analysis/incoming-traffic/commonOverTime";
import { pureNumberFilter } from "filters/numberFilter";

export default {
    tooltip: {
        formatter() {
            const currentIndex = this.series.data.findIndex((p) => p.index === this.point.index);
            const isFirstItem = currentIndex === this.series.data.length - 1;
            const prevPoint = !isFirstItem && this.series.data[currentIndex + 1];
            const change = getChange(prevPoint.y, this.y);
            const dateForTitle = dayjs.utc(this.x).utc().format("MMM YYYY");

            return ReactDOMServer.renderToString(
                <TrafficOverTimeChartToolTip>
                    <strong>Search Volume - {dateForTitle}</strong>
                    <CommonChangeOverTimeChartTooltipContent
                        valueFormatted={pureNumberFilter(this.y)}
                        isFirstItem={isFirstItem}
                        change={change}
                        showNoChangeSymbol
                    />
                </TrafficOverTimeChartToolTip>,
            );
        },
    },
};
