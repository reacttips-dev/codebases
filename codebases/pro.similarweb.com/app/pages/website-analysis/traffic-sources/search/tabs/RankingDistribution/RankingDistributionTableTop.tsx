import { Injector } from "common/ioc/Injector";
import {
    getColumnsPickerLiteProps,
    onChipAdd,
    onChipRemove,
    SearchContainer,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import { i18nFilter, pctSignFilter, percentageFilter } from "filters/ngFilters";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { UpSellTooltipContent } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import UnlockModalConfig from "components/Modals/src/UnlockModal/unlockModalConfig";
import UnlockModal from "components/Modals/src/UnlockModal/UnlockModal";
import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { swSettings } from "common/services/swSettings";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { allTrackers } from "services/track/track";
import ExcelClientDownload from "components/React/ExcelButton/ExcelClientDownload";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { useTrack } from "components/WithTrack/src/useTrack";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import {
    FilterItemChipdown,
    FiltersNewContainer,
    FiltersNewContent,
} from "pages/website-analysis/traffic-sources/search/components/filters/WebsiteKeywordsPageFiltersStyledComponents";
import {
    getRankingDistributionTableTopContext,
    IRankingDistributionTableTopContext,
    RankingDistributionTableTopContextProvider,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";
import { BrandedNonBrandedFilterForRankingDistribution } from "pages/website-analysis/traffic-sources/search/components/filters/BrandedNonBrandedFilter";
import { RankingTierFilter } from "pages/website-analysis/traffic-sources/search/components/filters/RankingTierFilter";
import { VolumeFilterForRankingDistribution } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import { CpcFilterForRankingDistribution } from "../../components/filters/CpcFilter";
import { SerpFilterForRankingDistribution } from "pages/website-analysis/traffic-sources/search/components/filters/SerpFilter";
import { RankingDistributionCompareTable } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionCompareTable";
import { RankingDistributionSingleGraph } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionSingleGraph";

const OverviewAndFiltersContainer = styled.div`
    padding: 16px 0 0 0;
`;

const OverviewAndFiltersContainerChild = styled.div`
    padding: 0 16px;

    &:first-of-type {
        border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    }
`;

const FiltersContainer = styled(FiltersNewContent)`
    flex-direction: column;
`;

const FiltersGroup = styled(FlexRow)`
    align-items: center;
    display: inline-flex;
`;

export const RankingDistributionTableTop: React.FC<any> = (props) => {
    const { filtersStateObject, onFilterChange, dataParamsAdapter } = props;
    const [track, trackWithGuid] = useTrack();
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const [excelDownloading, setExcelDownloading] = useState(false);
    const isCompare = filtersStateObject.keys.split(",").length > 1;
    const downloadExcel = useCallback(async () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
        setExcelDownloading(true);
        try {
            await ExcelClientDownload(props.excelLink);
        } catch (e) {
        } finally {
            setExcelDownloading(false);
        }
    }, [props.excelLink]);

    const doTrack = () => {
        trackWithGuid("button_download_locked", "click", {
            location: LocationService.getCurrentLocation(),
        });
    };

    const onBooleanSearchChange = (booleanSearchTerms) => {
        onFilterChange(booleanSearchTerms);
    };
    const contextValue = useMemo<IRankingDistributionTableTopContext>(() => {
        const { isLoadingData, chosenItems, tableData } = props;
        return getRankingDistributionTableTopContext({
            isLoadingData,
            tableFilters: props.filtersStateObject,
            applyChangesToUrl: () => null,
            isCompare,
            chosenItems,
            tableData,
            onFilterChange,
        });
    }, [props.isLoadingData, props.filtersStateObject, props.channelsFilter, props.sourcesFilter]);
    return (
        <RankingDistributionTableTopContextProvider value={contextValue}>
            <OverviewAndFiltersContainer>
                <OverviewAndFiltersContainerChild>
                    <FiltersNewContainer data-automation="search-keywords-filters">
                        <FiltersContainer>
                            <div>
                                <FilterItemChipdown>
                                    <RankingTierFilter />
                                </FilterItemChipdown>
                                <FilterItemChipdown>
                                    <BrandedNonBrandedFilterForRankingDistribution />
                                </FilterItemChipdown>
                                <FilterItemChipdown>
                                    <VolumeFilterForRankingDistribution />
                                </FilterItemChipdown>
                                <FiltersGroup alignItems="center">
                                    <FilterItemChipdown>
                                        <CpcFilterForRankingDistribution />
                                    </FilterItemChipdown>
                                    <FilterItemChipdown>
                                        <SerpFilterForRankingDistribution />
                                    </FilterItemChipdown>
                                </FiltersGroup>
                            </div>
                        </FiltersContainer>
                    </FiltersNewContainer>
                </OverviewAndFiltersContainerChild>
            </OverviewAndFiltersContainer>
            <div>
                <SearchContainer>
                    <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                        placeholder={i18nFilter()("analysis.keywords.boolean.search.placeholder")}
                        onChipAdd={onChipAdd}
                        onChipRemove={onChipRemove}
                        filters={filtersStateObject}
                        onApplyChanges={onBooleanSearchChange}
                    />
                    <FlexRow>
                        {downloadExcelPermitted && (
                            <PlainTooltip
                                placement="top"
                                tooltipContent={i18nFilter()(
                                    "ranking.distribution.csv.downloadCSV",
                                )}
                            >
                                <div className="export-buttons-wrapper">
                                    <div data-automation="Download Excel">
                                        <IconButton
                                            isLoading={excelDownloading}
                                            type="flat"
                                            iconName="excel"
                                            onClick={downloadExcel}
                                        />
                                    </div>
                                </div>
                            </PlainTooltip>
                        )}
                        {!downloadExcelPermitted && (
                            <PopupHoverContainer
                                content={() => (
                                    <UpSellTooltipContent
                                        trackingEventName={Injector.get<any>("swNavigator")
                                            .current()
                                            .trackingId.join("/")}
                                        upgradeButtonText={i18nFilter()(
                                            "directives.csv.notPermitted.button",
                                        )}
                                        upgradeText={i18nFilter()(
                                            "directives.csv.notPermitted.text",
                                        )}
                                        unlockModalConfig={{
                                            location: `${LocationService.getCurrentLocation()}/Download Table`,
                                            ...UnlockModalConfig().DownloadTable,
                                        }}
                                        onClick={() => setUnlockModalOpen(true)}
                                    />
                                )}
                                config={{
                                    cssClass: "Popup-element-wrapper--pro",
                                    cssClassContent: "Popup-content--pro",
                                    placement: "bottom",
                                    allowHover: true,
                                }}
                            >
                                <div className="export-buttons-wrapper">
                                    <div data-automation="Download Excel">
                                        <IconButton
                                            isLoading={excelDownloading}
                                            type="flat"
                                            iconName="excel-locked"
                                            onClick={doTrack}
                                        />
                                    </div>
                                </div>
                            </PopupHoverContainer>
                        )}
                        <div style={{ margin: "0 10px 0 7px" }}>
                            <ColumnsPickerLite
                                {...getColumnsPickerLiteProps(
                                    props.tableColumns,
                                    props.onClickToggleColumns,
                                )}
                                withTooltip
                            />
                        </div>
                    </FlexRow>
                </SearchContainer>
                {unlockModalOpen && (
                    <UnlockModal
                        isOpen={true}
                        onCloseClick={() => {
                            setUnlockModalOpen(false);
                        }}
                        location={`${LocationService.getCurrentLocation()}/Download Table`}
                        {...UnlockModalConfig().DownloadTable}
                    />
                )}
            </div>
            {isCompare && (
                <RankingDistributionCompareTable
                    chosenItems={props.chosenItems}
                    tableFilters={filtersStateObject}
                    dataParamsAdapter={dataParamsAdapter}
                />
            )}
            {!isCompare && (
                <>
                    <RankingDistributionSingleGraph dataParamsAdapter={dataParamsAdapter} />
                </>
            )}
        </RankingDistributionTableTopContextProvider>
    );
};
