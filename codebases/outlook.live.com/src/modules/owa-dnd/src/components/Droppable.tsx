import * as React from 'react';
import type DropViewState from '../store/schema/DropViewState';
import getLocalFilesDragData from '../utils/LocalFilesDragData';
import type DropEffect from '../store/schema/DropEffect';
import setDropState from '../actions/setDropState';
import {
    DragData,
    getDragItemType,
    getDragItemData,
    setDragItemDetails,
    setDropEffect,
} from '../utils/dragDataUtil';
import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { DraggableItemTypes } from '../utils/DraggableItemTypes';

const DEFAULT_ITEM_TYPE = 'nothing';

export interface DroppableProps {
    // A callback function to call when drop
    onDrop: (dragData: DragData, pageX: number, pageY: number, target?: HTMLElement) => void;

    // ViewState object, use this object to render different layout when dragging over
    dropViewState: DropViewState;

    // (Optional) A callback function to check if current drag data is able to drop on current element
    // The boolean return value here is deprecated, you should use DropEffect instead.
    canDrop?: (dragInfo: DragData) => boolean | DropEffect;

    // (Optional) A callback function to call when drag over this element
    onDragOver?: (dragInfo: DragData, pageX: number, pageY: number, target?: HTMLElement) => void;

    // (Optional) Flag for if this component will act upon the item
    bypassActOnDrop?: boolean;

    // (Deprecated) (Optional) whether to use copy as drop effect
    shouldUseCopyAsDropEffect?: boolean;

    // (Optional) A callback function to call when drag leave this element
    onDragLeave?: (dragInfo: DragData, target?: HTMLElement) => void;

    // (Optional) A callback function to call when a item is being dragged enter this element.
    onDragEnter?: (dragInfo: DragData) => void;

    // (Optional) CSS Class name of this element
    classNames?: string;

    // (Optional) Inline css styles for this element
    style?: React.CSSProperties;

    // Used to indicate whether a drag over a child element should be considered a
    // drag over the parent as well
    greedy?: boolean;

    // (Optional) Whether to ignore transient onDragLeave event
    shouldIgnoreTransientOnDragLeave?: boolean;

    // (Optional) Whether to prevent drag events from propagating through
    preventBubblingDragEvents?: boolean;

    // (Deprecated) (Optional) Whether we should show a default no-drop image for items that cannot be dropped
    showDefaultNoDropImage?: boolean;

    children?: React.ReactNode;
}

const DRAG_LEAVE_HANDLER_DELAY_IN_MILLISECONDS = 50;

// This is a helper class for better code reusing, this should be only invoked from owadnd classes
export class DroppableCore {
    private div: HTMLDivElement;

    // We receive a lot of onDragLeave and onDragOver events during hovering over.
    // onDragLeave sets false to isDragOver, onDragOver sets true to isDragOver.
    // Then, isDragOver property changes frequently and would cause UI flicking.
    // So we introduce a delay for the onDragLeave handler to ignore the transient onDragLeave event to avoid the UI flicking.
    private pendingDragLeaveHandler;

    constructor(private props: DroppableProps) {}

    // OnDragEnter event handler
    onDragEnter = (dragEvent: React.DragEvent<HTMLElement>) => {
        dragEvent.preventDefault();
        if (this.props.preventBubblingDragEvents) {
            dragEvent.stopPropagation();
        }
        //For edge when a draggable item is leaving the droppable
        //the dropEffect is stuck in the value when item was in
        //the original droppable. We are setting the drop effect
        // manually, so in drag enter we need to set the dropEffect
        // to the correct value.
        const dragData = this.getDragData(dragEvent);
        if (isBrowserEdge() || isBrowserIE()) {
            this.setDropEffectInternal(dragEvent, this.getDesiredDropEffect(dragData));
        }
        if (this.props.onDragEnter) {
            this.props.onDragEnter(dragData);
        }
    };

    // OnDragLeave event handler
    onDragLeave = (dragEvent: React.DragEvent<HTMLElement>) => {
        // The HTML5 API will fire onDragLeave when the user drags over any children of the droppable
        // We want to ignore this here and treat this as being still inside the droppable area.
        if (this.props.preventBubblingDragEvents) {
            dragEvent.stopPropagation();
        }

        if (this.props.greedy && !this.isReallyLeavingDroppable(dragEvent)) {
            return;
        }

        let dragType = this.props.dropViewState.draggableItemType;
        if (!dragType) {
            dragType = this.getDragType(dragEvent);
        }
        let dragData: DragData = { itemType: dragType, itemData: getDragItemData() };

        if (this.getDesiredDropEffect(dragData) == 'none') {
            return;
        }

        const handler = (dragData: DragData) => () => {
            if (this.props.onDragLeave) {
                this.props.onDragLeave(dragData, dragEvent.currentTarget);
            }
            setDropState(
                this.props.dropViewState,
                false /*isDragOver*/,
                null /*draggableItemType*/
            );
            this.pendingDragLeaveHandler = null;
        };

        if (!this.props.shouldIgnoreTransientOnDragLeave) {
            handler(dragData)();
        } else if (!this.pendingDragLeaveHandler) {
            dragEvent.persist();
            this.pendingDragLeaveHandler = setTimeout(
                handler(dragData),
                DRAG_LEAVE_HANDLER_DELAY_IN_MILLISECONDS
            );
        }
        //For edge when a draggable item is leaving the droppable
        //the dropEffect is stuck in the value when item was in
        //the original droppable. We are setting the drop effect
        // manually.
        if (isBrowserEdge() || isBrowserIE()) {
            this.setDropEffectInternal(dragEvent, 'none');
        }
    };

    // OnDragOver event handler
    onDragOver = (dragEvent: React.DragEvent<HTMLElement>) => {
        if (this.props.preventBubblingDragEvents) {
            dragEvent.stopPropagation();
        }

        let dragType = this.props.dropViewState.draggableItemType;
        if (!dragType) {
            dragType = this.getDragType(dragEvent);
        }
        let dragData: DragData = { itemType: dragType, itemData: getDragItemData() };

        const dropEffect = this.getDesiredDropEffect(dragData);

        // If we should not handle events, we should stop processing.
        if (dropEffect == 'none') {
            // If we're bypassing actions on drop, we don't want to modify the dropEffect.
            // This is often when there's a valid drop target above us in the document tree.
            // If this is a valid drop target, we should reset the drop effect to "none".
            // This sets a proper drag hint icon.
            if (!this.props.bypassActOnDrop) {
                this.setDropEffectInternal(dragEvent, 'none');
            }
            return;
        }

        if (!this.props.bypassActOnDrop) {
            dragEvent.preventDefault(); // adding preventDefault allows the drop to happen
            this.setDropEffectInternal(dragEvent, dropEffect);
        }

        if (this.props.shouldUseCopyAsDropEffect) {
            this.setDropEffectInternal(dragEvent, 'copy');
        }

        if (this.props.onDragOver) {
            this.props.onDragOver(
                dragData,
                dragEvent.pageX,
                dragEvent.pageY,
                dragEvent.currentTarget
            );
        }

        this.cancelPendingDragLeaveHandler();
        if (
            !this.props.dropViewState.isDragOver ||
            this.props.dropViewState.draggableItemType != dragType
        ) {
            setDropState(this.props.dropViewState, true /*isDragOver*/, dragType);
        }
    };

    // OnDrop event handler
    onDrop = (dragEvent: React.DragEvent<HTMLElement>) => {
        if (this.props.preventBubblingDragEvents) {
            dragEvent.stopPropagation();
        }

        let dragData = this.getDragData(dragEvent);

        // Need this, otherwise FireFox gets redirected.
        if (dragData?.itemType != DEFAULT_ITEM_TYPE) {
            dragEvent.preventDefault();
        }

        if (this.getDesiredDropEffect(dragData) == 'none') {
            return;
        }

        this.props.onDrop(dragData, dragEvent.pageX, dragEvent.pageY, dragEvent.currentTarget);

        // TODO VSO 13903: Some times components need extra info to determine if the dropping action is on the component itself
        // or another component which shares the same store object
        // We call this callback here to allow the component do some extra work.
        if (this.props.onDragLeave) {
            this.props.onDragLeave(dragData, dragEvent.currentTarget);
        }

        this.cancelPendingDragLeaveHandler();
        setDragItemDetails(null, null);
        setDropState(this.props.dropViewState, false /*isDragOver*/, null /*draggableItemType*/);
    };

    refCallback = (ref: HTMLDivElement) => {
        this.div = ref;
    };

    getDiv() {
        return this.div;
    }

    cancelPendingDragLeaveHandler() {
        if (this.pendingDragLeaveHandler) {
            clearTimeout(this.pendingDragLeaveHandler);
            this.pendingDragLeaveHandler = null;
        }
    }

    /**
     * Check whether we are *really* leaving the droppable area during a dragleave event
     * @param dragEvent The dragleave event
     * @returns True if we are in fact leaving the droppable, false otherwise
     */
    private isReallyLeavingDroppable(dragEvent: React.DragEvent<HTMLElement>): boolean {
        let hoveredElement = document.elementFromPoint(
            dragEvent.pageX,
            dragEvent.pageY
        ) as HTMLElement;
        return !this.isDescendantOrSelf(hoveredElement, dragEvent.currentTarget);
    }

    private isDescendantOrSelf(element: HTMLElement, ancestor: HTMLElement): boolean {
        if (!element || !ancestor) {
            return false;
        }
        if (element == ancestor) {
            return true;
        }
        var parent = element;
        while ((parent = parent.parentElement)) {
            if (parent == ancestor) {
                return true;
            }
        }
        return false;
    }

    private getDesiredDropEffect(dragData: DragData): DropEffect {
        // DragData can be null, if the drag has happened not from the dragContext source.
        if (dragData) {
            if (this.props.canDrop) {
                if (typeof this.props.canDrop(dragData) === 'boolean') {
                    // For legacy scenarios returning boolean values, provide a sensible default.
                    return this.props.canDrop(dragData) ? 'move' : 'none';
                } else {
                    return this.props.canDrop(dragData) as DropEffect;
                }
            } else {
                // If there's no canDrop method, provide a reasonable default.
                return 'move';
            }
        } else {
            // With no DragData, return 'none' by default.
            return 'none';
        }
    }

    private getDragData(dragEvent: React.DragEvent<HTMLElement>): DragData {
        let dragData: DragData = null;
        if (dragEvent.dataTransfer.files && dragEvent.dataTransfer.files.length > 0) {
            dragData = getLocalFilesDragData(dragEvent.dataTransfer.files);
        } else {
            // the dataTransfer object can have multiple types (if outside of OWA).
            // We should identify the non standard drag type if able.
            const dragTypes = dragEvent.dataTransfer.types;
            let rawData = null;
            let nonTextTypeObtained = false;
            for (var i = 0; i < dragTypes.length; i++) {
                // IE11 doesn't subclass DOMStringList as array
                const element = dragTypes[i];
                if (element != 'text') {
                    rawData = dragEvent.dataTransfer.getData(element);
                    nonTextTypeObtained = true;
                    break;
                }
            }
            if (!nonTextTypeObtained) {
                rawData = dragEvent.dataTransfer.getData('text');
            }
            try {
                dragData = JSON.parse(rawData) as DragData;
            } catch (e) {
                dragData = { itemType: DEFAULT_ITEM_TYPE };
            }
        }
        return dragData;
    }

    private getDragType(dragEvent: React.DragEvent<HTMLElement>): string {
        let dragType = getDragItemType();
        const dataTransfer = dragEvent.dataTransfer
            ? dragEvent.dataTransfer
            : dragEvent.nativeEvent.dataTransfer;
        if (!dragType && dataTransfer && dataTransfer.types && dataTransfer.types.length > 0) {
            // We want the first type available that is on our list of supported types (as determined by DraggableItemTypes)
            const typesArray = Array.prototype.slice.apply(dragEvent.dataTransfer.types);
            const draggableTypes = Object.values(DraggableItemTypes);
            const filteredTypes = typesArray.filter(type => {
                return draggableTypes.indexOf(type) >= 0;
            });
            if (filteredTypes.length > 0) {
                dragType = filteredTypes[0];
            }
        }
        return dragType;
    }

    private setDropEffectInternal(
        dragEvent: { dataTransfer: { dropEffect: string } },
        dropEffect: DropEffect
    ) {
        if (dragEvent.dataTransfer) {
            dragEvent.dataTransfer.dropEffect = dropEffect;
        }
        setDropEffect(dropEffect);
    }
}

export interface DroppableHandle {
    getDiv(): HTMLDivElement;
}

// TODO: Bug 14032: Consider a framework-independent design of owa-dnd
// TODO: Bug 14032: Consider a framework-independent design of owa-dnd
export default React.forwardRef(function Droppable(
    props: DroppableProps,
    ref: React.Ref<DroppableHandle>
) {
    const core = React.useRef<DroppableCore>(new DroppableCore(props));
    React.useImperativeHandle(
        ref,
        () => ({
            getDiv() {
                return core.current.getDiv();
            },
        }),
        []
    );
    return (
        <div
            ref={core.current.refCallback}
            className={props.classNames}
            style={props.style}
            onDrop={core.current.onDrop}
            onDragOver={core.current.onDragOver}
            onDragEnter={core.current.onDragEnter}
            onDragLeave={core.current.onDragLeave}>
            {props.children}
        </div>
    );
});
