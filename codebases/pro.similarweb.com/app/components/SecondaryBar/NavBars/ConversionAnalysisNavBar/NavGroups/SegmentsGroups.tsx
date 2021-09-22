import { SecondaryBarMenuGroupItem } from "components/SecondaryBar/Components/SecondaryBarMenuGroupItem";
import {
    groupMenuActions,
    isGroupSegmentSelected,
} from "components/SecondaryBar/NavBars/ConversionAnalysisNavBar/utils";
import { i18nFilter } from "filters/ngFilters";
import { colorsPalettes } from "@similarweb/styles";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import React, { FC } from "react";
import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import CountryService from "services/CountryService";
import styled from "styled-components";
import { NavBarItemWithWebsite } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarItemWithWebsite/NavBarItemWithWebsite";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { CreateNewButton } from "@similarweb/ui-components/dist/side-nav/src/components/CreateNewButton";

const i18n = i18nFilter();

const GoToHomePageNavBarItem = styled(NavBarGroupItemWithIcon)``;

const CreateNewButtonWrapper = styled.div`
    margin: 0 0 16px 8px;
`;

interface ISegmentGroupsProps {
    country: string;
    segments: ISegmentsData;
    groups: any;
    onMenuToggle: () => void;
    onGroupClick: (group) => void;
    onSegmentClick: (groupId: string, segment, isOssClick: boolean) => void;
    onAllGroupsClick: () => void;
    onCreateNewClick: () => void;
    handleMenuItemClick: any;
    selectedGroupId: string;
    selectedSegmentId: string;
}

export const SegmentsGroups: FC<ISegmentGroupsProps> = ({
    country,
    segments,
    groups,
    onMenuToggle,
    onGroupClick,
    onSegmentClick,
    onAllGroupsClick,
    onCreateNewClick,
    handleMenuItemClick,
    selectedGroupId,
    selectedSegmentId,
}) => {
    const handleGroupClick = (group) => () => {
        if (group.id === selectedGroupId && !selectedSegmentId) {
            return;
        }
        onGroupClick(group);
    };

    const handleSegmentClick = (groupId, segment, isOssClick = false) => () => {
        onSegmentClick(groupId, segment, isOssClick);
    };

    const getCountriesAvailableContent = (availableCountriesCodes) => {
        if (!country) {
            return "";
        }
        const currentCountry = CountryService.getCountryById(country);

        const availableCountriesArray = [];
        availableCountriesCodes.map((availableCountryCode) => {
            availableCountriesArray.push(
                `${CountryService.getCountryById(availableCountryCode).text}`,
            );
        });
        const availableCountries = availableCountriesArray.join(", ");
        return `${currentCountry.text} is not available, try switching to ${availableCountries}`;
    };

    const menuItemsConfig = [
        {
            id: groupMenuActions.DELETE,
            iconName: "delete",
            text: i18n("conversion.module.side.nav.additional.options.delete"),
            disabled: false,
        },
        {
            id: groupMenuActions.RENAME,
            iconName: "edit-icon",
            text: i18n("conversion.module.side.nav.additional.options.rename"),
            disabled: false,
        },
        {
            id: groupMenuActions.ADD,
            iconName: "add",
            text: i18n("conversion.module.side.nav.additional.options.add"),
            disabled: false,
        },
        {
            id: groupMenuActions.REMOVE,
            iconName: "clear-circle",
            text: i18n("conversion.module.side.nav.additional.options.remove"),
            disabled: false,
        },
    ];

    const buildMenuItems = (menuItemsConfig) => (): JSX.Element[] => {
        return menuItemsConfig.map((menuItemConfig) => {
            return (
                <EllipsisDropdownItem
                    key={menuItemConfig.id}
                    id={menuItemConfig.id}
                    iconName={menuItemConfig.iconName}
                    disabled={menuItemConfig.disabled}
                >
                    {menuItemConfig.text}
                </EllipsisDropdownItem>
            );
        });
    };

    const buildSegmentItemsOfCurrentGroup = (customSegments, groupId) => {
        return customSegments?.map((customSegment) => {
            const domainSegment = segments?.segmentDomains[customSegment.domain];
            const isDisabled = !customSegment.countries?.includes(parseInt(country, 10));
            const isOssDisabled =
                ConversionSegmentsUtils.getSegmentOssUserCountries(customSegment).length === 0;
            const segmentName =
                customSegment.segmentName && customSegment.segmentName.trim().length > 0
                    ? customSegment.segmentName
                    : null;

            return (
                <NavBarItemWithWebsite
                    key={`${customSegment.id}-${groupId}`}
                    id={customSegment.id}
                    primaryText={customSegment.domain}
                    secondaryText={segmentName ? segmentName : undefined}
                    isSelected={
                        customSegment.id === selectedSegmentId && groupId === selectedGroupId
                    }
                    onClick={handleSegmentClick(groupId, customSegment)}
                    onIconButtonClick={handleSegmentClick(groupId, customSegment, true)}
                    forceShowIcon={true}
                    itemIcon={!isOssDisabled ? "oss" : undefined}
                    websiteIconSrc={domainSegment.favicon}
                    iconTooltipContent={i18n("conversion.sidenav.oss.icon.tooltip")}
                    primaryTextTooltipContent={
                        isDisabled
                            ? getCountriesAvailableContent(customSegment.countries)
                            : undefined
                    }
                    secondaryTextTooltipContent={
                        segmentName ? `${domainSegment.domain} – ${segmentName}` : undefined
                    }
                />
            );
        });
    };

    const buildGroupItems = () => {
        return groups?.map((group) => {
            return (
                <SecondaryBarMenuGroupItem
                    buttonIconColor={colorsPalettes.navigation.ICON_DARK}
                    getMenuItems={buildMenuItems(menuItemsConfig)}
                    onMenuItemClick={(menuItem) =>
                        handleMenuItemClick(group.id, country, menuItem.id)()
                    }
                    onMenuToggle={onMenuToggle}
                    key={group.id}
                    id={group.id}
                    text={group.name}
                    isSelected={group.id === selectedGroupId && !selectedSegmentId}
                    buttonIcon={"dots-more"}
                    isLocked={false}
                    onGroupNameClick={handleGroupClick(group)}
                    isInitiallyOpened={isGroupSegmentSelected(group)}
                >
                    {buildSegmentItemsOfCurrentGroup(group?.segments, group.id)}
                </SecondaryBarMenuGroupItem>
            );
        });
    };

    return (
        <>
            <CreateNewButtonWrapper>
                <CreateNewButton
                    onClick={onCreateNewClick}
                    dataAutomation="nav-list-add-market-button"
                >
                    {`+ ${i18n("conversion.sidenav.create.new")}`}
                </CreateNewButton>
            </CreateNewButtonWrapper>

            <GoToHomePageNavBarItem
                id={"conversion.homepage.label"}
                text={i18n("conversion.homepage.label")}
                isSelected={false}
                isOpened={false}
                iconName={"dashboard"}
                onClick={onAllGroupsClick}
            >
                <span></span>
            </GoToHomePageNavBarItem>

            {buildGroupItems()}
        </>
    );
};
