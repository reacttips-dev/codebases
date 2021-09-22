import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import OutgoingPaidTrafficChart from "./OutgoingPaidTrafficChart";
import { PureComponent } from "react";
import { DownloadButtonMenu } from "../../../components/React/DownloadButtonMenu/DownloadButtonMenu";
import styled from "styled-components";
import {
    IOutgoingPaidTrafficProps,
    IOutgoingPaidTrafficChartSiteData,
    IOutgoingPaidTrafficCompareData,
    IOutgoingPaidTrafficSingleData,
} from "./OutgoingPaidTrafficTypes";
import SWReactComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { PngExportService } from "services/PngExportService";
import { formatDatesRangeString } from "./chartData";
import { NoData } from "components/NoData/src/NoData";

// Set the components wrapper to be a with a relative positioning
// and use absolute position to move the export PNG button to the
// chart's title. the reason we're using this method is that the
// chart's top is a different component (angularJS component)
const StyledOutgoingPaidTrafficContainer = styled.div`
    position: relative;
    .export-buttons-wrapper {
        position: absolute;
        top: -49px;
        right: 50px;
    }
`;

class OutgoingPaidTraffic extends PureComponent<IOutgoingPaidTrafficProps> {
    /**
     * Holds a reference to the underlying rendered chart. used by the PNG exporter service
     * for exporting images of the chart upon user requests.
     */
    private chartReference;

    /**
     * Holds a reference to the underlying chart data. used by the PNG exporter service
     * for exporting the chart's dates ranges.
     */
    private chartData: IOutgoingPaidTrafficChartSiteData[];

    public render() {
        // Adapt the data, and filter out any sites that have missing information
        const adaptedChartData = this.adaptChartData();
        this.chartData = this.filterValidChartData(adaptedChartData);

        // Render the chart only if it has SOME valid site data
        const chartComponent =
            this.chartData.length > 0 ? this.renderChartComponent() : this.renderNoDataComponent();

        return chartComponent;
    }

    private renderChartComponent = (): JSX.Element => {
        const { isCompareMode } = this.props;

        return (
            <StyledOutgoingPaidTrafficContainer>
                <DownloadButtonMenu exportFunction={this.handleOnExport} PNG={true} />
                <OutgoingPaidTrafficChart
                    isCompareMode={isCompareMode}
                    data={this.chartData}
                    afterRender={this.setChartReference}
                />
            </StyledOutgoingPaidTrafficContainer>
        );
    };

    private renderNoDataComponent = (): JSX.Element => {
        return <NoData subtitle="" />;
    };

    /**
     * Converts the provided traffic data into an array of site traffic data that is digestible
     * by the OutgoingPaidTrafficChart componemnt
     */
    private adaptChartData = (): IOutgoingPaidTrafficChartSiteData[] => {
        const { isCompareMode, trafficData } = this.props;

        const chartData = isCompareMode
            ? this.adaptToCompareMode(trafficData as IOutgoingPaidTrafficCompareData)
            : this.adaptToSingleMode(trafficData as IOutgoingPaidTrafficSingleData);

        return chartData;
    };

    /**
     * Process the traffic data for a single website (single chosen item)
     * used when viewing traffic data for a single website
     */
    private adaptToSingleMode = (
        data: IOutgoingPaidTrafficSingleData,
    ): IOutgoingPaidTrafficChartSiteData[] => {
        // Since we're processing the data in single mode
        // we know at this point that the chosen items prop
        // has a single item in it.
        const {
            chosenItems: [site],
        } = this.props;

        const siteData = {
            data: data?.data ?? [],
            dates: data?.dates ?? [],
            siteName: site?.displayName,
            siteColor: site?.color,
        };

        return [siteData];
    };

    /**
     * Process the traffic data for multiple websites (multiple chosen items)
     * used when viewing traffic data in compare mode.
     */
    private adaptToCompareMode = (
        data: IOutgoingPaidTrafficCompareData,
    ): IOutgoingPaidTrafficChartSiteData[] => {
        const { chosenItems } = this.props;

        const sitesData = data.data.map((site) => {
            const siteData = chosenItems?.find((x) => x.displayName === site.displayName);

            return {
                data: site?.data ?? [],
                dates: site?.dates ?? [],
                siteName: siteData?.displayName,
                siteColor: siteData?.color,
            };
        });

        return sitesData;
    };

    /**
     * Filters out any sites that have missing or invalid data. we don't want to display sites that
     * have no data whatsoever.
     */
    private filterValidChartData = (
        chartData: IOutgoingPaidTrafficChartSiteData[],
    ): IOutgoingPaidTrafficChartSiteData[] => {
        const validSites = chartData.filter((site) => {
            const hasValidData = site.data.length > 0 && site.dates.length > 0;
            const hasValidDisplayData = !!site.siteColor && !!site.siteName;
            return hasValidData && hasValidDisplayData;
        });

        return validSites;
    };

    private setChartReference = (chart) => {
        this.chartReference = chart;
        // Return some object, since the Chart's
        // afterRender callback expects a return value
        return {};
    };

    private handleOnExport = () => {
        if (!this.chartReference) {
            return;
        }

        // We want to add the dates range as the file name. For that we pick one of the websites
        // and take its dates range. since the chart covers data for the same dates on all chosen items
        // it's enough to pick one of the chosen items' and inspect its dates.
        const chartDates = this.chartData[0].dates;
        const exportTitle = `Outgoing Ads Chart ${formatDatesRangeString(chartDates)}`;
        Injector.get<PngExportService>("pngExportService").export(this.chartReference, exportTitle);
    };
}

const mapStateToProps = ({ routing: { chosenItems } }) => {
    return { chosenItems };
};

const connectedOutgoingPaidTrafic = connect(mapStateToProps)(OutgoingPaidTraffic);
export default SWReactComponent(connectedOutgoingPaidTrafic, "OutgoingPaidTraffic");
