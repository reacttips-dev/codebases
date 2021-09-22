import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { FC } from "react";
import styled from "styled-components";
import { TrendsBar } from "../../../../.pro-features/components/TrendsBar/src/TrendsBar";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";

interface IWebsiteAnalysisTrendsBarProps {
    data: Array<{ Key: string; Value: number }>;
    barsLimit?: number;
    inverted?: boolean;
    rowName: string;
}

const dateFormat = (date) => dayjs(date).format("MMM, YYYY");
const Container = styled.div`
    height: 20px;
`;

const WebsiteAnalysisTrendsBar: FC<IWebsiteAnalysisTrendsBarProps> = ({
    data,
    barsLimit,
    inverted,
    rowName,
}) => {
    const filter = Injector.get("$filter")("number");
    const dataWithTooltips = data.map((item) => {
        return {
            value: item.Value,
            tooltip: i18nFilter()(`wa.ao.ranks.trend.tooltip.${rowName}`, {
                date: dateFormat(item.Key),
                value: filter(item.Value),
            }),
        };
    });
    return (
        <Container>
            <TrendsBar values={dataWithTooltips} barsLimit={barsLimit} inverted={inverted} />
        </Container>
    );
};

export default SWReactRootComponent(WebsiteAnalysisTrendsBar, "WebsiteAnalysisTrendsBar");
