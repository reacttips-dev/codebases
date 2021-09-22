import { NavBarGroupItemWithMenu } from "@similarweb/ui-components/dist/navigation-bar";
import React, { SyntheticEvent, useCallback, useState } from "react";

export interface ISecondaryBarMenuGroupItemProps {
    id: string;
    text: string;
    isInitiallyOpened: boolean;
    isLocked?: boolean;
    isSelected?: boolean;
    onGroupToggleIconClick?: (e: SyntheticEvent, isOpened?: boolean) => void;
    onGroupNameClick?: () => void;
    buttonIcon?: string;
    onMenuToggle?: (isOpened?: boolean) => void;
    onMenuItemClick: (item: any) => void;
    getMenuItems: () => React.ReactNode[];
    buttonIconColor?: string;
    /** Forces children to be passed */
    children: React.ReactNode;
}

export function SecondaryBarMenuGroupItem(props: ISecondaryBarMenuGroupItemProps) {
    const {
        id,
        text,
        isLocked,
        isSelected,
        buttonIcon,
        buttonIconColor,
        isInitiallyOpened,
        getMenuItems,
        onMenuToggle,
        onMenuItemClick,
        onGroupNameClick,
        onGroupToggleIconClick,
        children,
    } = props;

    const [isGroupOpened, setIsGroupOpened] = useState(isInitiallyOpened);
    const [showButton, setShowButton] = useState(false);

    const handleGroupToggleIconClick = (e) => {
        if (onGroupToggleIconClick) {
            onGroupToggleIconClick(e);
        }

        setIsGroupOpened((isGroupOpened) => !isGroupOpened);
    };

    const handleMenuToggle = (isOpened) => {
        if (onMenuToggle) {
            onMenuToggle(isOpened);
        }

        setShowButton(isOpened);
    };

    return (
        <NavBarGroupItemWithMenu
            id={id}
            text={text}
            isOpened={isGroupOpened}
            onClick={onGroupNameClick}
            isSelected={isSelected}
            isLocked={isLocked}
            onGroupToggleIconClick={handleGroupToggleIconClick}
            buttonIcon={buttonIcon}
            forceShowButton={showButton}
            onMenuToggle={handleMenuToggle}
            onMenuItemClick={onMenuItemClick}
            getMenuItems={getMenuItems}
            buttonIconColor={buttonIconColor}
        >
            {children}
        </NavBarGroupItemWithMenu>
    );
}
