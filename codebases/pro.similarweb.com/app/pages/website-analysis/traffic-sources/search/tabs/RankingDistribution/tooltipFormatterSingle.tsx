import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import {
    FORMAT_DATA,
    FORMAT_VISUAL,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import ReactDOMServer from "react-dom/server";
import { TooltipWrapper } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/StyledComponents";
import { RankingsDistributionTooltip } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionTooltip";
import { getSingleTierChange } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Utilities";

const i18n = i18nFilter();
const tooltipWidth = "296px";
const columnCount = 3;
const percentageFilter = percentageSignFilter();

const baseTooltipConfig = {
    width: tooltipWidth,
    columns: columnCount,
    tableHeaders: [
        { position: 0, displayName: i18n("common.tooltip.ranking") },
        { position: 1, displayName: i18n("common.tooltip.percent_of_total") },
        { position: 2, displayName: "" },
    ],
};

const getAbsoluteTotal = (data, category) => {
    const series = data[0].series.chart.series;
    const total = series.reduce((acc, t) => {
        const val = t.data.find((f) => f.category === category);
        return (acc += val ? val.y : -1);
    }, 0);
    return total >= 0 ? total : undefined;
};

export function rankingsDistributionTooltipFormatterSingle(isFiltered) {
    return function () {
        const { points, x: currentMonth } = this;
        const tooltipConfig = {
            ...baseTooltipConfig,
        };

        const previousMonth = dayjs(currentMonth, FORMAT_DATA)
            .subtract(1, "month")
            .format(FORMAT_DATA);
        tooltipConfig["header"] = dayjs(currentMonth, FORMAT_DATA).format(FORMAT_VISUAL);
        tooltipConfig.tableHeaders[2].displayName = i18n("common.tooltip.since", {
            date: dayjs(previousMonth, FORMAT_DATA).format(FORMAT_VISUAL),
        });
        // create the table rows
        tooltipConfig["tableRows"] = points.reduce((acc, p) => {
            const row = {
                color: p.color,
                displayName: p.series.userOptions.tooltipName,
                value: [percentageFilter(p.y, 2)],
                change: getSingleTierChange(p, previousMonth, percentageFilter),
            };
            acc.unshift(row);
            return acc;
        }, []);

        return ReactDOMServer.renderToString(
            <TooltipWrapper>
                <RankingsDistributionTooltip {...tooltipConfig} />
            </TooltipWrapper>,
        );
    };
}
