import { MIN_MOUSE_MOVE_FOR_DRAG } from 'owa-dnd/lib/utils/constants';

let lastTouchStartTime = 0;
let touchCoordinates = {
    x: null,
    y: null,
};

export interface ITouchHandlerParams {
    onLongPress?(evt): void;
    onClick?(evt): void;
}

/**
 * Returns attributes for onTouchStart and onTouchEnd to detect a long press
 * @param onLongPress callback function to trigger event on long press
 * @param onClick callback function to register a click if neither a long press or drag was detected
 */
export function touchHandler(touchHandlerParams: ITouchHandlerParams) {
    const { onLongPress, onClick } = touchHandlerParams;

    const touchStart = evt => {
        lastTouchStartTime = Date.now();
        touchCoordinates.x = evt.changedTouches[0].clientX;
        touchCoordinates.y = evt.changedTouches[0].clientY;
    };

    const touchEnd = evt => {
        // Determine how far from origin touch event ended, and if it was long enough for a drag do nothing
        const isDrag =
            Math.abs(touchCoordinates.x - evt.changedTouches[0].clientX) >
                MIN_MOUSE_MOVE_FOR_DRAG ||
            Math.abs(touchCoordinates.y - evt.changedTouches[0].clientY) > MIN_MOUSE_MOVE_FOR_DRAG;
        if (isDrag) {
            return;
        }

        // Trigger a long press if touch was held longer than 500 ms without dragging
        const touchTimeDiff = Date.now() - lastTouchStartTime;
        if (onLongPress && touchTimeDiff >= 500) {
            onLongPress(evt);
        } else if (onClick) {
            // On iOS devices, touches will trigger a hover state on elements that change their display property on hover.
            // To circumvent this, when a touch looks like a regular selection we can optionally mimic it as a click
            onClick(evt);
        }
    };

    return {
        onTouchStart: touchStart,
        onTouchEnd: touchEnd,
    };
}
