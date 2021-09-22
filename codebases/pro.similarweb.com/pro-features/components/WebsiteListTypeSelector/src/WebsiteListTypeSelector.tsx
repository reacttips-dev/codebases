import { Dropdown, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled from "styled-components";
import { WebsiteListTypeSelectorItem } from "./WebsiteListTypeSelectorItem";
import { SWReactIcons } from "@similarweb/icons";
import { ECategoryType } from "common/services/categoryService.types";

export const ListTypeIconWrapper = styled.div`
    margin: -14px 8px 0px 0px;
`;

export const WEBSITE_LIST_TYPES = {
    General: {
        id: ECategoryType.GENERAL_LIST,
        title: "websites.lists.types.general",
        description: "websites.lists.types.general.description",
    },
    PartnersList: {
        id: ECategoryType.PARTNERS_LIST,
        title: "websites.lists.types.partners",
        description: "websites.lists.types.partners.description",
    },
};

export interface IWebsiteListTypeSelectorProps {
    onListTypeSelect: (typeId) => void;
    buttonWidth?: string;
    containerClass?: string;
    bubbleClass?: string;
    bubbleDirection?: "right" | "left";
    dropdownPopupPlacement?: string;
    onDropDownToggle?: (isOpen) => void;
    hideNotification?: boolean;
    disabled?: boolean;
    appendTo?: string;
    selectedListType?: string;
}

interface IWebsiteListTypeSelectorState {
    selectedListType: string;
}

export class WebsiteListTypeSelector extends React.Component<
    IWebsiteListTypeSelectorProps,
    IWebsiteListTypeSelectorState
> {
    private i18n: any;
    private static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };
    private static defaultProps = {
        dropdownPopupPlacement: "bottom-left",
    };

    private getListTypeTextById = (listId) => {
        switch (listId) {
            case ECategoryType.GENERAL_LIST:
                return this.i18n(WEBSITE_LIST_TYPES.General.title);
            case ECategoryType.PARTNERS_LIST:
                return this.i18n(WEBSITE_LIST_TYPES.PartnersList.title);
            default:
                return this.i18n("websites.lists.types.undefined");
        }
    };

    private onListTypeSelectProxy = (selectedTypeId) => {
        return () => {
            this.track("Drop Down", "click", `Website List Type/${selectedTypeId}`);
            this.setState({ selectedListType: selectedTypeId });
            this.props.onListTypeSelect(selectedTypeId);
        };
    };

    private track = (category, action, name) => {
        this.context.track(category, action, name);
    };

    constructor(props, context) {
        super(props, context);
        this.i18n = context.translate;
        this.state = {
            selectedListType: props.selectedListType,
        };
    }

    public render() {
        const { buttonWidth, containerClass, dropdownPopupPlacement, disabled } = this.props;
        const { translate } = this.context;
        const cssClassContainer = `DropdownContent-container Popup-content--pro-dropdown ${containerClass}`;
        let selectedTypeIcon = null;
        switch (this.state.selectedListType) {
            case ECategoryType.GENERAL_LIST:
                selectedTypeIcon = "custom-category";
                break;
            case ECategoryType.PARTNERS_LIST:
                selectedTypeIcon = "partners-list";
                break;
        }

        return (
            <>
                <Dropdown
                    appendTo={this.props.appendTo}
                    cssClassContainer={cssClassContainer}
                    dropdownPopupPlacement={dropdownPopupPlacement}
                    buttonWidth={buttonWidth}
                >
                    <DropdownButton
                        cssClass="DropdownButton--filtersBarDropdownButton"
                        height="initial"
                        disabled={disabled}
                        key="websiteListSelectorButton"
                    >
                        {selectedTypeIcon && (
                            <ListTypeIconWrapper>
                                <SWReactIcons size="xs" iconName={selectedTypeIcon} />
                            </ListTypeIconWrapper>
                        )}
                        <div>{this.getListTypeTextById(this.state.selectedListType)}</div>
                    </DropdownButton>
                    {GenericType(this.onListTypeSelectProxy(ECategoryType.GENERAL_LIST), translate)}
                    {PartnerType(
                        this.onListTypeSelectProxy(ECategoryType.PARTNERS_LIST),
                        translate,
                    )}
                </Dropdown>
            </>
        );
    }
}

const GenericType = (onClick, translate) => {
    return (
        <WebsiteListTypeSelectorItem
            closePopupOnClick={true}
            preventDefault={true}
            onClick={onClick}
            iconName="custom-category"
            description={translate(WEBSITE_LIST_TYPES.General.description)}
            title={translate(WEBSITE_LIST_TYPES.General.title)}
        />
    );
};

const PartnerType = (onClick, translate) => {
    return (
        <WebsiteListTypeSelectorItem
            closePopupOnClick={true}
            preventDefault={true}
            onClick={onClick}
            iconName="partners-list"
            description={translate(WEBSITE_LIST_TYPES.PartnersList.description)}
            title={translate(WEBSITE_LIST_TYPES.PartnersList.title)}
        />
    );
};
