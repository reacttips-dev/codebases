import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { PureComponent } from "react";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import "./ChosenKeyword.scss";
import { SWReactIcons } from "@similarweb/icons";
import {
    Dropdown,
    SimpleDropdownItem,
    DropdownButton,
} from "@similarweb/ui-components/dist/dropdown";
import autobind from "autobind-decorator";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../../filters/ngFilters";
import styled from "styled-components";
import { mixins } from "@similarweb/styles";
import { SwTrack } from "services/SwTrack";
import { getTracker, KeywordsGroupEditorModal } from "../KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IChosenKeywordProps {
    backgroundColor?: string;
    showDropDown?: boolean;
    className?: string;
}

interface IChosenKeywordComponentProps extends IChosenKeywordProps {
    keyword: string;
    keywordLink?: string;
    showKeywordGroupsDropdown?: boolean;
}

const ChosenKeywordLabel = styled.div`
    height: 100%;
    padding-left: 13px;
    padding-right: 13px;
    ${mixins.setFont({ $family: "Roboto", $size: 16, $color: "#1b2653" })};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ChosenKeywordLinkOut = styled.a`
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    width: 16px;
    height: 16px;
    svg {
        transform: translateY(1px);
        path {
            fill: ${colorsPalettes.blue["400"]};
        }
    }
`;

const ChosenKeywordLinkOutIcon = styled(SWReactIcons).attrs({
    iconName: "link-out",
})`
    display: flex;
`;

const ChosenKeyword: any = styled.div`
    height: 32px;
    display: inline-flex;
    align-items: center;
    border-radius: 6px;
    background-color: ${({ backgroundColor }: IChosenKeywordProps) => backgroundColor || "#ffffff"};
    box-shadow: 0 2px 4px 0 rgba(202, 202, 202, 0.2);
    border: solid 1px #d6dbe1;
    overflow: hidden;
    &:hover {
        background-color: #f5f5f5;
        ${ChosenKeywordLinkOut} {
            opacity: 1;
        }
    }
    > div {
        width: auto !important; // SIM-19483
    }

    // remove label border when there is no dropdown
    ${ChosenKeywordLabel} {
        ${({ showDropDown }: IChosenKeywordProps) => (showDropDown ? `` : `border: 0;`)}
    }
`;
interface IChosenKeywordAddToGroupProps {
    isOpen: boolean;
}
const ChosenKeywordAddToGroup = styled.div`
    width: 32px;
    height: 32px;
    background-color: ${({ isOpen }: IChosenKeywordAddToGroupProps) =>
        isOpen ? "2774fc" : "#e4e4e4"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    svg {
        width: 16px;
        height: 16px;
        path {
            fill: #1b2653;
        }
    }
    .DropdownButton--opened & {
        svg {
            path {
                fill: #ffffff;
            }
        }
    }
    ${ChosenKeyword}:hover & {
        transition: background-color 0.1s ease-in-out;
        background-color: #4e8cf9;
        &:hover {
            background-color: #4ea1f9;
        }
        &:active {
            background-color: #2774fc;
        }
        svg {
            path {
                fill: #ffffff;
            }
        }
    }
`;

const ChosenKeywordAddToGroupIcon = styled(SWReactIcons).attrs({
    iconName: "plus",
})`
    display: flex;
`;

@SWReactRootComponent
export class ChosenKeywordComponent extends PureComponent<IChosenKeywordComponentProps, any> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            dropdownIsOpen: false,
        };
    }

    public render() {
        const keywordGroups = this.getKeywordGroups().map((group, index) => (
            <SimpleDropdownItem
                className="ChosenKeyword-dropdown-item"
                id={group.text}
                key={`group-${index}`}
            >
                {group.text}
            </SimpleDropdownItem>
        ));
        const newGroup = (
            <SimpleDropdownItem
                id="new-group"
                key="new-group"
                className="ChosenKeyword-dropdown-add-new"
            >
                <SWReactIcons iconName="add" />
                {i18nFilter()("keywordAnalysis.keywordgroup.wizard.addnewgroup")}
            </SimpleDropdownItem>
        );
        const dropdownContent = [this.getDropdownButton(), newGroup, ...keywordGroups];
        return (
            <ChosenKeyword
                className={this.props.className}
                backgroundColor={this.props.backgroundColor}
            >
                <ChosenKeywordLabel data-automation-keyword-name={this.props.keyword}>
                    {this.props.keyword}
                    {this.props.keywordLink ? (
                        <ChosenKeywordLinkOut href={this.props.keywordLink} target="_blank">
                            <ChosenKeywordLinkOutIcon />
                        </ChosenKeywordLinkOut>
                    ) : null}
                </ChosenKeywordLabel>
                {this.props.showKeywordGroupsDropdown ? (
                    <Dropdown
                        appendTo="body"
                        onClick={this.onClick}
                        width={220}
                        closeOnItemClick={true}
                        onToggle={this.onToggle}
                        dropdownPopupPlacement="bottom"
                        cssClassContainer="DropdownContent-container ChosenKeyword-dropdown-container FiltersBarDropdown"
                    >
                        {dropdownContent}
                    </Dropdown>
                ) : null}

                <KeywordsGroupEditorModal
                    onClose={() => this.setState({ isOpen: false })}
                    open={this.state.isOpen}
                    keywordsGroup={this.state.keywordGroupToEdit}
                    onEditorOpened={this.onKeywordGroupEditorOpened}
                />
            </ChosenKeyword>
        );
    }

    private getDropdownButton() {
        return (
            <DropdownButton key={0} cssClass="ChosenKeyword-dropdown-button">
                <ChosenKeywordAddToGroup isOpen={this.state.dropdownIsOpen}>
                    <ChosenKeywordAddToGroupIcon />
                </ChosenKeywordAddToGroup>
            </DropdownButton>
        );
    }

    @autobind
    private onClick(item) {
        this.setState({
            isOpen: true,
            keywordGroupToEdit: item,
            isKeywordGroupNew: item === "new-group",
        });
    }

    @autobind
    private onKeywordGroupEditorOpened(editor) {
        editor._listItemsManager.onAddItem(this.props.keyword, false);
        if (this.state.isKeywordGroupNew) {
            const tracker = getTracker();
            tracker.createGroupFromAddToMenu(this.props.keyword);
        } else {
            const group = keywordsGroupsService.groupFromDropDown({
                text: this.state.keywordGroupToEdit,
            });
            const tracker = getTracker(group);
            tracker.addToGroupFromMenu(this.props.keyword, group);
        }
    }

    @autobind
    private onToggle(isOpen) {
        SwTrack.all.trackEvent(
            "Drop Down",
            isOpen ? "open" : "close",
            `add to/${this.props.keyword}`,
        );
        this.setState({
            dropdownIsOpen: isOpen,
        });
    }

    private getKeywordGroups() {
        return keywordsGroupsService.groupsToDropDown();
    }
}
