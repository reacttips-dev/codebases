import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { ChangePercentage } from "components/React/Table/cells";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { RightAlignedCell } from "components/React/Table/cells/RankCell";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { MinNumberCell } from "components/Workspace/TableCells/MinNumberCell";
import { i18nFilter } from "filters/ngFilters";
import { ListComponent } from "pages/digital-marketing/monitor-lists/ListComponent";
import React, { FC, useEffect, useMemo, useState } from "react";
import { allTrackers } from "services/track/track";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { MenuItem, MenuItemsWrapper, MenuItemText } from "../StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container/src/PopupClickContainer";
import { IPartnerList, trackListItemClick } from "../utils";

const i18n = i18nFilter();
const DefaultInnerLinkState = "affiliateanalysis_performanceoverview";
const DomainColumnHeaderKey = "affiliateresearch.monitorpartners.table.column.header.domain";
const TotalOutgoingTrafficColumnHeaderKey =
    "affiliateresearch.monitorpartners.table.column.header.outgoingTraffic";
const TotalOutgoingTrafficColumnHeaderTooltipKey =
    "affiliateresearch.monitorpartners.table.column.header.outgoingTraffic.tooltip";
const TrafficTrendChangeColumnHeaderKey =
    "affiliateresearch.monitorpartners.table.column.header.change";
const TrafficTrendChangeColumnHeaderTooltipKey =
    "affiliateresearch.monitorpartners.table.column.header.change.tooltip";
const TooltipContainerClass = "plainTooltip-element tooltip--partner-list-table--container";
const TooltipContentClass = "tooltip--partner-list-table--content";
const TableSubtitlePartnersCountKey =
    "affiliateresearch.monitorpartners.table.subtitle.partners.count";

export const getPartnerListColumnsConfig = (translate, track, navigator, partnerList, country) => {
    return [
        {
            field: "affiliateDomain",
            displayName: translate(DomainColumnHeaderKey),
            headerComponent: DefaultCellHeader,
            cellComponent: ({ value, row }) => {
                const props = {
                    domain: value,
                    icon: row.affiliateFavicon,
                    internalLink: navigator.href(DefaultInnerLinkState, {
                        key: value,
                        country: country,
                        duration: "3m",
                        webSource: "Total",
                        isWWW: "*",
                    }),
                    trackInternalLink: (e) => {
                        e.stopPropagation();
                        trackListItemClick(
                            TrackWithGuidService.trackWithGuid,
                            "analyze website",
                            value,
                        );
                    },
                    externalLink: `http://${value}`,
                    trackExternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("External Link", "click", `Table/${value}`);
                    },
                    hideTrackButton: true,
                };
                return <CoreWebsiteCell {...props} />;
            },
            width: "44%",
        },
        {
            field: "affiliateTotalOutgoingTraffic",
            displayName: translate(TotalOutgoingTrafficColumnHeaderKey),
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: ({ value, row }) => {
                if (typeof value !== "undefined") {
                    return <MinNumberCell value={value} />;
                } else {
                    return <RightAlignedCell>-</RightAlignedCell>;
                }
            },
            cellClass: "outgoingTraffic-cell",
            tooltip: translate(TotalOutgoingTrafficColumnHeaderTooltipKey),
            tooltipProps: {
                cssClass: TooltipContainerClass,
                cssClassContent: TooltipContentClass,
                maxWidth: 193,
                placement: "top",
            },
            width: "32%",
            isSorted: true,
            sortDirection: "desc",
        },
        {
            field: "affiliateTrafficTrendChange",
            displayName: translate(TrafficTrendChangeColumnHeaderKey),
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: ChangePercentage,
            tooltip: translate(TrafficTrendChangeColumnHeaderTooltipKey),
            tooltipProps: {
                cssClass: TooltipContainerClass,
                cssClassContent: TooltipContentClass,
                maxWidth: 193,
                placement: "top",
            },
            width: "24%",
        },
    ];
};

interface IPartnerListProps {
    groupData: IPartnerList;
    onSeeGroupClick: (listId: string) => () => void;
    fetchTableData: (keywordGroupId: string, params) => any;
    onEdit?: (partnerListId: string) => () => void;
    onDelete?: (partnerList: IPartnerList) => () => void;
    tooltipDate?: string;
    defaultCountry: number;
    service: any;
}

export const PartnerList: FC<IPartnerListProps> = ({
    groupData,
    onSeeGroupClick,
    fetchTableData,
    onEdit,
    onDelete,
    defaultCountry,
    service,
}) => {
    const currentCountry = defaultCountry ?? 999;
    const { CategoryHash, Id, Name, Domains } = groupData;
    const [tableData, setTableData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTableData(Id, queryParams);
                setTableData([...data.records].slice(0, 3));
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [Domains.join(), Domains.length, Id, fetchTableData]);

    const { from, to } = useMemo(
        () => service.durationService.getDurationData("3m", "", "KeywordAnalysis").forAPI,
        [],
    );

    const queryParams = {
        country: currentCountry,
        from,
        to,
        isWindow: false,
        webSource: "Total",
        groupHash: CategoryHash,
        sort: "affiliateTotalOutgoingTraffic",
        asc: false,
        rowsPerPage: 100,
        keywordsType: "both",
        includeSubDomains: true,
    };

    const subtitleFilters = useMemo(
        () => [
            {
                value: i18n(TableSubtitlePartnersCountKey, {
                    partnerCount: Domains.length,
                }),
            },
            {
                filter: "country",
                countryCode: currentCountry,
                value: service.countryService.getCountryById(currentCountry).text,
            },
        ],
        [Domains?.length, service, defaultCountry],
    );

    const config = {
        width: 128,
        height: 104,
        enabled: true,
        placement: "ontop-right",
        cssClassContent: "partner-list-table--menu",
        cssClass: "partner-list-table--menu-container",
    };

    const getMenuContent = () => (
        <MenuItemsWrapper justifyContent={"space-between"}>
            <MenuItem alignItems={"center"} onClick={onEdit(groupData.Id)} hasAllMenuItems={false}>
                <SWReactIcons iconName="edit-icon" size={"sm"} />
                <MenuItemText>
                    {i18n("affiliateresearch.monitorpartners.table.menu.edit")}
                </MenuItemText>
            </MenuItem>
            <MenuItem alignItems={"center"} onClick={onDelete(groupData)} hasAllMenuItems={false}>
                <SWReactIcons iconName="delete" size={"sm"} />
                <MenuItemText>
                    {i18n("affiliateresearch.monitorpartners.table.menu.delete")}
                </MenuItemText>
            </MenuItem>
        </MenuItemsWrapper>
    );

    const HeaderActionComponent = () => (
        <PopupClickContainer
            config={config}
            content={getMenuContent}
            appendTo={`.partner-list-table-${Id}`}
        >
            <div>
                <IconButton iconName={"dots-more"} type={"flat"} iconSize={"sm"} />
            </div>
        </PopupClickContainer>
    );

    return (
        <ListComponent
            title={Name}
            list={groupData}
            subtitleFilters={subtitleFilters}
            headerActionComponent={<HeaderActionComponent />}
            isLoading={isLoading}
            tableData={tableData}
            onSeeListClick={onSeeGroupClick}
            wrapperClassName={`partner-list-table-${Id}`}
            footerText={"affiliateresearch.monitorpartners.button.go"}
            innerTableComponent={
                !!tableData ? (
                    <MiniFlexTable
                        data={tableData}
                        columns={getPartnerListColumnsConfig(
                            service.translate,
                            service.track,
                            service.swNavigator,
                            groupData,
                            currentCountry,
                        )}
                    />
                ) : null
            }
        />
    );
};
