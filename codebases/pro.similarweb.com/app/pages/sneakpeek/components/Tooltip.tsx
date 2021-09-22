import { bigNumberCommaFilter, percentageSignFilter } from "filters/ngFilters";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import {
    Bullet,
    GraphTooltipSeriesName,
    GraphTooltipSeriesValue,
    GraphTooltipTitle,
    Separator,
} from "pages/sneakpeek/StyledComponents";
import dayjs from "dayjs";

const titleFormat = "MMM YYYY";

export const SneakpeekTooltip = ({ pointsData, isPercent }) => {
    const { points, x } = pointsData;
    const valueFilter = isPercent ? percentageSignFilter() : bigNumberCommaFilter();
    return (
        <FlexColumn alignItems={"flex-start"} style={{ padding: "8px" }}>
            <GraphTooltipTitle>{dayjs.utc(x).utc().format(titleFormat)}</GraphTooltipTitle>
            <Separator />
            {points.map((p) => (
                <FlexRow
                    key={p.series.name}
                    alignItems={"center"}
                    style={{ marginBottom: "8px", width: "100%" }}
                >
                    <FlexRow alignItems={"center"} style={{ flexGrow: 1 }}>
                        <Bullet color={p.color} />
                        <GraphTooltipSeriesName>{p.series.name}</GraphTooltipSeriesName>
                    </FlexRow>
                    <GraphTooltipSeriesValue>
                        {isPercent ? valueFilter(p.y, 2) : valueFilter(p.y)}
                    </GraphTooltipSeriesValue>
                </FlexRow>
            ))}
        </FlexColumn>
    );
};
