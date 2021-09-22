import { OTHERS_DOMAIN_NAME } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import { TooltipContainer } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import React from "react";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips/src/ChangeTooltip";
import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";

interface IChartTooltipProps {
    yFormatter: ({ value }: { value: any }) => any;
    timeGranularity: string;
    lastSupportedDate: string;
    points: Array<{ series: { name: string }; y: number }>;
    point?: { name: string };
    othersDomainPointPosition?: "top" | "bottom";
    shouldSkipSorting?: boolean;
}

export const ChartTooltip = (props: IChartTooltipProps) => {
    const {
        yFormatter,
        timeGranularity,
        lastSupportedDate,
        points: pointsArgs,
        point,
        shouldSkipSorting = false,
        othersDomainPointPosition = "bottom",
    } = props;
    const filteredPoints = pointsArgs.filter(({ series }) => series.name !== OTHERS_DOMAIN_NAME);

    let points = shouldSkipSorting
        ? filteredPoints
        : shuffle(filteredPoints).sort(({ y: y1 }, { y: y2 }) => {
              return y1 < y2 ? 1 : -1;
          });

    const others = pointsArgs.find(({ series }) => series.name === OTHERS_DOMAIN_NAME);
    if (others) {
        points = othersDomainPointPosition === "top" ? [others, ...points] : [...points, others];
    }
    const changeTooltipProp = ({ y, series }) => ({
        value: yFormatter({ value: y }),
        color: series.color,
        displayName: series.name,
        isBold: point?.name === series.name,
    });
    const changeTooltipProps = {
        header: getTooltipHeader(timeGranularity, points, lastSupportedDate),
        tableHeaders: [
            { position: 0, displayName: "Domain" },
            { position: 1, displayName: "Traffic share" },
        ],
        tableRows: points.map(changeTooltipProp),
        showChangeColumn: false,
    };
    return (
        <TooltipContainer>
            <ChangeTooltip {...changeTooltipProps} />
        </TooltipContainer>
    );
};
