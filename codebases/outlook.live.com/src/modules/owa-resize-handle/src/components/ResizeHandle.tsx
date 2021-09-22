import * as React from 'react';
import { ResizeHandleDirection } from './ResizeHandleDirection';
import { isCurrentCultureRightToLeft } from 'owa-localize';

import styles from './ResizeHandle.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export interface ResizeHandleProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: ResizeHandleDirection;
    onResize?: (previousElementDimension: number, nextElementDimension: number) => void;
    onResizing?: (previousElementDimension: number, nextElementDimension: number) => void;
    setNewDimensions?: boolean;
}

interface Dimensions {
    min: number;
    max: number;
    current: number;
}

export default React.forwardRef(function ResizeHandle(
    props: ResizeHandleProps,
    ref: React.Ref<HTMLDivElement>
) {
    props = {
        direction: ResizeHandleDirection.vertical,
        setNewDimensions: false,
        ...props,
    };
    const shouldFlipForRtl = () => {
        return props.direction === ResizeHandleDirection.vertical && isCurrentCultureRightToLeft();
    };
    const onMouseDown = (ev?: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        let { onResize, onResizing, direction, setNewDimensions } = props;
        let handle = ev.currentTarget;
        let isVertical = direction === ResizeHandleDirection.vertical;
        let firstElement = handle.previousSibling as HTMLElement;
        let secondElement = handle.nextSibling as HTMLElement;
        let getDimensions = isVertical ? getWidthDimensions : getHeightDimensions;
        let firstElementDimensions = getDimensions(firstElement);
        let secondElementDimensions = getDimensions(secondElement);
        // How far up/left the resize handle can go. Will be a negative number
        let minOffset = Math.max(
            firstElementDimensions.min - firstElementDimensions.current,
            secondElementDimensions.current - secondElementDimensions.max
        );
        // How far down/right the resize handle can go.
        let maxOffset = Math.min(
            firstElementDimensions.max - firstElementDimensions.current,
            secondElementDimensions.current - secondElementDimensions.min
        );
        if (shouldFlipForRtl()) {
            let temp = minOffset;
            minOffset = -maxOffset;
            maxOffset = -temp;
        }
        let start = isVertical ? ev.clientX : ev.clientY;
        let currentOffset = 0;
        handle.classList.add(styles.dragging);
        let getBoundedOffset = (clientCoordinate: number) => {
            return Math.min(maxOffset, Math.max(minOffset, clientCoordinate - start));
        };
        let mouseMoveHandler = (ev?: MouseEvent) => {
            currentOffset = getBoundedOffset(isVertical ? ev.clientX : ev.clientY);
            if (isVertical) {
                handle.style.left = currentOffset + 'px';
            } else {
                handle.style.top = currentOffset + 'px';
            }
            if (onResizing) {
                let newFirstSize = firstElementDimensions.current + currentOffset;
                let newSecondSize = secondElementDimensions.current - currentOffset;
                onResizing(newFirstSize, newSecondSize);
            }
        };
        // Defined below. Needs to be declared here so the handlers can reference it.
        let cleanupDragging: () => void;
        let mouseUpHandler = (ev?: MouseEvent) => {
            cleanupDragging();
            if (shouldFlipForRtl()) {
                // We need to flip the values in rtl, or dragging to the right (and visually
                // shrinking the element first in DOM order) will increase the size of the first element.
                currentOffset = -currentOffset;
            }
            let newFirstSize = firstElementDimensions.current + currentOffset;
            let newSecondSize = secondElementDimensions.current - currentOffset;
            // If we should, set styles on sibling elements
            if (setNewDimensions) {
                if (isVertical) {
                    firstElement.style.width = newFirstSize + 'px';
                    secondElement.style.width = newSecondSize + 'px';
                } else {
                    firstElement.style.height = newFirstSize + 'px';
                    secondElement.style.height = newSecondSize + 'px';
                }
            }
            // If a callback is provided, call it now
            if (onResize) {
                onResize(newFirstSize, newSecondSize);
            }
        };
        let mouseLeaveHandler = (ev?: MouseEvent) => {
            cleanupDragging();
        };
        cleanupDragging = () => {
            // clear handlers
            document.body.removeEventListener('mousemove', mouseMoveHandler);
            document.body.removeEventListener('mouseup', mouseUpHandler);
            document.body.removeEventListener('mouseleave', mouseLeaveHandler);
            // Clear styles
            handle.style.left = handle.style.top = '';
            handle.classList.remove(styles.dragging);
        };
        document.body.addEventListener('mousemove', mouseMoveHandler);
        document.body.addEventListener('mouseup', mouseUpHandler);
        document.body.addEventListener('mouseleave', mouseLeaveHandler);
    };
    const { direction, onResize, onResizing, setNewDimensions, ...divProps } = props;
    let handleClasses = classNames(
        'resizeHandle',
        {
            horizontal: props.direction === ResizeHandleDirection.horizontal,
            vertical: props.direction === ResizeHandleDirection.vertical,
        },
        props.className
    );
    return <div {...divProps} className={handleClasses} onMouseDown={onMouseDown} ref={ref} />;
});

function convertSettingToPixels(setting: number, parentDimension: number): number {
    if (setting >= 1) {
        // The value given was in pixels
        return setting;
    } else {
        // The value was a decimal percentage
        return parentDimension * setting;
    }
}

function getWidthDimensions(element: HTMLElement): Dimensions {
    let parentDimension = element.parentElement.clientWidth;
    return {
        min: convertSettingToPixels(+element.getAttribute('data-min-width') || 0, parentDimension),
        max: convertSettingToPixels(
            +element.getAttribute('data-max-width') || window.outerWidth,
            parentDimension
        ),
        current: element.offsetWidth,
    };
}

function getHeightDimensions(element: HTMLElement): Dimensions {
    let parentDimension = element.parentElement.clientHeight;
    return {
        min: convertSettingToPixels(+element.getAttribute('data-min-height') || 0, parentDimension),
        max: convertSettingToPixels(
            +element.getAttribute('data-max-height') || window.outerHeight,
            parentDimension
        ),
        current: element.offsetHeight,
    };
}
