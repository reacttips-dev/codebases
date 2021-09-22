import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { FORMAT_VISUAL } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import ReactDOMServer from "react-dom/server";
import { TooltipWrapper } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/StyledComponents";
import { RankingsDistributionTooltip } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionTooltip";
import { getSingleTierChange } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Utilities";

const i18n = i18nFilter();
const tooltipWidth = "420px";
const columnCount = 3;
const percentageFilter = percentageSignFilter();

const baseTooltipConfig = {
    width: tooltipWidth,
    columns: columnCount,
    tableHeaders: [
        { position: 0, displayName: i18n("common.tooltip.domain") },
        { position: 1, displayName: i18n("common.tooltip.percent_of_keywords") },
        { position: 2, displayName: "" },
    ],
};

export function rankingsDistributionTooltipFormatterCompare(tier) {
    return function () {
        const { points, x: currentMonthTimestamp } = this;
        const tooltipConfig = {
            ...baseTooltipConfig,
        };

        const previousMonthTimestamp = dayjs
            .utc(currentMonthTimestamp)
            .subtract(1, "month")
            .valueOf();

        tooltipConfig["header"] = i18n("ranking.distribution.compare.graph.tooltip.header", {
            position: tier,
            date: dayjs.utc(currentMonthTimestamp).format(FORMAT_VISUAL),
        });
        tooltipConfig.tableHeaders[2].displayName = i18n("common.tooltip.since", {
            date: dayjs.utc(previousMonthTimestamp).format(FORMAT_VISUAL),
        });
        // create the table rows
        tooltipConfig["tableRows"] = points.reduce((acc, p) => {
            const row = {
                color: p.color,
                displayName: p.series.name,
                value: [percentageFilter(p.y, 2)],
                change: getSingleTierChange(p, previousMonthTimestamp, percentageFilter),
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
