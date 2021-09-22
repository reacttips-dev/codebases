import { colorsPalettes } from "@similarweb/styles";

import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ChartLabelTooltip } from "components/React/ScatterChart/ChartLabelTooltip";
import { InfoTooltip } from "components/React/Tooltip/InfoTooltip/InfoTooltip";
import { i18nFilter } from "filters/ngFilters";
import { DropdownContainer } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { ConversionScatterChart } from "pages/conversion/components/ConversionScatterChart/ConversionScatterChart";
import React, { useState, forwardRef } from "react";
import ReactDOMServer from "react-dom/server";
import { AssetsService } from "services/AssetsService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { PngHeader } from "components/React/ScatterChart/PngHeader";
import {
    BenchMarkCheckbox,
    BenchmarkContainer,
    BenchmarkValuesContainer,
    ConversionScatterChartContainer,
    FiltersContainer,
    FlexBoxSpaceBetween,
    InfoContainer,
    Vs,
    Text,
} from "./Styled";

const benchmarkDefaultColor = colorsPalettes.blue[400];

const DisabledInfoTooltip: React.FunctionComponent<{ infoText: string; optionName: string }> = ({
    infoText,
    optionName,
}) => {
    return (
        <PlainTooltip tooltipContent={infoText}>
            <span>{optionName}</span>
        </PlainTooltip>
    );
};

const options = {
    efficiencyZones: false,
};

export const BasicScatterChart: React.FC<any> = forwardRef((props, chartRef: any) => {
    const {
        columns,
        chartData,
        getAverageForBenchmark,
        benchmarkInfoTooltipText,
        getMinValue,
        getMaxValue,
        disabledBenchmarkInfoText,
        benchmarkLabelText,
        aboveAvgText,
        belowAvgText,
        tooltipWidth,
        initialXAxisColumn,
        initialYAxisColumn,
        dropdownsWidth,
        showBenchmark,
        pngHeaderProps,
    } = props;
    const [xVertical, setXVertical] = useState(columns[initialXAxisColumn]);
    const [yVertical, setYVertical] = useState(columns[initialYAxisColumn]);
    const [isBenchmarkSelected, setIsBenchmarkSelected] = useState(false);
    const i18n = i18nFilter();
    const benchmarkLabel = i18n(benchmarkLabelText);
    const cursorUrl = AssetsService.assetUrl(`/images/scatter/dragtozoom_cursor@3x.svg`);

    const getIsDisabledBenchmark = (xVertical, yVertical) =>
        xVertical.disableBenchMark && yVertical.disableBenchMark;

    const getVerticalItems = (verticalName, verticalOtherId) => {
        return [
            <DropdownButton key={"vertical-button"} width={dropdownsWidth}>
                {verticalName}
            </DropdownButton>,
            ...columns.map((column) => (
                <EllipsisDropdownItem
                    disabled={column.id === verticalOtherId}
                    key={column.id}
                    id={column.id}
                >
                    {column.id === verticalOtherId ? (
                        <DisabledInfoTooltip
                            infoText={`Unable to choose ${column.name} in both categories`}
                            optionName={column.name}
                        />
                    ) : (
                        column.name
                    )}
                </EllipsisDropdownItem>
            )),
        ];
    };
    const data = chartData.map((item) => {
        return {
            icon: item.Favicon,
            name: item.Domain,
            data: [
                {
                    x: item[xVertical.id],
                    y: item[yVertical.id],
                },
            ],
        };
    });
    const getXYConfig = (vertical) => {
        return {
            name: vertical.name,
            valueFormat: (x) => (vertical.formatter ? vertical.formatter(x) : x),
            highLabel: "Above average",
            lowLabel: "Below average",
            midValue: getAverageForBenchmark(vertical),
        };
    };
    const metrics = {
        x: getXYConfig(xVertical),
        y: getXYConfig(yVertical),
    };
    const isDisabledBenchMark = getIsDisabledBenchmark(xVertical, yVertical);
    const getPlotLineConfig = (vertical) => {
        return [
            {
                color: isBenchmarkSelected && !isDisabledBenchMark ? benchmarkDefaultColor : "",
                width: 1,
                value: getAverageForBenchmark(vertical),
                dashStyle: "ShortDot",
            },
        ];
    };
    const getVectorConfig = (vertical) => {
        return {
            min: getMinValue(vertical),
            max: getMaxValue(vertical),
            plotLines: showBenchmark && getPlotLineConfig(vertical),
            labels: {
                formatter:
                    vertical.formatter &&
                    function () {
                        return vertical.formatter(this.value);
                    },
            },
            title: { text: vertical.name },
        };
    };
    const config = {
        chart: {
            height: "auto",
        },
        xAxis: getVectorConfig(xVertical),
        yAxis: getVectorConfig(yVertical),
        tooltip: {
            split: true,
            formatter: ({ chart }) => {
                return ReactDOMServer.renderToString(
                    <ChartLabelTooltip
                        tooltipWidth={tooltipWidth}
                        chart={chart}
                        getAverageForBenchmark={getAverageForBenchmark}
                        xVertical={xVertical}
                        yVertical={yVertical}
                        belowAvgText={belowAvgText}
                        aboveAvgText={aboveAvgText}
                    />,
                );
            },
        },
    };
    const onSelectedVerticalClick = (setVertical, id) => {
        id !== xVertical.id &&
            id !== yVertical.id &&
            setVertical(columns.find((column) => column.id === id));
    };

    const DropdownContainerScatterPlot = ({ selectedIds, onClick, items, axis }) => {
        const trackOnClick = () => {
            TrackWithGuidService.trackWithGuid(
                "top.web.sites.scatter.chart.dropdown.open",
                "click",
                { axis },
            );
        };
        const categoryChosen = (e) => {
            TrackWithGuidService.trackWithGuid(
                "top.web.sites.scatter.chart.dropdown.metric.selected",
                "click",
                { selectedMetric: e.id, axis },
            );
            onClick(e);
        };
        return (
            <DropdownContainer style={{ width: dropdownsWidth }} onClick={trackOnClick}>
                <Dropdown
                    dropdownPopupPlacement={"bottom-left"}
                    selectedIds={selectedIds}
                    shouldScrollToSelected={true}
                    onClick={categoryChosen}
                >
                    {items}
                </Dropdown>
            </DropdownContainer>
        );
    };

    const xBenchmark = xVertical.formatter(getAverageForBenchmark(xVertical));
    const yBenchmark = yVertical.formatter(getAverageForBenchmark(yVertical));
    const benchmarkClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "top.web.sites.scatter.chart.benchmark.clicked",
            "click",
            { selectedStatus: isBenchmarkSelected ? "unselect" : "select" },
        );
        setIsBenchmarkSelected(!isBenchmarkSelected);
    };
    return (
        <div ref={chartRef}>
            {pngHeaderProps && (
                <PngHeader
                    {...pngHeaderProps}
                    xVertical={xVertical.name}
                    yVertical={yVertical.name}
                />
            )}
            <FlexBoxSpaceBetween>
                <BenchmarkContainer>
                    {showBenchmark && (
                        <>
                            <PlainTooltip
                                enabled={isDisabledBenchMark}
                                tooltipContent={disabledBenchmarkInfoText}
                            >
                                <FlexRow>
                                    <BenchMarkCheckbox
                                        selected={isDisabledBenchMark ? false : isBenchmarkSelected}
                                        onClick={benchmarkClicked}
                                        label={benchmarkLabel}
                                        isDisabled={isDisabledBenchMark}
                                    />
                                </FlexRow>
                            </PlainTooltip>
                            <InfoContainer>
                                <InfoTooltip
                                    enabled={!isDisabledBenchMark}
                                    infoText={benchmarkInfoTooltipText}
                                />
                            </InfoContainer>
                        </>
                    )}
                </BenchmarkContainer>
                <FiltersContainer>
                    <FlexRow>
                        <DropdownContainerScatterPlot
                            selectedIds={{ [yVertical.id]: true }}
                            onClick={({ id }) => onSelectedVerticalClick(setYVertical, id)}
                            items={getVerticalItems(yVertical.name, xVertical.id)}
                            axis="yAxis"
                        />
                        <Vs>vs.</Vs>
                        <DropdownContainerScatterPlot
                            selectedIds={{ [xVertical.id]: true }}
                            onClick={({ id }) => onSelectedVerticalClick(setXVertical, id)}
                            items={getVerticalItems(xVertical.name, yVertical.id)}
                            axis="xAxis"
                        />
                    </FlexRow>
                </FiltersContainer>
            </FlexBoxSpaceBetween>
            {isBenchmarkSelected && !isDisabledBenchMark && (
                <BenchmarkValuesContainer>
                    {!xVertical.disableBenchMark && (
                        <Text>{`${xVertical.name} ${xBenchmark}`}</Text>
                    )}
                    {!yVertical.disableBenchMark && (
                        <Text>{`${yVertical.name} ${yBenchmark}`}</Text>
                    )}
                </BenchmarkValuesContainer>
            )}
            <ConversionScatterChartContainer cursorUrl={cursorUrl}>
                <ConversionScatterChart
                    data={data}
                    metrics={metrics}
                    config={config}
                    options={options}
                    translate={i18nFilter()}
                />
            </ConversionScatterChartContainer>
        </div>
    );
});
BasicScatterChart.defaultProps = {
    benchmarkLabelText: "widgets.scatter.plot.benchmark.label",
    tooltipWidth: "auto",
    initialXAxisColumn: 0,
    initialYAxisColumn: 1,
    dropdownsWidth: 180,
    showBenchmark: true,
};

BasicScatterChart.displayName = "BasicScatterChart";
