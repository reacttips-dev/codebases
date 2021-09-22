import { percentageFilter } from "filters/ngFilters";
import { OTHERS_DOMAIN_NAME } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";

export const visibleFilter = ({ visible }) => Boolean(visible);

export const parsePieData = (
    graphData: { name: string; color: string; data: { y: number }[]; visible: boolean }[],
) =>
    graphData.map(({ data, name, color, visible }) => ({
        name,
        color,
        visible,
        className: name,
        y: data[0]?.y,
    }));

export const getEnrichedLegendItems = (chartData, legends) => {
    const sitesData = chartData.reduce((res, { name, y }) => ({ ...res, [name]: y }), {});
    return sortLegends(
        legends.map((legend) => ({
            ...legend,
            y: sitesData[legend.name],
            data: legend.visible && percentageFilter()(sitesData[legend.name] || 0, 2) + "%",
        })),
    );
};

const sortLegends = (legends) => {
    const sortedLegends = legends
        .filter(({ name }) => name !== OTHERS_DOMAIN_NAME)
        .sort(({ y: y1 }, { y: y2 }) => (y1 < y2 ? 1 : -1));
    const others = legends.find(({ name }) => name === OTHERS_DOMAIN_NAME);
    return others ? [...sortedLegends, others] : sortedLegends;
};
