import { Button } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import {
    ContentContainer,
    SitesChartLoaderContainer,
} from "Arena/components/ArenaVisits/StyledComponents";
import { BoxFooter, StyledBox } from "Arena/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { StyledHeader } from "pages/app performance/src/page/StyledComponents";
import {
    ChartContainer,
    DropdownContainer,
    NoDataContainer,
} from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { getChartConfig } from "pages/workspace/marketing/pages/chartConfig";
import React from "react";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { granularities } from "utils";
import { TrafficStatelessTable } from "./TrafficStatelessTable";
import { SWReactTableNoDataWrapper } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";

const TableUtils = styled.div`
    display: flex;
    justify-content: space-between;
    ${DropdownContainer} {
        margin-right: 15px;
    }
`;
const TrafficStatelessContainerStyled = styled.div`
    ${SWReactTableNoDataWrapper} {
        width: 100%;
    }
    ${StyledHeader} {
        height: auto;
        border-bottom: none;
        padding: 24px 24px 0;
    }
    ${ContentContainer} {
        padding-top: 0;
    }
    ${ChartContainer} {
        padding: 16px 13px 0;
    }
    ${StyledBoxSubtitle} {
        padding-bottom: 16px;
    }
    .swReactTable-column:last-child {
        border: none;
    }
    .noData-frame {
        display: none; // hiding "NO data" for table, since there is already no data for chart above table.
    }
`;

const ChipDownContainerWrap = styled.div`
    margin-right: 10px;
`;
const TableUtilsLeft = styled.div`
    display: flex;
    align-items: center;
`;
export const TrafficStateless = (props) => {
    const {
        excludeColumns, // array of strings to exclude
        tableData, // array of objects without Data: or Records
        chartData, // chart data object as it passed to Chart component
        isChecked, // boolean
        onCheckBoxClick, // function
        selectedDropdownItem, // Dropdown Item
        onDropDownToggle, // function
        onDropDownItemClick, // function
        dropdownItems, // Dropdown item [] if length is 0, TableUtils is not displayed
        subtitleFilters, // Filters object that passed to BoxSubtitle component
        chartFilter, // as it passed to chart config
        isPdf, // boolean
        isChartLoading, // boolean
        disableDropDown, // boolean
        selectedGranularityIndex, // number 0, 1, 2
        onGranularityClick, // function (index, granularity)
        tableSelectionKey, // string
        title, // string
        titleTooltip, // string
        componentNameForI18n,
        onCloseItem, // function
        filters,
        selectedCategoryId,
        buttonLabel,
        navigateTo,
    } = props;
    const i18n = i18nFilter();
    const selectedIndex = dropdownItems.findIndex(
        (dropdownItem) => dropdownItem.id === selectedDropdownItem.id,
    );
    const buttonText = dropdownItems.length > 0 ? dropdownItems[selectedIndex].children : null;
    const selectedText = selectedIndex === 0 ? null : buttonText;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const learnMoreLink = swNavigator.href(navigateTo, {
        ...filters,
        key: filters.keys,
        category: selectedCategoryId,
    });
    return (
        <TrafficStatelessContainerStyled>
            <StyledBox>
                <StyledHeader>
                    <PrimaryBoxTitle tooltip={titleTooltip}>{title}</PrimaryBoxTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                    <TableUtils>
                        <TableUtilsLeft>
                            {dropdownItems.length > 0 && (
                                <PlainTooltip
                                    enabled={disableDropDown}
                                    text={i18n(
                                        "workspaces.marketing.organic.search.overview.chart.dropdown.disabled",
                                    )}
                                >
                                    <ChipDownContainerWrap>
                                        <ChipDownContainer
                                            onToggle={onDropDownToggle}
                                            width={230}
                                            onClick={onDropDownItemClick}
                                            selectedText={selectedText}
                                            selectedIds={{ [selectedDropdownItem.id]: true }}
                                            shouldScrollToSelected={true}
                                            disabled={disableDropDown}
                                            onCloseItem={onCloseItem}
                                            buttonText={buttonText}
                                        >
                                            {dropdownItems.map((dropdownItem) => (
                                                <EllipsisDropdownItem
                                                    key={dropdownItem.id}
                                                    {...dropdownItem}
                                                    width={230}
                                                />
                                            ))}
                                        </ChipDownContainer>
                                    </ChipDownContainerWrap>
                                </PlainTooltip>
                            )}
                            <PlainTooltip
                                text={i18n(
                                    "workspaces.marketing.organic.search.overview.chart.checkbox.tooltip",
                                )}
                            >
                                <div>
                                    <Checkbox
                                        label={i18n(
                                            "workspaces.marketing.organic.search.overview.chart.checkbox",
                                        )}
                                        onClick={onCheckBoxClick}
                                        selected={isChecked}
                                    />
                                </div>
                            </PlainTooltip>
                        </TableUtilsLeft>
                        <Switcher
                            selectedIndex={selectedGranularityIndex}
                            customClass="CircleSwitcher"
                            onItemClick={(index) => onGranularityClick(index, granularities[index])}
                        >
                            {granularities.map((granItem) => {
                                return (
                                    <CircleSwitcherItem key={granItem}>
                                        {granItem.charAt(0)}
                                    </CircleSwitcherItem>
                                );
                            })}
                        </Switcher>
                    </TableUtils>
                </StyledHeader>
                <ContentContainer>
                    {isChartLoading ? (
                        <SitesChartLoaderContainer>
                            <GraphLoader width={"100%"} />
                        </SitesChartLoaderContainer>
                    ) : (
                        chartData.length > 0 && (
                            <ChartContainer className={"sharedTooltip"}>
                                <Chart
                                    type={"line"}
                                    config={getChartConfig({
                                        type: "line",
                                        filter: chartFilter,
                                        selectedGranularity:
                                            granularities[selectedGranularityIndex],
                                    })}
                                    data={chartData}
                                />
                            </ChartContainer>
                        )
                    )}
                    <TrafficStatelessTable
                        tableData={tableData}
                        isLoading={isChartLoading}
                        excludeColumns={excludeColumns}
                        tableSelectionKey={tableSelectionKey}
                        componentNameForI18n={componentNameForI18n}
                    />
                </ContentContainer>
                <BoxFooter>
                    <a href={learnMoreLink}>
                        <Button type="flat">{i18nFilter()(buttonLabel)}</Button>
                    </a>
                </BoxFooter>
            </StyledBox>
        </TrafficStatelessContainerStyled>
    );
};
