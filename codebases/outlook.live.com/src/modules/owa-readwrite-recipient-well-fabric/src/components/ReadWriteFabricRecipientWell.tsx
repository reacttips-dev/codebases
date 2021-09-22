import { isStringNullOrWhiteSpace } from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47753 */
import * as React from 'react';
import containsImplicitGroupMembers from '../utils/containsImplicitGroupMembers';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import EditableReadWriteRecipient from './EditableReadWriteRecipient';
import expandGroup from '../utils/expandGroup';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import createFindControlViewState from 'owa-recipient-common/lib/utils/createFindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import getFloatingPickerProps from '../utils/getFloatingPickerProps';
import getRecipientAndImplicitGroupMembers from '../utils/getRecipientAndImplicitGroupMembers';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import resolveAllUnresolvedRecipients from 'owa-readwrite-recipient-well/lib/actions/resolveAllUnresolvedRecipients';
import setForceResolveState from 'owa-readwrite-recipient-well/lib/actions/setForceResolveState';
import tryForceResolve from '../utils/tryForceResolve';
import forceAddRecipientFromQueryString from '../utils/forceAddRecipientFromQueryString';
import updateQueryString from '../actions/updateQueryString';
import { FocusZoneTabbableElements, IFocusZoneProps } from '@fluentui/react/lib/FocusZone';
import type { IInputProps } from '@fluentui/react/lib/Pickers';
import type { IPersonaProps } from '@fluentui/react/lib/Persona';
import { observer } from 'mobx-react';
import { ReadWriteRecipientWellSize } from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import {
    ReadWriteCommonWell,
    ReadWriteCommonWellProps,
    ReadWriteCommonWellState,
} from 'owa-readwrite-common-well/lib/components/ReadWriteCommonWell';
import parsePastedTextForRecipients from '../utils/parsePastedTextForRecipients';
import getCopiedEmailAddresses from '../utils/getCopiedEmailAddresses';
import resolveAllPendingRecipients from '../utils/resolveAllPendingRecipients';
import type { IExtendedPeoplePickerProps } from '@fluentui/react/lib/ExtendedPicker';
import type {
    FloatingPeoplePicker,
    IPeopleFloatingPickerProps,
} from '@fluentui/react/lib/FloatingPicker';
import type {
    ISelectedPeopleProps,
    ISelectedPeopleItemProps,
} from '@fluentui/react/lib/SelectedItemsList';
import EntityAddSource from 'owa-service/lib/contract/EntityAddSource';
import isSameRecipient from '../utils/isSameRecipient';
import { getReadWriteRecipientViewStateFromRecipientAddressString } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromRecipientAddressString';
import type { ReadWriteCommonWellItemStyles } from 'owa-readwrite-common-well/lib/components/ReadWriteCommonWellItem.types';
import type { EditorPlugin } from 'roosterjs-editor-types';

import styles from './ReadWriteFabricRecipientWell.scss';
import classNames from 'classnames';

export interface ReadWriteFabricRecipientWellProps<TItem extends IPersonaProps>
    extends ReadWriteCommonWellProps<FindRecipientPersonaType, ReadWriteRecipientViewState, TItem> {
    recipientType: RecipientType;
    findControlViewState?: FindControlViewState;
    recipientSize?: ReadWriteRecipientWellSize;
    onRenderWellLabel?: (recipientType: RecipientType) => JSX.Element;
    inputProps?: IInputProps;
    useAsControlledComponent?: boolean /* This won't be needed after vso: 35556 */;
    convertInitialItemsToWellItems: (externalItems: TItem[]) => ReadWriteRecipientViewState[];
    processItemToAdd?: (
        itemToAdd: ReadWriteRecipientViewState,
        entityAddSource?: EntityAddSource,
        findControl?: FindControlViewState
    ) => boolean;
    onItemEdited?: (
        originalItem: ReadWriteRecipientViewState,
        newItem: ReadWriteRecipientViewState
    ) => void;
    onPickerHidden?: () => void;
    enableSingleSelection?: boolean;
    showAvailability?: boolean;
    peoplePickerClassName?: string;
    editingRecipientInputClassName?: string;
    canDrag?: boolean;
    isItemAligned?: boolean;
    wellItemStyles?: Partial<ReadWriteCommonWellItemStyles>;
    /**
     * If true, the recipient well will pre-resolve pending inserted recipients
     * before actually adding them to the well state.
     *
     * This can add a delay, but makes it so that the consumer's code does not need
     * to account for potentially unresolved recipients.
     */
    shouldPreResolveRecipients?: boolean;
    scenario?: string;
    /** Callback to retrieve additional recipient email addresses to send up with the live zero query call */
    getAdditionalRecipientEmailAddresses?: (recipientTypeToExclude: RecipientType) => string[];
    // These properties are only used by the UncontrolledRecipientEdit
    editorsRef?: EditorPlugin;
    inputAriaLabel?: string;
}

export interface ReadWriteFabricRecipientWellState
    extends ReadWriteCommonWellState<ReadWriteRecipientViewState> {
    findControlViewState: FindControlViewState;
}

@observer
export default class ReadWriteFabricRecipientWell<
    TItem extends IPersonaProps
> extends ReadWriteCommonWell<
    ReadWriteFabricRecipientWellProps<TItem>,
    FindRecipientPersonaType,
    ReadWriteRecipientViewState, // type of resolved item in well
    TItem, // type of item in suggestion before it going into the well
    ReadWriteFabricRecipientWellState
> {
    constructor(props: ReadWriteFabricRecipientWellProps<TItem>) {
        super(props);

        // Create a viewState if one was not passed in
        let defaultFindControlViewState = props.findControlViewState
            ? null
            : createFindControlViewState();

        this.state = {
            items: [],
            findControlViewState: defaultFindControlViewState,
        };
    }

    public addItem = (recipientsToAdd: ReadWriteRecipientViewState[]) => {
        this.onItemsAdded(recipientsToAdd);
    };

    public forceResolveQueryString = async () => {
        const shouldPreResolve = this.props.shouldPreResolveRecipients;
        await forceAddRecipientFromQueryString(this.getViewState, async recipients => {
            const possiblyResolvedRecipients = !shouldPreResolve
                ? recipients
                : await resolveAllPendingRecipients(recipients, this.props.findControlViewState);

            // When forcing a resolution, don't add duplicates.
            const newRecipients = possiblyResolvedRecipients.filter(recipient =>
                this.state.items.every(existingItem => !isSameRecipient(recipient, existingItem))
            );

            newRecipients.length && this.onItemsAdded(newRecipients);
        });
        this.picker && this.picker.clearInput();
    };

    public clearQueryString = () => {
        this.picker.clearInput();
        this.picker.inputElement.value = '';
        updateQueryString(this.getViewState(), '');
    };

    protected getFindControlProps = (): Partial<IPeopleFloatingPickerProps> => {
        let floatingPickerProps = getFloatingPickerProps(
            this.getViewState,
            this.getFindControl,
            this.props.useAsControlledComponent,
            this.props.theme,
            this.props.onPickerHidden,
            this.props.scenario,
            this.getAdditionalRecipientEmailAddresses
        );

        return {
            ...floatingPickerProps,
            onInputChanged: this.onInputChanged,
        };
    };

    protected getExtendedSelectedItemsListProps = (): Partial<ISelectedPeopleProps> => {
        return {
            onCopyItems: getCopiedEmailAddresses,
            canRemoveItem: this.canRemoveItem,
        };
    };

    protected extendedPickerProps(): Partial<IExtendedPeoplePickerProps> {
        const {
            inputProps,
            useAsControlledComponent,
            recipientType,
            peoplePickerClassName,
        } = this.props;
        const findControlViewState = this.getViewState();
        const currentRenderedQueryString = findControlViewState.currentRenderedQueryString
            ? findControlViewState.currentRenderedQueryString
            : '';

        return {
            headerComponent:
                this.props.onRenderWellLabel && this.props.onRenderWellLabel(recipientType),
            inputProps: inputProps,
            currentRenderedQueryString: useAsControlledComponent
                ? currentRenderedQueryString
                : undefined,
            focusZoneProps: {
                handleTabKey: FocusZoneTabbableElements.all,
                shouldInputLoseFocusOnArrowKey: () => {
                    return true;
                },
            } as IFocusZoneProps,
            suggestionItems: useAsControlledComponent
                ? findControlViewState.findResultSet.slice()
                : null,
            className: peoplePickerClassName,
            onPaste: (pastedText: string) => {
                this.onPaste(pastedText);
                // We can't resolve items immediately. Instead,
                // return no items and add asynchonously in onPaste
                return [];
            },
        };
    }

    protected onPaste = async (pastedText: string): Promise<void> => {
        const parsedItems = this.parsePastedTextForItems(pastedText);
        const itemsToAdd = this.props.shouldPreResolveRecipients
            ? await resolveAllPendingRecipients(parsedItems, this.props.findControlViewState)
            : parsedItems;
        this.onItemsAdded(itemsToAdd, EntityAddSource.Paste);
        this.clearQueryString();
    };

    protected processItemsToAdd = (
        itemsToAdd: ReadWriteRecipientViewState[],
        entityAddSource?: EntityAddSource
    ): ReadWriteRecipientViewState[] => {
        let { processItemToAdd } = this.props;

        let items: ReadWriteRecipientViewState[] = [];
        itemsToAdd.forEach(item => {
            if (!processItemToAdd || processItemToAdd?.(item, entityAddSource)) {
                if (containsImplicitGroupMembers(item)) {
                    items = items.concat(getRecipientAndImplicitGroupMembers(item));
                } else {
                    items.push(item);
                }
            }
        });
        if (this.props.enableSingleSelection) {
            this.picker.inputElement.hidden = true;
        }
        return items;
    };

    protected getItemIndex = (item: ReadWriteRecipientViewState): number => {
        for (let i = 0; i < this.state.items.length; i++) {
            let curItem = this.state.items[i];
            if (curItem.persona?.PersonaId?.Id) {
                if (item.persona?.PersonaId?.Id) {
                    if (item.persona.PersonaId.Id === curItem.persona.PersonaId.Id) {
                        return i;
                    }
                }
            }
        }
        return -1;
    };

    protected getWellClassname(): string {
        return classNames(
            super.getWellClassname(),
            this.props.recipientSize === ReadWriteRecipientWellSize.Small &&
                styles.smallWellWrapperOverride
        );
    }

    protected renderSelectedItem = (props: ISelectedPeopleItemProps): JSX.Element => {
        let {
            theme,
            recipientSize,
            showAvailability,
            editingRecipientInputClassName,
            canDrag,
            isItemAligned,
            wellItemStyles,
        } = this.props;
        const findControlViewState = this.getViewState();
        let size = recipientSize !== undefined ? recipientSize : ReadWriteRecipientWellSize.Regular;
        let viewState = props.item as ReadWriteRecipientViewState;
        return (
            <EditableReadWriteRecipient
                isSelected={props.selected}
                inForceResolve={findControlViewState.inForceResolve}
                dropViewState={this.props.dropViewState}
                index={props.index}
                theme={theme}
                size={size}
                expandGroupOperation={this.expandGroup}
                viewState={viewState}
                useContextMenu={true}
                onEditingFinished={this.onEditingFinished}
                draggableItemType={this.props.draggableItemType}
                removeOperation={(
                    item: ReadWriteRecipientViewState,
                    shouldRemoveFromRight?: boolean
                ) => {
                    this.onItemsRemoved([item], shouldRemoveFromRight);
                    this.focus();
                }}
                showAvailability={showAvailability}
                editingRecipientInputClassName={editingRecipientInputClassName}
                canDrag={canDrag}
                isItemAligned={isItemAligned}
                wellItemStyles={wellItemStyles}
                scenario={this.props.scenario}
            />
        );
    };

    protected convertSuggestionItemToWellItem = (
        suggestionItem: FindRecipientPersonaType
    ): ReadWriteRecipientViewState => {
        return getReadWriteRecipientViewStateFromFindRecipientPersonaType(suggestionItem);
    };

    protected convertInitialItemsToWellItems = (items: TItem[]): ReadWriteRecipientViewState[] => {
        return this.props.convertInitialItemsToWellItems(items);
    };

    protected onSelectedItemsChanged = (items: ReadWriteRecipientViewState[]): void => {
        const findControlViewState = this.getViewState();

        updateQueryString(findControlViewState, this.picker.inputElement.value);
    };

    protected parsePastedTextForItems(pastedText: string): ReadWriteRecipientViewState[] {
        return parsePastedTextForRecipients(pastedText);
    }

    protected onKeyDown = (ev: React.KeyboardEvent<unknown>) => {
        if (ev.ctrlKey && ev.which == KeyboardCharCodes.K) {
            ev.preventDefault();

            const findControlViewState = this.getViewState();
            if (!isStringNullOrWhiteSpace(findControlViewState.queryString)) {
                setForceResolveState(findControlViewState, true);
                tryForceResolve(this.getViewState, this.getFindControl());
            } else {
                resolveAllUnresolvedRecipients(findControlViewState, this.state.items);
            }
        }

        if (ev.which === KeyboardCharCodes.Enter) {
            let evtTarget = ev.target as HTMLElement;
            let LPCWrapper = evtTarget.querySelector('span.LPCWrapper') as HTMLElement;
            if (LPCWrapper) {
                LPCWrapper.click();
            }
        }
    };

    // Overriding onItemsRemoved of ReadWriteCommonWell so that we can properly remove duplicate persona in the recipient well.
    protected onItemsRemoved = (
        items: ReadWriteRecipientViewState[],
        shouldRemoveFromRight?: boolean
    ) => {
        if (this.props.onItemsRemoved) {
            this.props.onItemsRemoved(items, false /* isExpand */);
        } else {
            // Remove duplicate present
            const newItems = this.filterItems(items, shouldRemoveFromRight);
            this.setState({ items: newItems }, this.onItemsChanged);
        }
        if (this.props.enableSingleSelection) {
            this.picker.inputElement.hidden = false;
        }
    };

    // This method will remove a duplicate or invalid recipient present in state of this component.
    // The recipients to be removed are contained in items array which is being passed as a param.
    // This function removes invalid or duplicate by matching the persona id or smtp of recipient.
    private filterItems(
        items: ReadWriteRecipientViewState[],
        shouldRemoveFromRight: boolean
    ): ReadWriteRecipientViewState[] {
        const toBeRemovedItemNames = items.reduce((acc, item) => {
            if (item.persona) {
                const dedupKey = this.getPersonaKeyForDedup(item.persona);
                if (dedupKey !== null) {
                    // dedup key is present if users have either a valid persona id or smtp
                    acc[dedupKey] = true;
                }
            }
            return acc;
        }, {});

        let itemsToFilter = shouldRemoveFromRight ? this.state.items.reverse() : this.state.items;
        let filteredItem = itemsToFilter.filter(recipient => {
            const dedupKey = this.getPersonaKeyForDedup(recipient.persona);
            if (recipient.persona && dedupKey !== null && !toBeRemovedItemNames[dedupKey]) {
                // keep the data if no dup is found
                return true;
            } else {
                // remove the data if
                // - dup is found
                // - or dedup key is null, i.e user doesn't have a valid persona id or smtp
                // - or recipient doesn't have persona prop
                return false;
            }
        });

        return shouldRemoveFromRight ? filteredItem.reverse() : filteredItem;
    }

    private getPersonaKeyForDedup(persona: FindRecipientPersonaType): string {
        if (persona.PersonaId?.Id) {
            // for users who have valid persona id, use persona id as the key
            return persona.PersonaId.Id;
        } else if (persona.EmailAddress) {
            // for users who don't have persona id, use the smtp as key if it's present
            return persona.EmailAddress.EmailAddress;
        } else {
            return null;
        }
    }

    private getViewState = (): FindControlViewState => {
        return this.props.findControlViewState
            ? this.props.findControlViewState
            : this.state.findControlViewState;
    };

    private getFindControl = (): FloatingPeoplePicker => {
        return this.picker ? this.picker.floatingPicker.current : null;
    };

    private getAdditionalRecipientEmailAddresses = (): string[] | undefined => {
        return this.props.getAdditionalRecipientEmailAddresses?.(this.props.recipientType);
    };

    private expandGroup = (recipientToExpand: ReadWriteRecipientViewState) => {
        expandGroup(recipientToExpand).then(value => {
            if (value.length) {
                this.onItemsExpanded([recipientToExpand], value);
                this.focus();
            }
        });
    };

    protected onInputChanged = (filterText: string) => {
        let itemInserted = false;
        let lastCharIndex = filterText.length - 1;
        let lastChar = filterText[lastCharIndex];
        const findControlViewState = this.getViewState();
        if (lastChar == ';' || lastChar == ',') {
            let itemText = filterText.substring(0, lastCharIndex);
            if (itemText.length > 0) {
                let recipient = getReadWriteRecipientViewStateFromRecipientAddressString(itemText);

                this.onItemsAdded([recipient], EntityAddSource.ExplicitTyping);
                this.picker.clearInput();
                itemInserted = true;
            }
        }

        updateQueryString(findControlViewState, itemInserted ? '' : filterText);
    };

    private canRemoveItem(item: ReadWriteRecipientViewState): boolean {
        return !item.blockWellItemRemoval;
    }

    private onEditingFinished = (
        editedItem: ReadWriteRecipientViewState,
        newItem: ReadWriteRecipientViewState
    ) => {
        const findControlViewState = this.getViewState();

        if (this.props.onItemEdited) {
            this.props.onItemEdited(editedItem, newItem);
        } else {
            let newItems = this.state.items;
            const indexOfEditedItem = newItems.indexOf(editedItem);
            newItems.splice(indexOfEditedItem, 1, newItem);
            this.setState({ items: newItems }, this.onItemsChanged);
        }

        if (!findControlViewState.inForceResolve) {
            this.focus();
        } else {
            resolveAllUnresolvedRecipients(findControlViewState, this.state.items);
        }
    };
}
