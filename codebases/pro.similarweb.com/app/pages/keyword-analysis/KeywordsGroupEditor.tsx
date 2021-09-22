/* eslint-disable @typescript-eslint/explicit-function-return-type */
import angular, { IPromise } from "angular";
import * as React from "react";
import * as _ from "lodash";
import { ListEditor } from "components/React/list-editor/ListEditor";
import { KeywordListItem } from "./KeywordListItem";
import { Injector } from "common/ioc/Injector";
import { KeywordGroupEditorHelpers } from "./KeywordGroupEditorHelpers";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export interface IKeywordsGroupEditorGroup {
    title: string;
    items: { text: string }[];
    Id: string;
    GroupHash: string;
    LastUpdated: string;
    UniqueId?: string;
}

interface IKeywordsGroupEditorProps {
    titleText: string;
    tracker: any;
    ctrl: {
        onSaveSuccess: (updatedKeywordsGroup: any) => void;
        onEditorLoaded: (editor: ListEditor) => void;
        onDeleteSuccess: (deletedKeywordsGroup: any) => void;
    };
    keywordsGroup: IKeywordsGroupEditorGroup;
    showDeleteButton: boolean;
}

interface IKeywordsGroupEditorState {
    keywordsGroup: IKeywordsGroupEditorGroup;
}

export class KeywordsGroupEditor extends React.Component<
    IKeywordsGroupEditorProps,
    IKeywordsGroupEditorState
> {
    public static defaultProps = {
        showDeleteButton: true,
    };

    private _$q: any;
    private _editor: any;
    private _allGroups;
    private _i18nFilter;
    maxItems: number;

    constructor(props) {
        super(props);
        const injector = Injector;
        this._$q = injector.get("$q");
        this._i18nFilter = injector.get("i18nFilter");
        this._allGroups = props.allGroups;
        this.validateNewItem = this.validateNewItem.bind(this);
        this.filterPastedItems = this.filterPastedItems.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateExistingItem = this.validateExistingItem.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.maxItems = KeywordGroupEditorHelpers.getMaxGroupCount();
        this.state = {
            keywordsGroup: this.toList(props.keywordsGroup),
        };
    }

    render() {
        const {
            validateNewItem,
            filterPastedItems,
            validateExistingItem,
            onSave,
            onDelete,
            maxItems,
            validateTitle,
        } = this;
        const { titleText, tracker } = this.props;
        const { keywordsGroup } = this.state;

        if (!keywordsGroup) {
            return null;
        }

        return (
            <ListEditor
                ref={(editor) => (this._editor = editor)}
                list={keywordsGroup}
                tracker={tracker}
                titleText={titleText}
                placeHolderText={this._i18nFilter(
                    "KeywordAnalysis.keywordgroup.wizard.placeholder",
                )}
                itemsListTitle={this._i18nFilter("KeywordAnalysis.keywordgroup.wizard.list.title")}
                itemsListType={this._i18nFilter("KeywordAnalysis.keywordgroup.wizard.list.type")}
                ListItemComponent={KeywordListItem}
                itemHeight={42}
                // Show a delete button in the editor only in case we try to edit an existing list
                // there no option to "delete" a list that we're currently creating (a.k.a "new list")
                showDeleteButton={!this.isNewList(keywordsGroup) && this.props.showDeleteButton}
                isNewList={this.isNewList(keywordsGroup)}
                {...{
                    validateNewItem,
                    filterPastedItems,
                    validateExistingItem,
                    validateTitle,
                    onSave,
                    onDelete,
                    maxItems,
                }}
            />
        );
    }

    componentDidMount() {
        this.props.ctrl.onEditorLoaded(this._editor);
    }

    private isListFull(list) {
        return list.length >= this.maxItems;
    }

    isDuplicateItem(newItem, list) {
        return _.some(list, (listItem: any) => {
            return listItem.text.toLowerCase() === newItem.text.toLowerCase();
        });
    }

    isItemLengthValid({ text }) {
        return text.length > 0 && text.length <= 140;
    }

    isNewList({ Id }: { Id: string }) {
        return !Id || Id.length <= 0;
    }

    validateNewItem(item, list) {
        const listFull = this.isListFull(list);
        const validItemLength = this.isItemLengthValid(item);
        const isDuplicateItem = this.isDuplicateItem(item, list);
        const isValid = !listFull && validItemLength && !isDuplicateItem;
        let errorMessage = "";
        if (listFull) {
            errorMessage = "keywords list is full";
        } else if (!validItemLength) {
            errorMessage = "invalid item length";
        } else if (isDuplicateItem) {
            errorMessage = "keyword already exists";
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage,
        };
    }

    validateTitle(newGroupName) {
        return KeywordGroupEditorHelpers.validateTitle(newGroupName, this.props.keywordsGroup);
    }

    validateExistingItem(item, list) {
        const index = _.findIndex(list, item);
        return index < this.maxItems;
    }

    filterPastedItems(itemsToAdd, items): IPromise<any> {
        const newListItems = _.filter(itemsToAdd, (itemToAdd) => {
            const isValid = this.validateNewItem(itemToAdd, items).isValid;
            if (isValid) {
                items = [...items, itemToAdd];
            }
            return isValid;
        });
        let errorMessage = "";
        if (itemsToAdd.length === 0) {
            errorMessage = "please paste at least one keyword";
        } else if (newListItems.length === 0) {
            const isFullList = this.isListFull(items);
            if (isFullList) {
                errorMessage = "keywords list is full";
            } else {
                errorMessage = "keywords already exists in list or invalid keyword list";
            }
        } else if (newListItems.length < itemsToAdd.length) {
            errorMessage = "duplicate / invalid keywords were removed";
        }
        return this._$q.resolve({
            newListItems,
            isValid: !!newListItems.length,
            errorMessage,
        });
    }

    onGroupUpdated(groups: any[], list: any) {
        const group = _.find(groups, (group) => group.Name === list.title.trim());
        this.setState({
            keywordsGroup: this.toList(group),
        });
        return group;
    }

    toList(group: any = {}) {
        const {
            Name = null,
            Keywords = [],
            Id = null,
            GroupHash = null,
            LastUpdated = null,
            UniqueId = null,
        } = group;
        return {
            title: Name,
            items: Keywords.map((text) => ({ text: text.toLowerCase() })),
            Id,
            GroupHash,
            LastUpdated,
            UniqueId,
        };
    }

    fromList(target: any = {}) {
        const { title = null, items = [] } = target;
        const { GroupHash, Id, UniqueId } = this.state.keywordsGroup;
        return {
            Name: title,
            Keywords: items.map(({ text }) => text.toLowerCase()),
            GroupHash,
            Id,
            UniqueId,
        };
    }

    onSave(list) {
        return keywordsGroupsService
            .update(this.fromList(list))
            .then((data) => this.onGroupUpdated(data, list))
            .then((updatedKeywordsGroup) => this.props.ctrl.onSaveSuccess(updatedKeywordsGroup));
    }

    onDelete(list) {
        const groupToDelete = this.fromList(list);
        return keywordsGroupsService
            .deleteGroup(groupToDelete)
            .then(() => this.props.ctrl.onDeleteSuccess(groupToDelete));
    }
}
