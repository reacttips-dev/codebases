/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useCallback, useMemo } from "react";
import { NavBarHeaderWithMenu } from "@similarweb/ui-components/dist/navigation-bar";
import { SimpleHoverDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { openUnlockModal } from "services/ModalService";
import { IMultipleWorkspacesHeaderProps } from "./MarketingWorkspaceNavBarHeaderTypes";

/**
 * Resolves the target navigation state for the workspace menu item in case the user
 * clicks on it.
 */
const resolveWorkspaceNavState = (workspace: IMarketingWorkspace) => {
    const hasArenas = workspace.arenas.length > 0;
    const hasWebsiteGroups = workspace.customIndustries.length > 0;
    const hasKeywordGroups = workspace.keywordGroups.length > 0;
    if (hasArenas) {
        return {
            stateName: "marketingWorkspace-arena",
            navParams: {
                workspaceId: workspace.id,
                arenaId: workspace.arenas[0].id,
            },
        };
    } else if (hasWebsiteGroups) {
        return {
            stateName: "marketingWorkspace-websiteGroup",
            navParams: {
                workspaceId: workspace.id,
                websiteGroupId: workspace.customIndustries[0].id,
            },
        };
    } else if (hasKeywordGroups) {
        return {
            stateName: "marketingWorkspace-keywordGroup",
            navParams: {
                workspaceId: workspace.id,
                keywordGroupId: workspace.keywordGroups[0].id,
            },
        };
    }
};

export const MultipleWorkspacesHeader: FC<IMultipleWorkspacesHeaderProps> = (props) => {
    const {
        headerTitle,
        allWorkspaces,
        maxAllowedWorkspaces,
        services,
        selectedWorkspaceId,
    } = props;

    /**
     * Workspace menu items config, this is used for resolving the target nav state
     * when a user clicks on a menu item/
     */
    const menuItemsConfig = useMemo(() => {
        const workspaceItems = allWorkspaces.map((workspace, index) => {
            const workspaceNavState = resolveWorkspaceNavState(workspace);

            return {
                key: `${workspace.id}${index}`,
                id: workspace.id,
                name: workspace.friendlyName,
                onClick: () => {
                    if (workspaceNavState?.stateName) {
                        services.swNavigator.go(
                            workspaceNavState.stateName,
                            workspaceNavState.navParams,
                        );
                    }
                },
            };
        });

        const newWorkspaceItem = {
            key: `new-workspace-item`,
            id: "new-workspace-item",
            name: services.translate("workspaces.marketing.sidenav.newworkspace"),
            onClick: () => {
                const workspacesCount = allWorkspaces.length;
                if (workspacesCount >= maxAllowedWorkspaces) {
                    openUnlockModal(
                        { modal: "MarketingWorkspace" },
                        "Hook PRO/Home/Modules/Custom Categories/Upgrade button/click",
                    );
                } else {
                    services.swNavigator.go("marketingWorkspace-new");
                }
            },
        };

        return [...workspaceItems, newWorkspaceItem];
    }, [allWorkspaces, services]);

    const handleMenuItemClick = useCallback(
        (item: { id: string }) => {
            const itemConfig = menuItemsConfig.find((menuItem) => menuItem.id === item.id);
            if (!itemConfig) {
                return;
            }

            itemConfig.onClick();
        },
        [menuItemsConfig],
    );

    const buildMenuItems = useCallback(() => {
        return menuItemsConfig.map((item) => {
            return (
                <SimpleHoverDropdownItem key={item.key} id={item.id}>
                    {item.name}
                </SimpleHoverDropdownItem>
            );
        });
    }, [menuItemsConfig, handleMenuItemClick]);

    const handleHeaderClick = useCallback(() => {
        handleMenuItemClick({ id: selectedWorkspaceId });
    }, [handleMenuItemClick, selectedWorkspaceId]);

    return (
        <NavBarHeaderWithMenu
            text={headerTitle}
            onClick={handleHeaderClick}
            onMenuItemClick={handleMenuItemClick}
            getMenuItems={buildMenuItems}
        />
    );
};
