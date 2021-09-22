import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    EllipsisDropdownItem,
    IDropDownItem,
    NoBorderButton,
    TextWrapper,
} from "@similarweb/ui-components/dist/dropdown";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled, { css } from "styled-components";

import { ECategoryType } from "common/services/categoryService.types";
import TrackProvider from "../../WithTrack/src/TrackProvider";
import I18n from "../../WithTranslation/src/I18n";
import TranslationProvider from "../../WithTranslation/src/TranslationProvider";
import { TableSelectionKeywordsWarning } from "./TableSelectionKeywordsWarning";
import { TableSelectionNewGroup } from "./TableSelectionNewGroup";

const DropDownButton = styled(NoBorderButton)`
    ${TextWrapper} {
        color: ${colorsPalettes.carbon[0]};
    }
    .SWReactIcons path {
        fill: ${colorsPalettes.carbon[0]};
    }
}`;

const DropDownItem = styled(EllipsisDropdownItem)<
    IDropDownItem & { iconName: string; iconSize: string }
>`
    ${css`
        svg {
            width: 100%;
            height: 100%;
        }
    `}
`;

const ItemStyled = styled(EllipsisDropdownItem)<any>`
  padding: 0 18px;
  margin-bottom: 1px;
  position: relative;
  ${({ appendSeparator }) =>
      appendSeparator &&
      css`
          &:after {
              content: "";
              width: calc(100% - 16px);
              height: 1px;
              background-color: ${colorsPalettes.carbon[100]};
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
          }
      `}
  ${({ disableHover }) =>
      disableHover &&
      css`
          &:hover {
              background-color: inherit;
              cursor: default;
          }
      `}
  svg {
    width: 100%;
    height: 100%;
    }
  }
`;

export enum ETableSelectionNewGroupDropdownMode {
    NEW_GROUP,
    ALL_ITEMS_EXISTS,
    MAX_ITEMS,
    GROUP_LIST,
}

interface ITableSelectionNewGroupDropdownProps {
    mode?: ETableSelectionNewGroupDropdownMode;
    groups: Array<{ id: string; text: string }>;
    onSubmit: (name: string) => void;
    isLoading: boolean;
    error?: boolean;
    errorMessage?: string;
    currentGroup?: string;
    onGroupClick?: (item?) => void;
    onCancel?: () => void;
    count?: number;
    appendTo?: string;
    groupIconName?: string;
    newGroupNameLabel: string;
    trackingCategory?: string;
    allItemsExistsMessage?: string;
    maxItemsMessage?: string;
    newGroupItemText: string;
    onListTypeSelect?: (typeId) => void;
    groupType?: "website" | "keyword" | "segment";
    selectedListType?: ECategoryType;
    renderDropdownButton?: () => React.ReactElement;
    onToggleDropdown?: (isOpen: boolean) => void;
}

interface ITableSelectionNewGroupDropdownState {
    isOpen: boolean;
    groupName: string;
}

// height of popup - first item size - top & bottom padding
const scrollAreaHeight = 256 - 48 - 8 * 2;

export class TableSelectionNewGroupDropdown extends React.PureComponent<
    ITableSelectionNewGroupDropdownProps,
    ITableSelectionNewGroupDropdownState
> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
        trackWithGuid: PropTypes.func,
    };

    public static defaultProps = {
        mode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
        count: 0,
        appendTo: ".swReactTable-header-wrapper",
        trackingCategory: "",
        allItemsExistsMessage: "",
        maxItemsMessage: "",
        newGroupItemText: "",
    };

    public state = {
        isOpen: false,
        groupName: "",
    };

    private popupRef;

    constructor(props, context) {
        super(props, context);
    }

    public render() {
        const config = {
            width: 320,
            maxHeight: 330,
            enabled: true,
            placement: "ontop-left",
            cssClassContent: "Popup-content--pro-dropdown",
            onToggle: this.onToggle.bind(this),
        };
        return (
            <PopupClickContainer
                content={this.getContent}
                config={config}
                ref={this.setRef}
                appendTo={this.props.appendTo}
            >
                <div>{this.getDropdownButtonComponent()}</div>
            </PopupClickContainer>
        );
    }

    private getDropdownButtonComponent = () => {
        const { renderDropdownButton } = this.props;

        // In case the user has provided a custom button - render the dropdown
        // button using that function, otherwise - render the default button
        return renderDropdownButton ? (
            renderDropdownButton()
        ) : (
            <DropDownButton>
                <I18n>table.selection.keywords.selectgroup</I18n>
            </DropDownButton>
        );
    };

    private getContent = () => {
        const firstItem = this.getFirstItem();
        const content = this.getItems();

        // must use TranslationProvider since the dropdown content is rendered in a different tree
        return (
            <div>
                <TrackProvider
                    track={this.context.track}
                    trackWithGuid={this.context.trackWithGuid}
                >
                    <TranslationProvider translate={this.context.translate}>
                        {firstItem}
                        {this.props.mode !== ETableSelectionNewGroupDropdownMode.GROUP_LIST ? (
                            content
                        ) : (
                            <ScrollArea
                                style={{ maxHeight: scrollAreaHeight, minHeight: 0 }}
                                verticalScrollbarStyle={{ borderRadius: 5 }}
                                horizontal={false}
                                smoothScrolling={true}
                                minScrollSize={48}
                            >
                                {content}
                            </ScrollArea>
                        )}
                    </TranslationProvider>
                </TrackProvider>
            </div>
        );
    };

    private getFirstItem = () => {
        const { translate } = this.context;
        switch (this.props.mode) {
            case ETableSelectionNewGroupDropdownMode.NEW_GROUP:
                return (
                    <ItemStyled
                        disableHover={true}
                        id="add-new"
                        key={`item-new`}
                        iconName="add"
                        appendSeparator={true}
                        onClick={this.props.onGroupClick}
                    >
                        {translate(this.props.newGroupItemText)}
                    </ItemStyled>
                );
            case ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS:
                return (
                    <ItemStyled
                        disableHover={true}
                        appendSeparator={true}
                        key={`item-group`}
                        iconName={this.props.groupIconName}
                        iconSize="sm"
                    >
                        {this.props.currentGroup}
                    </ItemStyled>
                );
            case ETableSelectionNewGroupDropdownMode.MAX_ITEMS:
                return (
                    <ItemStyled
                        disableHover={true}
                        appendSeparator={true}
                        key={`item-group`}
                        iconName={this.props.groupIconName}
                        iconSize="sm"
                    >
                        {translate(this.props.newGroupItemText)}
                    </ItemStyled>
                );
            case ETableSelectionNewGroupDropdownMode.GROUP_LIST:
                return (
                    <ItemStyled
                        id="add-new"
                        key={`item-new`}
                        iconName="add"
                        appendSeparator={this.props.groups.length > 0}
                        onClick={this.props.onGroupClick}
                    >
                        {translate(this.props.newGroupItemText)}
                    </ItemStyled>
                );
        }
    };

    private getItems = () => {
        const { translate } = this.context;
        switch (this.props.mode) {
            case ETableSelectionNewGroupDropdownMode.NEW_GROUP:
                return [
                    <TableSelectionNewGroup
                        key="new-group"
                        title={this.props.newGroupNameLabel}
                        placeholder={translate("table.selection.newgroup.keywords.placeholder")}
                        onCancel={this.onCancel}
                        onSubmit={this.onSubmit}
                        submitButtonDisabled={false}
                        error={this.props.error}
                        errorMessage={this.props.errorMessage}
                        onListTypeSelect={this.props.onListTypeSelect}
                        groupName={this.state.groupName}
                        onGroupNameChange={this.onGroupNameChange}
                        isLoading={this.props.isLoading}
                        groupType={this.props.groupType}
                        selectedListType={this.props.selectedListType}
                    />,
                ];
            case ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS:
                return [
                    <TableSelectionKeywordsWarning
                        key="all-items-exist"
                        onCancel={this.onCancel}
                        message={translate(this.props.allItemsExistsMessage)}
                    />,
                ];
            case ETableSelectionNewGroupDropdownMode.MAX_ITEMS:
                return [
                    <TableSelectionKeywordsWarning
                        key="max-items"
                        onCancel={this.onCancel}
                        message={translate(this.props.maxItemsMessage, {
                            count: this.props.count.toString(),
                        })}
                    />,
                ];
            case ETableSelectionNewGroupDropdownMode.GROUP_LIST:
                return this.props.groups.map((item, index) => {
                    return (
                        <DropDownItem
                            key={`item-${index}`}
                            id={item.id}
                            iconName={this.props.groupIconName}
                            iconSize="sm"
                            onClick={this.onItemClick(item)}
                        >
                            {item.text}
                        </DropDownItem>
                    );
                });
        }
    };

    private onSubmit = () => {
        this.props.onSubmit(this.state.groupName);
    };

    private onItemClick = (item) => () => {
        this.props.onGroupClick(item);
    };

    private onToggle = (isOpen) => {
        const { track } = this.context;
        const { trackingCategory, onToggleDropdown } = this.props;
        track(trackingCategory, `${isOpen ? "open" : "close"}`, "dropdown");

        if (onToggleDropdown) {
            onToggleDropdown(isOpen);
        }
    };

    private onGroupNameChange = (value) => {
        this.setState({
            groupName: value,
        });
    };

    private setRef = (ref) => {
        this.popupRef = ref;
    };

    public close = () => {
        return this.popupRef.closePopup();
    };
    private onCancel = () => {
        this.setState(
            {
                groupName: "",
            },
            () => {
                this.props.onCancel();
            },
        );
    };
}
