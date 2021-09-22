import { colorsPalettes, colorsSets } from "@similarweb/styles";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import Chart from "../../../components/Chart/src/Chart";
import { getChartConfig } from "../../conversion/components/benchmarkOvertime/SitesVsCategorylineChart";
import { dateToUTC } from "../../conversion/components/benchmarkOvertime/chartDataProcessor";
import {
    Bullet,
    ChartContainer,
    LegendsContainer,
    LegendTitle,
} from "../../conversion/components/benchmarkOvertime/StyledComponents";
import { GraphWithTabs, IGraphWithTabsProps } from "./graphWithTabs";

export interface IIndustryAnalysisGeographyGraphWithTabsProps extends IGraphWithTabsProps {
    countryTextByIdFilter: () => (val, na?: any) => string;
}

export class IndustryAnalysisGeographyGraphWithTabs extends React.PureComponent<
    IIndustryAnalysisGeographyGraphWithTabsProps,
    any
> {
    constructor(props) {
        super(props);
    }

    @autobind
    public renderChart(selectedTab, filteredChartData, selectedRows) {
        const { rowSelectionProp, countryTextByIdFilter } = this.props;
        const chart = this.props.renderChart ? (
            this.props.renderChart(selectedTab, filteredChartData, selectedRows)
        ) : (
            <ChartContainer>
                <Chart
                    type={"line"}
                    config={getChartConfig({
                        type: "line",
                        filter: selectedTab.filter,
                        data: undefined,
                        yAxisFilter: undefined,
                    })}
                    data={transformData(
                        filteredChartData,
                        selectedRows,
                        rowSelectionProp,
                        countryTextByIdFilter,
                    )}
                />
            </ChartContainer>
        );
        return chart;
    }

    @autobind
    public renderLegend(selectedChartData) {
        const { selectedRows, rowSelectionProp, countryTextByIdFilter } = this.props;
        return (
            <LegendsContainer>
                {selectedRows
                    ? _.map(_.sortBy(selectedRows, "CountryName"), (row) => {
                          return (
                              <LegendTitle key={row[rowSelectionProp]}>
                                  <Bullet color={row.selectionColor} />
                                  {countryTextByIdFilter()(row[rowSelectionProp])}
                              </LegendTitle>
                          );
                      })
                    : _.map(Object.keys(selectedChartData), (chartKey: string, index) => {
                          return (
                              <LegendTitle key={"t" + index}>
                                  <Bullet color={colorsSets.c.toArray()[index]} />
                                  {countryTextByIdFilter()(chartKey)}
                              </LegendTitle>
                          );
                      })}
            </LegendsContainer>
        );
    }

    public render() {
        return (
            <GraphWithTabs
                {...this.props}
                renderLegend={this.renderLegend}
                renderChart={this.renderChart}
            />
        );
    }
}

const transformData = (data, selectedRows, rowSelectionProp, countryTextByIdFilter) => {
    return _.map(Object.keys(data), (chartKey: string, index) => {
        return {
            name: countryTextByIdFilter()(chartKey),
            color: selectedRows
                ? _.result(
                      _.find(selectedRows, (row: any) => row[rowSelectionProp] == chartKey),
                      "selectionColor",
                  )
                : colorsSets.c.toArray()[index],
            marker: { symbol: "circle" },
            data: _.map(Object.keys(data[chartKey]), (datekey: string) => {
                if (!datekey) {
                    return;
                }
                let val = data[chartKey][datekey];
                if (isNaN(parseFloat(val))) {
                    val = null;
                }

                return { x: dateToUTC(datekey), y: data[chartKey][datekey] };
            }),
        };
    });
};
