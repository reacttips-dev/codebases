import * as classNames from "classnames";
import { ProgressBar } from "components/React/ProgressBar";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { changeFilter, i18nFilter, percentageFilter } from "filters/ngFilters";
import { ListComponent } from "pages/digital-marketing/monitor-lists/ListComponent";
import {
    TableHeaderText,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React, { FC, useEffect, useMemo, useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";

import { IKeywordGroup, trackListItemClick } from "../utils";
import {
    ChangeContainer,
    ProgressCellContainer,
    KeywordGroupColumnsHeader,
    KeywordGroupCoreWebsiteCellContainer,
    KeywordGroupTableRowContainer,
    SearchTermHeaderContainer,
    TrafficShareContainer,
    TrafficShareHeaderContainer,
    ChangeHeaderContainer,
    ChangeTextContainer,
    MenuItemsWrapper,
    MenuItem,
    MenuItemText,
} from "../StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container/src/PopupClickContainer";
import swLog from "@similarweb/sw-log";
import TrafficShare from "components/React/Table/FlexTable/cells/TrafficShare";

const i18n = i18nFilter();
const SearchTermColumnHeaderKey = "keywordresearch.monitorkeywords.table.column.header.keyword";
const SearchTrafficColumnHeaderKey =
    "keywordresearch.monitorkeywords.table.column.header.searchTraffic";
const SearchTrafficColumnHeaderTooltipKey =
    "keywordresearch.monitorkeywords.table.column.header.searchTraffic.tooltip";
const ChangeColumnHeaderKey = "keywordresearch.monitorkeywords.table.column.header.change";
const ChangeColumnHeaderTooltipKey =
    "keywordresearch.monitorkeywords.table.column.header.change.tooltip";
const tooltipContainerClass = "plainTooltip-element tooltip--keyword-group-table--container";
const tooltipContentClass = "tooltip--keyword-group-table--content";
const ColumnHeaderSize = 12;
const NumberOfRows = 3;

const ChangePercentage: FC<{ value: number }> = ({ value }) => {
    const classes = classNames("changePercentage", { negative: value < 0, positive: value > 0 });
    const iconClasses = classNames("changePercentage-icon", {
        "sw-icon-arrow-up5": value > 0,
        "sw-icon-arrow-down5": value < 0,
    });
    return (
        <div className={classes}>
            <i className={iconClasses} />
            <ChangeTextContainer>
                {changeFilter()(Math.abs(value), undefined)}
            </ChangeTextContainer>{" "}
        </div>
    );
};

const TableRow = (row, index, routingParams, swNavigator) => {
    const { keyword: searchTerm, change, share } = row;
    const InnerLinkPage = "keywordAnalysis_overview";
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, keyword: searchTerm });
    const keywordClicked = () => {
        trackListItemClick(TrackWithGuidService.trackWithGuid, "analyze keyword", searchTerm);
    };
    return (
        <KeywordGroupTableRowContainer key={index}>
            <KeywordGroupCoreWebsiteCellContainer>
                <Text>
                    <a href={innerLink} onClick={keywordClicked}>
                        {searchTerm}
                    </a>
                </Text>
            </KeywordGroupCoreWebsiteCellContainer>
            <TrafficShareContainer>
                <TrafficShare totalShare={share} />
            </TrafficShareContainer>
            <ChangeContainer>
                <ChangePercentage value={change} />
            </ChangeContainer>
        </KeywordGroupTableRowContainer>
    );
};

export const KeywordGroupTableInner = (props) => {
    const { keywordGroupData, routingParams, currentDateForTooltip, swNavigator } = props;
    const truncatedList = keywordGroupData.data.slice(0, NumberOfRows);
    return (
        <div>
            <KeywordGroupColumnsHeader>
                <SearchTermHeaderContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(SearchTermColumnHeaderKey)}
                    </TableHeaderText>
                </SearchTermHeaderContainer>
                <TrafficShareHeaderContainer>
                    <PlainTooltip
                        cssClass={tooltipContainerClass}
                        cssClassContent={tooltipContentClass}
                        maxWidth={193}
                        placement="top"
                        tooltipContent={i18nFilter()(SearchTrafficColumnHeaderTooltipKey, {
                            date: currentDateForTooltip,
                        })}
                    >
                        <TableHeaderText fontSize={ColumnHeaderSize}>
                            {i18n(SearchTrafficColumnHeaderKey)}
                        </TableHeaderText>
                    </PlainTooltip>
                </TrafficShareHeaderContainer>
                <ChangeHeaderContainer>
                    <PlainTooltip
                        cssClass={tooltipContainerClass}
                        cssClassContent={tooltipContentClass}
                        maxWidth={193}
                        placement="top"
                        tooltipContent={i18nFilter()(ChangeColumnHeaderTooltipKey)}
                    >
                        <TableHeaderText fontSize={ColumnHeaderSize}>
                            {i18n(ChangeColumnHeaderKey)}
                        </TableHeaderText>
                    </PlainTooltip>
                </ChangeHeaderContainer>
            </KeywordGroupColumnsHeader>
            {truncatedList.map((row, index) => TableRow(row, index, routingParams, swNavigator))}
        </div>
    );
};

interface IKeywordGroupTableProps {
    groupData: any;
    isSharedList: boolean;
    onSeeGroupClick: (listId: string) => () => void;
    fetchTableData: (params) => any;
    onEdit?: (keywordGroupId: IKeywordGroup) => () => void;
    onDelete?: (keywordGroup: IKeywordGroup) => () => void;
    onShare?: (group) => () => void;
    tooltipDate?: string;
    defaultCountry: number;
    service: any;
    hasGroupSharingPermissions?: boolean;
}

export const KeywordGroupTable: FC<IKeywordGroupTableProps> = ({
    groupData,
    isSharedList,
    onSeeGroupClick,
    fetchTableData,
    onEdit,
    onDelete,
    onShare,
    tooltipDate,
    defaultCountry,
    service,
    hasGroupSharingPermissions,
}) => {
    const { Id, Name, Keywords, GroupHash } = groupData;
    const [tableData, setTableData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTableData(queryParams);
                setTableData(data);
            } catch (error) {
                swLog.error(
                    `Error fetching table data - KeywordGroupTable - Name: ${Name}, Id: ${Id} -- ${error}`,
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [Keywords.length, Keywords.join(), fetchTableData, Id, defaultCountry]);

    const countryForSubtitle = defaultCountry ?? 999;

    const { from, to } = useMemo(
        () => service.durationService.getDurationData("3m", "", "KeywordAnalysis").forAPI,
        [],
    );

    const queryParams = {
        country: countryForSubtitle,
        from,
        to,
        isWindow: false,
        sort: "share",
        asc: false,
        KeywordsGroup: Id,
        includeSubDomains: true,
        KeywordSource: "both",
        WebSource: "Desktop",
        groupHash: GroupHash,
    };

    const routingParams = {
        country: countryForSubtitle,
        webSource: "Total",
        mtd: false,
        duration: "3m",
    };

    const subtitleFilters = useMemo(
        () => [
            {
                value: i18n("keywordresearch.monitorkeywords.table.subtitle.keywords.count", {
                    keywordCount: Keywords.length,
                }),
            },
            {
                filter: "country",
                countryCode: countryForSubtitle,
                value: service.countryService.getCountryById(countryForSubtitle).text,
            },
        ],
        [Keywords?.length, service, defaultCountry],
    );

    const config = {
        width: 128,
        height: hasGroupSharingPermissions ? 152 : 104,
        enabled: true,
        placement: "ontop-right",
        cssClassContent: "keyword-group-table--menu",
        cssClass: "keyword-group-table--menu-container",
    };

    const getMenuContent = () => (
        <MenuItemsWrapper justifyContent={"space-between"}>
            <MenuItem
                alignItems={"center"}
                onClick={onEdit(groupData)}
                hasAllMenuItems={hasGroupSharingPermissions}
            >
                <SWReactIcons iconName="edit-icon" size={"sm"} />
                <MenuItemText>
                    {i18n("keywordresearch.monitorkeywords.table.menu.edit")}
                </MenuItemText>
            </MenuItem>
            <MenuItem
                alignItems={"center"}
                onClick={onDelete(groupData)}
                hasAllMenuItems={hasGroupSharingPermissions}
            >
                <SWReactIcons iconName="delete" size={"sm"} />
                <MenuItemText>
                    {i18n("keywordresearch.monitorkeywords.table.menu.delete")}
                </MenuItemText>
            </MenuItem>
            {hasGroupSharingPermissions && (
                <MenuItem alignItems={"center"} onClick={onShare(groupData)} hasAllMenuItems={true}>
                    <SWReactIcons iconName="social-share" size={"sm"} />
                    <MenuItemText>
                        {i18n("keywordresearch.monitorkeywords.table.menu.share")}
                    </MenuItemText>
                </MenuItem>
            )}
        </MenuItemsWrapper>
    );

    const HeaderActionComponent = () =>
        isSharedList ? (
            <PlainTooltip
                cssClass={tooltipContainerClass}
                cssClassContent={tooltipContentClass}
                maxWidth={193}
                tooltipContent={i18n("keyword.groups.sharing.sharedby", {
                    name: groupData.sharedBy ?? groupData.UserId,
                })}
            >
                <div>
                    <SWReactIcons iconName="social-share" size="sm" />
                </div>
            </PlainTooltip>
        ) : (
            <PopupClickContainer
                config={config}
                content={getMenuContent}
                appendTo={`.keyword-group-table-${Id}`}
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
            wrapperClassName={`keyword-group-table-${Id}`}
            footerText={"keywordresearch.monitorkeywords.button.go"}
            innerTableComponent={
                <KeywordGroupTableInner
                    keywordGroupData={tableData}
                    routingParams={routingParams}
                    currentDateForTooltip={tooltipDate}
                    swNavigator={service.swNavigator}
                />
            }
        />
    );
};
