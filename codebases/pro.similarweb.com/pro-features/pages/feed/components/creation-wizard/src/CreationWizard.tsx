import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import { PureComponent } from "react";
import * as React from "react";
import { IDomain, ISuggestedWebsites } from "../../../types/feed.types";
import { MultipleSelection } from "../../multiple-selection/src/MultipleSelection";
import "../styles/CreationWizard.scss";

interface ICreationWizardState {
    selectedItems: IDomain[];
    scrollHeight: number;
    isAutoCompleteLoading: boolean;
    autoCompleteIsFocused: boolean;
    inputIsEmpty: boolean;
    isSmallSiteNotificationOpen: boolean;
}

interface ICreationWizardProps {
    suggestedWebsites: ISuggestedWebsites;
    getAutoComplete: (query: string) => any;
    minSelectedItems?: number;
    onSelectedItemsChanged?: (selectedItems) => any;
    onSaveButtonClick?: (selectedItems: IDomain[]) => void;
    initialScrollHeight?: number;
    showSuggestionsInAutoComplete?: boolean;
    onItemAdded?: (domainName: string, source?: string, index?: number) => void;
    onItemDeleted?: (domainName: string) => void;
    isLoading?: boolean;
    ignoreDomains?: IDomain[];
    selectedItems?: IDomain[];
    buttonText?: string;
    buttonDisabled?: boolean;
    maxItems?: number;
    trackDisabledButton?: () => void;
    enableSmallSiteNotification?: boolean;
    subscriptionComponent?: React.ReactNode;
    getPlaceHolderText?(selectedItems: IDomain[], maxItems: number): string;
}

const CreationWizardPropTypes = {
    suggestedWebsites: PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                icon: PropTypes.string,
            }),
        ),
    }),
    getAutoComplete: PropTypes.func,
    minSelectedItems: PropTypes.number,
    onSelectedItemsChanged: PropTypes.func,
    onSaveButtonClick: PropTypes.func,
    initialScrollHeight: PropTypes.number.isRequired,
    showSuggestionsInAutoComplete: PropTypes.bool,
    onItemAdded: PropTypes.func,
    onItemDeleted: PropTypes.func,
    isLoading: PropTypes.bool,
    ignoreDomains: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            icon: PropTypes.string,
        }),
    ),
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            image: PropTypes.string,
            ignoreSmallSite: PropTypes.bool,
        }),
    ),
    buttonDisabled: PropTypes.bool,
    maxItems: PropTypes.number,
    trackDisabledButton: PropTypes.func,
};

const CreationWizardDefaultProps = {
    minSelectedItems: 1,
    onSelectedItemsChanged: _.noop,
    showSuggestionsInAutoComplete: false,
    onItemAdded: _.noop,
    onItemDeleted: _.noop,
    isLoading: false,
    initialScrollHeight: 158,
    ignoreDomains: [],
    selectedItems: [],
    buttonText: "OK, Done",
    maxItems: 10,
    trackDisabledButton: () => null,
    getPlaceHolderText: (selectedItems, maxItems) =>
        selectedItems.length === maxItems ? translationsKeys.full : "",
};
const translationsKeys = {
    empty: "dashboards.wizard.template_config.Website.placeholderEmpty",
    full: "dashboards.wizard.template_config.Website.placeholderFull",
    onOrMore: "dashboards.wizard.template_config.Website.placeholderOneOrMore",
};

export class CreationWizard extends PureComponent<ICreationWizardProps, ICreationWizardState> {
    public static propTypes = CreationWizardPropTypes;

    public static defaultProps = CreationWizardDefaultProps;

    public static contextTypes = {
        translate: PropTypes.func,
    };

    public selectedItemsPreviousHeight: number;

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedItems: props.selectedItems,
            scrollHeight: this.props.initialScrollHeight,
            isAutoCompleteLoading: false,
            autoCompleteIsFocused: false,
            inputIsEmpty: false,
            isSmallSiteNotificationOpen: false,
        };
    }

    // *******************
    //  Lifecycle events
    // *******************

    public componentDidMount() {
        this.selectedItemsPreviousHeight = document.getElementsByClassName(
            "MultipleSelection-autocomplete",
        )[0].clientHeight;
    }

    public componentDidUpdate(prevProps, prevState, prevContext) {
        // re-calculate the scroll height
        if (prevState.selectedItems.length !== this.state.selectedItems.length) {
            const current = document.getElementsByClassName("MultipleSelection-autocomplete")[0]
                .clientHeight;
            const diff = this.selectedItemsPreviousHeight - current;
            this.selectedItemsPreviousHeight = current;
            this.setState({
                // the maximum scroll height cannot be greather then the initial scroll height
                scrollHeight: Math.min(
                    this.state.scrollHeight + diff,
                    this.props.initialScrollHeight,
                ),
            });
        } else {
            this.selectedItemsPreviousHeight = document.getElementsByClassName(
                "MultipleSelection-autocomplete",
            )[0].clientHeight;
        }
    }

    public render() {
        const buttonEnabled = this.buttonEnabled();
        const {
            getPlaceHolderText,
            maxItems,
            enableSmallSiteNotification,
            buttonDisabled,
        } = this.props;
        const { translate } = this.context;
        const { selectedItems } = this.state;

        return (
            <div className="CreationWizard u-flex-column">
                <div className="CreationWizard-body">
                    {this.props.children}
                    <MultipleSelection
                        suggestionsTitle={this.props.suggestedWebsites.title}
                        suggestions={this.props.suggestedWebsites.items}
                        scrollHeight={this.state.scrollHeight}
                        onItemAdded={this.onItemAdded}
                        onItemDeleted={this.onItemDeleted}
                        placeholder={translate(getPlaceHolderText(selectedItems, maxItems))}
                        isAutocopmleteLoading={this.state.isAutoCompleteLoading}
                        inputIsEmpty={this.state.inputIsEmpty}
                        selectedItems={this.state.selectedItems}
                        getAutoCompleteItems={this.getAutoCompleteItems}
                        onAutocompleteFocus={this.onAutoCompleteFocused}
                        onAutocompleteBlur={this.onAutoCompleteBlur}
                        autoCompleteIsFocused={this.state.autoCompleteIsFocused}
                        maxItems={this.props.maxItems}
                        enableSmallSiteNotification={enableSmallSiteNotification}
                        deactivateItemPopup={this.deactivateItemPopup}
                        isSmallSiteNotificationOpen={this.smallsitePopupStateCheck}
                    />
                </div>
                {this.props.subscriptionComponent}
                <div className="CreationWizard-footer" onClick={this.props.trackDisabledButton}>
                    <Button
                        style={{ position: "relative" }}
                        width="auto"
                        isDisabled={buttonDisabled !== undefined ? buttonDisabled : !buttonEnabled}
                        onClick={this.onSaveButtonClick}
                        isLoading={this.props.isLoading}
                    >
                        {this.props.buttonText}
                    </Button>
                </div>
            </div>
        );
    }

    // ****************
    //  Class methods
    // ****************

    private onItemAdded = (domain: IDomain, source?: string, index?: number) => {
        if (this.state.isSmallSiteNotificationOpen) {
            return;
        }
        this.setState(
            {
                selectedItems: [...this.state.selectedItems, domain],
                inputIsEmpty: false,
            },
            this.onSelectedItemsChanged,
        );
        // tracking
        this.props.onItemAdded(domain.name, source, index);
    };

    private deactivateItemPopup = (index) => {
        const copyState = [...this.state.selectedItems];
        copyState[index].ignoreSmallSite = true;
        this.setState({ selectedItems: copyState });
    };

    private onItemDeleted = (domain: IDomain) => {
        this.setState(
            {
                selectedItems: this.state.selectedItems.filter((item) => item.name !== domain.name),
            },
            this.onSelectedItemsChanged,
        );
        // tracking
        this.props.onItemDeleted(domain.name);
    };

    private smallsitePopupStateCheck = (isOpen: boolean) => {
        if (isOpen) {
            this.setState({ isSmallSiteNotificationOpen: true });
        } else {
            this.setState({ isSmallSiteNotificationOpen: false });
        }
    };

    private onSaveButtonClick = () => {
        if (!this.buttonEnabled()) {
            this.setState({ inputIsEmpty: true });
        } else if (this.state.isSmallSiteNotificationOpen) {
            return;
        } else {
            this.props.onSaveButtonClick(this.state.selectedItems);
        }
    };

    /**
     * Checks if the domain is existed in the selectedItems array.
     * @param domain
     * @returns {boolean}
     */
    private existsInSelected = (domain: IDomain) => {
        return !_.isUndefined(_.find(this.state.selectedItems, domain));
    };

    private getAutoCompleteItems = (query: string): any => {
        if (typeof query === "string" && query !== "") {
            return this.getItemsFromAutoComplete(query);
        } else if (this.props.showSuggestionsInAutoComplete) {
            return this.getItemsFromSuggestions();
        } else {
            return [];
        }
    };

    private getItemsFromAutoComplete(query: string) {
        this.setState({ isAutoCompleteLoading: true });
        return this.props.getAutoComplete(query).then(
            (results) => {
                this.setState({ isAutoCompleteLoading: false });
                const listItems = [];
                this.removeSelected(this.removeIgnoredDomains(results)).map((item) => {
                    listItems.push(
                        <ListItemWebsite
                            img={item.image}
                            key={item.name}
                            onClick={this.onItemAdded.bind(
                                this,
                                {
                                    name: item.name,
                                    icon: item.image,
                                },
                                "autocomplete",
                            )}
                            text={item.name}
                        />,
                    );
                });
                return listItems;
            },
            (e) => {
                return e;
            },
        );
    }

    /**
     * Return array of items that aren't included in the selected items
     * @param items
     * @returns {any[]}
     */
    private removeSelected(items: any[]) {
        const selecdtedNames = this.state.selectedItems.map((selected) => selected.name);
        return items.filter((item) => {
            return !selecdtedNames.includes(item.name);
        });
    }

    /**
     * Return array of items that aren't included in the ignored items
     * @param items
     * @returns {any[]}
     */
    private removeIgnoredDomains(items: any[]) {
        const ignoredNames = this.props.ignoreDomains.map((ignored) => ignored.name);
        return items.filter((item) => {
            return !ignoredNames.includes(item.name);
        });
    }

    private getItemsFromSuggestions() {
        return this.removeSelected(this.props.suggestedWebsites.items).map((item: any) => {
            return (
                <ListItemWebsite
                    img={item.icon || item.image}
                    key={item.name}
                    onClick={this.onItemAdded.bind(this, {
                        name: item.name,
                        icon: item.icon || item.name,
                    })}
                    text={item.name}
                />
            );
        });
    }

    private buttonEnabled() {
        return this.state.selectedItems.length >= this.props.minSelectedItems;
    }

    private onSelectedItemsChanged = (state = this.state) => {
        this.props.onSelectedItemsChanged(state.selectedItems);
    };

    private onAutoCompleteFocused = () => {
        this.setState({
            autoCompleteIsFocused: true,
            inputIsEmpty: false,
        });
    };

    private onAutoCompleteBlur = () => {
        this.setState({
            autoCompleteIsFocused: false,
        });
    };
}
