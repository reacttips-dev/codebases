import { colorsPalettes, rgba } from "@similarweb/styles";

const HIGH_ZONE_COLOR = rgba(colorsPalettes.green[100], 0.2);
const LOW_ZONE_COLOR = rgba(colorsPalettes.red[100], 0.2);

export default (
    { minX, minY, maxX, maxY, midX, midY },
    { highZoneColor, lowZoneColor } = {
        highZoneColor: HIGH_ZONE_COLOR,
        lowZoneColor: LOW_ZONE_COLOR,
    },
) => ({}) => {
    const zones = [
        {
            type: "polygon",
            color: lowZoneColor,
            pointPlacement: "on",
            data: [
                [minX, minY],
                [midX, minY],
                [midX, midY],
                [minX, midY],
            ],
        },
        {
            type: "polygon",
            color: highZoneColor,
            pointPlacement: "on",
            data: [
                [midX, midY],
                [maxX, midY],
                [maxX, maxY],
                [midX, maxY],
            ],
        },
    ];

    return {
        plotOptions: {
            polygon: {
                showInLegend: false,
                showTooltip: false,
                enableMouseTracking: false,
            },
        },
        series: zones,
    };
};
