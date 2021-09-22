import * as _ from "lodash";
import * as numeral from "numeral";
import { stringify } from "querystring";
import * as React from "react";
import Chart from "../../../.pro-features/components/Chart/src/Chart";
import { GraphLoader } from "../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { CHART_COLORS } from "../../constants/ChartColors";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { DefaultFetchService } from "../../services/fetchService";
import { SneakpeekApiService } from "pages/sneakpeek/SneakpeekApiService";

@SWReactRootComponent
export default class SneakpeekPieChart extends React.PureComponent<any, any> {
    private fetchService;
    private swNavigator;
    private rawData;

    constructor(props) {
        super(props);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.fetchService = DefaultFetchService.getInstance();
        this.state = {
            loading: true,
        };
    }

    public componentDidMount() {
        this.fetchData();
    }

    public render() {
        const finalData = this.getData();

        return (
            <div>
                {this.state.loading && <GraphLoader width={"100%"} height={"232px"} />}
                {!this.state.loading && finalData && (
                    <Chart type="column" data={finalData} config={this.getChartConfig()} />
                )}
            </div>
        );
    }

    public fetchData = async () => {
        const setLoadingFalse = () => this.setState({ loading: false });
        let response;
        const { dynamicParams, params, queryId } = this.props;
        const apiParams = this.swNavigator.getApiParams();
        try {
            response = await SneakpeekApiService.ExecuteQuery(
                {
                    ...apiParams,
                    queryId,
                    ...params,
                    includeSubDomains: params.isWWW === "*",
                },
                { dynamicParams },
            );
        } catch (e) {
            setLoadingFalse();
        }
        this.rawData = response;
        setLoadingFalse();
    };

    public getData = () => {
        if (this.state.loading) {
            return;
        } else {
            return this.toHighchartsData(this.rawData);
        }
    };

    public getChartConfig = () => {
        if (!this.rawData) {
            return {};
        }

        const isPercentage = this.isPercentsGraph(this.rawData);

        const yAxisFormatter = isPercentage
            ? ({ value }) => numeral(value).format("0%").toUpperCase()
            : ({ value }) => numeral(value).format("0[.]0a").toUpperCase();
        const entries = Object.entries(this.rawData.Data.Data);
        const order = Object.keys(entries[0][1]); // extract columns names

        return {
            xAxis: {
                categories: order,
            },
            yAxis: {
                labels: {
                    formatter: yAxisFormatter,
                },
            },
            tooltip: {
                pointFormatter() {
                    const pointFormat = (value) =>
                        isPercentage
                            ? numeral(value).format("0%").toUpperCase()
                            : numeral(value).format("0[.]0a").toUpperCase();
                    return `<span style="color:${this.color}; font-family: Roboto;">\u25CF </span>${
                        this.series.name
                    }: <span style="font-weight: bold;color:${this.color};">${pointFormat(
                        this.y,
                    )}</span><br/>`;
                },
            },
        };
    };

    public isPercentsGraph = (rawData) => {
        if (!rawData) {
            return [];
        }
        const entries = Object.entries<number[]>(rawData.Data.Data);

        return _.every(entries[0][1], (val) => {
            return val === null || (val >= 0 && val <= 1);
        });
    };

    public toHighchartsData = (rawData) => {
        if (!rawData || !rawData.Data) {
            return [];
        }
        const entries = Object.entries(rawData.Data.Data);
        const order = Object.keys(entries[0][1]); // extract columns names

        return entries.map((item, index) => ({
            name: item[0],
            color: CHART_COLORS.chartMainColors[index],
            data: order.map((subItem) => item[1][subItem]),
        }));
    };
}
