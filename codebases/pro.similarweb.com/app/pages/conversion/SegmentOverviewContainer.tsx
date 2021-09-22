import { Injector } from "common/ioc/Injector";
import { swSettings, SWSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import ConversionSegment from "pages/conversion/ConversionSegment/ConversionSegment";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { AssetsService } from "../../services/AssetsService";
import ConversionApiService from "../../services/conversion/conversionApiService";

class SegmentOverviewContainerComponent extends PureComponent<any, any> {
    public pageFilters: any;
    public swNavigator: any;
    public swSettings: SWSettings;
    public isCompare: boolean;
    public data: any;
    private readonly conversionApiService: any;
    private segmentsData: ISegmentsData;
    private graphData: any;
    private durationDataForWidget: string[];
    private scatterData: any;

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
        };
        this.swSettings = swSettings;
        this.conversionApiService = new ConversionApiService();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.pageFilters = this.swNavigator.getApiParams();
    }

    public async componentDidMount() {
        const { country, webSource = "Desktop", from, to, sid } = this.pageFilters;
        const { duration, comparedDuration } = this.swNavigator.getParams();
        const durationData = DurationService.getDurationData(
            duration,
            comparedDuration,
            this.swSettings.getCurrentComponent().componentId,
        );
        const { compareFrom, compareTo } = durationData.forAPI;
        let response;
        try {
            response = await Promise.all([
                this.conversionApiService.getWebsiteConversionGraph({
                    country,
                    webSource,
                    from,
                    to,
                    compareFrom,
                    compareTo,
                    sid,
                }),
                this.conversionApiService.getWebsiteConversionScatterChart({
                    country,
                    from,
                    to,
                    webSource,
                    sid,
                }),
            ]);
        } catch (e) {}
        this.graphData = response && response[0] && response[0].Data ? response[0] : {};
        this.scatterData = response && response[1] && response[1].Data ? response[1] : {};
        this.durationDataForWidget = _.isArray(durationData.forWidget)
            ? durationData.forWidget.reverse()
            : undefined;
        this.setState({ loading: false });
    }

    public homeRedirect = () => {
        this.swNavigator.go("proModules");
    };

    public render() {
        const { gid, sid, country } = this.pageFilters;
        const isSingleLob = _.get(
            this.props.segments,
            `["segments"]["${sid}"]["isSingleLob"]`,
            true,
        );
        const pageProps = {
            loading: this.state.loading,
            translate: i18nFilter(),
            track: allTrackers.trackEvent.bind(allTrackers),
            pageFilters: this.pageFilters,
            graphData: this.graphData,
            durationDataForWidget: this.durationDataForWidget,
            onGraphDDClick: (obj) => console.log("downloading graph " + obj.id),
            onScatterDDClick: (obj) => console.log("downloading scatter " + obj.id),
            scatterData: this.scatterData,
            getLink: this.swNavigator.href.bind(this.swNavigator),
            getAssetsUrl: AssetsService.assetUrl.bind(AssetsService),
            segmentsData: this.props.segments,
            isSingleLob,
        };

        const permissions = {
            HOOK: this.homeRedirect, // Should be a modal
            HIDDEN: this.homeRedirect,
            OPEN: () => <ConversionSegment {...pageProps} />,
        };

        return hasPermissions(
            permissions,
            this.swSettings.current.resources.AvaliabilityMode.toUpperCase(),
        )();
    }
}

export const hasPermissions = (permissions, permission) => {
    return permissions[permission];
};

function mapStateToProps({ conversionModule: { segments } }) {
    return {
        segments,
    };
}

export const SegmentOverviewContainer = SWReactRootComponent(
    connect(mapStateToProps, null)(SegmentOverviewContainerComponent),
    "SegmentOverviewContainer",
);
