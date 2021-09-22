import { IconButton } from "@similarweb/ui-components/dist/button";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { ListItemTitleContext } from "@similarweb/ui-components/dist/workspace-sidenav";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { CSSProperties, StatelessComponent } from "react";
import styled from "styled-components";
import { Injector } from "../../../scripts/common/ioc/Injector";

export interface IConversionNavAdditionalOptionsProps {
    onClickEdit: (action: string, gid, country) => void;
    onClickRename: (gid) => void;
    onClickDelete: (gid) => void;
    onToggleEllipsis: (a: boolean) => void;
    useSettingsBtn?: boolean;
    dropDownStyle?: CSSProperties;
}

const DropdownContainer = styled.div`
    width: 37px;
    position: relative;
`;
DropdownContainer.displayName = "DropdownContainer";

export const ConversionNavEllipsisButton = styled.div.attrs<{ forceShow?: boolean }>({
    children: <IconButton type="flat" iconName="dots-more" />,
})<{ forceShow?: boolean }>`
    opacity: ${({ forceShow }) => (forceShow ? 1 : 0)};
    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
ConversionNavEllipsisButton.displayName = "ConversionNavEllipsisButton";

export const ConversionNavAdditionalOptions: StatelessComponent<IConversionNavAdditionalOptionsProps> = ({
    onClickRename,
    onClickDelete,
    onToggleEllipsis,
    onClickEdit,
    useSettingsBtn,
    dropDownStyle,
}) => {
    const [isDropdownOpen, setDropdownOpen] = React.useState(false);
    const { gid, country } = Injector.get<any>("swNavigator").getParams();
    function createActionsMenuContent(itemTitleId) {
        return [
            useSettingsBtn ? (
                <IconButton
                    iconSize="sm"
                    type="flat"
                    iconName="settings"
                    key="ConversionNavSettingsButton"
                />
            ) : (
                <ConversionNavEllipsisButton
                    key="ConversionNavEllipsisButton"
                    forceShow={isDropdownOpen}
                />
            ),
            {
                id: "add",
                iconName: "add",
                text: i18nFilter()("conversion.module.side.nav.additional.options.add"),
                onClickFunc: () => onClickEdit("add", useSettingsBtn ? gid : itemTitleId, country),
            },
            {
                id: "remove",
                iconName: "clear-circle",
                text: i18nFilter()("conversion.module.side.nav.additional.options.remove"),
                onClickFunc: () =>
                    onClickEdit("remove", useSettingsBtn ? gid : itemTitleId, country),
            },
            {
                id: "rename",
                iconName: "edit-icon",
                text: i18nFilter()("conversion.module.side.nav.additional.options.rename"),
                onClickFunc: () => onClickRename(useSettingsBtn ? gid : itemTitleId),
            },
            {
                id: "delete",
                iconName: "delete",
                text: i18nFilter()("conversion.module.side.nav.additional.options.delete"),
                onClickFunc: () => onClickDelete(useSettingsBtn ? gid : itemTitleId),
            },
        ];
    }
    const { Consumer } = ListItemTitleContext;
    const onToggleEllipsisCallBack = (isOpen) => {
        onToggleEllipsis(isOpen);
        setDropdownOpen(isOpen);
    };
    return (
        <Consumer>
            {({ itemTitleId }) => {
                return (
                    <DropdownContainer style={dropDownStyle}>
                        <Dropdown
                            appendTo={"body"}
                            cssClassContainer={
                                "DropdownContent-container conversion-side-nav-additional"
                            }
                            dropdownPopupPlacement={"bottom-left"}
                            buttonWidth="40px"
                            width="230px"
                            itemsComponent={EllipsisDropdownItem}
                            onClick={(action) => action.onClickFunc(action.id)}
                            onToggle={onToggleEllipsisCallBack}
                        >
                            {createActionsMenuContent(itemTitleId)}
                        </Dropdown>
                    </DropdownContainer>
                );
            }}
        </Consumer>
    );
};
