import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { PoPWithCompareChart } from "components/Chart/src/components/PopWithComapreChart/PoPWithCompareChart";
import {
    AvgContainer,
    ChartUtils,
    DropdownContainer,
    DropDownText,
    InfoIcon,
    LeftUtils,
    RightUtils,
    TooltipContainer,
} from "components/React/TrafficGrowthComparison/StyledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { changeFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { allTrackers } from "services/track/track";
import UIComponentStateService from "services/UIComponentStateService";
import { rgba } from "@similarweb/styles";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

const i18n = i18nFilter();
const dropdownItems = [
    { id: "website", children: "Website" },
    { id: "period", children: "Period" },
];

class TrafficGrowthComparison extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selectedView:
                UIComponentStateService.getItem(
                    "Traffic_growth_comparison_state",
                    "localStorage",
                ) || dropdownItems[0].id,
        };
    }
    public render() {
        const { data = [], viewData } = this.props;
        const duration = viewData.duration;
        const getChartData = () => {
            let chartData;
            if (this.state.selectedView === "website") {
                chartData = [
                    {
                        data: data.map((item) => ({
                            dates: duration[1],
                            color: {
                                pattern: {
                                    path: {
                                        d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
                                        stroke: rgba("#000000", 0.3),
                                    },
                                    width: 10,
                                    height: 10,
                                    backgroundColor: item.color,
                                },
                            },
                            name: item.Domain,
                            y: item.ComparedPeriodVisits,
                            change: item.Change,
                            image: item.image,
                        })),
                    },
                    {
                        data: data.map((item) => ({
                            dates: duration[0],
                            color: item.color,
                            name: item.Domain,
                            y: item.OriginalPeriodVisits,
                            change: item.Change,
                            image: item.image,
                        })),
                    },
                ];
            } else {
                chartData = data.map((item) => ({
                    name: item.Domain,
                    data: [
                        {
                            color: {
                                pattern: {
                                    path: {
                                        d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
                                        stroke: rgba("#000000", 0.3),
                                    },
                                    width: 10,
                                    height: 10,
                                    backgroundColor: item.color,
                                },
                            },
                            name: duration[1],
                            y: item.ComparedPeriodVisits,
                            change: item.Change,
                            image: item.image,
                            website: item.Domain,
                        },
                        {
                            color: item.color,
                            name: duration[0],
                            y: item.OriginalPeriodVisits,
                            change: item.Change,
                            image: item.image,
                            website: item.Domain,
                        },
                    ],
                }));
            }
            return chartData;
        };
        const onDropDownItemClick = (selectedItem) => {
            allTrackers.trackEvent("Viewed by", "Open/click", `table name/${selectedItem.id}`);
            UIComponentStateService.setItem(
                "Traffic_growth_comparison_state",
                "localStorage",
                selectedItem.id,
            );
            this.setState({ selectedView: selectedItem.id });
        };
        const average = (arr) => {
            let currentPeriodSum = 0;
            let previousPeriodSum = 0;
            for (let i = 0; i < arr.length; i++) {
                previousPeriodSum += arr[i].ComparedPeriodVisits;
                currentPeriodSum += arr[i].OriginalPeriodVisits;
            }
            return (currentPeriodSum - previousPeriodSum) / previousPeriodSum;
        };
        const changeAvg = changeFilter()(average(data)).toString();
        const isDecrease = average(data) < 0;
        const isZero = isNaN(average(data)) || average(data) === 0;

        return (
            <div>
                <ChartUtils>
                    <LeftUtils>
                        <AvgContainer>
                            {i18n("analysis.traffic.GrowthComparison.avgchange")}
                        </AvgContainer>
                        <ChangeValue unsigned={isZero} value={changeAvg} isDecrease={isDecrease} />
                        <TooltipContainer>
                            <PlainTooltip
                                placement="top"
                                tooltipContent={i18n(
                                    "analysis.traffic.GrowthComparison.avgchange.tooltip",
                                )}
                            >
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        </TooltipContainer>
                    </LeftUtils>
                    <RightUtils>
                        <DropDownText>{"View by:"}</DropDownText>
                        <DropdownContainer className="TrafficGrowthComparisonDropdownContainer">
                            <Dropdown
                                dropdownPopupPlacement={"ontop-left"}
                                cssClassContainer={
                                    "DropdownContent-container DropdownContent-container-padding"
                                }
                                shouldScrollToSelected={true}
                                onToggle={() => null}
                                width={165}
                                onClick={onDropDownItemClick}
                                selectedIds={this.state.selectedView}
                            >
                                {[
                                    <DropdownButton key={"DropdownButton"} width={165}>
                                        {
                                            dropdownItems.find(
                                                (dropdownItem) =>
                                                    dropdownItem.id === this.state.selectedView,
                                            ).children
                                        }
                                    </DropdownButton>,
                                    ...dropdownItems.map((dropdownItem) => (
                                        <EllipsisDropdownItem
                                            key={dropdownItem.id}
                                            {...dropdownItem}
                                        />
                                    )),
                                ]}
                            </Dropdown>
                        </DropdownContainer>
                    </RightUtils>
                </ChartUtils>
                <PoPWithCompareChart
                    view={this.state.selectedView}
                    legendDurations={duration}
                    data={getChartData()}
                    type={chartTypes.COLUMN}
                    options={{
                        categoryXSeries: true,
                        height: viewData.isDashboard ? 192 : 250,
                    }}
                />
            </div>
        );
    }
}

export default SWReactRootComponent(TrafficGrowthComparison, "TrafficGrowthComparison");
