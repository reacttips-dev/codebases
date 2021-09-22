import { NavBarSectionItem } from "@similarweb/ui-components/dist/navigation-bar";
import React, { FC, useCallback, useEffect, useState } from "react";

export interface ISecondaryBarSectionItemProps {
    id: string;
    text: string;
    isInitiallyOpened: boolean;
    hasActiveChild: boolean;
    isLocked?: boolean;
    isSelected?: boolean;
    onClick: (id: string) => void;
    /** Forces children to be passed */
    children: React.ReactNode;
    href: string;
}

export const SecondaryBarSectionItem: FC<ISecondaryBarSectionItemProps> = (props) => {
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

    // since the parent of this component is sometimes an anchor tag, and this
    // component is wrapped in an anchor as well, we need to prevent clicks on
    // this component from navigating to the target that is defined on the parent.
    const handleClick = useCallback(
        (itemId, itemParams, e) => {
            if (hasActiveChild) {
                e.preventDefault();
                return;
            }

            setIsOpened(!isOpened);
            e.preventDefault();
            onClick(itemId);
        },
        [onClick, children, id, isOpened],
    );

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
};
