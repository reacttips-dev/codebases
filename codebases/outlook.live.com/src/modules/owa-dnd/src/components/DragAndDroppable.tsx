import * as React from 'react';
import { DraggableProps, DraggableCore } from './Draggable';
import { DroppableProps, DroppableCore } from './Droppable';
import { IsSetDragImageSupported } from '../utils/constants';

export interface DragAndDroppableProps extends DraggableProps, DroppableProps {
    children?: React.ReactNode;
}

export interface DragAndDroppableHandle {
    getDiv(): HTMLDivElement;
}

// TODO: Bug 14032: Consider a framework-independent design of owa-dnd
export default React.forwardRef(function DragAndDroppable(
    props: DragAndDroppableProps,
    ref: React.Ref<DragAndDroppableHandle>
) {
    React.useEffect(() => {
        return () => {
            dragCore.current.onUnmount();
        };
    }, []);
    const dragCore = React.useRef<DraggableCore>(new DraggableCore(props));
    const dropCore = React.useRef<DroppableCore>(new DroppableCore(props));
    React.useImperativeHandle(
        ref,
        () => ({
            getDiv() {
                return dragCore.current.getDiv();
            },
        }),
        []
    );
    return IsSetDragImageSupported ? (
        <div
            draggable={props.isDraggable ? props.isDraggable() : true}
            className={props.classNames}
            ref={dragCore.current.refCallback}
            onDragStart={dragCore.current.onDragStart}
            onDragEnd={dragCore.current.onDragEnd}
            onDrop={dropCore.current.onDrop}
            onDragOver={dropCore.current.onDragOver}
            onDragEnter={dropCore.current.onDragEnter}
            onDragLeave={dropCore.current.onDragLeave}>
            {props.children}
        </div>
    ) : (
        <div
            className={props.classNames}
            ref={dragCore.current.refCallback}
            onDragEnd={dragCore.current.onDragEnd}
            onDrop={dropCore.current.onDrop}
            onDragOver={dropCore.current.onDragOver}
            onDragEnter={dropCore.current.onDragEnter}
            onDragLeave={dropCore.current.onDragLeave}>
            {props.children}
        </div>
    );
});
