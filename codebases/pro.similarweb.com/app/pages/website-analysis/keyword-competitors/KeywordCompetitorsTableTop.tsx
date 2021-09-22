import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import React, { FunctionComponent, useMemo } from "react";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { KeywordCompetitorsPageScatterChart } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageScatterChart";
import {
    IKeywordCompetitorsPageContext,
    KeywordCompetitorsPageContextProvider,
} from "./KeywordCompetitorsPageContext";
import { WebsiteTypeFilter } from "./filters/WebsiteTypeFilter";
import { Injector } from "common/ioc/Injector";
import { DomainsFilter } from "pages/website-analysis/keyword-competitors/filters/DomainsFilter";
import {
    NewCompetitorsFilter,
    RisingCompetitorsFilter,
} from "pages/website-analysis/keyword-competitors/filters/CompetitorsFilters";
import { CategoryFilter } from "pages/website-analysis/keyword-competitors/filters/CategoryFilter";
import { SearchTypeFilter } from "pages/website-analysis/keyword-competitors/filters/SearchTypeFilter";
import { SearchFilter } from "pages/website-analysis/keyword-competitors/filters/SearchFilter";
import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";
import { useTrack } from "components/WithTrack/src/useTrack";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";

const TopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
    padding-bottom: 2px;
`;
const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;
const ChipWrap = styled.div`
    padding-left: 8px;
    margin-bottom: 10px;
    &:first-child {
        padding-left: 0;
    }
    ${ChipItemWrapper} {
        margin-right: 0;
    }
`;

const ChipWrapLastInRow = styled(ChipWrap)`
    margin-right: 8px;
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const KeywordCompetitorsTableTop: FunctionComponent<any> = (props) => {
    const {
        isLoadingData,
        isCompare,
        downloadExcelPermitted,
        excelLink,
        tableColumns,
        onClickToggleColumns,
        filtersStateObject,
        onFilterChange,
        mainSiteData,
        a2d,
    } = props;
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    const selectedSite = filtersStateObject.selectedSite || filtersStateObject.keys;
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const [track, trackWithGuid] = useTrack();
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };
    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible: col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key));
    };

    const scatterChartData = Array.isArray(props.tableData)
        ? props.tableData.slice(0, 10).filter((item) => item.Domain !== "grid.upgrade")
        : null;

    const context = useMemo<IKeywordCompetitorsPageContext>(() => {
        const swNavigator = Injector.get("swNavigator");
        const chosenSites = Injector.get<any>("chosenSites");
        const context: IKeywordCompetitorsPageContext = {
            allSites: chosenSites.map((item, infoItem) => {
                return { name: item, displayName: infoItem.displayName, icon: infoItem.icon };
            }),
            selectedSite: filtersStateObject.selectedSite,
            onSelectSite: (selectedSite) => {
                const value = { selectedSite: selectedSite.text };
                trackWithGuid("keywords.competitors.filters.domain", "click", {
                    domain: selectedSite.text,
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            onSelectRisingCompetitors: () => {
                const value = { risingCompetitors: !filtersStateObject.risingCompetitors };
                trackWithGuid("keywords.competitors.filters.rising", "check", {
                    type: filtersStateObject.risingCompetitors ? "remove" : "add",
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            risingCompetitors: filtersStateObject.risingCompetitors,
            onSelectNewCompetitors: () => {
                const value = { newCompetitors: !filtersStateObject.newCompetitors };
                trackWithGuid("keywords.competitors.filters.new", "check", {
                    type: filtersStateObject.newCompetitors ? "remove" : "add",
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            newCompetitors: filtersStateObject.newCompetitors,
            onSelectWebsiteType: (type) => {
                const value = { websiteType: type?.id };
                trackWithGuid("keywords.competitors.filters.website.type", "click", {
                    type: type?.id ?? "clear",
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            selectedWebsiteType: filtersStateObject.websiteType,
            allCategories: props.allCategories,
            selectedCategory: filtersStateObject.category,
            onSelectCategory: (category) => {
                const value = { category: category?.forApi };
                trackWithGuid("keywords.competitors.filters.category", "click", {
                    category: category?.id ?? "clear",
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            // search types
            searchTypes: props.searchTypes,
            selectedSearchType: filtersStateObject.searchType,
            onSelectSearchType: (type) => {
                const value = { [props.searchTypeParam]: type?.id };
                trackWithGuid("keywords.competitors.filters.search.type", "click", {
                    type: type?.id ?? "clear",
                });
                swNavigator.applyUpdateParams(value);
                onFilterChange({ searchType: type?.id });
            },
            searchTypeFilterPlaceholder: props.searchTypeFilterPlaceholder,
            search: filtersStateObject.search,
            onSearch: (term) => {
                const value = { search: term || null };
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
        };
        return context;
    }, [
        filtersStateObject,
        onFilterChange,
        props.allCategories,
        props.searchTypes,
        props.searchTypeParam,
    ]);
    return isLoadingData ? null : (
        <>
            <KeywordCompetitorsPageContextProvider value={context}>
                <TopStyled>
                    <TopStyledLeft>
                        {isCompare && (
                            <ChipWrap>
                                <DomainsFilter />
                            </ChipWrap>
                        )}
                        <ChipWrap>
                            <CategoryFilter />
                        </ChipWrap>
                        <ChipWrap>
                            <WebsiteTypeFilter />
                        </ChipWrap>
                        <ChipWrapLastInRow>
                            <SearchTypeFilter />
                        </ChipWrapLastInRow>
                        <FlexRow style={{ height: 32 }} alignItems="center">
                            <ChipWrap>
                                <RisingCompetitorsFilter />
                            </ChipWrap>
                            <ChipWrap>
                                <NewCompetitorsFilter />
                            </ChipWrap>
                        </FlexRow>
                    </TopStyledLeft>
                </TopStyled>
                {mainSiteData && scatterChartData?.length > 0 && (
                    <KeywordCompetitorsPageScatterChart
                        columns={props.tableColumns
                            .filter((column) => column.field && column.scatterChart)
                            .map((column) => {
                                return {
                                    id: column.field,
                                    name: column.displayName,
                                    formatter: column.scatterChartFormatter,
                                    disableBenchMark: !column.scatterChartBenchmark,
                                    hidePill: column.hideScatterTooltipPill,
                                };
                            })}
                        tableData={scatterChartData}
                        domain={selectedSite}
                        mainSiteData={mainSiteData}
                    />
                )}
                <SearchContainer>
                    <SearchFilter />
                    <Right>
                        <FlexRow>
                            <DownloadExcelContainer {...excelLinkHref}>
                                <DownloadButtonMenu
                                    Excel={true}
                                    downloadUrl={excelDownloadUrl}
                                    exportFunction={trackExcelDownload}
                                    excelLocked={!downloadExcelPermitted}
                                />
                            </DownloadExcelContainer>
                            <div>
                                <ColumnsPickerLite {...getColumnsPickerLiteProps()} />
                            </div>
                            <AddToDashboardButton onClick={a2d} />
                        </FlexRow>
                    </Right>
                </SearchContainer>
            </KeywordCompetitorsPageContextProvider>
        </>
    );
};
