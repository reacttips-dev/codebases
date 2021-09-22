import React, { FC, useMemo, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import { SWReactTableOptimized } from "components/React/Table/SWReactTableOptimized";
import { SWReactIcons } from "@similarweb/icons";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import { tableColumns } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotColumns";
import {
    ArrowIcon,
    Box,
    BoxNotClickable,
    Grid,
    PixelPlaceholderLoaderStyled,
    SearchSerpContainer,
    SerpCount,
    SerpName,
    SERPWidgetCloseIconButton,
    SerpWidgetTableTitleContainer,
    SerpWidgetTableTitleText,
    SerpWidgetTitleText,
    SWReactTableOptimizedStyled,
    TitleContainer,
    WidgetTableWrapper,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { ISERPRecord } from "pages/keyword-analysis/serp-snapshot/types";
import { SWReactTableWrapperFooter } from "components/React/Table/SWReactTableWrapper";
import { Pagination, PaginationInput } from "@similarweb/ui-components/dist/pagination";
import * as _ from "lodash";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { invertSortDirection } from "UtilitiesAndConstants/UtilityFunctions/sort";
import { NoSerpData } from "pages/keyword-analysis/serp-snapshot/NoSerpData";

const DEFAULT_SORT = "position";
const LOADER_WIDTH = 200;
const LOADER_HEIGHT = 56;
const ITEMS_PER_PAGE = 5;

interface ISERPSnapshotTableTopWidgets {
    serpRecords: Record<string, ISERPRecord>;
    noSerpRecords: boolean;
    lastScrapeDate?: string;
    isLoadingData: boolean;
}

export const SERPSnapshotTableTopWidgets: FC<ISERPSnapshotTableTopWidgets> = (props) => {
    const { serpRecords, noSerpRecords, lastScrapeDate, isLoadingData } = props;
    const [serpFeatureTable, setSerpFeatureTable] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [page, setPage] = useState(0);
    const [pageDataChunks, setPageDataChunks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(false);

    const onBoxClick = (serpName) => {
        TrackWithGuidService.trackWithGuid("serp.widget.click", "click", { serpName: serpName });
        if (serpFeatureTable === serpName) {
            setSerpFeatureTable("");
        } else {
            setSerpFeatureTable(serpName);
            const records = serpRecords[serpName].records;
            const totalRecords = records.length;
            setShowPagination(totalRecords > ITEMS_PER_PAGE);
            setTotalPages(Math.ceil(totalRecords / ITEMS_PER_PAGE));
            setPageDataChunks(_.chunk(records, ITEMS_PER_PAGE));
            setPage(0);
        }
    };

    const onPageChange = (selectedPage) => {
        selectedPage--;
        switch (true) {
            case selectedPage > totalPages - 1:
                setPage(totalPages - 1);
                break;
            case selectedPage < 0:
                setPage(0);
                break;
            case selectedPage === page:
                return;
            default:
                setPage(selectedPage);
                break;
        }
    };

    const SerpBox = ({ serpFeature, isSelected }) => {
        if (serpFeature) {
            const serpName = serpFeature.serpFeature;
            return (
                <Box onClick={() => onBoxClick(serpName)} isSelected={isSelected}>
                    <SWReactIcons iconName={SERP_MAP[serpName].icon} size={"xs"} />
                    <div style={{ paddingLeft: "24px" }}>
                        <SerpName>{SERP_MAP[serpName].name}</SerpName>
                        <SerpCount>{serpFeature.records.length} websites</SerpCount>
                    </div>
                </Box>
            );
        }
    };
    const SerpBoxNotClickable = ({ serpFeature }) => {
        if (serpFeature) {
            const serpName = serpFeature.serpFeature;
            return (
                <BoxNotClickable>
                    <SWReactIcons iconName={SERP_MAP[serpName].icon} size={"xs"} />
                    <div style={{ paddingLeft: "24px" }}>
                        <SerpName>{SERP_MAP[serpName].name}</SerpName>
                    </div>
                </BoxNotClickable>
            );
        }
    };

    const Table = () => {
        return (
            <WidgetTableWrapper>
                <SWReactTableOptimizedStyled>
                    <SerpWidgetTableTitleContainer>
                        <SerpWidgetTableTitleText>
                            {i18nFilter()("serp.top.table.widget.table.title", {
                                name: SERP_MAP[serpFeatureTable].name,
                            })}
                        </SerpWidgetTableTitleText>
                        <SERPWidgetCloseIconButton
                            type="flat"
                            onClick={() => setSerpFeatureTable("")}
                            iconName="clear"
                            placement="left"
                            iconSize="xs"
                        />
                    </SerpWidgetTableTitleContainer>
                    <SWReactTableOptimized
                        tableData={{ Data: pageDataChunks[page], pageSize: ITEMS_PER_PAGE }}
                        tableColumns={widgetColumns}
                        onSort={onSort}
                        tableOptions={tableOptions}
                    />
                    <SWReactTableWrapperFooter>
                        {showPagination && (
                            <Pagination
                                page={page + 1}
                                itemsPerPage={ITEMS_PER_PAGE}
                                itemsCount={serpRecords[serpFeatureTable].records.length}
                                handlePageChange={onPageChange}
                                captionElement={PaginationInput}
                                hasItemsPerPageSelect={false}
                            />
                        )}
                    </SWReactTableWrapperFooter>
                </SWReactTableOptimizedStyled>
            </WidgetTableWrapper>
        );
    };

    const onSort = ({ sortDirection }) => {
        const sort = invertSortDirection(sortDirection);
        const records = serpRecords[serpFeatureTable].records;
        const sortedData = _.orderBy(records, "currentPosition", sort);
        setSortDirection(sort);
        setPageDataChunks(_.chunk(sortedData, ITEMS_PER_PAGE));
    };

    const widgetColumns = useMemo(
        () =>
            tableColumns.getWidgetTableColumnsConfig({
                sortedColumn: DEFAULT_SORT,
                sortDirection: sortDirection,
            }),
        [sortDirection],
    );
    const Loader = () => {
        return (
            <div style={{ display: "flex" }}>
                <PixelPlaceholderLoaderStyled width={LOADER_WIDTH} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoaderStyled width={LOADER_WIDTH} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoaderStyled width={LOADER_WIDTH} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoaderStyled width={LOADER_WIDTH} height={LOADER_HEIGHT} />
            </div>
        );
    };

    const tableOptions = {};
    if (noSerpRecords) {
        return <NoSerpData />;
    }
    return (
        <div>
            <SearchSerpContainer>
                {isLoadingData ? (
                    <Loader />
                ) : (
                    <>
                        {Object.keys(serpRecords).length ? (
                            <>
                                <SerpWidgetTitleText>
                                    {i18nFilter()("serp.top.table.widgets.title")}
                                </SerpWidgetTitleText>
                                <Grid>
                                    {Object.keys(serpRecords).map((item, index) => {
                                        const serp = serpRecords[item];
                                        const isCurrentlySelected =
                                            serpFeatureTable === serp.serpFeature;
                                        const itemElement = serp.records.length ? (
                                            <div style={{ position: "relative" }}>
                                                <SerpBox
                                                    serpFeature={serp}
                                                    isSelected={isCurrentlySelected}
                                                />
                                                {isCurrentlySelected && (
                                                    <ArrowIcon>
                                                        <SWReactIcons
                                                            iconName="arrow-blue-border"
                                                            size={"sm"}
                                                        />
                                                    </ArrowIcon>
                                                )}
                                            </div>
                                        ) : (
                                            <SerpBoxNotClickable serpFeature={serp} />
                                        );

                                        if (isCurrentlySelected) {
                                            return (
                                                <>
                                                    {itemElement}
                                                    <Table />
                                                </>
                                            );
                                        }
                                        return itemElement;
                                    })}
                                </Grid>
                            </>
                        ) : null}
                    </>
                )}
            </SearchSerpContainer>
        </div>
    );
};
