import React, { FC } from "react";
import { IDashboardNavItemConfig } from "components/SecondaryBar/NavBars/DashboardsNavBar/DashboardNavBarTypes";
import {
    NavBarInputItem,
    NavBarItemWithMenu,
    NavBarSimpleItem,
} from "@similarweb/ui-components/dist/navigation-bar";
import { DeleteConfirmationTooltip } from "@similarweb/ui-components/dist/side-nav/src/components/DeleteConfirmationTooltip";
import { DeleteUnShareConfirmationTooltip } from "@similarweb/ui-components/dist/side-nav/src/components/DeleteUnShareConfirmationTooltip";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import styled from "styled-components";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";

interface IDashboardNavItemProps {
    itemConfig: IDashboardNavItemConfig;
    onClick: (id: string) => void;
    getMenuItems: () => React.ReactElement[];
    onMenuItemClick: (menuItem: any, navItem: IDashboardNavItemConfig) => void;
    onCancelDelete: () => void;
    onConfirmDelete: (navItem: IDashboardNavItemConfig) => void;
    onConfirmEdit: (newItemText: string) => void;
    onCancelEdit: () => void;
}

const ItemDeleteContainer = styled.div`
    border-radius: 6px;
    background-color: white;
`;

const ItemLoaderContainer = styled.div`
    border-radius: 6px;
    height: 32px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
`;

export const DashboardNavItem: FC<IDashboardNavItemProps> = (props) => {
    const {
        itemConfig,
        onClick,
        getMenuItems,
        onMenuItemClick,
        onCancelDelete,
        onConfirmDelete,
        onConfirmEdit,
        onCancelEdit,
    } = props;

    const renderItemWithMenu = (): JSX.Element => {
        return (
            <NavBarItemWithMenu
                key={itemConfig.id}
                id={itemConfig.id}
                text={itemConfig.title}
                isSelected={!itemConfig.deletePopUpIsOpen && itemConfig.isActive}
                onClick={onClick}
                getMenuItems={getMenuItems}
                onMenuItemClick={(menuItem) => onMenuItemClick(menuItem, itemConfig)}
                itemIcon={itemConfig.isSharedByMe ? "social-share" : null}
            />
        );
    };

    const renderDeleteConfirmationTooltip = (): JSX.Element => {
        // The user should be notified that his item will be unshared
        // from other users
        return itemConfig.isSharedByMe ? (
            <DeleteUnShareConfirmationTooltip
                onConfirm={() => onConfirmDelete(itemConfig)}
                onCancel={() => onCancelDelete()}
            />
        ) : (
            <DeleteConfirmationTooltip
                onConfirm={() => onConfirmDelete(itemConfig)}
                onCancel={() => onCancelDelete()}
            />
        );
    };

    const renderItemWithDeleteTooltip = (): JSX.Element => {
        return (
            <PopupClickContainer
                content={renderDeleteConfirmationTooltip}
                config={{
                    placement: "right",
                    cssClass: "deleteConfirmation--tooltip",
                    width: 415,
                    defaultOpen: true,
                    onToggle: (isOpen: boolean, isOutsideClick: boolean) =>
                        isOutsideClick && onCancelDelete(),
                }}
            >
                <ItemDeleteContainer>
                    <NavBarSimpleItem
                        id={itemConfig.id}
                        text={itemConfig.title}
                        isSelected={false}
                    />
                </ItemDeleteContainer>
            </PopupClickContainer>
        );
    };

    const renderEditableItem = (): JSX.Element => {
        return (
            <NavBarInputItem
                id={itemConfig.id}
                text={itemConfig.title}
                isInputFocused={true}
                isInputSelected={true}
                onItemEditConfirm={onConfirmEdit}
                onItemEditCancel={onCancelEdit}
            />
        );
    };

    const renderLoader = (): JSX.Element => {
        return (
            <ItemLoaderContainer>
                <DotsLoader />
            </ItemLoaderContainer>
        );
    };

    if (itemConfig.isLoading) {
        return renderLoader();
    }

    if (itemConfig.isEditable) {
        return renderEditableItem();
    }

    if (itemConfig.deletePopUpIsOpen) {
        return renderItemWithDeleteTooltip();
    }

    return renderItemWithMenu();
};
