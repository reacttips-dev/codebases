import React from "react";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import { DropdownItemId, DropdownItemType } from "../types";
import { StyledDropdownItem } from "./styles";

type DropdownItemProps = {
    locked?: boolean;
    selected?: boolean;
    className?: string;
    item: DropdownItemType;
    onClick(id: DropdownItemId, group?: string): void;
};

const DropdownItem: React.FC<DropdownItemProps> = ({
    item,
    locked = false,
    selected = false,
    className = null,
    onClick,
}) => {
    return (
        <StyledDropdownItem
            onClick={() => onClick(item.id, item.group)}
            data-automation={`dropdown-item-${item.id}`}
            className={classNames(className, { "selected-item": selected, "locked-item": locked })}
        >
            <span>{item.label}</span>
            {locked && <SWReactIcons iconName="locked" size="xs" />}
        </StyledDropdownItem>
    );
};

export default React.memo(DropdownItem);
