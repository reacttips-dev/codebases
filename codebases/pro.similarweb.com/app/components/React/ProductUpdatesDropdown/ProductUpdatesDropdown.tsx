import React, { SyntheticEvent } from "react";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";
import {
    UserSettingsDropDownItem,
    UserSettingsDropDownLink,
} from "../UserSettingDropdown/UserSettingDropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTrack } from "components/WithTrack/src/useTrack";

interface ProductUpdatesDropdown {
    onClick: () => void;
    onChildClick: () => void;
    onToggle: (isOpen: boolean, isOutsideClick: boolean, e: SyntheticEvent) => void;
}

const ProductUpdatesDropdown: React.FC<ProductUpdatesDropdown> = ({
    onToggle,
    onChildClick,
    onClick,
}): JSX.Element => {
    const dropdownClasses = "DropdownContent-container UserSettingsDropDownContent-container";
    const translate = useTranslation();
    const [trackLegacy, trackWithGuid] = useTrack();

    const onToggleInternal = (
        isOpen: boolean,
        isOutsideClick: boolean,
        e: SyntheticEvent,
    ): void => {
        onToggle(isOpen, isOutsideClick, e);
    };

    const onClickInternal = (item): void => {
        if (item.onClick) {
            item.onClick();
        }

        onChildClick();
    };

    const onClickItem = (title) => {
        trackWithGuid("product_board.dropdown.click", "click", {
            // eslint-disable-next-line @typescript-eslint/camelcase
            item_name: title,
        });
    };

    const getDropdownContent = (): JSX.Element[] => {
        return [
            <UserSettingsDropDownItem key="product-updates-dmi">
                <UserSettingsDropDownLink
                    onClick={() => onClickItem(translate("product_board.items.DMI"))}
                    preventDefault={false}
                    href="/#/product-updates/dmi"
                >
                    {translate("product_board.items.DMI")}
                </UserSettingsDropDownLink>
            </UserSettingsDropDownItem>,
            <UserSettingsDropDownItem key="product-updates-ri">
                <UserSettingsDropDownLink
                    onClick={() => onClickItem(translate("product_board.items.RI"))}
                    preventDefault={false}
                    href="/#/product-updates/ri"
                >
                    {translate("product_board.items.RI")}
                </UserSettingsDropDownLink>
            </UserSettingsDropDownItem>,
        ];
    };

    return (
        <Dropdown
            width={270}
            dropdownPopupHeight={400}
            buttonWidth={"auto"}
            appendTo={"body"}
            dropdownPopupPlacement="right"
            cssClassContainer={dropdownClasses}
            onClick={onClickInternal}
            onToggle={onToggleInternal}
        >
            {[
                <IconSidebarItem
                    key="product-updates"
                    icon={"report-product"}
                    title={translate("product_board.sidebar_item.title")}
                    onItemClick={onClick}
                />,
                ...getDropdownContent(),
            ]}
        </Dropdown>
    );
};

export default ProductUpdatesDropdown;
