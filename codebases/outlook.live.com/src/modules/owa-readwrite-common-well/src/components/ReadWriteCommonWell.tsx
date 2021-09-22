import * as React from 'react';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import Droppable from 'owa-dnd/lib/components/Droppable';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import type WellItemDragData from '../store/schema/WellItemDragData';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';
import { ExtendedPeoplePicker } from '@fluentui/react/lib/ExtendedPicker';
import type { IPersonaProps } from '@fluentui/react/lib/Persona';
import type { ITheme } from '@fluentui/style-utilities';
import type { WellDropViewState } from '../store/schema/WellDropViewState';
import updateItemListOnDrop from '../actions/updateItemListOnDrop';
import {
    FloatingPeoplePicker,
    IPeopleFloatingPickerProps,
} from '@fluentui/react/lib/FloatingPicker';
import {
    ISelectedPeopleProps,
    SelectedPeopleList,
    ISelectedPeopleItemProps,
} from '@fluentui/react/lib/SelectedItemsList';
import { DarkModeContext } from 'owa-theme';
import type EntityAddSource from 'owa-service/lib/contract/EntityAddSource';
import { setDidDragStart } from '../actions/setDidDragStart';

import styles from './ReadWriteCommonWell.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface ReadWriteCommonWellProps<
    TSuggestion extends IPersonaProps, // suggestion type
    TItem extends ReadWriteCommonWellItemViewState, // resolved item type
    TSelectedItem extends IPersonaProps // external (controlled component) selectedItems
> {
    draggableItemType: string;
    dropViewState?: WellDropViewState;
    theme?: ITheme;
    defaultSelectedItems: TSelectedItem[];
    /* Selected items, if using as a controlled component */
    selectedItems?: TSelectedItem[];
    /* Called when an item(s) is/are added to the well */
    onItemsAdded?: (items: TItem[]) => void;
    /* Called when an item(s) is/are removed from the well */
    onItemsRemoved?: (items: TItem[], isExpand?: boolean) => void;
    /* Called when items in the well are changed (should be used in lieu of onItemAdded/onItemRemoved as this will not be called if those are provided) */
    onItemsChanged?: (items: TItem[]) => void;
    /* Called when an item is selected in the picker */
    onItemSelected?: (item: TSuggestion) => TSuggestion | Promise<TSuggestion>;
    /* Custom css for the common container */
    containerClassName?: string;
    /* Custom CSS class name for well container */
    wellClassName?: string;
}

export interface ReadWriteCommonWellState<TItem> {
    items: TItem[];
}

export abstract class ReadWriteCommonWell<
    TProps extends ReadWriteCommonWellProps<TSuggestion, TItem, TSuggestedItem>,
    TSuggestion extends IPersonaProps, // suggestion type
    TItem extends ReadWriteCommonWellItemViewState, // resolved item type
    TSuggestedItem extends IPersonaProps, // external (controlled component) selectedItems
    TState extends ReadWriteCommonWellState<TItem>
> extends React.Component<TProps, TState> {
    protected picker: ExtendedPeoplePicker;
    static contextType = DarkModeContext;
    private dropViewState: WellDropViewState;
    private textElement?: HTMLElement;

    public static defaultProps = {
        dropViewState: createDropViewState(),
    };

    public focus = () => {
        if (this.picker) {
            this.picker.focus();
            // show the picker if there is a query present already.
            this.picker.floatingPicker.current &&
                this.picker.floatingPicker.current.inputText.length !== 0 &&
                this.picker.floatingPicker.current.showPicker();
        }
    };

    constructor(props: TProps) {
        super(props);

        this.dropViewState = this.props.dropViewState;
        this.state = { items: [] } as TState;
    }

    componentDidMount() {
        const convertedItems: TItem[] = this.convertInitialItemsToWellItems(
            this.props.defaultSelectedItems
        );
        this.setState({ items: convertedItems });
        // Saving this value because inputElement doesn't appear when itemLimit is reached
        this.textElement = this?.picker?.inputElement?.parentElement;
    }

    componentDidUpdate() {
        // Adding this to fix the a11y issue
        if (this.state.items.length === 0) {
            this.textElement?.setAttribute('role', 'presentation');
        } else {
            this.textElement?.setAttribute('role', 'list');
        }
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78455
    UNSAFE_componentWillReceiveProps(
        nextProps: ReadWriteCommonWellProps<TSuggestion, TItem, TSuggestedItem>
    ) {
        if (nextProps.selectedItems) {
            const convertedItems: TItem[] = this.convertInitialItemsToWellItems(
                nextProps.selectedItems
            );
            this.setState({ items: convertedItems });
        }
    }

    // Timer variable which will contain reference to async execution of nextTick in requestAnimationFrame.
    private updateTimer = null;
    // Function responsible for re-rendering component and setting updateTimer ref to null.
    private nextTick = () => {
        this.updateTimer = null;
        this.forceUpdate();
    };

    // Debounce re-render to once-per-frame to deal with the high cost of expanding distribution lists
    // (data streaming in for personas forces lots of re-renders on dl expansion)
    shouldComponentUpdate(
        nextProps: Readonly<TProps>,
        nextState: Readonly<TState>,
        nextContext: any
    ): boolean {
        if (this.updateTimer !== null) {
            cancelAnimationFrame(this.updateTimer);
        }
        this.updateTimer = requestAnimationFrame(this.nextTick);
        return false;
    }

    private canDrop = (dragData: DragData): boolean => {
        return dragData.itemType === this.props.draggableItemType;
    };

    private onDrop = (
        dragData: WellItemDragData,
        pageX: number,
        pageY: number,
        target?: HTMLElement
    ): void => {
        if (this.canDrop(dragData)) {
            setDidDragStart(this.dropViewState, false);
            let item = dragData.item;
            let dropIndex = this.dropViewState.dropItemIndex;
            let originalItemIndex = this.getItemIndex(item);
            this.dropViewState.shouldRemoveFromRight = false;

            if (dropIndex >= 0) {
                this.dropViewState.shouldRemoveFromRight =
                    originalItemIndex < dropIndex ? false : true;
                updateItemListOnDrop(this.state.items, dropIndex, item);
                this.onItemsChanged();
            } else {
                this.onItemsAdded([item]);
            }
        }
    };

    private onDragEnter = (dragData: WellItemDragData): void => {
        setDidDragStart(this.dropViewState, true);

        // Need to force update the dropViewState for cross Well DnD
        this.forceUpdate();
    };

    private removeItems = (items: TItem[], fromExpand?: boolean) => {
        if (this.props.onItemsRemoved) {
            this.props.onItemsRemoved(items, fromExpand);
        } else {
            const newItems = this.state.items.filter(value => items.indexOf(value) === -1);
            this.setState({ items: newItems }, this.onItemsChanged);
        }
    };

    render() {
        const isDarkMode = this.context;
        const well = this.dropViewState ? (
            <Droppable
                classNames={this.props.containerClassName}
                dropViewState={this.dropViewState}
                onDragEnter={this.onDragEnter}
                canDrop={this.canDrop}
                onDrop={this.onDrop}>
                <div
                    className={classNames(styles.wellContainer, {
                        darkModeInput: isDarkMode,
                    })}
                    onClick={this.focus}
                    onKeyDown={this.onKeyDown}>
                    {this.renderWell()}
                </div>
            </Droppable>
        ) : (
            <div className={this.props.containerClassName}>
                <div
                    className={classNames(styles.wellContainer, {
                        darkModeInput: isDarkMode,
                    })}
                    onClick={this.focus}
                    onKeyDown={this.onKeyDown}>
                    {this.renderWell()}
                </div>
            </div>
        );
        return well;
    }

    protected getSelectedItemsListProps = (): ISelectedPeopleProps => {
        return {
            onRenderItem: this.renderSelectedItem,
            onChange: this.onSelectedItemsChanged,
            ...this.getExtendedSelectedItemsListProps(),
        };
    };

    // Allow the RecipientWell to tack additional classes on to the well container
    // in order to support the recipient well.
    protected getWellClassname(): string {
        return classNames(styles.well, this.props.wellClassName);
    }

    private renderWell = (): JSX.Element => {
        return (
            <div className={this.getWellClassname()}>
                <ExtendedPeoplePicker
                    defaultSelectedItems={this.convertInitialItemsToWellItems(
                        this.props.defaultSelectedItems
                    )}
                    selectedItems={this.state.items}
                    floatingPickerProps={this.getFindControlProps()}
                    selectedItemsListProps={this.getSelectedItemsListProps()}
                    onRenderFloatingPicker={onRenderFindControl}
                    onRenderSelectedItems={onRenderSelectedItemsList}
                    onItemsRemoved={this.onItemsRemoved}
                    componentRef={this.extendedPickerRef}
                    onItemAdded={this.onItemAdded}
                    {...this.extendedPickerProps()}
                    onItemSelected={this.onItemSelected}
                />
            </div>
        );
    };

    private onItemAdded = (item: TSuggestion) => {
        this.onItemsAdded([this.convertSuggestionItemToWellItem(item)]);
    };

    private extendedPickerRef = (ref: ExtendedPeoplePicker) => {
        this.picker = ref;
    };

    /**
     * Callback on keydown for special handling
     */
    protected abstract onKeyDown: (event: React.KeyboardEvent<unknown>) => void;

    /**
     * Converts the initial items (defaultSelectedItems or selectedItems) to well items
     */
    protected abstract convertInitialItemsToWellItems: (items: TSuggestedItem[]) => TItem[];

    /**
     * Converts the suggestion item to a well item
     */
    protected abstract convertSuggestionItemToWellItem: (suggestionItem: TSuggestion) => TItem;

    /**
     * Extra props for the sub class to pass to the find control
     */
    protected abstract getFindControlProps: () => Partial<IPeopleFloatingPickerProps>;

    /**
     * Extra props for the sub class to pass to the selected items list
     */
    protected abstract getExtendedSelectedItemsListProps: () => Partial<ISelectedPeopleProps>;

    /**
     * Extra props for the sub class to pass to the people picker
     */
    protected abstract extendedPickerProps(): any;

    /**
     * Processes items to be added and returns the items that should be added
     */
    // Disable TSLint rule to work around https://github.com/microsoft/TypeScript/issues/33855
    // tslint:disable-next-line:use-arrow-functions-for-react-bound-methods
    protected processItemsToAdd = (
        itemsToAdd: TItem[],
        entityAddSource?: EntityAddSource
    ): TItem[] => {
        return itemsToAdd;
    };

    /**
     * Callback for when an item is added to the well
     */
    protected onItemsAdded = (itemsToAdd: TItem[], entityAddSource?: EntityAddSource) => {
        const processedItemsToAdd = this.processItemsToAdd(itemsToAdd, entityAddSource);

        if (this.props.onItemsAdded) {
            this.props.onItemsAdded(processedItemsToAdd);
        } else {
            const newItems = this.state.items.concat(processedItemsToAdd);
            this.setState({ items: newItems }, this.onItemsChanged);
        }
    };

    /**
     * Callback for when an item or items are removed from the well
     */
    protected onItemsRemoved = (items: TItem[]) => {
        this.removeItems(items, false /* fromExpand*/);
    };

    /**
     * Callback for when group expanded
     */
    protected onItemsExpanded = (itemsToRemove: TItem[], itemsToAdd: TItem[]) => {
        this.removeItems(itemsToRemove, true /* fromExpand*/);
        this.onItemsAdded(itemsToAdd);
    };

    /**
     * Callback for when any items in the well have changed
     */
    protected onItemsChanged = () => {
        if (this.props.onItemsChanged) {
            this.props.onItemsChanged(this.state.items);
        }
    };

    /** Callback when Item is selected from the picker dropdown */
    protected onItemSelected = (item: TSuggestion): TSuggestion | Promise<TSuggestion> => {
        if (this.props.onItemSelected) {
            return this.props.onItemSelected(item);
        }

        return item;
    };

    /**
     * Callback for when the selected items in the well has changed
     */
    protected abstract onSelectedItemsChanged: (items: TItem[]) => void;

    /**
     * Rendering function for the items in the well
     */
    protected abstract renderSelectedItem: (props: ISelectedPeopleItemProps) => JSX.Element;

    /**
     * Get the index of an item in the recipientWell
     * @param item
     */
    protected abstract getItemIndex: (item: ReadWriteCommonWellItemViewState) => number;
}

function onRenderFindControl(props: IPeopleFloatingPickerProps): JSX.Element {
    return <FloatingPeoplePicker {...props} />;
}

function onRenderSelectedItemsList(props: ISelectedPeopleProps): JSX.Element {
    return <SelectedPeopleList {...props} />;
}
