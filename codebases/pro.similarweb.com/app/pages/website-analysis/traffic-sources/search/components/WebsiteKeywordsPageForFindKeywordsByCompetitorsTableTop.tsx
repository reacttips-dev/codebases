import { SwNavigator } from "common/services/swNavigator";
import { KeywordsGapVennFilter } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/KeywordsGapVennFilter";
import KeywordsTableOverviewCompare from "pages/website-analysis/traffic-sources/search/components/KeywordsTableOverviewCompare";
import { WebsiteKeywordsPageForFindKeywordsByCompetitorsFilters } from "./WebsiteKeywordsPageForFindKeywordsByCompetitorsFilters";
import {
    getColumnsPickerLiteProps,
    getWebsiteKeywordsPageTableTopContext,
    IWebsiteKeywordsPageTableTop,
    onChipAdd,
    onChipRemove,
    SearchContainer,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import { i18nFilter } from "filters/ngFilters";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { UpSellTooltipContent } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import UnlockModalConfig from "components/Modals/src/UnlockModal/unlockModalConfig";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import UnlockModal from "components/Modals/src/UnlockModal/UnlockModal";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    WebsiteKeywordsPageTableTopContextProvider,
    IWebsiteKeywordsPageTableTopContext,
} from "./WebsiteKeywordsPageContext";
import { swSettings } from "common/services/swSettings";
import { ExcelDownload } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";

const compareBarTitleTooltipTextKey = "keyword_research.keyword_gap.total_traffic_bar.tooltip";

export const WebsiteKeywordsPageForFindKeywordsByCompetitorsTableTop: React.FC<IWebsiteKeywordsPageTableTop> = (
    props,
) => {
    const [displayType, setDisplayType] = useState<"percent" | "number">("percent");
    const {
        tableData,
        chosenItems,
        isLoadingData,
        filtersStateObject,
        noData,
        headerData,
        breakdown,
        excelLink,
    } = props;
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const initialFiltersStateObject = useRef(filtersStateObject);
    // use this state to store the changes for the table filters until the user applies them
    const [nextTableParams, setNextTableParams] = useState(filtersStateObject);
    const isCompare = filtersStateObject.keys.split(",").length > 1;
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const track = () => {
        TrackWithGuidService.trackWithGuid("button_download_locked", "click", {
            location: LocationService.getCurrentLocation(),
        });
    };

    const addTempParams = useCallback(
        (params) => {
            setNextTableParams({
                ...nextTableParams,
                ...params,
            });
        },
        [nextTableParams],
    );

    const swNavigator: SwNavigator = Injector.get("swNavigator");
    const applyChangesToUrl = () => {
        swNavigator.applyUpdateParams(nextTableParams);
        TrackWithGuidService.trackWithGuid("website.keywords.table.filters.apply", "click");
    };

    const contextValue = useMemo<IWebsiteKeywordsPageTableTopContext>(() => {
        const { sourcesFilter, channelsFilter, isLast28Days } = props;
        const getWebsiteKeywordsPageTableTopContextArgs = {
            isLoadingData,
            nextTableParams,
            initialFiltersStateObject,
            applyChangesToUrl,
            isCompare,
            chosenItems,
            sourcesFilter,
            channelsFilter,
            tableData,
            addTempParams,
            isLast28Days,
        };
        return getWebsiteKeywordsPageTableTopContext(getWebsiteKeywordsPageTableTopContextArgs);
    }, [
        props.isLoadingData,
        props.filtersStateObject,
        props.channelsFilter,
        props.sourcesFilter,
        addTempParams,
        nextTableParams,
    ]);

    return (
        <WebsiteKeywordsPageTableTopContextProvider value={contextValue}>
            {isCompare && (
                <KeywordsGapVennFilter
                    tableData={tableData}
                    chosenItems={chosenItems}
                    filtersStateObject={filtersStateObject}
                    swNavigator={swNavigator}
                />
            )}
            <WebsiteKeywordsPageForFindKeywordsByCompetitorsFilters />
            {isCompare && (
                <KeywordsTableOverviewCompare
                    {...headerData}
                    filters={props.filtersStateObject}
                    isFetching={isLoadingData}
                    sitesList={chosenItems}
                    displayType={displayType}
                    setDisplayType={setDisplayType}
                    noData={noData}
                    breakdown={breakdown}
                    showMetricTotals={false}
                    compareBarTitleTooltipText={compareBarTitleTooltipTextKey}
                />
            )}
            <div>
                <SearchContainer>
                    <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                        placeholder={i18nFilter()("analysis.keywords.boolean.search.placeholder")}
                        onChipAdd={onChipAdd}
                        onChipRemove={onChipRemove}
                    />
                    <FlexRow>
                        {downloadExcelPermitted && <ExcelDownload excelLink={excelLink} />}
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
                                            type="flat"
                                            iconName="excel-locked"
                                            onClick={track}
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
                        <AddToDashboardButton
                            onClick={() => {
                                props.onAddToDashboard(props.filtersStateObject);
                            }}
                        />
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
        </WebsiteKeywordsPageTableTopContextProvider>
    );
};
