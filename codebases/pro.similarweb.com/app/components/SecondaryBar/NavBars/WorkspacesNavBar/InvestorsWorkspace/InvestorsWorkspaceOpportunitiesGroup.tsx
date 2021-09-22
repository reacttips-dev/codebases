import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import React, { FC, useCallback, useState } from "react";
import { NavBarGroupItemWithMenu } from "@similarweb/ui-components/dist/navigation-bar";

interface IInvestorsWorkspaceOpportunitiesGroup {
    selectedId: string;
    opportunitiesGroupItems: JSX.Element[];
    menuItems: () => JSX.Element[];
    onCreateNewListClick: VoidFunction;
    onMenuItemClick?: VoidFunction;
}

export const InvestorsWorkspaceOpportunitiesGroup: FC<IInvestorsWorkspaceOpportunitiesGroup> = ({
    selectedId,
    opportunitiesGroupItems,
    menuItems,
    onMenuItemClick,
    onCreateNewListClick,
}) => {
    const [isGroupOpened, setIsGroupOpened] = useState(true);

    const handleGroupClick = useCallback(() => {
        setIsGroupOpened(!isGroupOpened);
    }, [isGroupOpened, setIsGroupOpened]);

    const isCollapsed = isGroupOpened || selectedId !== OVERVIEW_ID;

    return (
        <WithTranslation>
            {(translate) => (
                <NavBarGroupItemWithMenu
                    id={"keywords-group"}
                    text={translate("workspaces.investors.opportunity-lists.title")}
                    isOpened={isCollapsed}
                    onClick={handleGroupClick}
                    getMenuItems={menuItems}
                    onMenuItemClick={onMenuItemClick}
                    menuWidth={"256px"}
                    isLocked={false}
                >
                    {opportunitiesGroupItems}
                </NavBarGroupItemWithMenu>
            )}
        </WithTranslation>
    );
};
