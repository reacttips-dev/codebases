import { Button } from "@similarweb/ui-components/dist/button";
import { EllipsisDropdownItem, IDropDownItem } from "@similarweb/ui-components/dist/dropdown";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import { ModalTableSelectionNewGroup } from "components/TableSelection/src/ModalTableSelectionNewGroup";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled, { css } from "styled-components";
import { ECategoryType } from "common/services/categoryService.types";
import { TableSelectionKeywordsWarning } from "./TableSelectionKeywordsWarning";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete/src/Autocomplete";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/src/ComponentsUtils";
import { colorsPalettes } from "@similarweb/styles";

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

const DropDownButton = styled(Button)<{ marginLeft?: number }>`
    ${({ marginLeft = 0 }) => marginLeft && `margin-left: ${marginLeft}px`};
    margin-left: ${`marginLeft`}10px;
    background-color: #72a3fa;
    &:active, &:hover {
        background-color: #92c3ff;
  }
}`;

const NoDataWrapper = styled.div`
    font-size: 12px;
    font-weight: 600;
    padding: 8px 0 4px 16px;
`;

const BaseWrapper = styled.div`
    position: absolute;
    left: 312px;
    z-index: 10; // this value is necessary in order to stack on top of the table in the keyword research > find keywords > keyword generator tool table
`;

const WarningMessageWrapper = styled(BaseWrapper)`
    max-width: 312px;
    max-height: 170px;
    border-radius: 4px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 1px 1px 6px rgb(0, 0, 0, 0.24);
`;

const AutocompleteWrapper = styled(BaseWrapper)``;

const AutocompleteStyled = styled(Autocomplete)`
    width: 320px;
    .input-container {
        border-radius: 3px 3px 0 0;
        height: 44px;
        padding-bottom: 8px;
    }
    .input-container:after {
        content: "";
        width: 90%;
        position: absolute;
        bottom: 0;
        height: 1px;
        background-color: ${colorsPalettes.blue[400]};
    }
`;

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{
                maxHeight: 240,
                minHeight: 0,
            }}
            verticalScrollbarStyle={{ borderRadius: 5 }}
            horizontal={false}
            smoothScrolling={true}
            minScrollSize={48}
            {...rest}
        >
            {children}
        </ScrollArea>
    );
};

const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "border-box",
        width: "400px",
        padding: 0,
    },
};

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
    onNewListButtonClick: () => void;
    isLoading: boolean;
    error?: boolean;
    isCreateNewListModalOpen?: boolean;
    errorMessage?: string;
    onGroupClick?: (item?) => void;
    onCancel?: () => void;
    count?: number;
    appendTo?: string;
    groupIconName?: string;
    newGroupNameLabel: string;
    trackingCategory?: string;
    allItemsExistsMessage?: string;
    maxItemsMessage?: string;
    groupType?: "website" | "keyword" | "segment";
    selectedListType?: ECategoryType;
}

interface ITableSelectionNewGroupDropdownState {
    groupName: string;
    isAutocompleteOpen: boolean;
    isWarningOpen: boolean;
}

// height of popup - first item size - top & bottom padding
const scrollAreaHeight = 256 - 48 - 8 * 2;
const NO_DATA = -2;

export class TableSelectionGroupKeywordComponent extends React.PureComponent<
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
    };

    public state = {
        groupName: "",
        isAutocompleteOpen: false,
        isWarningOpen: false,
    };

    constructor(props, context) {
        super(props, context);
    }

    public componentDidMount() {
        document.body.addEventListener("click", this.handleBodyClick, { capture: true });
    }

    public componentWillUnmount() {
        document.body.removeEventListener("click", this.handleBodyClick, { capture: true });
    }

    // we want the autocomplete and warning messages to close when clicking outside of themselves
    private handleBodyClick = (e) => {
        if (
            !findParentByClass(e.target, "AutocompleteKeywordGroupsAddToList") &&
            !findParentByClass(e.target, "TableSelectionKeywordsWarning")
        ) {
            if (this.state.isAutocompleteOpen || this.state.isWarningOpen) {
                this.onToggle(false);
            }
            this.setState({ isAutocompleteOpen: false, isWarningOpen: false });
        }
    };

    public render() {
        const { translate } = this.context;

        return (
            <div style={{ display: "flex" }}>
                <div>
                    <DropDownButton
                        type="primary"
                        label={translate("table.selection.create.group")}
                        onClick={this.props.onNewListButtonClick}
                    />
                </div>
                {this.props.groups.length > 0 &&
                    !this.state.isAutocompleteOpen &&
                    !this.state.isWarningOpen && (
                        <div>
                            <DropDownButton
                                type="primary"
                                label={translate("table.selection.add.to.list")}
                                marginLeft={10}
                                onClick={this.onAddToListButtonClick}
                            />
                        </div>
                    )}
                {this.state.isWarningOpen && (
                    <WarningMessageWrapper className="TableSelectionKeywordsWarning">
                        {this.getWarningItems()}
                    </WarningMessageWrapper>
                )}
                {this.state.isAutocompleteOpen && (
                    <AutocompleteWrapper>
                        <AutocompleteStyled
                            className="AutocompleteKeywordGroupsAddToList"
                            getListItems={this.getAutocompleteData}
                            renderItems={this.autocompleteRenderItems}
                            loadingComponent={<DotsLoader />}
                            autoFocus={true}
                            floating={true}
                            debounce={250}
                            preventTruncateUnlessForced={true}
                            placeholder={translate("table.selection.autocomplete.placeholder")}
                        />
                    </AutocompleteWrapper>
                )}
                <ProModal
                    isOpen={this.props.isCreateNewListModalOpen}
                    customStyles={proModalStyles}
                    showCloseIcon={false}
                >
                    <ModalTableSelectionNewGroup
                        title={translate("table.selection.newgroup.keywords.create")}
                        subTitle={this.props.newGroupNameLabel}
                        placeholder={translate("table.selection.newgroup.keywords.placeholder")}
                        onCancel={this.onCancel}
                        onSubmit={this.onSubmit}
                        submitButtonDisabled={this.state.groupName.length === 0}
                        error={this.props.error}
                        errorMessage={this.props.errorMessage}
                        onGroupNameChange={this.onGroupNameChange}
                        isLoading={this.props.isLoading}
                        groupType={this.props.groupType}
                        selectedListType={this.props.selectedListType}
                    />
                </ProModal>
            </div>
        );
    }

    private onAddToListButtonClick = () => {
        this.setState({
            isAutocompleteOpen: true,
        });
        this.onToggle(true);
    };

    private getWarningItems = () => {
        const { translate } = this.context;
        // we decide what to display based on the current mode ie. used max items/ items exist in group
        if (this.props.mode === ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS) {
            return [
                <TableSelectionKeywordsWarning
                    onCancel={this.onCancel}
                    message={translate(this.props.allItemsExistsMessage)}
                />,
            ];
        }
        return [
            <TableSelectionKeywordsWarning
                onCancel={this.onCancel}
                message={translate(this.props.maxItemsMessage, {
                    count: this.props.count.toString(),
                })}
            />,
        ];
    };

    private getAutocompleteData = (query) => {
        const { translate } = this.context;
        if (!query) {
            return this.props.groups;
        } else {
            const normalizedQuery = query.trim().toLowerCase();
            const filteredGroups = this.props.groups.filter((group) =>
                group.text.trim().toLowerCase().startsWith(normalizedQuery),
            );
            return filteredGroups.length
                ? filteredGroups
                : [
                      NO_DATA,
                      <NoDataWrapper>{translate("table.selection.add.no.data")}</NoDataWrapper>,
                  ];
        }
    };

    private autocompleteRenderItems = ({ selectedItemId, listItems }) => {
        if (!listItems.length) {
            return null;
        }

        const componentListItems =
            listItems[0] === NO_DATA ? listItems[1] : listItems.map(this.itemCreator);

        return <ScrollAreaWrap>{componentListItems}</ScrollAreaWrap>;
    };

    private itemCreator = (item, index) => {
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
    };

    private onSubmit = () => {
        this.props.onSubmit(this.state.groupName);
    };

    private onItemClick = (item) => () => {
        this.props.onGroupClick(item);
    };

    private onToggle = (isOpen) => {
        const { track } = this.context;
        const { trackingCategory } = this.props;
        track(trackingCategory, `${isOpen ? "open" : "close"}`, "dropdown");
    };

    private onGroupNameChange = (value) => {
        this.setState({
            groupName: value,
        });
    };

    public openWarning = () => {
        this.setState({ isWarningOpen: true, isAutocompleteOpen: false });
    };

    public close = () => {
        this.setState({ isAutocompleteOpen: false });
    };
    private onCancel = () => {
        this.setState(
            {
                groupName: "",
                isWarningOpen: false,
                isAutocompleteOpen:
                    this.props.mode === ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS &&
                    !this.props.isCreateNewListModalOpen,
            },
            () => {
                this.props.onCancel();
            },
        );
    };
}
