import {
    Switcher,
    GraphHeaderContainer,
    SwitchContainer,
    TitleContainer,
    ButtonsContainer,
} from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphStyles";
import { DataTypeSwitcherEnum, GranularitySwitcherEnum } from "../CategoryShareGraphTypes";
import { ICategoryShareServices } from "pages/industry-analysis/category-share/CategoryShareTypes";
import {
    resolveDataGranulairtyFromSwitcher,
    getCategoryDetailsForDashboard,
} from "pages/industry-analysis/category-share/CategoryShareGraph/utils/CategoryShareGraphUtils";
import { AddToDashboard } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/AddToDashboard";
import React, { FC } from "react";
import { PngDownload } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/PngDownload";
import { MonthToDateToggle } from "pages/industry-analysis/category-share/CategoryShareGraph/components/MonthToDateToggle";

interface ICategoryShareGraphHeaderProps {
    selectedDataType: DataTypeSwitcherEnum;
    onSelectDataType: (index: number) => void;
    selectedGranularity: GranularitySwitcherEnum;
    onSelectGranularity: (index: number) => void;
    onToggleMonthToDate: (isEnabled: boolean) => void;
    graphRef: React.MutableRefObject<HTMLDivElement>;
    services: ICategoryShareServices;
    params: { category: string; webSource: string; duration: string; mtd?: string };
    isMonthlyGranularitySupported: boolean;
    isMTDSupported: boolean;
    isMTDActive: boolean;
}

export const CategoryShareGraphHeader: FC<ICategoryShareGraphHeaderProps> = (props) => {
    const {
        selectedDataType,
        onSelectDataType,
        selectedGranularity,
        onSelectGranularity,
        onToggleMonthToDate,
        graphRef,
        services,
        params,
        isMTDSupported,
        isMTDActive,
        isMonthlyGranularitySupported,
    } = props;

    const categoryDetails = services.categoryService.categoryQueryParamToCategoryObject(
        params.category,
    );

    return (
        <GraphHeaderContainer>
            <TitleContainer>{services.translate("categoryShare.graph.title")}</TitleContainer>
            <ButtonsContainer>
                <MonthToDateToggle
                    isMonthToDateActive={isMTDActive}
                    onToggleMonthToDate={onToggleMonthToDate}
                    services={services}
                    isDisabled={!isMTDSupported}
                />

                <SwitchContainer>
                    <Switcher
                        itemList={[{ title: "%" }, { title: "#" }]}
                        selectedIndex={selectedDataType}
                        onItemClick={onSelectDataType}
                    />
                </SwitchContainer>

                <SwitchContainer>
                    <Switcher
                        itemList={[
                            { title: "D" },
                            { title: "W" },
                            { title: "M", disabled: !isMonthlyGranularitySupported },
                        ]}
                        selectedIndex={selectedGranularity}
                        onItemClick={onSelectGranularity}
                    />
                </SwitchContainer>
                <PngDownload
                    chartRef={graphRef}
                    metricName={services.translate("keywords.research.common.traffic.chart.header")}
                    offset={{ x: 0, y: 100 }}
                />
                <AddToDashboard
                    metric={{
                        addToDashboardName: "TopCategoryShare",
                        chartType: "CategoryShareGraphDashboard",
                        title: "1",
                    }}
                    webSource={params.webSource}
                    filters={{
                        timeGranularity: resolveDataGranulairtyFromSwitcher(selectedGranularity),
                        includeSubDomains: true,
                        keys: categoryDetails.forApi,
                    }}
                    overrideParams={{
                        key: [
                            {
                                ...getCategoryDetailsForDashboard(params, services),
                            },
                        ],
                    }}
                />
            </ButtonsContainer>
        </GraphHeaderContainer>
    );
};
