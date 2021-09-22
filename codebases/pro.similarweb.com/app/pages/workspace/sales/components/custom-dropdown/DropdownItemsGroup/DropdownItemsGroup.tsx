import React from "react";
import { StyledGroupTitle } from "./styles";
import { SWReactIcons } from "@similarweb/icons";
import DropdownItem from "../DropdownItem/DropdownItem";
import { DropdownItemId, DropdownItemType } from "../types";

type DropdownItemsGroupProps = {
    title: string;
    icon?: string;
    className?: string;
    items: DropdownItemType[];
    itemsLocked?: boolean;
    selectedItemId: DropdownItemId;
    onItemClick(id: DropdownItemId, group?: string): void;
};

const DropdownItemsGroup: React.FC<DropdownItemsGroupProps> = ({
    icon,
    items,
    title,
    onItemClick,
    selectedItemId,
    className = null,
    itemsLocked = false,
}) => {
    return (
        <div className={className}>
            <StyledGroupTitle>
                {icon && <SWReactIcons size="sm" iconName={icon} />}
                <span>{title}</span>
            </StyledGroupTitle>
            <div>
                {items.map((item) => (
                    <DropdownItem
                        item={item}
                        key={item.id}
                        locked={itemsLocked}
                        onClick={onItemClick}
                        selected={selectedItemId === item.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(DropdownItemsGroup);
