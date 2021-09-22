import { swSettings } from "common/services/swSettings";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import React, { FC, useCallback, useState } from "react";
import {
    NavBarGroupItemWithButton,
    NavBarGroupItemWithMenu,
} from "@similarweb/ui-components/dist/navigation-bar";

interface ISalesWorkspaceLeadsGroupProps {
    selectedId: string;
    leadsGroupItems: JSX.Element[];
    menuItems: () => JSX.Element[];
    onMenuToggle?: (isOpened: boolean) => void;
    onCreateNewListClick: VoidFunction;
    onMenuItemClick?: VoidFunction;
}

export const SalesWorkspaceLeadsGroup: FC<ISalesWorkspaceLeadsGroupProps> = ({
    selectedId,
    leadsGroupItems,
    menuItems,
    onCreateNewListClick,
    onMenuToggle,
    onMenuItemClick,
}) => {
    const [isGroupOpened, setIsGroupOpened] = useState(true);

    const handleGroupClick = useCallback(() => {
        setIsGroupOpened(!isGroupOpened);
    }, [isGroupOpened, setIsGroupOpened]);

    const savedSearchesEnabled =
        swSettings?.components?.SalesWorkspace?.resources?.ShowSavedSearches ?? false;

    const isCollapsed = isGroupOpened || selectedId !== OVERVIEW_ID;

    const renderGroupComponent = (translate) =>
        savedSearchesEnabled ? (
            <NavBarGroupItemWithButton
                id="arenas-group"
                text={translate("workspaces.sales.opportunity-lists.title")}
                isOpened={isCollapsed}
                onClick={handleGroupClick}
                onButtonClick={onCreateNewListClick}
                buttonIcon="plus"
            >
                {leadsGroupItems}
            </NavBarGroupItemWithButton>
        ) : (
            <NavBarGroupItemWithMenu
                id={"keywords-group"}
                text={translate("workspaces.sales.opportunity-lists.title")}
                isOpened={isCollapsed}
                onClick={handleGroupClick}
                getMenuItems={menuItems}
                onMenuToggle={onMenuToggle}
                onMenuItemClick={onMenuItemClick}
                menuWidth={"256px"}
                isLocked={false}
            >
                {leadsGroupItems}
            </NavBarGroupItemWithMenu>
        );

    return <WithTranslation>{(translate) => renderGroupComponent(translate)}</WithTranslation>;
};
