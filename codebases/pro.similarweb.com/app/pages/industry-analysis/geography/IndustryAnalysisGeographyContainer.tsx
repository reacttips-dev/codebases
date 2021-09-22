import { Injector } from "common/ioc/Injector";
import { swSettings, SWSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { countryTextByIdFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { IndustryAnalysisGeography } from "../../../../.pro-features/pages/industryAnalysis/geography/IndustryAnalysisGeography";
import { DefaultFetchService } from "../../../services/fetchService";
import { IndustryAnalysisGeographyTableContainer } from "./IndustryAnalysisGeographyTableContainer";
import _ from "lodash";
import { SwNavigator } from "common/services/swNavigator";
import categoryService from "common/services/categoryService";

type IndustryAnalysisApiParams = {
    webSource: string;
    includeSubDomains: boolean;
    category: string;
    from: string;
    to: string;
    isWindow: boolean;
    keys: string;
    timeGranularity: string;
    categoryDisplayApi: string;
};

class IndustryAnalysisGeographyContainer extends PureComponent<any, any> {
    public pageFilters: any;
    public swNavigator: SwNavigator;
    public swSettings: SWSettings;
    public isCompare: boolean;
    public data: any;
    private graphData: any;
    private durationDataForWidget: string[];
    private tableData: any;
    private fetchService: DefaultFetchService;
    private countryTextByIdFilter: () => (val, na?: any) => string;

    constructor(props, context) {
        super(props, context);
        this.swSettings = swSettings;
        this.countryTextByIdFilter = countryTextByIdFilter;
        this.fetchService = DefaultFetchService.getInstance();
        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
        this.pageFilters = this.swNavigator.getApiParams();
        this.state = {
            loading: true,
        };
    }

    public async componentDidMount() {
        let response;
        try {
            const apiParams = this.getApiParams();
            const apiQs = _.pick(apiParams, [
                "webSource",
                "keys",
                "from",
                "to",
                "isWindow",
                "includeSubDomains",
            ]);

            response = await Promise.all([
                this.fetchService.get("api/geographyCategory/graph", apiQs),
                this.fetchService.get("api/geographyCategory/table", apiQs),
            ]);
        } catch (e) {}

        this.graphData = response && response[0] ? response[0] : {};
        this.tableData = response && response[1] && response[1].Data ? response[1] : {};
        this.setState({ loading: false });
    }

    public render() {
        const pageProps = {
            loading: this.state.loading,
            translate: i18nFilter(),
            track: allTrackers.trackEvent.bind(allTrackers),
            countryTextByIdFilter: this.countryTextByIdFilter,
            pageFilters: this.pageFilters,
            graphData: this.graphData,
            tableData: transformTableData(this.tableData),
            durationDataForWidget: this.durationDataForWidget,
            getLink: this.swNavigator.href.bind(this.swNavigator),
            selectedRows: this.props.selectedRows,
            tableExcelUrl: this.generateTableExcelApiUrl(),
            components: { IndustryAnalysisGeographyTableContainer },
        };

        return <IndustryAnalysisGeography {...pageProps} />;
    }

    private getApiParams = (): IndustryAnalysisApiParams => {
        const {
            webSource = "Desktop",
            includeSubDomains = true,
            category,
            from,
            to,
        } = this.pageFilters;

        const { duration } = this.swNavigator.getParams();

        const durationData = DurationService.getDurationData(
            duration,
            this.swSettings.getCurrentComponent().componentId,
        );

        const isWindow = durationData.forAPI.isWindow;
        const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
        const { forApi: keys, forDisplayApi: categoryDisplayApi } = categoryObject;

        return {
            webSource,
            includeSubDomains,
            category,
            from,
            to,
            isWindow,
            keys,
            categoryDisplayApi,
            timeGranularity: "Monthly",
        };
    };

    private generateTableExcelApiUrl = () => {
        const params = this.getApiParams();
        const apiParams = { ...params, category: params.categoryDisplayApi };
        const qs = Object.keys(apiParams)
            .filter((key) => apiParams[key] !== undefined && apiParams[key] !== "")
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(apiParams[key])}`)
            .join("&");

        return `api/geographyCategory/excel?${qs}`;
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

function mapStateToProps({ tableSelection: { IndustryAnalysisGeoTable } }) {
    return {
        selectedRows: IndustryAnalysisGeoTable,
    };
}

function transformTableData(data) {
    if (!data || !data.Data) {
        return data;
    }
    return {
        Data: data.Data.map((tableItem) => {
            return { ...tableItem, CountryName: countryTextByIdFilter()(tableItem.Country) };
        }),
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(IndustryAnalysisGeographyContainer),
    "IndustryAnalysisGeographyContainer",
);

export default IndustryAnalysisGeographyContainer;
