import { SwNavigator } from "common/services/swNavigator";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import {
    NavBarGroupItemWithButton,
    NavBarGroupItemWithMenu,
    NavBarSimpleItem,
    NavBarIcon,
    NavBarSectionItem,
} from "@similarweb/ui-components/dist/navigation-bar";
import { adaptKeyowrdsData } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/Services/MarketingWorkspaceDataHandler";
import { IMarketingWorkspaceKeywordGroup } from "../../MarketingWorkspaceNavBarBodyTypes";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import { IKeywordGroup } from "userdata";
import { EmptyGroupItemWithMenu } from "../../NavItems/EmptyGroupItemWithMenu";
import { IMarketingWorkspaceServices } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBodyTypes";
import { EmptyGroupItem } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/NavItems/EmptyGroupItem";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { GroupDropdownMenuItem } from "../../NavGroupComponents/GroupDropdownMenuItem";
import { i18nFilter } from "filters/ngFilters";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";

interface IMarketingWorkspaceKeywordsGroupProps {
    services: IMarketingWorkspaceServices;
    keywordGroups: IMarketingWorkspaceKeywordGroup[];
    sharedKeywordGroups: IMarketingWorkspaceKeywordGroup[];
    selectedKeywordGroupId?: string;
    countryId: string;
    workspaceId: string;
    hasKeywordsGenerator: boolean;
}

const EmptySharedGroupsItem = styled.i`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    padding-left: 32px;
    display: inline-block;
    margin-bottom: 6px;
`;

const StyledNavBarSimpleItem = styled(NavBarSimpleItem)`
    ${SWReactIcons} {
        svg {
            path {
                fill: ${({ isSelected }) => (isSelected ? colorsPalettes.blue["400"] : "auto")};
            }
        }
    }
`;

const linkKeywordGroupToWorkspace = async (
    group: IKeywordGroup,
    workspaceId: string,
): Promise<void> => {
    try {
        await marketingWorkspaceApiService.linkKeywordGroupToWorkspace(group.Id, workspaceId);
        marketingWorkspaceGo("marketingWorkspace-keywordGroup", {
            workspaceId: workspaceId,
            keywordGroupId: group.Id,
        });
    } catch (e) {}
};

const goToKeywordGenerator = (navigator: SwNavigator): void => {
    navigator.go("marketingWorkspace-keywordGeneratorTool");
};

export const MarketingWorkspacesKeywordsGroup: FC<IMarketingWorkspaceKeywordsGroupProps> = (
    props,
) => {
    const {
        services,
        keywordGroups,
        sharedKeywordGroups,
        countryId,
        selectedKeywordGroupId,
        workspaceId,
        hasKeywordsGenerator,
    } = props;

    const [isGroupOpened, setIsGroupOpened] = useState(true);
    const [isMyListsOpened, setIsMyListsOpened] = useState(true);
    const [isSharedListsOpened, setIsShardListsOpened] = useState(true);
    const [isOpen, setIsOpen] = useState<boolean>();

    const toggleMyLists = useCallback(() => {
        setIsMyListsOpened(!isMyListsOpened);
    }, [isMyListsOpened]);

    const toggleSharedLists = useCallback(() => {
        setIsShardListsOpened(!isSharedListsOpened);
    }, [isSharedListsOpened]);

    const openKeywordListModal = () => {
        setIsOpen(true);
    };

    const keywordGroupsData = useMemo(
        () => adaptKeyowrdsData(keywordGroups, countryId, services).filter((group) => group.linked),
        [keywordGroups, countryId, services],
    );

    const sharedKeywordGroupsData = useMemo(
        () => adaptKeyowrdsData(sharedKeywordGroups, countryId, services),
        [sharedKeywordGroups, countryId, services],
    );

    const hasKeywordGroupsData = useMemo(() => {
        return keywordGroupsData && keywordGroupsData.length > 0;
    }, [keywordGroupsData]);

    const hasSharedKeywordGroupsData = useMemo(() => {
        return sharedKeywordGroupsData && sharedKeywordGroupsData.length > 0;
    }, [sharedKeywordGroupsData]);

    const hasSelectedKeywordGroup = useMemo(() => {
        return keywordGroupsData?.some((kwg) => kwg.id === selectedKeywordGroupId) ?? false;
    }, [keywordGroupsData, selectedKeywordGroupId]);

    // In case the current nav item has no keyword groups, or a subitem (keyword group)
    // was selected - we want to make sure that it is opened, and cannot be closed
    useEffect(() => {
        if (hasSelectedKeywordGroup || !hasKeywordGroupsData) {
            setIsGroupOpened(true);
        }
    }, [hasKeywordGroupsData, hasSelectedKeywordGroup, setIsGroupOpened]);

    const renderMenuItems = useCallback(() => {
        return [
            <GroupDropdownMenuItem
                key={"keyword-list"}
                id={"keywordList"}
                title={services.translate("keyword.generator.tool.add.group.dropdown.upload.title")}
                description={services.translate(
                    "keyword.generator.tool.add.group.dropdown.upload.description",
                )}
                iconName="add"
            />,
            <GroupDropdownMenuItem
                key={"keyword-generator"}
                id={"keywordGenerator"}
                title={services.translate("keyword.generator.tool.add.group.dropdown.tool.title")}
                description={services.translate(
                    "keyword.generator.tool.add.group.dropdown.tool.description",
                )}
                iconName="wand"
            />,
        ];
    }, []);

    const handleMenuItemClick = useCallback(
        (item) => {
            switch (item.id) {
                case "keywordList":
                    openKeywordListModal();
                    return;

                case "keywordGenerator":
                    goToKeywordGenerator(services.swNavigator);
                    return;

                default:
                    return;
            }
        },
        [workspaceId, services],
    );

    const handleGroupClick = useCallback(() => {
        /**
         * We want to keep the nav item constantly opened (ignore user toggle) in cases
         * where it has a selected keyword group (to avoid closing the nav item when it has a selected child)
         * or in cases where it has no items at all. (so that the user will see the "add new item" message)
         */
        if (hasSelectedKeywordGroup || !hasKeywordGroupsData) {
            return;
        }
        setIsGroupOpened(!isGroupOpened);
    }, [isGroupOpened, setIsGroupOpened, hasSelectedKeywordGroup, hasKeywordGroupsData]);

    const renderKeywordGroupItems = useCallback(() => {
        return keywordGroupsData.map((kwGroup) => {
            const hasKeywordItems = kwGroup.totalItems > 0;
            const groupText = hasKeywordItems
                ? `${kwGroup.name} (${kwGroup.totalItems})`
                : `${kwGroup.name}`;
            return (
                <StyledNavBarSimpleItem
                    key={kwGroup.id}
                    id={kwGroup.id}
                    text={groupText}
                    isSelected={kwGroup.id === selectedKeywordGroupId}
                    onClick={kwGroup.onClick}
                    icon={kwGroup.isShared && <SWReactIcons iconName="users" size="xs" />}
                />
            );
        });
    }, [keywordGroupsData, selectedKeywordGroupId]);

    const renderSharedKeywordGroupItems = useCallback(() => {
        return sharedKeywordGroupsData.map((kwGroup) => {
            const hasKeywordItems = kwGroup.totalItems > 0;
            const groupText = hasKeywordItems
                ? `${kwGroup.name} (${kwGroup.totalItems})`
                : `${kwGroup.name}`;

            return (
                <NavBarSimpleItem
                    key={kwGroup.id}
                    id={kwGroup.id}
                    text={groupText}
                    isSelected={kwGroup.id === selectedKeywordGroupId}
                    onClick={kwGroup.onClick}
                />
            );
        });
    }, [keywordGroupsData, selectedKeywordGroupId]);

    const renderEmptyGroupItem = useCallback(() => {
        // The empty group item can be one of two types: a group item with menu, or a group item
        // with button that leads to a single action. this depends on whether the user has multiple
        // choices. (depends on their permissions)
        return hasKeywordsGenerator ? (
            <EmptyGroupItemWithMenu
                text={services.translate("workspaces.marketing.sidenav.keywordgroups.new.text")}
                buttonText={services.translate(`workspaces.marketing.sidenav.keywordgroups.new`)}
                onMenuItemClick={handleMenuItemClick}
                getMenuItems={renderMenuItems}
            />
        ) : (
            <EmptyGroupItem
                text={services.translate("workspaces.marketing.sidenav.keywordgroups.new.text")}
                buttonText={services.translate(`workspaces.marketing.sidenav.keywordgroups.new`)}
                onButtonClick={() => openKeywordListModal()}
            />
        );
    }, [handleMenuItemClick, renderMenuItems, services, hasKeywordsGenerator, workspaceId]);

    const rendreEmptySharedGroupsItem = useCallback(() => {
        return (
            <EmptySharedGroupsItem>
                {services.translate("workspaces.marketing.sidenav.keywordgroups.sharedlists.empty")}
            </EmptySharedGroupsItem>
        );
    }, [handleMenuItemClick, renderMenuItems, services, hasKeywordsGenerator, workspaceId]);
    // In case the user has no keyword groups, we should render an item that prompts the user
    // to create a keyword group.
    const keywordGroupItems = hasKeywordGroupsData
        ? renderKeywordGroupItems()
        : renderEmptyGroupItem();

    const sharedKeywordGroupItems = hasSharedKeywordGroupsData
        ? renderSharedKeywordGroupItems()
        : rendreEmptySharedGroupsItem();

    // The group component can be one of two types: a group item with menu, or a group item with single action. this depends on whether the user has the keywords generator feature available or not.
    // in case the user does have the keywords generator - then he has multiple tools for creating keyword groups
    // and therefore needs a menu to pick an action from.
    const groupComponent = (
        <>
            {hasKeywordsGenerator ? (
                <NavBarGroupItemWithMenu
                    id={"keywords-group"}
                    text={services.translate("workspaces.marketing.sidenav.keywordgroups")}
                    isOpened={isGroupOpened}
                    onClick={handleGroupClick}
                    getMenuItems={renderMenuItems}
                    onMenuItemClick={handleMenuItemClick}
                    menuWidth={"328px"}
                    isLocked={false}
                    renderIconToggle={(isOpen) => (
                        <NavBarIcon
                            iconName="nav-keyword-group"
                            iconSize="xs"
                            iconColor={colorsPalettes.navigation.ICON_DARK}
                        />
                    )}
                >
                    <NavBarSectionItem
                        id="my-kw-lists"
                        key="my-kw-lists"
                        text={i18nFilter()("workspaces.marketing.sidenav.keywordgroups.mylists")}
                        isLocked={false}
                        isOpened={isMyListsOpened}
                        isSelected={false}
                        onClick={toggleMyLists}
                    >
                        {keywordGroupItems}
                    </NavBarSectionItem>
                    <NavBarSectionItem
                        id="shared-lists"
                        key="shared-lists"
                        text={i18nFilter()(
                            "workspaces.marketing.sidenav.keywordgroups.sharedlists",
                        )}
                        isLocked={false}
                        isOpened={isSharedListsOpened}
                        isSelected={false}
                        onClick={toggleSharedLists}
                    >
                        {sharedKeywordGroupItems}
                    </NavBarSectionItem>
                </NavBarGroupItemWithMenu>
            ) : (
                <NavBarGroupItemWithButton
                    id={"keywords-group"}
                    text={services.translate("workspaces.marketing.sidenav.keywordgroups")}
                    isOpened={isGroupOpened}
                    onClick={handleGroupClick}
                    onButtonClick={() => openKeywordListModal()}
                    isLocked={false}
                    renderIconToggle={(isOpen) => (
                        <NavBarIcon
                            iconName="nav-keyword-group"
                            iconSize="xs"
                            iconColor={colorsPalettes.navigation.ICON_DARK}
                        />
                    )}
                >
                    {keywordGroupItems}
                </NavBarGroupItemWithButton>
            )}
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={{} as any}
                hideViewGroupLink
                onSave={(group) => linkKeywordGroupToWorkspace(group, workspaceId)}
            />
        </>
    );

    return groupComponent;
};
