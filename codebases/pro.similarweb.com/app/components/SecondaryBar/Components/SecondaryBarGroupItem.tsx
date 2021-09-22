import { NavBarGroupItem, NavBarSectionItem } from "@similarweb/ui-components/dist/navigation-bar";
import React, { useCallback, useEffect, useState } from "react";

export interface ISecondaryBarGroupItemProps {
    id: string;
    text: string;
    isInitiallyOpened: boolean;
    hasActiveChild: boolean;
    isLocked?: boolean;
    isSelected?: boolean;
    onClick: (id: string) => void;
    /** Forces children to be passed */
    children: React.ReactNode;
    href?: string;
}

export function SecondaryBarGroupItem(props: ISecondaryBarGroupItemProps) {
    const {
        id,
        text,
        isInitiallyOpened,
        hasActiveChild,
        onClick,
        children,
        isLocked,
        isSelected,
        href,
    } = props;

    const [isOpened, setIsOpened] = useState(isInitiallyOpened);

    useEffect(() => {
        if (hasActiveChild) {
            setIsOpened(true);
        }
    }, [hasActiveChild]);

    const handleClick = useCallback(() => {
        if (hasActiveChild) {
            return;
        }

        onClick(id);
        setIsOpened(!isOpened);
    }, [onClick, children, id, isOpened]);

    return (
        <NavBarSectionItem
            href={href}
            id={id}
            text={text}
            isOpened={isOpened || hasActiveChild}
            onClick={handleClick}
            isSelected={isSelected}
            isLocked={isLocked}
        >
            {children}
        </NavBarSectionItem>
    );
}
