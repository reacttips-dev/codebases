import * as React from 'react';
import styles from './TimedDragTarget.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

// Wrap div's props so we can pass them through without adding more nodes to the HTML DOM.
interface TimedDragTargetProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Timeout before the onDragoverTimerCallback is called
     */
    dragTimeoutMs: number;
    /**
     * Called when a drag event stays inside this element for `dragTimeoutMs` seconds.
     */
    onDragTimeout: () => void;
    showDragIndicatorArrow?: boolean;
}

/**
 * Wrapper component to fire a callback when a draggable element has dragged over it for some duration.
 */
/**
 * Wrapper component to fire a callback when a draggable element has dragged over it for some duration.
 */
export default function TimedDragTarget(props: TimedDragTargetProps) {
    React.useEffect(() => {
        return () => {
            clearDragoverTimer();
        };
    }, []);
    const dragoverTimerId = React.useRef<number>(null);
    /**
     * Because drag events are fired for all valid drag target children, and we don't want to force
     * pointer-events: none on all children of this component, we track a counter (increment on enter,
     * decrement on exit).
     *
     * Since you can't exit a child without first entering it, this is guaranteed to always be positive
     * while we are dragging over this element.
     */
    const dragCounter = React.useRef(0);
    const [isDraggingOver, setIsDraggingOver] = React.useState<boolean>(false);
    const onDragEnter = () => {
        dragCounter.current++;
        if (dragoverTimerId.current !== null) {
            return;
        }
        dragoverTimerId.current = window.setTimeout(executeCallback, props.dragTimeoutMs);
        setIsDraggingOver(true);
    };
    const onDragLeave = () => {
        dragCounter.current--;
        if (dragoverTimerId.current === null || dragCounter.current > 0) {
            return;
        }
        clearDragoverTimer();
    };
    const executeCallback = () => {
        dragoverTimerId.current = null;
        props.onDragTimeout();
        setIsDraggingOver(false);
    };
    const clearDragoverTimer = () => {
        window.clearTimeout(dragoverTimerId.current);
        dragoverTimerId.current = null;
        setIsDraggingOver(false);
    };
    // only copy over props that are generic to div
    const propCopy = { ...props };
    delete propCopy.onDragEnter;
    delete propCopy.onDragLeave;
    delete propCopy.showDragIndicatorArrow;
    delete propCopy.onDragTimeout;
    delete propCopy.dragTimeoutMs;
    delete propCopy.className;
    return (
        // This ...props expansion includes children.
        <div
            {...propCopy}
            className={classNames(props.className || '', {
                [styles.withDragIndicator]: isDraggingOver && props.showDragIndicatorArrow,
                [styles.canHaveDragIndicator]: props.showDragIndicatorArrow,
            })}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        />
    );
}
