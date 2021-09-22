import { useState } from "react";
import { IGalleryProps } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import {
    DropdownWrapper,
    FilterText,
    SortWrapper,
    StyledSwitcher,
    StyledSWReactIcons,
} from "../../common/StyledComponents";
import I18n from "components/WithTranslation/src/I18n";
import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { WebSourceToChannelType } from "pages/website-analysis/traffic-sources/ads/channels";
import { NoDataState } from "pages/website-analysis/traffic-sources/display-ads/common/EmptyState";
import { TilesContainer } from "pages/website-analysis/traffic-sources/display-ads/common/TilesContainer";
import {
    LAST_SEEN,
    sortFields,
    ACTIVE_DAYS,
    FIRST_SEEN,
} from "pages/website-analysis/traffic-sources/ads/availableFilters";
import { CircleSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const SortOrder = {
    asc: 0,
    desc: 1,
};

interface ISortFields {
    id: string;
    key: string;
    text: string;
    value: string;
}
export const VideosGallery = (props: IGalleryProps) => {
    const {
        initialTilesList,
        webSource,
        onSortChange,
        initialSort,
        params,
        selectedFilters,
        tilesEndpoint,
    } = props;

    const infoTexts = {
        [LAST_SEEN]: "traffic.sources.creatives.gallery.sort.last-seen.info-text",
        [ACTIVE_DAYS]: "traffic.sources.creatives.gallery.sort.active-days.info-text",
        [FIRST_SEEN]: "traffic.sources.creatives.gallery.sort.first-seen.info-text",
    };
    const sortItems = sortFields[WebSourceToChannelType[webSource]].map((item: ISortFields) => ({
        ...item,
        key: item.value,
        tooltipText: infoTexts[item.value],
    }));
    const initialSortType = initialSort ? initialSort.split(" ")[0] : LAST_SEEN;
    const initialSortOrder = initialSort ? SortOrder[initialSort.split(" ")[1]] : SortOrder.desc;
    const [selectedSort, setSelectedSort] = useState<ISortFields>(
        sortItems.find((i) => i.key === initialSortType),
    );
    const [selectedOrder, setSelectedOrder] = useState<number>(initialSortOrder);

    const getOrderButton = () => {
        const onOrderChange = (value) => {
            setSelectedOrder(value);
            const sortValue = Object.keys(SortOrder).find((key) => SortOrder[key] === value);
            onSortChange(`${selectedSort.key} ${sortValue}`);

            TrackWithGuidService.trackWithGuid(
                "websiteanalysis.trafficsources.ads.videos.sort.direction.filter",
                "click",
                { direction: sortValue },
            );
        };

        return (
            <StyledSwitcher
                selectedIndex={selectedOrder}
                customClass="CircleSwitcher"
                onItemClick={onOrderChange}
            >
                {[
                    <PlainTooltip
                        placement="top"
                        tooltipContent={i18nFilter()(
                            "traffic.sources.creatives.gallery.order.asc.tooltip",
                        )}
                    >
                        <div>
                            <CircleSwitcherItem
                                key={SortOrder.asc}
                                disabled={false}
                                selected={selectedOrder === SortOrder.asc}
                            >
                                <StyledSWReactIcons
                                    iconName="arrow-up-grey"
                                    size="xs"
                                    isClicked={selectedOrder === SortOrder.asc}
                                />
                            </CircleSwitcherItem>
                        </div>
                    </PlainTooltip>,
                    <PlainTooltip
                        placement="top"
                        tooltipContent={i18nFilter()(
                            "traffic.sources.creatives.gallery.order.desc.tooltip",
                        )}
                    >
                        <div>
                            <CircleSwitcherItem
                                key={SortOrder.desc}
                                disabled={false}
                                selected={selectedOrder === SortOrder.desc}
                            >
                                <StyledSWReactIcons
                                    iconName="arrow-down-grey"
                                    size="xs"
                                    isClicked={selectedOrder === SortOrder.desc}
                                />
                            </CircleSwitcherItem>
                        </div>
                    </PlainTooltip>,
                ]}
            </StyledSwitcher>
        );
    };

    const getDropdown = () => {
        const onDropdownChanged = (value) => {
            setSelectedSort(sortItems.find((i) => i.key === value.id));
            onSortChange(
                `${value.id} ${Object.keys(SortOrder).find(
                    (key) => SortOrder[key] === selectedOrder,
                )}`,
            );

            TrackWithGuidService.trackWithGuid(
                "websiteanalysis.trafficsources.ads.videos.sort.filter",
                "click",
                { kind: value.children },
            );
        };
        return (
            <DropdownWrapper>
                <Dropdown
                    selectedIds={{ [selectedSort.value]: true }}
                    onClick={onDropdownChanged}
                    width={"151px"}
                    dropdownPopupPlacement="ontop-left"
                >
                    {[
                        <DropdownButton key={"button"} width={151}>
                            {sortItems.find((item) => item.key === selectedSort.key).text}
                        </DropdownButton>,
                        ...sortItems.map((f) => (
                            <EllipsisDropdownItem
                                key={f.id}
                                id={f.value}
                                tooltipText={i18nFilter()(f.tooltipText)}
                            >
                                {f.text}
                            </EllipsisDropdownItem>
                        )),
                    ]}
                </Dropdown>
            </DropdownWrapper>
        );
    };

    return (
        <>
            <SortWrapper>
                <FilterText>
                    <I18n>traffic.sources.creatives.gallery.sort.by</I18n>
                </FilterText>
                {getDropdown()}
                <FilterText>
                    <I18n>traffic.sources.creatives.gallery.order</I18n>
                </FilterText>
                {getOrderButton()}
            </SortWrapper>
            {initialTilesList && initialTilesList.length > 0 ? (
                <TilesContainer
                    initialTilesList={initialTilesList}
                    params={params}
                    selectedFilters={selectedFilters}
                    tilesEndpoint={tilesEndpoint}
                />
            ) : (
                <NoDataState />
            )}
        </>
    );
};
