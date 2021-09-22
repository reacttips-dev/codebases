import dayjs from "dayjs";
import * as numeral from "numeral";
import * as React from "react";
import { FC } from "react";
import PointInfoVertical from "../../../../../../components/Chart/src/components/point info/PointInfo";
import PointValueAndChange from "../../../../../../components/Chart/src/components/PointValueAndChange";
import { WithHoverEvents } from "../../../../../../components/Chart/src/components/WithHoverEvents";
import ResponsiveChart from "../../../../../../components/Chart/src/ResponsiveChart";
import WithTranslation from "../../../../../../components/WithTranslation/src/WithTranslation";
import {
    CenterInfo,
    ChartAndInfo,
    NoChange,
} from "../../../../../../styled components/StyledGraphWithInfo/StyledComponents";
import { getChange, getVsText } from "../../../../../../utils";
import Footer from "../../../common components/Footer";
import Header from "../../../common components/Header";
import WithAllContexts from "../../../common components/WithAllContexts";
import EmptyDownloadsSection from "./EmptyDownloadsSection";
import graphConfig from "./graphConfig";
import LoadingDownloadsSection from "./LoadingDownloadsSection";
import { DownloadsContainer } from "./StyledComponents";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

function toHighchartsData(data) {
    return [{ data: data.map((item) => [new Date(item.key).getTime(), item.value]) }];
}

const graphWithInfo = (origData, data) => ({ config, selectedPointIndex, type, afterRender }) => {
    const currPoint = data[0].data[selectedPointIndex];
    return (
        <WithTranslation>
            {(translate) => {
                const title = `${translate("app.performance.downloads.title")}, ${dayjs(
                    currPoint[0],
                ).format("MMM YYYY")}`;
                const change = getChange(
                    origData[selectedPointIndex].value,
                    origData[selectedPointIndex + 1].value,
                );
                const formattedChange = change
                    ? numeral(Math.abs(change) / 100)
                          .format("0[.]00a%")
                          .toUpperCase()
                    : () => <NoChange>-</NoChange>;
                return (
                    <ChartAndInfo>
                        <ResponsiveChart
                            type={type}
                            config={config}
                            data={data}
                            afterRender={afterRender}
                        />
                        <CenterInfo>
                            <PointInfoVertical
                                title={title}
                                tooltip={translate("app.performance.downloads.tooltip.point")}
                            >
                                <PointValueAndChange
                                    value={numeral(currPoint[1]).format("0[.]0a").toUpperCase()}
                                    change={formattedChange}
                                    changeSubtitle={getVsText("Monthly", translate)}
                                    isDecrease={change < 0}
                                />
                            </PointInfoVertical>
                        </CenterInfo>
                    </ChartAndInfo>
                );
            }}
        </WithTranslation>
    );
};

const DownloadsSection: FC<any> = ({ loading, data }) => {
    if (loading) {
        return <LoadingDownloadsSection />;
    }
    if (!data || !data.length) {
        return <EmptyDownloadsSection />;
    }
    return (
        <WithAllContexts>
            {({ translate, track, getLink, filters, swNavigator }) => {
                const state = isSalesIntelligenceAppsState(swNavigator)
                    ? "salesIntelligence-apps-engagementoverview"
                    : "apps-engagementoverview";

                const type = "area";
                const chartData: any = toHighchartsData(data.slice(1));
                const config = graphConfig({ type });
                const trackLearnMore = () =>
                    track("internal link", "click", `downloads/app engagement overview/learn more`);
                const subtitleFilters = [
                    {
                        filter: "date",
                        value: filters.downloadsDuration,
                    },
                    {
                        filter: "country",
                        countryCode: filters.country,
                        value: filters.countryName,
                    },
                ];
                return (
                    <DownloadsContainer data-automation-downloads-container={true}>
                        <Header
                            title={translate("app.performance.downloads.title")}
                            tooltip={translate("app.performance.downloads.tooltip")}
                            subtitleFilters={subtitleFilters}
                        />
                        <WithHoverEvents
                            type={type}
                            config={config}
                            initialSelectedPoint={chartData[0].data.length - 1}
                        >
                            {graphWithInfo(data, chartData)}
                        </WithHoverEvents>
                        <Footer
                            text={translate("app.performance.downloadsection.learnmore")}
                            href={getLink(state, {
                                appId: `${filters.store.toLowerCase() === "google" ? "0" : "1"}_${
                                    filters.appsInfo[0].id
                                }`,
                                country: filters.country,
                                duration: "3m",
                                tab: "Downloads",
                                dataMode: "Number",
                            })}
                            onClick={trackLearnMore}
                        />
                    </DownloadsContainer>
                );
            }}
        </WithAllContexts>
    );
};
DownloadsSection.displayName = "DownloadsSection";
export default DownloadsSection;
