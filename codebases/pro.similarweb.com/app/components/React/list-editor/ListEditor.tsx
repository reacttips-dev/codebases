/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { allTrackers } from "../../../services/track/track";
import * as React from "react";
import * as PropTypes from "prop-types";
import * as _ from "lodash";
import { Component } from "react";
import { ListTitle } from "./ListTitle";
import { ListFooter } from "./ListFooter";
import { ListItemsManager } from "./ListItemsManager";
import autobind from "autobind-decorator";
import { column } from "../Table/SWReactTableDefaults";
import swLog from "@similarweb/sw-log";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IPromise } from "angular";
import { ITitleValidation } from "pages/keyword-analysis/KeywordGroupEditorHelpers";

interface IListEditorProps {
    list: any;
    tracker: any;
    titleText: string;
    placeHolderText: string;
    maxItems: number;
    itemsListTitle: string;
    itemsListType: any;
    ListItemComponent: any;
    itemHeight: number;
    validateNewItem: (itemToAdd: any, items: any) => { isValid: boolean; errorMessage: string };
    filterPastedItems: (itemsToAdd: any, items: any) => IPromise<any>;
    onSave: (groupToSave: { title: string; items: any }) => Promise<void>;
    onDelete: (groupToDelete: { title: string; items: any }) => Promise<void>;
    validateTitle: (title: string) => ITitleValidation;
    validateExistingItem: (item: any, list: any) => boolean;
    showDeleteButton?: boolean;
    isNewList: boolean;
}

interface IListEditorState {
    isSaving: boolean;
    isDeleting: boolean;
    title: { text?: string; isValid?: boolean; errorMessage?: string };
    list: { items?: any; isValid?: boolean; errorMessage?: string; showErrors?: boolean };
    originalList: { items?: any; title?: string };
}

export class ListEditor extends Component<IListEditorProps, IListEditorState> {
    private _listItemsManager: any;
    private clearErrorsTimer: any;

    constructor(props, state) {
        super(props, state);
        this.onListTitleChange = this.onListTitleChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addItems = this.addItems.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onListTitleInput = this.onListTitleInput.bind(this);
        this.clearListItemsErrors = this.clearListItemsErrors.bind(this);
        this.resetSaveButton = this.resetSaveButton.bind(this);
        this.resetDeleteButton = this.resetDeleteButton.bind(this);
        this.onItemTextChanged = this.onItemTextChanged.bind(this);
        this.state = {
            isSaving: false,
            isDeleting: false,
            title: {},
            list: {},
            originalList: {},
        };
    }

    public init(props = this.props) {
        const listTitle = props.list.title;
        const { isValid, errorMessage } = this.props.validateTitle(listTitle);
        const { items } = props.list;
        this.setState({
            originalList: props.list,
            isSaving: false,
            title: {
                text: listTitle,
                isValid,
                errorMessage,
            },
            list: {
                items,
                isValid: true,
                errorMessage: "",
            },
        });
    }

    public componentDidUpdate(prevProps) {
        if (this.props.list !== prevProps.list || this.props.list.items !== prevProps.list.items) {
            this.init();
        }
    }

    // eslint-disable-next-line react/no-deprecated
    public componentWillMount() {
        this.init();
    }

    public componentWillUnmount() {
        clearTimeout(this.clearErrorsTimer);
    }

    public removeItem(itemToRemove) {
        this.props.tracker.onRemove(itemToRemove);
        return this.setState({
            list: Object.assign({}, this.state.list, {
                items: this.state.list.items.filter((item) => {
                    return item !== itemToRemove;
                }),
            }),
        });
    }

    public addItem(itemToAdd) {
        const { list } = this.state;
        const { items } = list;
        const { isValid, errorMessage } = this.props.validateNewItem(itemToAdd, items);
        if (isValid) {
            this.setState({
                list: {
                    items: [...items, itemToAdd],
                    isValid: true,
                    errorMessage: "",
                },
            });
        } else {
            this.setState({
                list: Object.assign({}, list, {
                    isValid: false,
                    errorMessage,
                }),
            });
        }

        this.clearErrorsTimer = setTimeout(this.clearListItemsErrors, 5000);
    }

    clearListItemsErrors() {
        if (this.itemsHaveBeenChanged()) {
            this.setState({
                list: Object.assign({}, this.state.list, {
                    isValid: true,
                    errorMessage: "",
                }),
            });
        }
    }

    addItems(itemsToAdd) {
        const { list } = this.state;
        const { items } = list;
        this.props
            .filterPastedItems(itemsToAdd, items)
            .then(({ isValid, errorMessage, newListItems }) => {
                this.setState({
                    list: {
                        isValid,
                        errorMessage,
                        showErrors: !isValid,
                        items: isValid ? [...items, ...newListItems] : items,
                    },
                });
                if (errorMessage && this.itemsHaveBeenChanged()) {
                    this.clearErrorsTimer = setTimeout(this.clearListItemsErrors, 5000);
                }
            });
    }

    onItemTextChanged(item, newText) {
        const isItemWithSameTextExists = _.some(
            this.state.list.items,
            (itemInList: any) => itemInList !== item && itemInList.text === newText,
        );
        let errorMessage = "";
        if (item.text === newText) {
            return;
        }
        if (!isItemWithSameTextExists) {
            item.text = newText;
            this.setState({
                list: {
                    isValid: true,
                    errorMessage,
                    showErrors: false,
                    items: [...this.state.list.items],
                },
            });
            this.props.tracker.onEdit({ ...item, text: newText });
        } else {
            errorMessage = "item with the same name already exists";
            this.setState({
                list: Object.assign(this.state.list, {
                    isValid: false,
                    errorMessage,
                    showErrors: true,
                }),
            });
        }

        if (errorMessage && this.itemsHaveBeenChanged()) {
            this.clearErrorsTimer = setTimeout(this.clearListItemsErrors, 5000);
        }
    }

    itemsHaveBeenChanged() {
        const {
            list: { items },
        } = this.state;
        return items.length && this.state.originalList.items !== items;
    }

    titleHasBeenChanged() {
        const {
            title: { text },
        } = this.state;
        return text && this.state.originalList.title !== text;
    }

    @autobind
    setListItemsManager(itemsManager) {
        this._listItemsManager = itemsManager;
    }

    render() {
        const {
            titleText,
            placeHolderText,
            maxItems,
            itemsListTitle,
            itemsListType,
            validateExistingItem,
            ListItemComponent,
            itemHeight,
            tracker,
            showDeleteButton = false,
        } = this.props;
        const {
            addItem,
            addItems,
            removeItem,
            onSave,
            onDelete,
            onListTitleInput,
            onListTitleChange,
            onItemTextChanged,
        } = this;
        const { title, list, isSaving, isDeleting } = this.state;
        const saveButtonEnabled = this.enableButton();
        return (
            <div className="catory-editor customCategoriesWizard">
                <ListTitle
                    {...{ titleText, placeHolderText, title, onListTitleInput, onListTitleChange }}
                    tracker={tracker}
                />
                <ListItemsManager
                    ref={this.setListItemsManager}
                    {...{
                        list,
                        itemsListTitle,
                        validateExistingItem,
                        maxItems,
                        itemsListType,
                        addItem,
                        addItems,
                        removeItem,
                        onSave,
                        onItemTextChanged,
                        ListItemComponent,
                        itemHeight,
                    }}
                    tracker={tracker}
                />
                <ListFooter
                    onSave={onSave}
                    onDelete={onDelete}
                    saveButtonEnabled={saveButtonEnabled}
                    isSaving={isSaving}
                    isDeleting={isDeleting}
                    showDeleteButton={showDeleteButton}
                />
            </div>
        );
    }

    resetSaveButton() {
        this.setState({ isSaving: false });
    }

    resetDeleteButton() {
        this.setState({ isDeleting: false });
    }

    onSave() {
        this.setState({ isSaving: true });
        const { text: title } = this.state.title;
        const { items } = this.state.list;

        this.props
            .onSave({ title, items })
            .then(() => {
                this.resetSaveButton();
                this.props.tracker.onSave(title, items);
            })
            .catch(() => this.resetSaveButton());
    }

    onDelete() {
        this.setState({ isDeleting: true });

        const { text: title } = this.state.title;
        const { items } = this.state.list;

        this.props
            .onDelete({ title, items })
            .then(() => {
                this.resetDeleteButton();
            })
            .catch(() => this.resetDeleteButton());
    }

    onListTitleInput(e) {
        // Only need to track users initial inputting ie.first character. (adjust logic to not track if reducing to one character)
        if (e.target.value.length === 1) {
            TrackWithGuidService.trackWithGuid(
                "keyword_lists.create_keyword_list.pop_up",
                "value-ok",
            );
        }
        const newInputText = e.target.value;
        const { title } = this.state;
        this.setState({
            title: _.merge({}, title, {
                text: newInputText,
            }),
        });
    }

    onListTitleChange(newTitle) {
        const { isValid, errorMessage } = this.props.validateTitle(newTitle);
        this.setState({
            title: {
                ...this.state.title,
                text: newTitle,
                isValid,
                errorMessage: isValid ? "" : errorMessage,
            },
        });
        this._listItemsManager.focusInput();
    }

    componentDidCatch(error, errorInfo) {
        swLog.exception(`error:`, error.message, "\nstack:", errorInfo.componentStack);
    }

    isFormValid() {
        const { title, list } = this.state;
        return title.isValid && list.isValid && title.text && list.items.length;
    }

    enableButton() {
        const titleChanged = this.titleHasBeenChanged();
        const itemsHasBeenChanged = this.itemsHaveBeenChanged();
        const formValid = this.isFormValid();
        return (
            !this.state.isSaving &&
            formValid &&
            (titleChanged || itemsHasBeenChanged || this.props.isNewList)
        );
    }

    static propTypes = {
        titleText: PropTypes.string.isRequired,
        placeHolderText: PropTypes.string.isRequired,
        itemsListTitle: PropTypes.string.isRequired,
        itemsListType: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        list: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.shape({ text: PropTypes.string.isRequired })),
            Title: PropTypes.string,
        }).isRequired,
        maxItems: PropTypes.number.isRequired,
        validateNewItem: PropTypes.func.isRequired,
        validateExistingItem: PropTypes.func.isRequired,
        validateTitle: PropTypes.func.isRequired,
        filterPastedItems: PropTypes.func.isRequired,
        itemHeight: PropTypes.number.isRequired,
        tracking: PropTypes.shape({
            onPaste: PropTypes.func,
            onAdd: PropTypes.func,
            onRemove: PropTypes.func,
            onEdit: PropTypes.func,
            onError: PropTypes.func,
            onSave: PropTypes.func,
            onCancel: PropTypes.func,
        }),
    };

    static defaultProps = {
        tracking: {
            onPaste: _.noop,
            onAdd: _.noop,
            onRemove: _.noop,
            onEdit: _.noop,
            onError: _.noop,
            onSave: _.noop,
            onCancel: _.noop,
        },
    };
}
