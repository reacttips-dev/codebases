import type * as React from 'react';
import type { IPoint } from '@fluentui/react/lib/Utilities';

export default function getAnchorForContextMenu(
    evt: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | KeyboardEvent
): IPoint {
    // Get the coordinates of the event, if applicable
    let xPos = null,
        yPos = null;

    if (
        (evt as React.MouseEvent<HTMLElement>).clientX ||
        (evt as React.MouseEvent<HTMLElement>).clientY
    ) {
        xPos = (evt as React.MouseEvent<HTMLElement>).clientX;
        yPos = (evt as React.MouseEvent<HTMLElement>).clientY;
    } else if (
        (evt as React.TouchEvent<HTMLElement>).changedTouches &&
        (evt as React.TouchEvent<HTMLElement>).changedTouches.length > 0
    ) {
        xPos = (evt as React.TouchEvent<HTMLElement>).changedTouches[0].clientX;
        yPos = (evt as React.TouchEvent<HTMLElement>).changedTouches[0].clientY;
    }
    if (xPos || yPos) {
        // If the event had coordinates, use those
        return { x: xPos, y: yPos };
    }

    // The event had no coordinates, likely because it was triggered by a key press
    // As such, we should calculate the anchor from the event target
    // Chrome, natively, will use the midpoint of the element in such situations, so let's just do the same
    let clientRect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
    return {
        x: clientRect.left + clientRect.width / 2,
        y: clientRect.top + clientRect.height / 2,
    };
}
