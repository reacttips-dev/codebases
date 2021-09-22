import {
    getColumnsPickerLiteProps,
    getWebsiteKeywordsPageTableTopContext,
    IWebsiteKeywordsPageTableTop,
    onChipAdd,
    onChipRemove,
    SearchContainer,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { colorsPalettes } from "@similarweb/styles";
import { KeywordsOverviewHeader } from "./keywordsTableOverview";
import KeywordsTableOverviewCompare from "./KeywordsTableOverviewCompare";
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
import { WebsiteKeywordsPageFilters } from "./WebsiteKeywordsPageFilters";
import { swSettings } from "common/services/swSettings";
import styled from "styled-components";
import { ExcelDownload } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";

const OverviewAndFiltersContainer = styled.div`
    padding: 24px 0 0 0;
`;

const OverviewAndFiltersContainerChild = styled.div`
    padding: 0 16px;
    &:first-of-type {
        border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    }
`;

export const WebsiteKeywordsPageTableTop: React.FC<IWebsiteKeywordsPageTableTop> = (props) => {
    const { filtersStateObject, isLoadingData, headerData, breakdown, excelLink } = props;

    const isCompare = filtersStateObject.keys.split(",").length > 1;
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const [displayType, setDisplayType] = useState<"percent" | "number">("percent");
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const initialFiltersStateObject = useRef(filtersStateObject);
    // use this state to store the changes for the table filters until the user applies them
    const [nextTableParams, setNextTableParams] = useState(filtersStateObject);

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

    const swNavigator: any = Injector.get("swNavigator");
    const applyChangesToUrl = () => {
        const paramsToUpdate: any = {
            ...nextTableParams,
        };
        if (Array.isArray(paramsToUpdate.serp) && paramsToUpdate.serp.length > 0) {
            paramsToUpdate.serp = paramsToUpdate.serp.join(",");
        }
        swNavigator.applyUpdateParams(paramsToUpdate);
        TrackWithGuidService.trackWithGuid("website.keywords.table.filters.apply", "click");
    };

    const contextValue = useMemo<IWebsiteKeywordsPageTableTopContext>(() => {
        const {
            isLoadingData,
            chosenItems,
            sourcesFilter,
            channelsFilter,
            tableData,
            isLast28Days,
            serpDataLoading,
        } = props;
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
            serpDataLoading,
        };
        return getWebsiteKeywordsPageTableTopContext(getWebsiteKeywordsPageTableTopContextArgs);
    }, [
        props.isLoadingData,
        props.filtersStateObject,
        props.channelsFilter,
        props.sourcesFilter,
        addTempParams,
        nextTableParams,
        props.serpDataLoading,
    ]);
    return (
        <WebsiteKeywordsPageTableTopContextProvider value={contextValue}>
            <OverviewAndFiltersContainer>
                <OverviewAndFiltersContainerChild>
                    <WebsiteKeywordsPageFilters />
                </OverviewAndFiltersContainerChild>
                <div>
                    {isCompare ? (
                        <KeywordsTableOverviewCompare
                            {...headerData}
                            webSource={filtersStateObject.webSource}
                            isFetching={isLoadingData}
                            breakdown={breakdown}
                            sitesList={Injector.get<any>("chosenSites").sitelistForLegend()}
                            displayType={displayType}
                            setDisplayType={setDisplayType}
                            noData={props.noData}
                            filters={props.filtersStateObject}
                        />
                    ) : (
                        <KeywordsOverviewHeader
                            {...headerData}
                            webSource={filtersStateObject.webSource}
                            isFetching={isLoadingData}
                            dashboard={false}
                            filters={props.filtersStateObject}
                            noData={props.noData}
                        />
                    )}
                </div>
            </OverviewAndFiltersContainer>
            <div>
                <SearchContainer>
                    <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                        placeholder={i18nFilter()("analysis.keywords.boolean.search.placeholder")}
                        onChipAdd={onChipAdd}
                        onChipRemove={onChipRemove}
                        filters={filtersStateObject}
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
