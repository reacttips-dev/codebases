import { Bubble } from "@similarweb/ui-components/dist/bubble";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import * as PropTypes from "prop-types";
import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { GroupCreationDropdownItem } from "./GroupCreationDropdownItem";
import { PreferencesService } from "services/preferences/preferencesService";

interface IKeywordGroupCreationDropdownProps {
    children: ReactNode;
    onKeywordsModalClick: () => void;
    onGeneratorToolClick: () => void;
    buttonWidth?: string;
    containerClass?: string;
    bubbleClass?: string;
    bubbleDirection?: "right" | "left";
    dropdownPopupPlacement?: string;
    onDropDownToggle?: (isOpen) => void;
    hideNotification?: boolean;
    appendTo?: string;
    hasKeywordsGenerator: boolean;
}

interface IKeywordGroupCreationDropdownState {
    showNotification: boolean;
}

const USER_PREFERENCES_KEY = "keywordsGeneratorPromotion_Beta5";

const ToolTitle = styled.span`
    display: flex;
    align-items: center;
`;

export class KeywordGroupCreationDropdown extends React.Component<
    IKeywordGroupCreationDropdownProps,
    IKeywordGroupCreationDropdownState
> {
    private static contextTypes = {
        translate: PropTypes.func,
    };
    private static defaultProps = {
        onDropDownToggle: (isOpen) => null,
        dropdownPopupPlacement: "bottom-right",
        hasKeywordsGenerator: false,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            showNotification: !PreferencesService.get(USER_PREFERENCES_KEY),
        };
    }

    public removeBubble = async (isOpen?) => {
        await PreferencesService.add({ [USER_PREFERENCES_KEY]: true });
        this.setState({
            showNotification: false,
        });
        // call this method only only if isOpen is true or false
        if (isOpen !== "undefined") {
            this.props.onDropDownToggle(isOpen);
        }
    };

    public render() {
        const {
            children,
            onKeywordsModalClick,
            onGeneratorToolClick,
            buttonWidth,
            containerClass,
            bubbleClass,
            bubbleDirection,
            dropdownPopupPlacement,
        } = this.props;
        const { translate } = this.context;

        const cssClassContainer = `DropdownContent-container Popup-content--pro-dropdown ${containerClass}`;
        const augment = (child) => React.cloneElement(child, { onClick: onKeywordsModalClick });

        // validate that children is a component and not an array (see use in Dropdown's definition)
        const child = children.constructor === Array ? children[0] : children;

        return (
            <>
                {this.props.hasKeywordsGenerator ? (
                    <Bubble
                        isOpen={!this.props.hideNotification && this.state.showNotification}
                        onClose={this.removeBubble}
                        placement={`bottom-${bubbleDirection}`}
                        title={translate("keywords.generator.promotion.bubble.title")}
                        text={translate("keywords.generator.promotion.bubble.text")}
                        cssClass={`Bubble-element ${bubbleClass}`}
                    >
                        <div>
                            <Dropdown
                                width={328}
                                appendTo={this.props.appendTo}
                                onToggle={this.removeBubble}
                                cssClassContainer={cssClassContainer}
                                dropdownPopupPlacement={dropdownPopupPlacement}
                                buttonWidth={buttonWidth}
                            >
                                {child}
                                {UseKeywordsModal(onKeywordsModalClick, translate)}
                                {UseGeneratorTool(onGeneratorToolClick, translate)}
                            </Dropdown>
                        </div>
                    </Bubble>
                ) : (
                    React.Children.map(children, augment)
                )}
            </>
        );
    }
}

const UseKeywordsModal = (onClick, translate) => {
    return (
        <GroupCreationDropdownItem
            preventDefault={true}
            onClick={onClick}
            iconName="add"
            description={translate("keyword.generator.tool.add.group.dropdown.upload.description")}
            title={translate("keyword.generator.tool.add.group.dropdown.upload.title")}
        />
    );
};

const UseGeneratorTool = (onClick, translate) => {
    return (
        <GroupCreationDropdownItem
            preventDefault={true}
            onClick={onClick}
            iconName="wand"
            description={translate("keyword.generator.tool.add.group.dropdown.tool.description")}
            title={
                <ToolTitle>
                    {translate("keyword.generator.tool.add.group.dropdown.tool.title")}
                </ToolTitle>
            }
        />
    );
};
