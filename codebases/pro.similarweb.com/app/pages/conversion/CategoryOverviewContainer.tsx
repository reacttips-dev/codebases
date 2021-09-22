import { Injector } from "common/ioc/Injector";
import { swSettings, SWSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import { allTrackers } from "services/track/track";
import { CategoryOverview } from "../../../.pro-features/pages/conversion/CategoryOverview";
import { AssetsService } from "../../services/AssetsService";
import ConversionApiService from "../../services/conversion/conversionApiService";
import CategoryConversionTableContainer from "./conversionTableContainer/CategoryConversionTableContainer";

export interface IIndustryItemData {
    domain: string;
    favicon: string;
    singleLob: boolean;
}

export interface ICategoryOverviewContainerProps {
    segments: ISegmentsData;
    selectedRows: any;
}

export interface ICategoryOverviewContainerState {
    loading: boolean;
    graphData: any;
    scatterData: any;
    tableData: any;
}

class CategoryOverviewContainer extends React.Component<
    ICategoryOverviewContainerProps,
    ICategoryOverviewContainerState
> {
    public swNavigator: any;
    public swSettings: SWSettings;
    public isCompare: boolean;
    public data: any;
    private readonly conversionApiService: any;

    constructor(props, context) {
        super(props, context);
        this.swSettings = swSettings;
        this.conversionApiService = new ConversionApiService();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.state = {
            loading: true,
            graphData: null,
            tableData: null,
            scatterData: null,
        };
    }

    public async componentDidMount() {
        const { country, webSource = "Desktop", gid, from, to } = this.swNavigator.getApiParams();
        let response;
        try {
            response = await Promise.all([
                this.conversionApiService.getCategoryConversionGraph({
                    country,
                    webSource,
                    from,
                    to,
                    gid,
                }),
                this.conversionApiService.getCategoryConversionScatterChart({
                    country,
                    from,
                    to,
                    webSource,
                    gid,
                }),
                this.conversionApiService.getCategoryConversionTable({
                    country,
                    from,
                    to,
                    webSource,
                    gid,
                }),
            ]);
        } catch (e) {}

        this.setState({
            graphData: response && response[0] && response[0].Data ? response[0] : {},
            scatterData: response && response[1] && response[1].Data ? response[1] : {},
            tableData: response && response[2] && response[2].Data ? response[2] : {},
            loading: false,
        });
    }

    public homeRedirect = () => {
        this.swNavigator.go("proModules");
    };

    public render() {
        const pageFilters = this.swNavigator.getApiParams();
        const { gid, country, from, to, webSource = "Desktop" } = pageFilters;
        const pageProps = {
            loading: this.state.loading,
            translate: i18nFilter(),
            track: allTrackers.trackEvent.bind(allTrackers),
            components: { CategoryConversionTableContainer },
            pageFilters,
            segmentsData: this.props.segments,
            selectedRows: this.props.selectedRows,
            graphData: this.state.graphData,
            onGraphDDClick: (obj) => console.log("downloading graph " + obj.id),
            onScatterDDClick: (obj) => console.log("downloading scatter " + obj.id),
            tableExcelLink: this.conversionApiService.getCategoryConversionExcel({
                gid,
                country,
                from,
                to,
                webSource,
            }),
            scatterData: this.state.scatterData,
            tableData: this.state.tableData,
            getLink: this.swNavigator.href.bind(this.swNavigator),
            getAssetsUrl: AssetsService.assetUrl.bind(AssetsService),
        };

        const permissions = {
            HOOK: this.homeRedirect, // Should be a modal
            HIDDEN: this.homeRedirect,
            OPEN: () => <CategoryOverview {...pageProps} />,
        };

        return hasPermissions(
            permissions,
            this.swSettings.current.resources.AvaliabilityMode.toUpperCase(),
        )();
    }
}

function mapStateToProps({
    tableSelection: { CategoryConversionTable },
    routing: {
        params: { industry },
    },
    conversionModule: { segments },
}) {
    return {
        selectedRows: CategoryConversionTable,
        industry,
        segments,
    };
}

SWReactRootComponent(
    connect(mapStateToProps, null)(CategoryOverviewContainer),
    "CategoryOverviewContainer",
);

export default CategoryOverviewContainer;

export const hasPermissions = (permissions, permission) => {
    return permissions[permission];
};
