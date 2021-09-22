import * as React from 'react';
import type DragViewState from '../store/schema/DragViewState';
import type DropEffect from '../store/schema/DropEffect';
import setDragState from '../actions/setDragState';
import { DragData, setDragItemDetails, setDropEffect, getDropEffect } from '../utils/dragDataUtil';
import {
    IsSetDragImageSupported,
    MIN_MOUSE_MOVE_FOR_DRAG,
    DataTransferWorkaround,
} from '../utils/constants';
import { isBrowserEdge, isBrowserIE, isBrowserSafari } from 'owa-user-agent/lib/userAgent';
import * as trace from 'owa-trace';
import { AriaProperties, generateDomPropertiesForAria } from 'owa-accessibility';

export interface DraggableProps {
    // A callback function to call when drag starts to get the data for drag-and-drop
    getDragData: () => DragData;

    // A callback function to get a HTML element to override default drag preview image
    getDragPreview: (dragData: DragData) => HTMLElement;

    // (Optional) drag ViewState. Pass in this object if the component need to render different layout when dragging
    dragViewState?: DragViewState;

    // (Optional) A callback function to check if current element is able to be dragged
    canDrag?: () => boolean;

    // (Optional) A callback function to check if current element should be a draggable element
    isDraggable?: () => boolean;

    // (Optional) A callback function to call when a drag operation starts
    onDragStart?: (dragData: DragData, pageX: number, pageY: number) => void;

    // (Optional) A callback function to call when a drag operation ends
    onDragEnd?: (dragData: DragData, dropEffect?: DropEffect) => void;

    // (Optional) A callback function to call to allow the consumer to take additional action onMouseDown
    onMouseDown?: (mouseDownEvent: MouseEvent) => void;

    // (Optional) CSS Class name of this element
    classNames?: string;

    // (Optional) X-Offset of the preview image
    xOffset?: number;

    // (Optional) Y-Offset of the preview image
    yOffset?: number;

    // Whether we should show a default no-drag image for items that cannot be dragged
    showDefaultNoDragImage?: boolean;

    children?: React.ReactNode;

    ariaProps?: AriaProperties;
}

// This is a helper class for better code reusing, this should be only invoked from owadnd classes
export class DraggableCore {
    private div: HTMLDivElement;
    private initialPageX = 0;
    private initialPageY = 0;
    private dragHelperElement: HTMLElement = null;
    private isPotentialDrag: boolean = false;
    private isDragging: boolean = false;

    constructor(private props: DraggableProps) {}

    updateProps(props) {
        this.props = props;
    }

    onUnmount() {
        this.onDragEnd(null);

        if (!IsSetDragImageSupported) {
            this.removeMouseMoveAndUpEventListeners();
        }

        this.div.removeEventListener('mousedown', this.onMouseDown);
    }

    onDragStart = (dragEvent: React.DragEvent<HTMLElement>) => {
        dragEvent.dataTransfer.clearData();
        if (this.isDragAllowed()) {
            dragEvent.stopPropagation();

            this.setDragStateAndData(dragEvent);

            // TODO - 9122 https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/9122
            dragEvent.dataTransfer.effectAllowed = 'copyMove';

            this.onDragStartInternal(dragEvent.pageX, dragEvent.pageY);
            this.overrideDefaultDragPreviewImage(dragEvent.dataTransfer);
        } else if (this.props.showDefaultNoDragImage) {
            // Drag is not allowed, show the default no-drag image
            this.overrideDefaultNoDragImage(dragEvent.dataTransfer);

            // this is required for the no-drop image to work in Firefox
            dragEvent.dataTransfer.setData('text', 'nodrop');
            dragEvent.dataTransfer.effectAllowed = 'none';
        }
    };

    onDragEnd = (dragEvent: { dataTransfer: DataTransfer }) => {
        if (this.isDragging) {
            this.isDragging = false;
            let { onDragEnd } = this.props;
            let dropEffect = dragEvent ? (dragEvent.dataTransfer.dropEffect as DropEffect) : null;
            if (isBrowserEdge() || isBrowserIE()) {
                dropEffect = getDropEffect() as DropEffect;
            }
            if (onDragEnd) {
                onDragEnd(this.props.getDragData(), dropEffect);
            }
        }

        this.resetDragStateAndData();
        this.removeDragHelperElement();
    };

    onMouseDown = (mouseDownEvent: MouseEvent) => {
        if (!IsSetDragImageSupported && mouseDownEvent.button == 0 && this.isDragAllowed()) {
            // If this is a left mouse click, there could be a potential for drag
            // We use event.button property instead of event.which as event.button is
            // now a standard
            this.initialPageX = mouseDownEvent.pageX;
            this.initialPageY = mouseDownEvent.pageY;
            this.isPotentialDrag = true;
            document.body.addEventListener('mousemove', this.onMouseMove);
            document.body.addEventListener('mouseup', this.onMouseUp);
        }

        if (this.props.onMouseDown) {
            this.props.onMouseDown(mouseDownEvent);
        }
    };

    refCallback = (ref: HTMLDivElement) => {
        this.div = ref;
        if (this.div) {
            this.div.addEventListener('mousedown', this.onMouseDown);
        }
    };

    getDiv() {
        return this.div;
    }

    private onMouseMove = (mouseMoveEvent: MouseEvent) => {
        let pageX = mouseMoveEvent.pageX;
        let pageY = mouseMoveEvent.pageY;

        // Only if the mouse has moved enough we detect this as a potential drag and
        // call dragDrop on the helper element
        if (
            Math.abs(this.initialPageX - pageX) >= MIN_MOUSE_MOVE_FOR_DRAG ||
            Math.abs(this.initialPageY - pageY) >= MIN_MOUSE_MOVE_FOR_DRAG
        ) {
            this.removeMouseMoveAndUpEventListeners();

            if (this.isPotentialDrag) {
                this.isPotentialDrag = false;

                // In Edge, if user has text selection in somewhere, it will be used as drag preview image and cover DragHelperElement.
                // To resolve this issue, we clear text selection on each potential drag. This is also needed for IE for cases when
                // user cannot drag and we want to show the no-drag cursor without selecting text
                if (isBrowserEdge() || isBrowserIE()) {
                    window.getSelection().removeAllRanges();
                }

                if (this.isDragAllowed()) {
                    this.dragHelperElement = this.getDragHelperElement();
                    document.body.appendChild(this.dragHelperElement);
                }
            }

            /* If we do not have a drag helper template we should call
            dragDrop on actual element there is no scenario for this yet
            and hence I am not calling it as of now */
            if (this.dragHelperElement) {
                /* DOMElement.DragDrop() is a block call and will not
                return until user release the mouse button. Call
                dragEnd explicitly so that the helper gets removed. */
                this.dragHelperElement.addEventListener('dragstart', event => {
                    this.onDragStartHelperElement(event);
                });
                this.dragHelperElement.addEventListener('dragend', event => {
                    this.onDragEnd(event);
                });
                (this.dragHelperElement as any).dragDrop();
                setTimeout(this.onDragEnd, 0);
            }
        }
    };

    private onMouseUp = (mouseUpEvent: MouseEvent) => {
        this.removeMouseMoveAndUpEventListeners();
    };

    // Instead of dragging the actual element, we instead drag a "helper" element
    // However, the element we're calling drag on doesn't have any of the events bound to it.
    // So, we need to attach all the data to the drag event now, after drag starts on the helper element.
    private onDragStartHelperElement = (event: any) => {
        let dragEvent = event as React.DragEvent<HTMLElement>;
        dragEvent.stopPropagation();
        dragEvent.dataTransfer.effectAllowed = 'copyMove';
        this.setDragStateAndData(dragEvent);
        this.onDragStartInternal(dragEvent.pageX, dragEvent.pageY);
    };

    private onDragStartInternal(pageX: number, pageY: number) {
        this.isDragging = true;
        let { onDragStart } = this.props;
        if (onDragStart) {
            onDragStart(this.props.getDragData(), pageX, pageY);
        }
    }

    private setDragStateAndData(dragEvent: React.DragEvent<HTMLElement>) {
        let { dragViewState } = this.props;

        if (dragViewState) {
            setDragState(this.props.dragViewState, true /*isBeingDragged*/);
        }

        let dragData = this.props.getDragData();

        // We also use a custom MIME type for browsers that support it.
        try {
            dragEvent.dataTransfer.setData(dragData.itemType, JSON.stringify(dragData));
        } catch (e) {
            // Set drag data on the data transfer object
            // 'text' is used because IE11 and Edge reject other MIME types
            // 'text' can cause issues for other cases.
            dragEvent.dataTransfer.setData('text', JSON.stringify(dragData));
        }

        // Store the drag type on a global object to help IE or Edge
        setDragItemDetails(dragData.itemType, dragData.itemData);
    }

    private resetDragStateAndData() {
        let { dragViewState } = this.props;

        if (dragViewState) {
            // clear dragging state
            setDragState(this.props.dragViewState, false /*isBeingDragged*/);
        }
        setDragItemDetails(null, null);
        setDropEffect(null);
    }

    private overrideDefaultDragPreviewImage(dataTransfer: DataTransfer) {
        if (IsSetDragImageSupported) {
            this.dragHelperElement = this.getDragHelperElement();
            document.body.appendChild(this.dragHelperElement);

            let xOffset = this.props.xOffset ? this.props.xOffset : 0;
            let yOffset = this.props.yOffset ? this.props.yOffset : 0;
            (dataTransfer as DataTransferWorkaround).setDragImage(
                this.dragHelperElement,
                xOffset,
                yOffset
            );
        }
    }

    private overrideDefaultNoDragImage(dataTransfer: DataTransfer) {
        if (IsSetDragImageSupported) {
            this.dragHelperElement = document.createElement('div');
            this.dragHelperElement.style.display = 'none';
            document.body.appendChild(this.dragHelperElement);
            (dataTransfer as DataTransferWorkaround).setDragImage(this.dragHelperElement, 0, 0);
        }
    }

    private removeMouseMoveAndUpEventListeners = () => {
        document.body.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeEventListener('mouseup', this.onMouseUp);
    };

    private removeDragHelperElement = () => {
        if (!document.body) {
            const dragHelperElementToLog = this.dragHelperElement
                ? this.dragHelperElement.innerHTML
                : 'null';
            trace.errorThatWillCauseAlert('removeDragHelperElement: ' + dragHelperElementToLog);
            return;
        }

        if (document.body.contains(this.dragHelperElement)) {
            document.body.removeChild(this.dragHelperElement);
            this.dragHelperElement = null;
        }
    };

    private getDragHelperElement(): HTMLElement {
        // Always get the drag preview as it could be different for each drag instance
        let dragHelperElement = this.props.getDragPreview(this.props.getDragData());
        dragHelperElement.style.zIndex = '-1000';

        if (!isBrowserSafari()) {
            dragHelperElement.style.top = '0px';
            dragHelperElement.style.left = '0px';
            dragHelperElement.style.position = 'fixed';
        } else {
            // prevents iPad drag preview transforming such that the dragHelperElement's contents
            // shrink with a lot of extra padding while dragging
            dragHelperElement.style.width = 'fit-content';
            dragHelperElement.style.height = 'fit-content';
        }
        return dragHelperElement;
    }

    private isDragAllowed() {
        return !this.props.canDrag || this.props.canDrag();
    }
}

export interface DraggableHandle {
    getDiv(): HTMLDivElement;
}

// TODO: Bug 14032: Consider a framework-independent design of owa-dnd
export default React.forwardRef(function Draggable(
    props: DraggableProps,
    ref: React.Ref<DraggableHandle>
) {
    React.useEffect(() => {
        return () => {
            core.current.onUnmount();
        };
    }, []);
    const core = React.useRef<DraggableCore>(new DraggableCore(props));

    // In case the props on the draggable component change, we need to set them
    // explicitly on the DraggableCore's instance. The useRef holds onto the same instance
    // of object
    core.current.updateProps(props);
    React.useImperativeHandle(
        ref,
        () => ({
            getDiv() {
                return core.current.getDiv();
            },
        }),
        []
    );
    return IsSetDragImageSupported ? (
        <div
            draggable={props.isDraggable ? props.isDraggable() : true}
            {...generateDomPropertiesForAria(props.ariaProps)}
            className={props.classNames}
            ref={core.current.refCallback}
            onDragStart={core.current.onDragStart}
            onDragEnd={core.current.onDragEnd}>
            {props.children}
        </div>
    ) : (
        <div
            className={props.classNames}
            ref={core.current.refCallback}
            {...generateDomPropertiesForAria(props.ariaProps)}>
            {props.children}
        </div>
    );
});
