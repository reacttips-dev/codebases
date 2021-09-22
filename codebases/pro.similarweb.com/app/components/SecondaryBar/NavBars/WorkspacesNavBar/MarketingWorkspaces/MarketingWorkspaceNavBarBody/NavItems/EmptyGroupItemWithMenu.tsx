/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { IEmptyGroupItemWithMenuProps } from "./EmptyGroupItemTypes";
import { ItemContainer, TextContainer } from "./EmptyGroupItemStyles";

export const EmptyGroupItemWithMenu = (props: IEmptyGroupItemWithMenuProps) => {
    const {
        text,
        buttonText,
        onButtonClick,
        onMenuItemClick,
        getMenuItems,
        menuWidth = "328px",
    } = props;

    const menuContents = [
        <Button key="menuButton" type="flat" onClick={onButtonClick}>
            {buttonText}
        </Button>,
        ...getMenuItems(),
    ];

    return (
        <ItemContainer>
            <TextContainer>{text}</TextContainer>
            <Dropdown
                appendTo="body"
                dropdownPopupPlacement={"bottom-left"}
                width={menuWidth}
                onClick={onMenuItemClick}
                closeOnItemClick={true}
            >
                {menuContents}
            </Dropdown>
        </ItemContainer>
    );
};
